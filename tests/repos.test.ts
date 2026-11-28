import { afterEach, describe, expect, test } from "bun:test";
import { memoryD1 } from "../scripts/local-d1";
import { looksBinary, safePath } from "../src/worker/api/repos";
import type { Env } from "../src/worker/env";
import worker from "../src/worker/index";

/** 平台内的仓库页（故事 2.2）。Forgejo 用假服务代替，只实现仓库页用到的接口。 */
const BASE = "http://forgejo.test";
const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

const b64 = (s: string | Uint8Array) => btoa(String.fromCharCode(...(typeof s === "string" ? new TextEncoder().encode(s) : s)));

function fakeForgejo() {
  const seen: { method: string; path: string; body: any }[] = [];
  const repo = { name: "cs61a", description: "CS61A 的作业与项目", private: true, empty: false, size: 12, updated_at: "2026-11-26T08:22:03Z", default_branch: "main" };
  const commit = (sha: string, message: string) => ({ sha, created: "2026-11-26T08:22:02Z", commit: { message, author: { name: "会长", email: "x", date: "2026-11-26T08:22:02Z" } }, parents: [{ sha: "p".repeat(40) }], stats: { total: 3, additions: 2, deletions: 1 }, files: [{ filename: "lab/lab01/lab01.py", status: "modified" }] });
  const sha = "a".repeat(40);
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    if (url.origin !== BASE) return realFetch(input, init);
    const method = init?.method ?? "GET";
    const path = url.pathname.replace("/api/v1", "");
    const body = init?.body ? JSON.parse(String(init.body)) : null;
    seen.push({ method, path, body });
    const res = (status: number, data?: unknown, headers: Record<string, string> = {}) => new Response(data === undefined ? "" : JSON.stringify(data), { status, headers });
    if (method === "GET" && path === "/users/s254030411/repos") return res(200, [repo]);
    if (method === "GET" && path === "/repos/s254030411/cs61a") return res(200, repo);
    if (method === "PATCH" && path === "/repos/s254030411/cs61a") return res(200, { ...repo, private: body.private });
    if (method === "GET" && path === "/repos/s254030411/cs61a/git/trees/main")
      return res(200, { tree: [{ path: "lab", type: "tree", size: 0 }, { path: "lab/lab01/lab01.py", type: "blob", size: 30 }, { path: "img.png", type: "blob", size: 4 }], truncated: false });
    if (method === "GET" && path === "/repos/s254030411/cs61a/contents/lab/lab01/lab01.py") return res(200, { type: "file", size: 30, content: b64("def digit(n, k):\n    return 1\n"), encoding: "base64" });
    if (method === "GET" && path === "/repos/s254030411/cs61a/contents/img.png") return res(200, { type: "file", size: 4, content: b64(new Uint8Array([0x89, 0, 0x4e, 0x47])), encoding: "base64" });
    if (method === "GET" && path === "/repos/s254030411/cs61a/commits") return res(200, [commit(sha, "实验 1 · 取出某一位数字：提交，通过（3/3）\n\n细节")], { "x-total-count": "31", "x-hasmore": "true" });
    if (method === "GET" && path === `/repos/s254030411/cs61a/git/commits/${sha}`) return res(200, commit(sha, "实验 1 · 取出某一位数字：提交，通过（3/3）\n"));
    if (method === "GET" && path === `/repos/s254030411/cs61a/git/commits/${sha}.diff`) return new Response("diff --git a/lab/lab01/lab01.py b/lab/lab01/lab01.py\n-    return ______\n+    return 1\n");
    if (method === "PATCH" && path === "/admin/users/s254030411") return res(body.password === "weakweak" ? 422 : 200, {});
    if (method === "POST" && path === "/admin/users") return res(201, {});
    return res(404, { message: `fake: no ${method} ${path}` });
  }) as typeof fetch;
  return { seen, sha };
}

