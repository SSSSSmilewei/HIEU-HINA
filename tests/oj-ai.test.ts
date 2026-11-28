import { afterEach, describe, expect, test } from "bun:test";
import { memoryD1 } from "../scripts/local-d1";
import type { Env } from "../src/worker/env";
import worker from "../src/worker/index";
import { guardAnswer, OJ_AI_DAILY_LIMIT, parseReview } from "../src/worker/api/ojAi";

/** OJ 里的 AI（故事 4.1）。大模型和判题服务都用假的。 */
const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

let prompts: { system: string; user: string }[] = [];
function fake(modelReply: string) {
  prompts = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (url.startsWith("http://model.test")) {
      const b = JSON.parse(String(init?.body));
      prompts.push({ system: b.messages[0].content, user: b.messages[1].content });
      return Response.json({ choices: [{ message: { content: modelReply }, finish_reason: "stop" }] });
    }
    if (url.startsWith("http://judge.test")) return Response.json({ verdict: "WA", passed: 0, total: 1, timeMs: 1, memoryKb: 1, cases: [{ index: 1, verdict: "WA", hidden: false, input: "digit(3579, 2)", expected: "5", actual: "9", timeMs: 0, memoryKb: 0 }] });
    return realFetch(input, init);
  }) as typeof fetch;
}

const problem = { title: "取出某一位数字", statement: "实现 digit(n, k)。", kind: "function" };
function setup() {
  const env = {
    DB: memoryD1(),
    ASSETS: {
      fetch: async (req: Request) =>
        new URL(req.url).pathname === "/oj/assignments/cs61a/lab01.json" ? Response.json({ problems: [{ id: "digit", ...problem }] }) : new Response("index", { headers: { "content-type": "text/html" } }),
    },
    SESSION_SECRET: "test-session-secret-0123456789abcdef",
    FIRST_ADMIN_CODE: "first-admin-secret",
    AI_API_KEY: "k",
    AI_BASE_URL: "http://model.test",
    AI_MODEL: "m",
    JUDGE_URL: "http://judge.test",
    JUDGE_TOKEN: "judge-token-0123456789",
  } as unknown as Env;
  const jars = new Map<string, string>();
  async function call(who: string, method: string, path: string, body?: unknown) {
    const headers: Record<string, string> = {};
    if (jars.has(who)) headers.cookie = jars.get(who)!;
    if (body !== undefined) headers["content-type"] = "application/json";
    const res = await worker.fetch(new Request(`http://localhost${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }), env);
    const set = res.headers.get("set-cookie");
    if (set) jars.set(who, set.split(";")[0]!);
    return { status: res.status, data: (await res.json()) as Record<string, any> };
  }
  const login = () => call("me", "POST", "/api/auth/register", { studentNo: "254030411", name: "会长", className: "计科2501", password: "pass-2026-x", confirm: "pass-2026-x", invite: "first-admin-secret" });
  return { env, call, login };
}

const files = { "lab01.py": "def digit(n, k):\n    return n % 10\n" };
const failed = { verdict: "WA", passed: 0, total: 3, timeMs: 0, memoryKb: 0, cases: [{ index: 1, verdict: "WA", hidden: false, input: "digit(3579, 2)", expected: "5", actual: "9", timeMs: 0, memoryKb: 0 }] };

describe("OJ 里的 AI", () => {
  test("长代码块会被隐藏，短的保留", () => {
    expect(guardAnswer("看这里：\n```py\nx = 1\n```")).toContain("x = 1");
    const long = guardAnswer("答案：\n```py\ndef digit(n, k):\n    a = n\n    b = a // 10\n    return b % 10\n```");
    expect(long).not.toContain("return b % 10");
    expect(long).toContain("已经隐藏");
  });

  test("评语 JSON：分数夹在 0–100，多余字段去掉", () => {
    const r = parseReview('```json\n{"summary":"不错","score":130,"suggestions":["a",1,"b"],"x":1}\n```');
    expect(r.score).toBe(100);
    expect(r.suggestions).toEqual(["a", "b"]);
  });

  test("提示：要登录；提示词里带着题面、代码和失败的用例", async () => {
    fake("个位是 n % 10，但这道题要的是往左第 k 位。先想想怎样把末尾 k 位去掉。");
    const { call, login } = setup();
    expect((await call("guest", "POST", "/api/oj/ai/hint", { problem: "cs61a/lab01/digit", files })).status).toBe(401);
    await login();
    const r = await call("me", "POST", "/api/oj/ai/hint", { problem: "cs61a/lab01/digit", files, result: failed });
    expect(r.status).toBe(200);
    expect(r.data.answer).toContain("末尾 k 位");
    expect(prompts[0]!.user).toContain("实现 digit(n, k)");
    expect(prompts[0]!.user).toContain("return n % 10");
    expect(prompts[0]!.user).toContain("digit(3579, 2)");
    expect(prompts[0]!.system).toContain("不给出能直接通过的完整代码");
  });

  test("提问：问题不能为空；题目不存在 404", async () => {
    fake("好问题。");
    const { call, login } = setup();
    await login();
    expect((await call("me", "POST", "/api/oj/ai/ask", { problem: "cs61a/lab01/digit", files, question: " " })).status).toBe(400);
    expect((await call("me", "POST", "/api/oj/ai/ask", { problem: "cs61a/lab01/nope", files, question: "?" })).status).toBe(404);
    expect((await call("me", "POST", "/api/oj/ai/ask", { problem: "cs61a/lab01/digit", files, question: "pow 怎么用？" })).data.answer).toBe("好问题。");
  });

  test("评阅：只能评自己的提交；同一次提交只评一次（第二次读缓存）", async () => {
    fake('{"summary":"思路对了一半","approach":"只取了个位","edgeCases":"k 超过位数","quality":"简洁","suggestions":["先去掉末尾 k 位"],"score":55}');
    const { call, login } = setup();
    await login();
    const s = await call("me", "POST", "/api/oj/submit", { problem: "cs61a/lab01/digit", language: "python", files });
    expect(s.status).toBe(200);
    const r1 = await call("me", "POST", "/api/oj/ai/review", { submission: s.data.id });
    expect(r1.data.review).toMatchObject({ score: 55, summary: "思路对了一半" });
    const before = prompts.length;
    const r2 = await call("me", "POST", "/api/oj/ai/review", { submission: s.data.id });
    expect(r2.data.review.score).toBe(55);
    expect(prompts.length).toBe(before);
    expect((await call("other", "POST", "/api/oj/ai/review", { submission: s.data.id })).status).toBe(401);
  });

  test("每天的次数有上限", async () => {
    fake("提示");
    const { call, login } = setup();
    await login();
    for (let i = 0; i < OJ_AI_DAILY_LIMIT; i++) expect((await call("me", "POST", "/api/oj/ai/hint", { problem: "cs61a/lab01/digit", files })).status).toBe(200);
    expect((await call("me", "POST", "/api/oj/ai/hint", { problem: "cs61a/lab01/digit", files })).status).toBe(429);
  });
});
