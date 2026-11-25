import { existsSync, readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { memoryD1 } from "../scripts/local-d1";
import type { LevelIndex } from "../src/shared/levels";
import type { Env } from "../src/worker/env";
import worker from "../src/worker/index";

function setup() {
  const env = {
    DB: memoryD1(),
    ASSETS: { fetch: async () => new Response("index") },
    SESSION_SECRET: "test-session-secret-0123456789abcdef",
    FIRST_ADMIN_CODE: "first-admin-secret",
  } as unknown as Env;
  const jars = new Map<string, string>();
  async function call(who: string, method: string, path: string, body?: unknown) {
    const headers: Record<string, string> = {};
    if (jars.has(who)) headers.cookie = jars.get(who) as string;
    if (body !== undefined) headers["content-type"] = "application/json";
    const res = await worker.fetch(new Request(`http://localhost${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }), env);
    const set = res.headers.get("set-cookie");
    if (set) jars.set(who, set.split(";")[0]);
    const text = await res.text();
    let data: any = text;
    try {
      data = JSON.parse(text);
    } catch {
      /* 非 JSON */
    }
    return { status: res.status, data };
  }
  async function accounts() {
    const reg = (who: string, body: Record<string, unknown>) => call(who, "POST", "/api/auth/register", { className: "计科2501", password: "pass-2026-x", confirm: "pass-2026-x", ...body });
    expect((await reg("admin", { studentNo: "254030411", name: "会长", invite: "first-admin-secret" })).status).toBe(200);
    const inv = await call("admin", "POST", "/api/admin/invites", { count: 1 });
    expect((await reg("lin", { studentNo: "250101001", name: "林同学", invite: inv.data.codes[0] })).status).toBe(200);
  }
  return { call, accounts };
}

describe("闯关：仓库和过关记录", () => {
  test("保存、读取、覆盖、删除文件；每人的仓库互不可见", async () => {
    const { call, accounts } = setup();
    await accounts();
    expect((await call("guest", "GET", "/api/repos/cs61a")).status).toBe(401);
    expect((await call("lin", "PUT", "/api/repos/cs61a/files", { path: "hog/hog.py", content: "x = 1\n" })).data.ok).toBe(true);
    expect((await call("lin", "PUT", "/api/repos/cs61a/files", { path: "hog/hog.py", content: "x = 2\n" })).data.ok).toBe(true);
    const mine = await call("lin", "GET", "/api/repos/cs61a");
    expect(mine.data.files).toHaveLength(1);
    expect(mine.data.files[0]).toMatchObject({ path: "hog/hog.py", content: "x = 2\n" });
    expect((await call("admin", "GET", "/api/repos/cs61a")).data.files).toEqual([]);
    expect((await call("lin", "DELETE", "/api/repos/cs61a/files?path=hog/hog.py")).data.ok).toBe(true);
    expect((await call("lin", "GET", "/api/repos/cs61a")).data.files).toEqual([]);
  });

  test("拒绝不合法的路径、太大的文件、不存在的课", async () => {
    const { call, accounts } = setup();
    await accounts();
    for (const path of ["../etc/passwd", "/abs.py", "a/../b.py", "a b.py", ""]) {
      expect((await call("lin", "PUT", "/api/repos/cs61a/files", { path, content: "" })).status).toBe(400);
    }
    expect((await call("lin", "PUT", "/api/repos/cs61a/files", { path: "big.py", content: "x".repeat(200_001) })).status).toBe(413);
    expect((await call("lin", "PUT", "/api/repos/no-such-course/files", { path: "a.py", content: "" })).status).toBe(404);
  });

  test("过关只在第一次记录", async () => {
    const { call, accounts } = setup();
    await accounts();
    expect((await call("lin", "PUT", "/api/levels/cs61a/hog/q01")).data).toEqual({ ok: true, first: true });
    expect((await call("lin", "PUT", "/api/levels/cs61a/hog/q01")).data).toEqual({ ok: true, first: false });
    const got = await call("lin", "GET", "/api/levels/cs61a");
    expect(Object.keys(got.data.passed)).toEqual(["hog/q01"]);
    expect((await call("lin", "PUT", "/api/levels/cs61a/Hog_X/q01")).status).toBe(400);
  });
});

describe("闯关内容", () => {
  const index = JSON.parse(readFileSync("content/levels/cs61a/index.json", "utf8")) as LevelIndex;

  test("CS61A：关卡 id 不重复，测试文件、起始文件都在，链接到的条目存在", () => {
    expect(index.format).toBe("hiana-levels@1");
    const course = JSON.parse(readFileSync("content/courses/cs61a/course.json", "utf8"));
    const itemIds = new Set(course.modules.flatMap((m: any) => m.items.map((it: any) => it.id)));
    const pageIds = new Set(course.modules.flatMap((m: any) => m.items.flatMap((it: any) => it.pages.map((p: any) => p.id))));
    for (const ch of index.chapters) {
      expect(itemIds.has(ch.item)).toBe(true);
      if (ch.soon) continue;
      const ids = ch.levels.map((l) => l.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const f of [...(ch.files ?? []).map((f) => f.path), ...(ch.support ?? [])]) expect(existsSync(`content/levels/cs61a/${f}`)).toBe(true);
      for (const lv of ch.levels) {
        expect(existsSync(`content/levels/cs61a/${ch.dir}/tests/${lv.test}.py`)).toBe(true);
        expect(lv.task.length).toBeGreaterThan(50);
        for (const r of lv.refs) expect(pageIds.has(r.href.split("/").pop())).toBe(true);
      }
    }
  });

  test("仓库里没有官方答案：测试里的期望输出都是加密的或者是题面里给出的", () => {
    // 抽查：第 1 关的第一个用例在官方测试里是加密的
    const t01 = readFileSync("content/levels/cs61a/hog/tests/01.py", "utf8");
    expect(t01).toContain("8a27d52d885dfcd62a4a92cbfe64d30a");
    expect(t01).toContain("# locked");
  });
});
