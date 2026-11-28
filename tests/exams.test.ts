import { afterEach, describe, expect, test } from "bun:test";
import { memoryD1 } from "../scripts/local-d1";
import { Exam, gradeLocal, normalizeText, publicExam } from "../src/shared/exam";
import { GRACE_MS } from "../src/worker/api/exams";
import { EXAMS } from "../src/worker/examData";
import type { Env } from "../src/worker/env";
import worker from "../src/worker/index";

/** 限时测验（故事 3.5）。判题服务和大模型用假的；时间用 Date.now 替身拨快。 */
const realFetch = globalThis.fetch;
const realNow = Date.now;
afterEach(() => {
  globalThis.fetch = realFetch;
  Date.now = realNow;
});

let judgeCalls = 0;
function fakeServices() {
  judgeCalls = 0;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (url.startsWith("http://judge.test")) {
      judgeCalls++;
      const body = JSON.parse(String(init?.body)) as { files: Record<string, string> };
      const good = Object.values(body.files).join("").includes("odd == 0");
      return Response.json(good ? { verdict: "AC", passed: 9, total: 9, timeMs: 1, memoryKb: 1, cases: [] } : { verdict: "WA", passed: 3, total: 9, timeMs: 1, memoryKb: 1, cases: [] });
    }
    if (url.startsWith("http://model.test")) return Response.json({ choices: [{ message: { content: "提示" }, finish_reason: "stop" }] });
    return realFetch(input, init);
  }) as typeof fetch;
}

