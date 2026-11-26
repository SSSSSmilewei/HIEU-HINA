import { type Exam, type ExamAnswers, examTotal, gradeLocal, publicExam } from "../../shared/exam";
import { EXAMS } from "../examData";
import { type Ctx, HttpError, json, type Router } from "../http";
import { requireAdmin, requireUser } from "./common";
import { callJudge } from "./oj";

/**
 * 限时测验（故事 3.5）。
 *   GET  /api/exams?course=            测验列表和自己的最好成绩
 *   GET  /api/exams/:id                说明；有作答时带题目（开考前不给题目），交卷后带答案、讲解和每题得分
 *   POST /api/exams/:id/start          开考：记下截止时间（已经在考就返回那一次）
 *   PUT  /api/exams/:id/answers        保存作答（截止时间之后不收）
 *   POST /api/exams/:id/submit         交卷并判分（写代码的题交给判题服务）
 *   GET  /api/admin/exams/:id/attempts 管理员看全部成绩
 *   POST /api/admin/exam-attempts/:id/regrade  管理员重新判分（判题服务当时连不上时用）
 * 过了截止时间还没交卷的，下次读取时按最后保存的作答自动交卷。成绩只本人和管理员能看。
 */

/** 网络延迟的宽限：截止后这么久内保存和交卷仍然算数 */
export const GRACE_MS = 30_000;
const MAX_ANSWERS_BYTES = 200_000;

interface AttemptRow {
  id: string;
  user_id: string;
  exam: string;
  started_at: number;
  deadline: number;
  answers: string;
  saved_at: number | null;
  submitted_at: number | null;
  score: number | null;
  max_score: number | null;
  passed: number | null;
  detail: string | null;
}

interface QuestionResult {
  id: string;
  points: number;
  got: number;
  note?: string;
}

function getExam(id: string): Exam {
  const e = EXAMS.get(id);
  if (!e) throw new HttpError(404, "没有这场测验");
  return e;
}

/** 正在进行中的测验（还没交卷、没过截止时间）：考试期间不能用 AI */
export async function activeExam(db: D1Database, userId: string, now = Date.now()): Promise<string | null> {
  const row = await db.prepare("SELECT exam FROM exam_attempts WHERE user_id = ? AND submitted_at IS NULL AND deadline + ? > ? ORDER BY started_at DESC LIMIT 1").bind(userId, GRACE_MS, now).first<{ exam: string }>();
  return row?.exam ?? null;
}

async function grade(c: Ctx, exam: Exam, row: AttemptRow, now: number): Promise<AttemptRow> {
  const answers = JSON.parse(row.answers) as ExamAnswers;
  const detail: QuestionResult[] = [];
  for (const s of exam.sections)
    for (const q of s.questions) {
      const a = answers[q.id];
      const local = gradeLocal(q, a);
      if (local !== null) {
        detail.push({ id: q.id, points: q.points, got: local });
        continue;
      }
      if (q.type !== "code" || typeof a !== "string" || !a.trim() || a === q.starter) {
        detail.push({ id: q.id, points: q.points, got: 0, note: "没有作答" });
        continue;
      }
      try {
        const r = await callJudge(c.env, "submit", { problem: q.problem, language: "python", files: { [q.file]: a } });
        const got = r.verdict === "AC" ? q.points : r.total ? Math.round((q.points * r.passed * 10) / r.total) / 10 : 0;
        detail.push({ id: q.id, points: q.points, got, note: `判题结果：${r.verdict}，通过 ${r.passed}/${r.total}` });
      } catch (e) {
        detail.push({ id: q.id, points: q.points, got: 0, note: `判题服务暂时不可用（${e instanceof Error ? e.message : "未知错误"}），请联系管理员重新判分` });
      }
    }
  const score = Math.round(detail.reduce((n, d) => n + d.got, 0) * 10) / 10;
  const max = examTotal(exam);
  const passed = score >= max * exam.pass ? 1 : 0;
  const submitted = row.submitted_at ?? Math.min(now, row.deadline + GRACE_MS);
  await c.env.DB.prepare("UPDATE exam_attempts SET submitted_at = ?, score = ?, max_score = ?, passed = ?, detail = ? WHERE id = ?").bind(submitted, score, max, passed, JSON.stringify(detail), row.id).run();
  return { ...row, submitted_at: submitted, score, max_score: max, passed, detail: JSON.stringify(detail) };
}

