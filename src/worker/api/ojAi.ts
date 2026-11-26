import { complete, extractJson, ModelError, modelConfig } from "../ai";
import { cnDate } from "../../shared/heatmap";
import type { JudgeResult } from "../../shared/judge";
import type { Env } from "../env";
import { type Ctx, HttpError, json, type Router } from "../http";
import { requireUser } from "./common";
import { activeExam } from "./exams";

/**
 * OJ 里的 AI（故事 4.1）。规矩：测试判对错，AI 管理解和表达；AI 不给完整答案。
 *   POST /api/oj/ai/hint    卡住时要一条提示：带上题目、当前代码、最近一次的失败用例
 *   POST /api/oj/ai/ask     随时提问：带上题目和当前代码
 *   POST /api/oj/ai/review  提交后请 AI 评一评：思路、边界、代码质量，给一个质量分（综合排行用，故事 5.2）
 */

export const OJ_AI_DAILY_LIMIT = 40;
const MAX_CODE_CHARS = 12_000;
const MAX_STATEMENT_CHARS = 8_000;
/** 回答里超过这么多行的代码块要隐藏（防止直接给出答案） */
const MAX_CODE_LINES_IN_ANSWER = 3;

const RULES = `你是海纳协会学习平台的编程助教，同学正在 OJ 上做题。
必须遵守：
1. 不给出能直接通过的完整代码，也不逐行告诉同学该写什么；最多给出 3 行以内的伪代码或语法示例。
2. 先指出同学的代码在哪里、为什么不对（结合失败的用例），再引导下一步怎么想。
3. 用简体中文，正式、清楚、简短；专有名词第一次出现时写中文并附英文。
4. 涉及课程概念时，用课程里的说法（例如 CS61A 的「环境」「帧」「高阶函数」）。`;

interface ProblemLite {
  title: string;
  statement: string;
  kind: string;
  hints?: string[];
}

async function loadProblem(env: Env, id: string): Promise<ProblemLite | null> {
  const parts = id.split("/");
  const url = parts.length === 3 ? `https://assets.local/oj/assignments/${parts[0]}/${parts[1]}.json` : `https://assets.local/oj/problems/${id}.json`;
  const res = await env.ASSETS.fetch(new Request(url));
  if (!res.ok || !(res.headers.get("content-type") ?? "").includes("json")) return null;
  const data = (await res.json()) as ProblemLite & { problems?: (ProblemLite & { id: string })[] };
  return parts.length === 3 ? (data.problems?.find((p) => p.id === parts[2]) ?? null) : data;
}

/** 每人每天的次数；考试进行中不能用 AI（故事 3.5） */
async function useQuota(db: D1Database, uid: string, now: number) {
  if (await activeExam(db, uid, now)) throw new HttpError(403, "测验进行中，不能使用 AI 助教。交卷之后就可以用了");
  const day = cnDate(now);
  const row = await db.prepare("SELECT count FROM oj_ai_usage WHERE user_id = ? AND day = ?").bind(uid, day).first<{ count: number }>();
  if ((row?.count ?? 0) >= OJ_AI_DAILY_LIMIT) throw new HttpError(429, `今天请 AI 的次数用完了（每天 ${OJ_AI_DAILY_LIMIT} 次），明天再来，或者先在讨论区问问同学`);
  await db.prepare("INSERT INTO oj_ai_usage (user_id, day, count) VALUES (?, ?, 1) ON CONFLICT(user_id, day) DO UPDATE SET count = count + 1").bind(uid, day).run();
}

/** 把回答里过长的代码块换成提示，防止 AI 直接把答案写出来 */
export function guardAnswer(text: string): string {
  return text.replace(/```[^\n]*\n([\s\S]*?)```/g, (block, body: string) =>
    body.trim().split("\n").length > MAX_CODE_LINES_IN_ANSWER ? "\n> （这里原本是一段较长的代码，为了不直接给出答案，已经隐藏。请按上面的思路自己写一写。）\n" : block,
  );
}

function describeResult(r: JudgeResult | undefined): string {
  if (!r) return "（还没有运行过）";
  const bad = r.cases.find((c) => c.verdict !== "AC");
  const lines = [`结果：${r.verdict}，通过 ${r.passed}/${r.total}`];
  if (r.message) lines.push(`报错：\n${r.message.slice(0, 2000)}`);
  if (bad && !bad.hidden) {
    if (bad.input) lines.push(`失败的用例（输入或语句）：\n${bad.input.slice(0, 1500)}`);
    if (bad.expected) lines.push(`期望：\n${bad.expected.slice(0, 1500)}`);
    if (bad.actual !== undefined) lines.push(`实际：\n${bad.actual.slice(0, 1500)}`);
    if (bad.message) lines.push(`报错：\n${bad.message.slice(0, 1500)}`);
  }
  return lines.join("\n");
}

function codeBlock(files: Record<string, string>): string {
  let left = MAX_CODE_CHARS;
  return Object.entries(files)
    .map(([path, content]) => {
      const part = content.slice(0, Math.max(0, left));
      left -= part.length;
      return `文件 ${path}：\n\`\`\`\n${part}\n\`\`\``;
    })
    .join("\n\n");
}

interface AiBody {
  problem: string;
  files: Record<string, string>;
  result?: JudgeResult;
  question?: string;
}

