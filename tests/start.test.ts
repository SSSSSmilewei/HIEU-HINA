import { describe, expect, test } from "bun:test";
import { memoryD1 } from "../scripts/local-d1";
import type { Env } from "../src/worker/env";
import worker from "../src/worker/index";

/** 和 api.test.ts 一样：内存数据库 + 带 Cookie 调接口。ip 用来测防刷（从 applications.test.ts 抄来） */
function setup() {
  const env = {
    DB: memoryD1(),
    ASSETS: { fetch: async () => new Response("index") },
    SESSION_SECRET: "test-session-secret-0123456789abcdef",
    FIRST_ADMIN_CODE: "first-admin-secret",
  } as unknown as Env;
  const jars = new Map<string, string>();
  let ipSeq = 0;
  async function call(who: string, method: string, path: string, body?: unknown, ip?: string) {
    const headers: Record<string, string> = { "cf-connecting-ip": ip ?? `10.0.0.${++ipSeq % 250}` };
    if (jars.has(who)) headers.cookie = jars.get(who) as string;
    if (body !== undefined) headers["content-type"] = "application/json";
    const res = await worker.fetch(
      new Request(`http://localhost${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }),
      env,
    );
    const set = res.headers.get("set-cookie");
    if (set) jars.set(who, set.split(";")[0]);
    const bytes = new Uint8Array(await res.arrayBuffer());
    const text = new TextDecoder().decode(bytes);
    let data: unknown = text;
    try {
      data = JSON.parse(text);
    } catch {
      /* CSV */
    }
    return { status: res.status, data: data as Record<string, any>, text, bytes, headers: res.headers };
  }
  /** 一个管理员 admin、一个普通成员 lin */
  async function accounts() {
    const reg = (who: string, body: Record<string, unknown>) => call(who, "POST", "/api/auth/register", { className: "计科2501", password: "pass-2026-x", confirm: "pass-2026-x", ...body });
    expect((await reg("admin", { studentNo: "254030411", name: "会长", invite: "first-admin-secret" })).status).toBe(200);
    const inv = await call("admin", "POST", "/api/admin/invites", { count: 1 });
    expect((await reg("lin", { studentNo: "250101001", name: "林同学", invite: inv.data.codes[0] })).status).toBe(200);
  }
  return { env, call, accounts };
}

describe("新生任务", () => {
  test("/api/start 一次返回三项任务的进度；前言在讲义页标记完成后变成已读", async () => {
    const { call, accounts } = setup();
    await accounts();
    expect((await call("guest", "GET", "/api/start")).status).toBe(401);
    const s0 = (await call("lin", "GET", "/api/start")).data;
    expect(s0.prefaces).toEqual([false, false]);
    expect(s0.cs50x.done).toBe(false);
    expect(s0.cs50x.progress.items).toBeGreaterThan(0);
    expect(s0.cs50x.next.id).toBeTruthy();
    expect(s0.certificates).toEqual([]);

    await call("lin", "PUT", "/api/courses/csdiy/items/preface", { done: true });
    await call("lin", "PUT", "/api/courses/across-the-deep-sea/items/preface", { done: true });
    await call("lin", "PUT", `/api/courses/cs50x/items/${s0.cs50x.next.id}`, { done: true });
    const s1 = (await call("lin", "GET", "/api/start")).data;
    expect(s1.prefaces).toEqual([true, true]);
    expect(s1.cs50x.progress.doneItems).toBe(1);
    expect(s1.cs50x.next.id).not.toBe(s0.cs50x.next.id);
  });

  test("CS50x：本人点「我已完成」，可以撤销；旧版 App 读 certificates 也认作完成", async () => {
    const { call, accounts } = setup();
    await accounts();
    expect((await call("guest", "PUT", "/api/start/done/cs50x")).status).toBe(401);
    expect((await call("lin", "DELETE", "/api/start/done/cs50x")).status).toBe(409);

    expect((await call("lin", "PUT", "/api/start/done/cs50x")).status).toBe(200);
    const s = (await call("lin", "GET", "/api/start")).data;
    expect(s.cs50x).toMatchObject({ done: true, self: true });
    expect(s.certificates[0]).toMatchObject({ course: "cs50x", status: "approved" });

    expect((await call("lin", "DELETE", "/api/start/done/cs50x")).status).toBe(200);
    expect((await call("lin", "GET", "/api/start")).data.cs50x.done).toBe(false);
  });

  test("证书提交和确认已取消：旧接口回提示，不报错；以前确认过的证书照样算完成、不能撤销", async () => {
    const { env, call, accounts } = setup();
    await accounts();
    const put = await call("lin", "PUT", "/api/start/certificates/cs50x", { url: "https://certificates.cs50.io/abc.pdf" });
    expect(put.status).toBe(410);
    expect(put.data.error).toContain("我已完成");
    expect((await call("lin", "GET", "/api/admin/certificates")).status).toBe(403);
    expect((await call("admin", "GET", "/api/admin/certificates")).data).toEqual([]);
    expect((await call("admin", "PUT", "/api/admin/certificates/cs50x/someone", { status: "approved" })).status).toBe(410);

    // 取消前管理员确认过的证书
    const lin = await env.DB.prepare("SELECT id FROM users WHERE student_no = '250101001'").first<{ id: string }>();
    const admin = await env.DB.prepare("SELECT id FROM users WHERE student_no = '254030411'").first<{ id: string }>();
    await env.DB.prepare(
      "INSERT INTO certificates (user_id, course_slug, url, status, submitted_at, reviewed_by, reviewed_at) VALUES (?, 'cs50x', 'https://x.example/c', 'approved', 1, ?, 2)",
    )
      .bind(lin?.id, admin?.id)
      .run();
    expect((await call("lin", "GET", "/api/start")).data.cs50x).toMatchObject({ done: true, self: false });
    expect((await call("lin", "DELETE", "/api/start/done/cs50x")).status).toBe(409);
  });

  test("Across the Deep Sea 是站内课，前言能标记完成", async () => {
    const { call, accounts } = setup();
    await accounts();
    const c = await call("lin", "GET", "/api/courses/across-the-deep-sea");
    expect(c.status).toBe(200);
    expect((await call("lin", "PUT", "/api/courses/across-the-deep-sea/items/preface", { done: true })).status).toBe(200);
    expect((await call("lin", "GET", "/api/courses/across-the-deep-sea")).data.done.preface).toBeGreaterThan(0);
  });
});