function setup() {
  const env = {
    DB: memoryD1(),
    ASSETS: { fetch: async () => Response.json({ problems: [{ id: "digit", title: "t", statement: "s", kind: "function" }] }) },
    SESSION_SECRET: "test-session-secret-0123456789abcdef",
    FIRST_ADMIN_CODE: "first-admin-secret",
    JUDGE_URL: "http://judge.test",
    JUDGE_TOKEN: "judge-token-0123456789",
    AI_API_KEY: "k",
    AI_BASE_URL: "http://model.test",
    AI_MODEL: "m",
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
  return { call, login };
}

const ID = "cs61a-fa25-mt1";
const right = {
  q1a: "-7\nNone",
  q1b: " 6\n8\n\n8\nNone ",
  q2a: 8,
  q2b: "last  >  odd",
  q2c: 4,
  q2d: 2,
  q3a1: "f(0)",
  q3a2: "f(t)",
  q3a3: 1,
  q3b1: "n < f(t)",
  q3b2: 9,
  q3b3: 3,
  q3c1: "max_term(f)",
  q3c2: "f(x) != t",
  q4: "def patterned(n):\n    odd = 0\n    while n:\n        n, last = n // 10, n % 10\n        if last % 2 == 1:\n            odd = max(odd, last)\n        elif last > odd:\n            odd = 0\n    return odd == 0\n",
};

describe("测验格式", () => {
  test("站内的测验都通过格式校验；公开版本不带答案和讲解", () => {
    expect(EXAMS.size).toBeGreaterThan(0);
    for (const e of EXAMS.values()) {
      const pub = JSON.stringify(publicExam(e));
      expect(pub).not.toContain('"answer"');
      expect(pub).not.toContain('"answers"');
      expect(pub).not.toContain('"accept"');
      expect(pub).not.toContain('"explain"');
    }
  });

  test("每场测验用自己的标准答案作答，不需要判题服务的题全部满分（防止答案录错）", () => {
    expect([...EXAMS.keys()]).toEqual(["cs61a-fa25-mt1", "cs61a-fa25-mt2", "cs61a-fa25-final"]);
    for (const e of EXAMS.values())
      for (const s of e.sections)
        for (const q of s.questions) {
          const a = q.type === "choice" ? q.answer : q.type === "multi" ? q.answers : q.type === "text" ? q.accept[0]! : null;
          if (a !== null) expect(gradeLocal(q, a), `${e.id}/${q.id}`).toBe(q.points);
          if (q.type === "text") for (const x of q.accept) expect(gradeLocal(q, x), `${e.id}/${q.id}`).toBe(q.points);
        }
    expect(EXAMS.get("cs61a-fa25-final")!.certificate).toBe(true);
  });

  test("填空比较：忽略首尾空白、多余空格和空行", () => {
    expect(normalizeText(" 6\n8\n\n 8 \nNone ")).toBe("6\n8\n8\nNone");
    const q = Exam.parse(EXAMS.get(ID)).sections[1]!.questions[1]!;
    expect(gradeLocal(q, "last   > odd")).toBe(2);
    expect(gradeLocal(q, "odd > last")).toBe(0);
  });
});

describe("限时测验", () => {
  test("游客能看说明但看不到题；开考前不给题目", async () => {
    fakeServices();
    const { call, login } = setup();
    const g = await call("guest", "GET", `/api/exams/${ID}`);
    expect(g.data.exam.minutes).toBe(80);
    expect(g.data.paper).toBeNull();
    expect((await call("guest", "POST", `/api/exams/${ID}/start`)).status).toBe(401);
    await login();
    expect((await call("me", "GET", `/api/exams/${ID}`)).data.paper).toBeNull();
  });

  test("全对：满分、及格；写代码的题交给判题服务；交卷后才有答案和讲解", async () => {
    fakeServices();
    const { call, login } = setup();
    await login();
    const s = await call("me", "POST", `/api/exams/${ID}/start`);
    expect(JSON.stringify(s.data.paper)).not.toContain("explain");
    const attempt = s.data.attempt.id;
    expect((await call("me", "PUT", `/api/exams/${ID}/answers`, { attempt, answers: { q1a: "x" } })).status).toBe(200);
    const r = await call("me", "POST", `/api/exams/${ID}/submit`, { attempt, answers: right });
    expect(r.data.attempt).toMatchObject({ score: 34, maxScore: 34, passed: true });
    expect(judgeCalls).toBe(1);
    expect(JSON.stringify(r.data.paper)).toContain("explain");
    const list = await call("me", "GET", "/api/exams?course=cs61a");
    expect(list.data.exams[0].mine).toMatchObject({ score: 34, passed: true, attempts: 1 });
  });

  test("写代码的题按通过比例给分；没作答的不调判题服务", async () => {
    fakeServices();
    const { call, login } = setup();
    await login();
    const attempt = (await call("me", "POST", `/api/exams/${ID}/start`)).data.attempt.id;
    const r = await call("me", "POST", `/api/exams/${ID}/submit`, { attempt, answers: { ...right, q4: "def patterned(n):\n    return True\n" } });
    expect(r.data.attempt.score).toBeCloseTo(30 + 4 * (3 / 9), 1);
    const attempt2 = (await call("me", "POST", `/api/exams/${ID}/start`)).data.attempt.id;
    const before = judgeCalls;
    const r2 = await call("me", "POST", `/api/exams/${ID}/submit`, { attempt: attempt2, answers: { q2a: 8 } });
    expect(r2.data.attempt).toMatchObject({ score: 2, passed: false });
    expect(judgeCalls).toBe(before);
  });

  test("到时间自动交卷：按最后保存的作答判分，之后不能再保存", async () => {
    fakeServices();
    const { call, login } = setup();
    await login();
    const s = await call("me", "POST", `/api/exams/${ID}/start`);
    const attempt = s.data.attempt.id;
    await call("me", "PUT", `/api/exams/${ID}/answers`, { attempt, answers: { q2a: 8, q2c: 4 } });
    const t0 = realNow();
    Date.now = () => t0 + 80 * 60_000 + GRACE_MS + 1000;
    expect((await call("me", "PUT", `/api/exams/${ID}/answers`, { attempt, answers: right })).status).toBe(409);
    const g = await call("me", "GET", `/api/exams/${ID}`);
    expect(g.data.attempt).toMatchObject({ score: 4, passed: false });
    expect(g.data.attempt.submittedAt).not.toBeNull();
  });

  test("考试进行中不能用 AI；交卷后恢复", async () => {
    fakeServices();
    const { call, login } = setup();
    await login();
    const hint = () => call("me", "POST", "/api/oj/ai/hint", { problem: "cs61a/lab01/digit", files: { "lab01.py": "x" } });
    expect((await hint()).status).toBe(200);
    const attempt = (await call("me", "POST", `/api/exams/${ID}/start`)).data.attempt.id;
    expect((await hint()).status).toBe(403);
    await call("me", "POST", `/api/exams/${ID}/submit`, { attempt, answers: {} });
    expect((await hint()).status).toBe(200);
  });

  test("成绩只本人和管理员能看：别人拿不到这次作答", async () => {
    fakeServices();
    const { call, login } = setup();
    await login();
    const attempt = (await call("me", "POST", `/api/exams/${ID}/start`)).data.attempt.id;
    expect((await call("other", "POST", `/api/exams/${ID}/submit`, { attempt, answers: right })).status).toBe(401);
    const admin = await call("me", "GET", `/api/admin/exams/${ID}/attempts`);
    expect(admin.data.attempts).toHaveLength(1);
  });
});