/** 过了截止时间还没交卷：按最后保存的作答自动交卷 */
async function settle(c: Ctx, exam: Exam, row: AttemptRow, now: number): Promise<AttemptRow> {
  if (row.submitted_at === null && now > row.deadline + GRACE_MS) return grade(c, exam, row, now);
  return row;
}

function view(row: AttemptRow, now: number) {
  const done = row.submitted_at !== null;
  return {
    id: row.id,
    startedAt: row.started_at,
    deadline: row.deadline,
    now,
    answers: JSON.parse(row.answers) as ExamAnswers,
    submittedAt: row.submitted_at,
    score: row.score,
    maxScore: row.max_score,
    passed: row.passed === null ? null : row.passed === 1,
    detail: done && row.detail ? (JSON.parse(row.detail) as QuestionResult[]) : null,
  };
}

async function latest(db: D1Database, uid: string, examId: string): Promise<AttemptRow | null> {
  return db.prepare("SELECT * FROM exam_attempts WHERE user_id = ? AND exam = ? ORDER BY started_at DESC LIMIT 1").bind(uid, examId).first<AttemptRow>();
}

async function ownAttempt(c: Ctx, examId: string, attemptId: unknown): Promise<AttemptRow> {
  const u = requireUser(c);
  if (typeof attemptId !== "string") throw new HttpError(400, "缺少作答编号");
  const row = await c.env.DB.prepare("SELECT * FROM exam_attempts WHERE id = ?").bind(attemptId).first<AttemptRow>();
  if (!row || row.user_id !== u.id || row.exam !== examId) throw new HttpError(404, "没有这次作答");
  return row;
}

function readAnswers(raw: unknown): string {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new HttpError(400, "作答格式不对");
  const s = JSON.stringify(raw);
  if (s.length > MAX_ANSWERS_BYTES) throw new HttpError(413, "作答太长了");
  return s;
}

