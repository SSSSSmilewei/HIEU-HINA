/**
 * 判题服务（故事 1.2）。部署在学校服务器上，平台的 Worker 通过 HTTP 调用。
 *
 *   JUDGE_TOKEN=... SANDBOX_URL=http://127.0.0.1:5050 bun judge/src/server.ts
 *
 * 接口（都要带 Authorization: Bearer <JUDGE_TOKEN>，除了 /v1/health）：
 *   GET  /v1/health          服务和沙箱是否正常
 *   POST /v1/run             只跑公开用例，或者跑自带的输入
 *   POST /v1/submit          跑全部用例
 * 请求体是 JudgeRequest（src/shared/judge.ts），返回 JudgeResult。
 * 日志只记题目、语言、结果，不记学员代码。
 */
import { join } from "node:path";
import { JudgeRequest, MAX_SUBMIT_BYTES } from "../../src/shared/judge";
import { judge, type Mode } from "./judge";
import { loadProblems } from "./problems";
import { GoJudge } from "./sandbox";

const ROOT = join(import.meta.dir, "../..");
const PORT = Number(process.env.PORT ?? 8790);
const TOKEN = process.env.JUDGE_TOKEN ?? "";
const SANDBOX_URL = process.env.SANDBOX_URL ?? "http://127.0.0.1:5050";
/** 同时判几份提交；多出来的排队 */
const CONCURRENCY = Number(process.env.JUDGE_CONCURRENCY ?? 4);

if (TOKEN.length < 16) {
  console.error("要设置 JUDGE_TOKEN（至少 16 个字符）");
  process.exit(1);
}

const problems = loadProblems(ROOT);
const sandbox = new GoJudge(SANDBOX_URL);

let running = 0;
const waiting: (() => void)[] = [];
async function slot<T>(fn: () => Promise<T>): Promise<T> {
  if (running >= CONCURRENCY) await new Promise<void>((r) => waiting.push(r));
  running++;
  try {
    return await fn();
  } finally {
    running--;
    waiting.shift()?.();
  }
}

const json = (body: unknown, status = 200) => Response.json(body, { status });

function authorized(req: Request): boolean {
  const got = req.headers.get("authorization") ?? "";
  const want = `Bearer ${TOKEN}`;
  if (got.length !== want.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ want.charCodeAt(i);
  return diff === 0;
}

async function handleJudge(req: Request, mode: Mode): Promise<Response> {
  const text = await req.text();
  if (text.length > MAX_SUBMIT_BYTES) return json({ error: "提交的代码太大" }, 413);
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return json({ error: "请求不是合法的 JSON" }, 400);
  }
  const parsed = JudgeRequest.safeParse(raw);
  if (!parsed.success) return json({ error: "请求格式不对", detail: parsed.error.issues.slice(0, 5).map((i) => `${i.path.join(".")}：${i.message}`) }, 400);
  const lp = problems.get(parsed.data.problem);
  if (!lp) return json({ error: "没有这道题" }, 404);
  const started = Date.now();
  const result = await slot(() => judge(sandbox, lp, parsed.data, mode));
  console.log(`${new Date().toISOString()} ${mode} ${parsed.data.problem} ${parsed.data.language} ${result.verdict} ${result.passed}/${result.total} ${Date.now() - started}ms`);
  return json(result);
}

Bun.serve({
  port: PORT,
  hostname: process.env.HOST ?? "127.0.0.1",
  async fetch(req) {
    const { pathname } = new URL(req.url);
    if (pathname === "/v1/health") {
      const ok = await fetch(`${SANDBOX_URL}/version`).then((r) => r.ok, () => false);
      return json({ ok, problems: problems.size, queue: waiting.length, running }, ok ? 200 : 503);
    }
    if (!authorized(req)) return json({ error: "令牌不对" }, 401);
    if (req.method === "POST" && pathname === "/v1/run") return handleJudge(req, "run");
    if (req.method === "POST" && pathname === "/v1/submit") return handleJudge(req, "submit");
    return json({ error: "没有这个接口" }, 404);
  },
});
console.log(`判题服务已启动：http://127.0.0.1:${PORT}，${problems.size} 道题，沙箱 ${SANDBOX_URL}`);
