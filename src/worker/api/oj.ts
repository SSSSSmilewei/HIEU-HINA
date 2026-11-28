import { recordActivityOnce } from "../activity";
import { syncOrQueue } from "../forgejo";
import type { Env } from "../env";
import { type Ctx, HttpError, json, type Router } from "../http";
import { ExecRequest, type ExecResult, JudgeRequest, type JudgeResult, MAX_SUBMIT_BYTES, VERDICTS } from "../../shared/judge";
import { memberId, isAdmin } from "./common";

/**
 * OJ 判题接口（故事 1.3）。平台不自己判题，把请求转给判题服务（judge/，学校服务器），存提交记录。
 *   POST /api/oj/run                 只跑公开用例（游客也能用）
 *   POST /api/oj/submit              跑全部用例，存一条提交记录（要登录）
 *   GET  /api/oj/submissions?problem=  我在这道题上的提交
 *   GET  /api/oj/submissions/:id     一次提交的代码和结果（本人或管理员）
 *   GET  /api/oj/solved?prefix=      我通过了哪些题（prefix 如 cs61a/lab01）
 *   POST /api/oj/exec                运行任意代码（不判对错，VSCode 插件用；要登录）
 */

const MINUTE_MS = 60_000;
/** 每人每分钟最多提交几次、运行几次 */
export const SUBMITS_PER_MINUTE = 10;
export const RUNS_PER_MINUTE = 20;
/** 运行任意代码：每人每分钟最多几次 */
export const EXECS_PER_MINUTE = 10;
/** 提交列表最多返回几条 */
const LIST_LIMIT = 50;
const JUDGE_TIMEOUT_MS = 120_000;

async function readRequest(c: Ctx): Promise<JudgeRequest> {
  const text = await c.req.text();
  if (text.length > MAX_SUBMIT_BYTES) throw new HttpError(413, "代码太大了");
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new HttpError(400, "请求不是合法的 JSON");
  }
  const r = JudgeRequest.safeParse(raw);
  if (!r.success) throw new HttpError(400, "请求格式不对");
  return r.data;
}

/** 限流：who 在最近一分钟里调用了多少次 */
export async function limit(db: D1Database, who: string, max: number, now: number) {
  const row = await db.prepare("SELECT COUNT(*) AS n FROM oj_hits WHERE who = ? AND at > ?").bind(who, now - MINUTE_MS).first<{ n: number }>();
  if ((row?.n ?? 0) >= max) throw new HttpError(429, "太频繁了，请稍等一会儿再试");
  await db.batch([db.prepare("INSERT INTO oj_hits (who, at) VALUES (?, ?)").bind(who, now), db.prepare("DELETE FROM oj_hits WHERE at < ?").bind(now - MINUTE_MS)]);
}

/** 转给判题服务。判题服务没配或连不上时回 503，判题服务说题目不存在时回 404。 */
export async function callJudge(env: Env, mode: "run" | "submit", body: JudgeRequest): Promise<JudgeResult> {
  if (!env.JUDGE_URL || !env.JUDGE_TOKEN) throw new HttpError(503, "判题服务还没有配置");
  let res: Response;
  try {
    res = await fetch(`${env.JUDGE_URL.replace(/\/$/, "")}/v1/${mode}`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${env.JUDGE_TOKEN}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(JUDGE_TIMEOUT_MS),
    });
  } catch {
    throw new HttpError(503, "判题服务暂时连不上，请稍后再试");
  }
  if (res.status === 404) throw new HttpError(404, "没有这道题");
  if (res.status === 400) throw new HttpError(400, ((await res.json().catch(() => ({}))) as { error?: string }).error ?? "请求格式不对");
  if (!res.ok) throw new HttpError(503, `判题服务出错（${res.status}），请稍后再试`);
  const result = (await res.json()) as JudgeResult;
  if (!VERDICTS.includes(result.verdict)) throw new HttpError(503, "判题服务返回的结果看不懂");
  return result;
}

/** 运行任意代码：转给判题服务的 /v1/exec */
async function callExec(env: Env, body: ExecRequest): Promise<ExecResult> {
  if (!env.JUDGE_URL || !env.JUDGE_TOKEN) throw new HttpError(503, "判题服务还没有配置");
  let res: Response;
  try {
    res = await fetch(`${env.JUDGE_URL.replace(/\/$/, "")}/v1/exec`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${env.JUDGE_TOKEN}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(JUDGE_TIMEOUT_MS),
    });
  } catch {
    throw new HttpError(503, "判题服务暂时连不上，请稍后再试");
  }
  if (res.status === 400) throw new HttpError(400, ((await res.json().catch(() => ({}))) as { error?: string }).error ?? "请求格式不对");
  if (!res.ok) throw new HttpError(503, `判题服务出错（${res.status}），请稍后再试`);
  return (await res.json()) as ExecResult;
}

function clientKey(c: Ctx): string {
  return c.user ? `u:${c.user.id}` : `ip:${c.req.headers.get("cf-connecting-ip") ?? "local"}`;
}

