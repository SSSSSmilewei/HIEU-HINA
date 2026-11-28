import { afterEach, describe, expect, test } from "bun:test";
import { memoryD1 } from "../scripts/local-d1";
import type { JudgeResult } from "../src/shared/judge";
import type { Env } from "../src/worker/env";
import worker from "../src/worker/index";
import { RUNS_PER_MINUTE, SUBMITS_PER_MINUTE } from "../src/worker/api/oj";

/** 平台判题接口（故事 1.3）。判题服务用假的代替：拦下发往 JUDGE_URL 的请求。 */
const JUDGE_URL = "http://judge.test";
const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

let judgeCalls: { path: string; auth: string | null; body: Record<string, unknown> }[] = [];
function fakeJudge(reply: (body: Record<string, unknown>) => Partial<JudgeResult> | number) {
  judgeCalls = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (!url.startsWith(JUDGE_URL)) return realFetch(input, init);
    const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
    judgeCalls.push({ path: new URL(url).pathname, auth: new Headers(init?.headers).get("authorization"), body });
    const r = reply(body);
    if (typeof r === "number") return new Response(JSON.stringify({ error: "x" }), { status: r });
    return Response.json({ verdict: "AC", passed: 1, total: 1, timeMs: 3, memoryKb: 512, cases: [], ...r });
  }) as typeof fetch;
}

function setup(judge = true) {
  const env = {
    DB: memoryD1(),
    ASSETS: { fetch: async () => new Response("index") },
    SESSION_SECRET: "test-session-secret-0123456789abcdef",
    FIRST_ADMIN_CODE: "first-admin-secret",
    ...(judge ? { JUDGE_URL, JUDGE_TOKEN: "judge-token-0123456789" } : {}),
  } as unknown as Env;
  const jars = new Map<string, string>();
  async function call(who: string, method: string, path: string, body?: unknown) {
    const headers: Record<string, string> = {};
    if (jars.has(who)) headers.cookie = jars.get(who) as string;
    if (body !== undefined) headers["content-type"] = "application/json";
    const res = await worker.fetch(new Request(`http://localhost${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }), env);
    const set = res.headers.get("set-cookie");
    if (set) jars.set(who, set.split(";")[0]!);
    return { status: res.status, data: (await res.json()) as Record<string, any> };
  }
  async function admin() {
    const r = await call("admin", "POST", "/api/auth/register", { studentNo: "254030411", name: "会长", className: "计科2501", password: "pass-2026-x", confirm: "pass-2026-x", invite: "first-admin-secret" });
    expect(r.status).toBe(200);
  }
  return { env, call, admin };
}

const req = { problem: "cs61a/lab01/digit", language: "python", files: { "lab01.py": "def digit(n, k): return n // 10 ** k % 10\n" } };

describe("OJ 判题接口", () => {
  test("运行：游客也能用，请求原样转给判题服务并带上令牌", async () => {
    fakeJudge(() => ({ verdict: "WA", passed: 0 }));
    const { call } = setup();
    const r = await call("guest", "POST", "/api/oj/run", req);
    expect(r.status).toBe(200);
    expect(r.data.result.verdict).toBe("WA");
    expect(judgeCalls[0]).toMatchObject({ path: "/v1/run", auth: "Bearer judge-token-0123456789", body: req });
  });

  test("提交要登录", async () => {
    fakeJudge(() => ({}));
    const { call } = setup();
    expect((await call("guest", "POST", "/api/oj/submit", req)).status).toBe(401);
    expect(judgeCalls).toHaveLength(0);
  });

  test("提交存记录；第一次通过记进热力图，之后不重复", async () => {
    fakeJudge(() => ({ verdict: "AC", passed: 3, total: 3 }));
    const { call, admin, env } = setup();
    await admin();
    const first = await call("admin", "POST", "/api/oj/submit", req);
    expect(first.data).toMatchObject({ firstSolve: true, result: { verdict: "AC" } });
    const second = await call("admin", "POST", "/api/oj/submit", req);
    expect(second.data.firstSolve).toBe(false);

    const list = await call("admin", "GET", `/api/oj/submissions?problem=${encodeURIComponent(req.problem)}`);
    expect(list.data.submissions).toHaveLength(2);
    expect(list.data.submissions[0]).toMatchObject({ verdict: "AC", passed: 3, total: 3, language: "python" });

    const one = await call("admin", "GET", `/api/oj/submissions/${first.data.id}`);
    expect(one.data.submission.files).toEqual(req.files);

    expect((await call("admin", "GET", "/api/oj/solved?prefix=cs61a/lab01")).data.solved.map((s: { problem: string }) => s.problem)).toEqual([req.problem]);
    expect((await call("admin", "GET", "/api/oj/solved?prefix=cs61a/lab02")).data.solved).toEqual([]);

    const events = await env.DB.prepare("SELECT COUNT(*) AS n FROM activity_events WHERE ref = ?").bind(`oj:${req.problem}`).first<{ n: number }>();
    expect(events?.n).toBe(1);
  });

  test("别人的提交看不到", async () => {
    fakeJudge(() => ({}));
    const { call, admin } = setup();
    await admin();
    const s = await call("admin", "POST", "/api/oj/submit", req);
    expect((await call("guest", "GET", `/api/oj/submissions/${s.data.id}`)).status).toBe(401);
  });

  test("参数不对 400；题目不存在 404；判题服务没配或出错 503", async () => {
    fakeJudge((b) => (b.problem === "nope" ? 404 : 500));
    const { call } = setup();
    expect((await call("g", "POST", "/api/oj/run", { ...req, language: "rust" })).status).toBe(400);
    expect((await call("g", "POST", "/api/oj/run", { ...req, problem: "nope" })).status).toBe(404);
    expect((await call("g", "POST", "/api/oj/run", req)).status).toBe(503);
    const noJudge = setup(false);
    expect((await noJudge.call("g", "POST", "/api/oj/run", req)).data.error).toContain("还没有配置");
  });

  test("代码太大回 413", async () => {
    fakeJudge(() => ({}));
    const { call } = setup();
    const r = await call("g", "POST", "/api/oj/run", { ...req, files: { "lab01.py": "x".repeat(300 * 1024) } });
    expect(r.status).toBe(413);
  });

  test("限流：运行和提交每分钟有上限", async () => {
    fakeJudge(() => ({}));
    const { call, admin } = setup();
    for (let i = 0; i < RUNS_PER_MINUTE; i++) expect((await call("g", "POST", "/api/oj/run", req)).status).toBe(200);
    expect((await call("g", "POST", "/api/oj/run", req)).status).toBe(429);
    await admin();
    for (let i = 0; i < SUBMITS_PER_MINUTE; i++) expect((await call("admin", "POST", "/api/oj/submit", req)).status).toBe(200);
    expect((await call("admin", "POST", "/api/oj/submit", req)).status).toBe(429);
  });
});