export function examRoutes(api: Router) {
  api.get("/api/exams", async (c) => {
    const course = c.url.searchParams.get("course");
    const list = [...EXAMS.values()].filter((e) => !course || e.course === course);
    const best = new Map<string, { score: number; max: number; passed: boolean; attempts: number }>();
    if (c.user) {
      const rows = await c.env.DB.prepare("SELECT exam, MAX(score) AS score, MAX(max_score) AS max, MAX(passed) AS passed, COUNT(*) AS n FROM exam_attempts WHERE user_id = ? AND submitted_at IS NOT NULL GROUP BY exam")
        .bind(c.user.id)
        .all<{ exam: string; score: number; max: number; passed: number; n: number }>();
      for (const r of rows.results) best.set(r.exam, { score: r.score, max: r.max, passed: r.passed === 1, attempts: r.n });
    }
    return json({
      exams: list.map((e) => ({ id: e.id, course: e.course, item: e.item, title: e.title, source: e.source, minutes: e.minutes, pass: e.pass, certificate: e.certificate, total: examTotal(e), questions: e.sections.reduce((n, s) => n + s.questions.length, 0), mine: best.get(e.id) ?? null })),
    });
  });

  api.get("/api/exams/:id", async (c) => {
    const exam = getExam(c.params.id!);
    const now = Date.now();
    const meta = { id: exam.id, course: exam.course, item: exam.item, title: exam.title, source: exam.source, license: exam.license, minutes: exam.minutes, pass: exam.pass, certificate: exam.certificate, intro: exam.intro, total: examTotal(exam), questions: exam.sections.reduce((n, s) => n + s.questions.length, 0) };
    if (!c.user) return json({ exam: meta, paper: null, attempt: null });
    let row = await latest(c.env.DB, c.user.id, exam.id);
    if (row) row = await settle(c, exam, row, now);
    if (!row) return json({ exam: meta, paper: null, attempt: null });
    // 考试中给不带答案的试卷；交卷后给完整的试卷（答案、讲解）
    const paper = row.submitted_at === null ? publicExam(exam) : exam;
    return json({ exam: meta, paper, attempt: view(row, now) });
  });

  api.post("/api/exams/:id/start", async (c) => {
    const u = requireUser(c);
    const exam = getExam(c.params.id!);
    const now = Date.now();
    const cur = await latest(c.env.DB, u.id, exam.id);
    if (cur && cur.submitted_at === null && now <= cur.deadline + GRACE_MS) return json({ attempt: view(cur, now), paper: publicExam(exam) });
    if (cur) await settle(c, exam, cur, now);
    const other = await activeExam(c.env.DB, u.id, now);
    if (other && other !== exam.id) throw new HttpError(409, "你还有另一场测验没有交卷，先把那一场做完");
    const row: AttemptRow = { id: crypto.randomUUID(), user_id: u.id, exam: exam.id, started_at: now, deadline: now + exam.minutes * 60_000, answers: "{}", saved_at: null, submitted_at: null, score: null, max_score: null, passed: null, detail: null };
    await c.env.DB.prepare("INSERT INTO exam_attempts (id, user_id, exam, started_at, deadline, answers) VALUES (?, ?, ?, ?, ?, '{}')").bind(row.id, u.id, exam.id, row.started_at, row.deadline).run();
    return json({ attempt: view(row, now), paper: publicExam(exam) });
  });

  api.put("/api/exams/:id/answers", async (c) => {
    const exam = getExam(c.params.id!);
    const b = await c.body<{ attempt?: string; answers?: unknown }>();
    const row = await ownAttempt(c, exam.id, b.attempt);
    const now = Date.now();
    if (row.submitted_at !== null) throw new HttpError(409, "已经交卷了");
    if (now > row.deadline + GRACE_MS) {
      await grade(c, exam, row, now);
      throw new HttpError(409, "时间到了，已经按最后保存的作答自动交卷");
    }
    await c.env.DB.prepare("UPDATE exam_attempts SET answers = ?, saved_at = ? WHERE id = ?").bind(readAnswers(b.answers), now, row.id).run();
    return json({ savedAt: now });
  });

  api.post("/api/exams/:id/submit", async (c) => {
    const exam = getExam(c.params.id!);
    const b = await c.body<{ attempt?: string; answers?: unknown }>();
    let row = await ownAttempt(c, exam.id, b.attempt);
    const now = Date.now();
    if (row.submitted_at !== null) return json({ attempt: view(row, now), paper: exam });
    if (b.answers !== undefined && now <= row.deadline + GRACE_MS) {
      row = { ...row, answers: readAnswers(b.answers), saved_at: now };
      await c.env.DB.prepare("UPDATE exam_attempts SET answers = ?, saved_at = ? WHERE id = ?").bind(row.answers, now, row.id).run();
    }
    row = await grade(c, exam, { ...row, submitted_at: Math.min(now, row.deadline + GRACE_MS) }, now);
    return json({ attempt: view(row, now), paper: exam });
  });

  api.get("/api/admin/exams/:id/attempts", async (c) => {
    requireAdmin(c);
    const exam = getExam(c.params.id!);
    const rows = await c.env.DB.prepare(
      "SELECT a.id, a.started_at, a.submitted_at, a.score, a.max_score, a.passed, u.name, u.student_no FROM exam_attempts a JOIN users u ON u.id = a.user_id WHERE a.exam = ? ORDER BY a.started_at DESC LIMIT 500",
    )
      .bind(exam.id)
      .all();
    return json({ attempts: rows.results });
  });

  api.post("/api/admin/exam-attempts/:id/regrade", async (c) => {
    requireAdmin(c);
    const row = await c.env.DB.prepare("SELECT * FROM exam_attempts WHERE id = ?").bind(c.params.id!).first<AttemptRow>();
    if (!row) throw new HttpError(404, "没有这次作答");
    if (row.submitted_at === null) throw new HttpError(409, "还没交卷");
    const exam = getExam(row.exam);
    const r = await grade(c, exam, row, Date.now());
    return json({ score: r.score, maxScore: r.max_score, passed: r.passed === 1 });
  });
}
