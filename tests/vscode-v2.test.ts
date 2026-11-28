import { afterEach, describe, expect, test } from "bun:test";
import { memoryD1 } from "../scripts/local-d1";
import { tokenAllowed } from "../src/worker/api/tokens";
import type { Env } from "../src/worker/env";
import worker from "../src/worker/index";

/** VSCode 插件第二版（2026-11-28）：一键登录、插件用的 Git 凭据、在服务器上运行代码 */
const FORGEJO = "http://forgejo.test";
const JUDGE = "http://judge.test";
const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function fakeServices() {
  const users = new Map<string, string | null>(); // Forgejo 用户名 → 密码
  const execs: any[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    const method = init?.method ?? "GET";
    const body = init?.body ? JSON.parse(String(init.body)) : null;
    const res = (status: number, data?: unknown) => new Response(data === undefined ? "" : JSON.stringify(data), { status });
    if (url.origin === JUDGE) {
      execs.push(body);
      return res(200, { status: "ok", exitCode: 0, timeMs: 12, memoryKb: 9000, stdout: "hello\n", stderr: "" });
    }
    if (url.origin !== FORGEJO) return realFetch(input, init);
    const path = url.pathname.replace("/api/v1", "");
    let m: RegExpMatchArray | null;
    if (method === "POST" && path === "/admin/users") {
      if (users.has(body.username)) return res(422, {});
      users.set(body.username, null);
      return res(201, {});
    }
    if ((m = path.match(/^\/users\/([^/]+)$/))) return users.has(m[1]!) ? res(200, {}) : res(404, {});
    if ((m = path.match(/^\/admin\/users\/([^/]+)$/)) && method === "PATCH") {
      if (!users.has(m[1]!)) return res(404, {});
      if (body.password) users.set(m[1]!, body.password);
      return res(200, {});
    }
    return res(404, {});
  }) as typeof fetch;
  return { users, execs };
}