interface SubmissionRow {
  id: string;
  user_id: string;
  problem: string;
  language: string;
  files: string;
  verdict: string;
  passed: number;
  total: number;
  time_ms: number;
  memory_kb: number;
  result: string;
  created_at: number;
}

const brief = (r: SubmissionRow) => ({
  id: r.id,
  problem: r.problem,
  language: r.language,
  verdict: r.verdict,
  passed: r.passed,
  total: r.total,
  timeMs: r.time_ms,
  memoryKb: r.memory_kb,
  createdAt: r.created_at,
});

export function ojRoutes(api: Router) {
  api.post("/api/oj/run", async (c) => {
    const body = await readRequest(c);
    await limit(c.env.DB, clientKey(c), RUNS_PER_MINUTE, Date.now());
    return json({ result: await callJudge(c.env, "run", body) });
  });

  api.post("/api/oj/exec", async (c) => {
    const uid = memberId(c);
    const text = await c.req.text();
    if (text.length > MAX_SUBMIT_BYTES) throw new HttpError(413, "代码太大了");
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      throw new HttpError(400, "请求不是合法的 JSON");
    }
    const r = ExecRequest.safeParse(raw);
    if (!r.success) throw new HttpError(400, r.error.issues[0]?.message ?? "请求格式不对");
    await limit(c.env.DB, `exec:${uid}`, EXECS_PER_MINUTE, Date.now());
    return json({ result: await callExec(c.env, r.data) });
  });

  api.post("/api/oj/submit", async (c) => {
    const uid = memberId(c);
    const body = await readRequest(c);
    const now = Date.now();
    const recent = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM oj_submissions WHERE user_id = ? AND created_at > ?").bind(uid, now - MINUTE_MS).first<{ n: number }>();
    if ((recent?.n ?? 0) >= SUBMITS_PER_MINUTE) throw new HttpError(429, "提交太频繁了，请稍等一会儿再试");
    const result = await callJudge(c.env, "submit", body);
    const id = crypto.randomUUID();
    await c.env.DB.prepare(
      "INSERT INTO oj_submissions (id, user_id, problem, language, files, verdict, passed, total, time_ms, memory_kb, result, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(id, uid, body.problem, body.language, JSON.stringify(body.files), result.verdict, result.passed, result.total, result.timeMs, result.memoryKb, JSON.stringify(result), now)
      .run();
    let firstSolve = false;
    if (result.verdict === "AC") {
      const ins = await c.env.DB.prepare("INSERT OR IGNORE INTO oj_solved (user_id, problem, solved_at) VALUES (?, ?, ?)").bind(uid, body.problem, now).run();
      firstSolve = (ins.meta.changes ?? 0) > 0;
      // 热力图：每道题第一次通过记一次学习记录
      if (firstSolve) await recordActivityOnce(c.env.DB, uid, "exercise", `oj:${body.problem}`, now);
    }
    // 写进学员自己的仓库（Forgejo）；写不进去就排队，不影响判题结果
    const u = c.user!;
    const repo = await syncOrQueue(c.env, {
      user: { id: u.id, name: u.name, studentNo: u.studentNo, username: u.username, kind: u.kind },
      problem: body.problem,
      files: body.files,
      verdict: result.verdict,
      passed: result.passed,
      total: result.total,
    });
    return json({ id, result, firstSolve, repo });
  });

  api.get("/api/oj/submissions", async (c) => {
    const uid = memberId(c);
    const problem = c.url.searchParams.get("problem");
    const rows = problem
      ? await c.env.DB.prepare("SELECT * FROM oj_submissions WHERE user_id = ? AND problem = ? ORDER BY created_at DESC LIMIT ?").bind(uid, problem, LIST_LIMIT).all<SubmissionRow>()
      : await c.env.DB.prepare("SELECT * FROM oj_submissions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?").bind(uid, LIST_LIMIT).all<SubmissionRow>();
    return json({ submissions: rows.results.map(brief) });
  });

  api.get("/api/oj/submissions/:id", async (c) => {
    const uid = memberId(c);
    const row = await c.env.DB.prepare("SELECT * FROM oj_submissions WHERE id = ?").bind(c.params.id).first<SubmissionRow>();
    // 别人的提交对普通成员就像不存在
    if (!row || (row.user_id !== uid && !isAdmin(c))) throw new HttpError(404, "没有这次提交");
    return json({ submission: { ...brief(row), files: JSON.parse(row.files) as Record<string, string>, result: JSON.parse(row.result) as JudgeResult } });
  });

  api.get("/api/oj/solved", async (c) => {
    if (!c.user) return json({ solved: [] });
    const prefix = c.url.searchParams.get("prefix") ?? "";
    if (prefix && !/^[a-z0-9_/-]{1,120}$/.test(prefix)) throw new HttpError(400, "prefix 不对");
    const rows = await c.env.DB.prepare("SELECT problem, solved_at FROM oj_solved WHERE user_id = ? AND substr(problem, 1, ?) = ? ORDER BY solved_at")
      .bind(c.user.id, prefix.length, prefix)
      .all<{ problem: string; solved_at: number }>();
    return json({ solved: rows.results.map((r) => ({ problem: r.problem, solvedAt: r.solved_at })) });
  });
}
