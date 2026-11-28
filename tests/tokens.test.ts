import { describe, expect, test } from "bun:test";
import { memoryD1 } from "../scripts/local-d1";
import { tokenAllowed } from "../src/worker/api/tokens";
import type { Env } from "../src/worker/env";
import worker from "../src/worker/index";

/** 个人令牌（故事 2.3，VSCode 插件用） */
async function setup() {
  const env = { DB: memoryD1(), ASSETS: { fetch: async () => new Response("x") }, SESSION_SECRET: "test-session-secret-0123456789abcdef", FIRST_ADMIN_CODE: "first-admin-secret" } as unknown as Env;
  const jar: { cookie?: string } = {};
  const call = async (method: string, path: string, body?: unknown, bearer?: string) => {
    const headers: Record<string, string> = {};
    if (bearer) headers.authorization = `Bearer ${bearer}`;
    else if (jar.cookie) headers.cookie = jar.cookie;
    if (body !== undefined) headers["content-type"] = "application/json";
    const res = await worker.fetch(new Request(`http://localhost${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }), env);
    const set = res.headers.get("set-cookie");
    if (set && !bearer) jar.cookie = set.split(";")[0]!;
    return { status: res.status, data: (await res.json()) as Record<string, any> };
  };
  await call("POST", "/api/auth/register", { studentNo: "254030411", name: "会长", className: "计科2501", password: "pass-2026-x", confirm: "pass-2026-x", invite: "first-admin-secret" });
  return { env, call };
}

describe("个人令牌", () => {
  test("只放行插件要用的接口", () => {
    expect(tokenAllowed("GET", "/api/auth/me")).toBe(true);
    expect(tokenAllowed("POST", "/api/oj/submit")).toBe(true);
    expect(tokenAllowed("POST", "/api/oj/run")).toBe(true);
    expect(tokenAllowed("GET", "/api/oj/submissions/abc")).toBe(true);
    expect(tokenAllowed("GET", "/api/git/repos/cs61a/commits")).toBe(true);
    expect(tokenAllowed("POST", "/api/git/repos/cs61a/visibility")).toBe(false);
    expect(tokenAllowed("POST", "/api/git/password")).toBe(false);
    expect(tokenAllowed("POST", "/api/tokens")).toBe(false);
    expect(tokenAllowed("POST", "/api/auth/password")).toBe(false);
    expect(tokenAllowed("POST", "/api/attendance/checkin")).toBe(false);
  });

  test("签发、使用、撤销；数据库里只存散列", async () => {
    const { env, call } = await setup();
    expect((await call("POST", "/api/tokens", { name: "" })).status).toBe(400);
    const made = await call("POST", "/api/tokens", { name: "宿舍的笔记本" });
    const token = made.data.token as string;
    expect(token).toMatch(/^hnp_[0-9a-f]{48}$/);
    const stored = await env.DB.prepare("SELECT hash, hint FROM api_tokens").first<{ hash: string; hint: string }>();
    expect(stored!.hash).not.toContain(token);
    expect(stored!.hint).toBe(token.slice(-4));

    const list = await call("GET", "/api/tokens");
    expect(list.data.tokens).toHaveLength(1);
    expect(list.data.tokens[0].name).toBe("宿舍的笔记本");
    expect(JSON.stringify(list.data)).not.toContain(token);

    // 用令牌：能看账号；不能签发新令牌、不能改密码（当作没登录）
    expect((await call("GET", "/api/auth/me", undefined, token)).data.member.studentNo).toBe("254030411");
    expect((await call("POST", "/api/tokens", { name: "再来一个" }, token)).status).toBe(401);
    expect((await call("POST", "/api/auth/password", { current: "pass-2026-x", password: "pass-2027-y", confirm: "pass-2027-y" }, token)).status).toBe(401);
    expect((await call("GET", "/api/auth/me", undefined, "hnp_" + "0".repeat(48))).data.role).toBeNull();

    await call("DELETE", `/api/tokens/${made.data.id}`);
    expect((await call("GET", "/api/auth/me", undefined, token)).data.role).toBeNull();
    expect((await call("GET", "/api/tokens")).data.tokens).toEqual([]);
    expect((await call("DELETE", `/api/tokens/${made.data.id}`)).status).toBe(404);
  });

  test("改密码以后旧令牌失效", async () => {
    const { call } = await setup();
    const token = (await call("POST", "/api/tokens", { name: "旧电脑" })).data.token as string;
    expect((await call("GET", "/api/auth/me", undefined, token)).data.role).toBe("member");
    expect((await call("POST", "/api/auth/password", { current: "pass-2026-x", password: "pass-2027-y", confirm: "pass-2027-y" })).status).toBe(200);
    expect((await call("GET", "/api/auth/me", undefined, token)).data.role).toBeNull();
    expect((await call("GET", "/api/tokens")).data.tokens).toEqual([]);
  });

  test("最多同时 10 个", async () => {
    const { call } = await setup();
    for (let i = 0; i < 10; i++) expect((await call("POST", "/api/tokens", { name: `第 ${i} 个` })).status).toBe(200);
    expect((await call("POST", "/api/tokens", { name: "第 11 个" })).status).toBe(400);
  });
});