async function setup() {
  const env = {
    DB: memoryD1(),
    ASSETS: { fetch: async () => new Response("x") },
    SESSION_SECRET: "test-session-secret-0123456789abcdef",
    FIRST_ADMIN_CODE: "first-admin-secret",
    FORGEJO_URL: FORGEJO,
    FORGEJO_TOKEN: "t",
    JUDGE_URL: JUDGE,
    JUDGE_TOKEN: "judge-token-0123456789",
  } as unknown as Env;
  let cookie = "";
  const call = async (method: string, path: string, body?: unknown, bearer?: string) => {
    const headers: Record<string, string> = {};
    if (bearer) headers.authorization = `Bearer ${bearer}`;
    else if (cookie) headers.cookie = cookie;
    if (body !== undefined) headers["content-type"] = "application/json";
    const res = await worker.fetch(new Request(`http://localhost${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }), env);
    const set = res.headers.get("set-cookie");
    if (set && !bearer) cookie = set.split(";")[0]!;
    return { status: res.status, data: (await res.json()) as Record<string, any> };
  };
  const anon = async (method: string, path: string, body?: unknown) => {
    const res = await worker.fetch(new Request(`http://localhost${path}`, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) }), env);
    return { status: res.status, data: (await res.json()) as Record<string, any> };
  };
  await call("POST", "/api/auth/register", { studentNo: "254030411", name: "会长", className: "计科2501", username: "huizhang", password: "pass-2026-x", confirm: "pass-2026-x", invite: "first-admin-secret" });
  return { env, call, anon };
}

describe("插件一键登录", () => {
  test("插件发起、网页确认、插件取到令牌；令牌只交出一次", async () => {
    fakeServices();
    const { call, anon } = await setup();
    const start = await anon("POST", "/api/device/start", { client: "VSCode 插件（宿舍的笔记本）" });
    expect(start.data.userCode).toMatch(/^[A-Z2-9]{4}-[A-Z2-9]{4}$/);
    expect(start.data.url).toBe(`/link?code=${start.data.userCode}`);
    const dc = start.data.deviceCode as string;
    expect((await anon("POST", "/api/device/poll", { deviceCode: dc })).data.status).toBe("pending");

    // 没登录不能看、不能确认
    expect((await anon("GET", `/api/device/${start.data.userCode}`)).status).toBe(401);
    expect((await anon("POST", "/api/device/approve", { code: start.data.userCode, allow: true })).status).toBe(401);
    const info = await call("GET", `/api/device/${start.data.userCode.toLowerCase().replace("-", "")}`);
    expect(info.data).toMatchObject({ client: "VSCode 插件（宿舍的笔记本）", status: "pending" });
    expect((await call("POST", "/api/device/approve", { code: start.data.userCode, allow: true })).data.status).toBe("approved");
    expect((await call("POST", "/api/device/approve", { code: start.data.userCode, allow: true })).status).toBe(409);

    const got = await anon("POST", "/api/device/poll", { deviceCode: dc });
    expect(got.data.status).toBe("ok");
    expect(got.data.token).toMatch(/^hnp_/);
    expect((await anon("POST", "/api/device/poll", { deviceCode: dc })).data.status).toBe("expired");
    expect((await call("GET", "/api/auth/me", undefined, got.data.token)).data.member.username).toBe("huizhang");
    // 令牌列表里出现这个插件的名字；用令牌不能替别的插件批准
    expect((await call("GET", "/api/tokens")).data.tokens[0].name).toBe("VSCode 插件（宿舍的笔记本）");
    const again = await anon("POST", "/api/device/start", {});
    expect((await call("POST", "/api/device/approve", { code: again.data.userCode, allow: true }, got.data.token)).status).toBe(401);
  });

  test("拒绝以后插件得到 denied；确认码不对是 404", async () => {
    fakeServices();
    const { call, anon } = await setup();
    const start = await anon("POST", "/api/device/start", {});
    expect((await call("POST", "/api/device/approve", { code: start.data.userCode, allow: false })).data.status).toBe("denied");
    expect((await anon("POST", "/api/device/poll", { deviceCode: start.data.deviceCode })).data.status).toBe("denied");
    expect((await call("GET", "/api/device/AAAA-AAAA")).status).toBe(404);
  });
});

describe("插件用的 Git 凭据", () => {
  test("没设过 Git 密码就生成一个并记住；设过就用设的；reset 重新生成", async () => {
    const f = fakeServices();
    const { call, env } = await setup();
    const token = (await call("POST", "/api/tokens", { name: "插件" })).data.token as string;
    const a = await call("POST", "/api/git/credential", {}, token);
    expect(a.data).toMatchObject({ username: "huizhang", base: FORGEJO });
    expect(f.users.get("huizhang")).toBe(a.data.password);
    expect((await call("POST", "/api/git/credential", {}, token)).data.password).toBe(a.data.password);

    // 在网页上自己设了 Git 密码：插件拿到的就是它（不会把命令行用的密码改掉）
    await call("POST", "/api/git/password", { password: "My-own-git-2026" });
    expect((await call("POST", "/api/git/credential", {}, token)).data.password).toBe("My-own-git-2026");
    const r = await call("POST", "/api/git/credential", { reset: true }, token);
    expect(r.data.password).not.toBe("My-own-git-2026");
    expect(f.users.get("huizhang")).toBe(r.data.password);
    // 数据库里不是明文
    const row = await env.DB.prepare("SELECT iv, enc FROM git_credentials").first<{ iv: string; enc: string }>();
    expect(row!.enc).not.toContain(Buffer.from(r.data.password).toString("hex"));
  });
});

describe("在服务器上运行代码", () => {
  test("要登录；转给判题服务；路径和语言要检查；每分钟最多 10 次", async () => {
    const f = fakeServices();
    const { call, anon } = await setup();
    const body = { language: "python", main: "lab/hello.py", files: { "lab/hello.py": "print('hello')" }, stdin: "" };
    expect((await anon("POST", "/api/oj/exec", body)).status).toBe(401);
    const token = (await call("POST", "/api/tokens", { name: "插件" })).data.token as string;
    const r = await call("POST", "/api/oj/exec", body, token);
    expect(r.data.result).toMatchObject({ status: "ok", stdout: "hello\n" });
    expect(f.execs[0]).toMatchObject({ language: "python", main: "lab/hello.py" });
    expect((await call("POST", "/api/oj/exec", { ...body, main: "other.py" }, token)).status).toBe(400);
    expect((await call("POST", "/api/oj/exec", { ...body, files: { "../x.py": "" }, main: "../x.py" }, token)).status).toBe(400);
    expect((await call("POST", "/api/oj/exec", { ...body, language: "scheme" }, token)).status).toBe(400);
    // 格式不对的请求不算次数：上面成功 1 次，再 9 次到 10 次
    for (let i = 0; i < 8; i++) await call("POST", "/api/oj/exec", body, token);
    expect((await call("POST", "/api/oj/exec", body, token)).status).toBe(200);
    expect((await call("POST", "/api/oj/exec", body, token)).status).toBe(429);
  });

  test("令牌能用的接口多了运行和 Git 凭据", () => {
    expect(tokenAllowed("POST", "/api/oj/exec")).toBe(true);
    expect(tokenAllowed("POST", "/api/git/credential")).toBe(true);
    expect(tokenAllowed("POST", "/api/device/approve")).toBe(false);
  });
});