async function setup() {
  const env = {
    DB: memoryD1(),
    ASSETS: { fetch: async () => new Response("x") },
    SESSION_SECRET: "test-session-secret-0123456789abcdef",
    FIRST_ADMIN_CODE: "first-admin-secret",
    FORGEJO_URL: BASE,
    FORGEJO_TOKEN: "t",
    FORGEJO_PUBLIC_URL: "https://git.example.edu/",
  } as unknown as Env;
  const jars = new Map<string, string>();
  const call = async (who: string, method: string, path: string, body?: unknown) => {
    const headers: Record<string, string> = {};
    if (jars.has(who)) headers.cookie = jars.get(who)!;
    if (body !== undefined) headers["content-type"] = "application/json";
    const res = await worker.fetch(new Request(`http://localhost${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }), env);
    const set = res.headers.get("set-cookie");
    if (set) jars.set(who, set.split(";")[0]!);
    return { status: res.status, data: (await res.json()) as Record<string, any> };
  };
  await call("me", "POST", "/api/auth/register", { studentNo: "254030411", name: "会长", className: "计科2501", password: "pass-2026-x", confirm: "pass-2026-x", invite: "first-admin-secret" });
  return { env, call };
}

describe("仓库页的路径检查", () => {
  test("不许 ..、开头的 /、空的一级", () => {
    expect(safePath("lab/lab01/lab01.py")).toBe("lab/lab01/lab01.py");
    expect(safePath("中文 目录/a b.py")).toBe("%E4%B8%AD%E6%96%87%20%E7%9B%AE%E5%BD%95/a%20b.py");
    for (const bad of ["", "/etc/passwd", "../x", "a/../b", "a//b", "a/./b", "a\nb"]) expect(safePath(bad)).toBeNull();
  });

  test("有 0 字节就当二进制", () => {
    expect(looksBinary(new Uint8Array([0x89, 0x50, 0]))).toBe(true);
    expect(looksBinary(new TextEncoder().encode("print('你好')"))).toBe(false);
  });
});

describe("仓库页接口", () => {
  test("游客要先登录；还没交过作业的人没有仓库", async () => {
    fakeForgejo();
    const { call } = await setup();
    expect((await call("guest", "GET", "/api/git/repos")).status).toBe(401);
    expect((await call("me", "GET", "/api/git/repos")).data).toEqual({ enabled: true, owner: null, repos: [] });
    expect((await call("me", "GET", "/api/git/repos/cs61a")).status).toBe(404);
  });

  test("列表、文件树、文件、提交历史、一次提交的改动对比", async () => {
    const f = fakeForgejo();
    const { env, call } = await setup();
    const me = await env.DB.prepare("SELECT id FROM users WHERE student_no = '254030411'").first<{ id: string }>();
    await env.DB.prepare("INSERT INTO forgejo_users (user_id, username, created_at) VALUES (?, 's254030411', 0)").bind(me!.id).run();

    const list = await call("me", "GET", "/api/git/repos");
    expect(list.data.repos).toEqual([{ name: "cs61a", description: "CS61A 的作业与项目", private: true, empty: false, sizeKb: 12, updatedAt: Date.parse("2026-11-26T08:22:03Z"), cloneUrl: "https://git.example.edu/s254030411/cs61a.git" }]);

    const repo = await call("me", "GET", "/api/git/repos/cs61a");
    expect(repo.data.tree).toEqual([
      { path: "lab", type: "dir", size: 0 },
      { path: "lab/lab01/lab01.py", type: "file", size: 30 },
      { path: "img.png", type: "file", size: 4 },
    ]);
    expect(repo.data.branch).toBe("main");

    expect((await call("me", "GET", "/api/git/repos/cs61a/file?path=lab/lab01/lab01.py")).data).toEqual({ size: 30, content: "def digit(n, k):\n    return 1\n" });
    expect((await call("me", "GET", "/api/git/repos/cs61a/file?path=img.png")).data).toEqual({ size: 4, binary: true });
    expect((await call("me", "GET", "/api/git/repos/cs61a/file?path=../../etc/passwd")).status).toBe(400);
    expect((await call("me", "GET", "/api/git/repos/..%2Fx/file?path=a")).status).toBe(400);

    const commits = await call("me", "GET", "/api/git/repos/cs61a/commits?page=1");
    expect(commits.data).toEqual({ commits: [{ sha: f.sha, title: "实验 1 · 取出某一位数字：提交，通过（3/3）", author: "会长", at: Date.parse("2026-11-26T08:22:02Z"), additions: 2, deletions: 1 }], total: 31, hasMore: true });

    const one = await call("me", "GET", `/api/git/repos/cs61a/commits/${f.sha}`);
    expect(one.data.files).toEqual([{ path: "lab/lab01/lab01.py", status: "modified" }]);
    expect(one.data.diff).toContain("+    return 1");
    expect(one.data.diffTruncated).toBe(false);
    expect((await call("me", "GET", "/api/git/repos/cs61a/commits/not-a-sha")).status).toBe(400);

    // 只会请求自己名下的仓库
    expect(f.seen.every((r) => !r.path.startsWith("/repos/") || r.path.startsWith("/repos/s254030411/"))).toBe(true);
  });

  test("改公开或私有；设置 Git 密码", async () => {
    const f = fakeForgejo();
    const { env, call } = await setup();
    const me = await env.DB.prepare("SELECT id FROM users WHERE student_no = '254030411'").first<{ id: string }>();
    await env.DB.prepare("INSERT INTO forgejo_users (user_id, username, created_at) VALUES (?, 's254030411', 0)").bind(me!.id).run();

    expect((await call("me", "POST", "/api/git/repos/cs61a/visibility", { private: "no" })).status).toBe(400);
    expect((await call("me", "POST", "/api/git/repos/cs61a/visibility", { private: false })).data).toEqual({ private: false });

    expect((await call("me", "POST", "/api/git/password", { password: "short" })).status).toBe(400);
    expect((await call("me", "POST", "/api/git/password", { password: "has space 123" })).status).toBe(400);
    expect((await call("me", "POST", "/api/git/password", { password: "weakweak" })).status).toBe(400);
    expect((await call("me", "POST", "/api/git/password", { password: "Git-pass-2026" })).data).toEqual({ ok: true, owner: "s254030411" });
    expect(f.seen.find((r) => r.method === "PATCH" && r.path === "/admin/users/s254030411" && r.body.password === "Git-pass-2026")).toBeTruthy();
  });

  test("仓库服务没配置：列表说没开，其他接口回 503", async () => {
    const { env, call } = await setup();
    (env as { FORGEJO_URL?: string }).FORGEJO_URL = undefined;
    expect((await call("me", "GET", "/api/git/repos")).data.enabled).toBe(false);
    expect((await call("me", "GET", "/api/git/repos/cs61a")).status).toBe(503);
  });
});

describe("改动对比的解析", () => {
  test("按文件切开，算出新旧行号，跳过文件头", async () => {
    const { parseDiff } = await import("../src/client/pages/Repos");
    const diff = [
      "diff --git a/lab/lab01.py b/lab/lab01.py",
      "index 1111111..2222222 100644",
      "--- a/lab/lab01.py",
      "+++ b/lab/lab01.py",
      "@@ -1,3 +1,3 @@",
      " def digit(n, k):",
      "-    return ______",
      "+    return n // 10 ** k % 10",
      " ",
      "\\ No newline at end of file",
      "diff --git a/img.png b/img.png",
      "new file mode 100644",
      "Binary files /dev/null and b/img.png differ",
      "",
    ].join("\n");
    const files = parseDiff(diff);
    expect(files.map((f) => [f.path, f.binary])).toEqual([
      ["lab/lab01.py", false],
      ["img.png", true],
    ]);
    expect(files[0]!.lines).toEqual([
      { kind: "hunk", text: "@@ -1,3 +1,3 @@" },
      { kind: "ctx", text: "def digit(n, k):", old: 1, new: 1 },
      { kind: "del", text: "    return ______", old: 2 },
      { kind: "add", text: "    return n // 10 ** k % 10", new: 2 },
      { kind: "ctx", text: "", old: 3, new: 3 },
      { kind: "note", text: "No newline at end of file" },
    ]);
  });
});