async function readBody(c: Ctx): Promise<AiBody> {
  const b = await c.body<Partial<AiBody>>();
  if (typeof b.problem !== "string" || !/^[a-z0-9_/-]{1,120}$/.test(b.problem)) throw new HttpError(400, "题目编号不对");
  if (!b.files || typeof b.files !== "object") throw new HttpError(400, "缺少代码");
  if (JSON.stringify(b.files).length > 200_000) throw new HttpError(413, "代码太大了");
  if (b.question !== undefined && (typeof b.question !== "string" || b.question.length > 2000)) throw new HttpError(400, "问题太长了");
  return b as AiBody;
}

async function ask(c: Ctx, system: string, user: string, maxTokens: number, asJson = false): Promise<string> {
  const cfg = modelConfig(c.env);
  if (!cfg) throw new HttpError(503, "还没有接 AI。管理员在 Worker 设置里填 AI_API_KEY 后就能用");
  try {
    return (await complete(cfg, { system, user, maxTokens, json: asJson })).text.trim();
  } catch (err) {
    console.error(JSON.stringify({ msg: "oj ai failed", error: String(err) }));
    throw new HttpError(502, err instanceof ModelError ? "AI 暂时没回应，过一会儿再试" : "AI 出了点问题，过一会儿再试");
  }
}

function context(p: ProblemLite, b: AiBody): string {
  return [`题目：${p.title}`, "题面：", p.statement.slice(0, MAX_STATEMENT_CHARS), "", "同学现在的代码：", codeBlock(b.files), "", "最近一次判题：", describeResult(b.result)].join("\n");
}

export interface Review {
  summary: string;
  approach: string;
  edgeCases: string;
  quality: string;
  suggestions: string[];
  /** 0–100，只评代码质量和思路，不评对错（对错由测试判） */
  score: number;
}

export function parseReview(text: string): Review {
  const raw = extractJson(text) as Partial<Review>;
  const str = (v: unknown) => (typeof v === "string" ? v.slice(0, 2000) : "");
  const score = Math.round(Number(raw.score));
  return {
    summary: str(raw.summary),
    approach: str(raw.approach),
    edgeCases: str(raw.edgeCases),
    quality: str(raw.quality),
    suggestions: Array.isArray(raw.suggestions) ? raw.suggestions.filter((s): s is string => typeof s === "string").slice(0, 5).map((s) => s.slice(0, 400)) : [],
    score: Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : 0,
  };
}

export function ojAiRoutes(api: Router) {
  api.post("/api/oj/ai/hint", async (c) => {
    const u = requireUser(c);
    const b = await readBody(c);
    const p = await loadProblem(c.env, b.problem);
    if (!p) throw new HttpError(404, "没有这道题");
    await useQuota(c.env.DB, u.id, Date.now());
    const text = await ask(c, RULES, `${context(p, b)}\n\n请给同学「下一步」的一条提示：先说哪里不对、为什么，再给一个方向。150 字以内。`, 500);
    return json({ answer: guardAnswer(text) });
  });

  api.post("/api/oj/ai/ask", async (c) => {
    const u = requireUser(c);
    const b = await readBody(c);
    if (!b.question?.trim()) throw new HttpError(400, "请写下你的问题");
    const p = await loadProblem(c.env, b.problem);
    if (!p) throw new HttpError(404, "没有这道题");
    await useQuota(c.env.DB, u.id, Date.now());
    const text = await ask(c, RULES, `${context(p, b)}\n\n同学的问题：${b.question.trim()}\n\n请回答，400 字以内。`, 900);
    return json({ answer: guardAnswer(text) });
  });

  api.post("/api/oj/ai/review", async (c) => {
    const u = requireUser(c);
    const { submission } = await c.body<{ submission?: string }>();
    if (typeof submission !== "string") throw new HttpError(400, "要指定是哪一次提交");
    const db = c.env.DB;
    const cached = await db.prepare("SELECT review FROM oj_reviews WHERE submission_id = ?").bind(submission).first<{ review: string }>();
    if (cached) return json({ review: JSON.parse(cached.review) as Review });
    const row = await db.prepare("SELECT user_id, problem, files, result FROM oj_submissions WHERE id = ?").bind(submission).first<{ user_id: string; problem: string; files: string; result: string }>();
    if (!row || row.user_id !== u.id) throw new HttpError(404, "没有这次提交");
    const p = await loadProblem(c.env, row.problem);
    if (!p) throw new HttpError(404, "没有这道题");
    await useQuota(db, u.id, Date.now());
    const b: AiBody = { problem: row.problem, files: JSON.parse(row.files) as Record<string, string>, result: JSON.parse(row.result) as JudgeResult };
    const system = `${RULES}\n现在请你评阅同学的一次提交。对错已经由测试判定，你只评思路、边界情况和代码质量。只输出一个 JSON 对象。`;
    const user = `${context(p, b)}\n\n输出 JSON：{"summary": 一句话总评, "approach": 思路评价, "edgeCases": 边界情况是否考虑周全（没考虑到的举例说明）, "quality": 可读性、命名、结构, "suggestions": [最多 3 条改进建议，不写完整代码], "score": 0 到 100 的整数，代表代码质量和思路的清晰程度}`;
    let review: Review;
    try {
      review = parseReview(await ask(c, system, user, 900, true));
    } catch (e) {
      if (e instanceof HttpError) throw e;
      throw new HttpError(502, "AI 的评语格式不对，再试一次");
    }
    review.suggestions = review.suggestions.map(guardAnswer);
    await db.prepare("INSERT OR REPLACE INTO oj_reviews (submission_id, user_id, problem, score, review, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(submission, u.id, row.problem, review.score, JSON.stringify(review), Date.now())
      .run();
    return json({ review });
  });
}
