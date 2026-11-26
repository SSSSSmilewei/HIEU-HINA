import { describe, expect, test } from "bun:test";
import { memoryD1 } from "../scripts/local-d1";
import { videoEmbed } from "../src/shared/video";
import type { Env } from "../src/worker/env";
import worker from "../src/worker/index";

/** 视频换源（故事 3.6） */
describe("视频地址转换", () => {
  test("B 站：BV 号和分 P", () => {
    expect(videoEmbed("https://www.bilibili.com/video/BV1sy411z7nA/?p=3")).toEqual({ provider: "bilibili", embed: "https://player.bilibili.com/player.html?bvid=BV1sy411z7nA&p=3&autoplay=0&high_quality=1&danmaku=0" });
    expect(videoEmbed("https://m.bilibili.com/video/BV1sy411z7nA").embed).toContain("p=1");
  });

  test("YouTube：watch、youtu.be、带起始时间", () => {
    expect(videoEmbed("https://www.youtube.com/watch?v=gNv81_4X0uU&list=PL6BsET-8jg").embed).toBe("https://www.youtube-nocookie.com/embed/gNv81_4X0uU");
    expect(videoEmbed("https://youtu.be/gNv81_4X0uU?t=90").embed).toBe("https://www.youtube-nocookie.com/embed/gNv81_4X0uU?start=90");
  });

  test("认不出的网站只给链接", () => {
    expect(videoEmbed("https://example.com/v.mp4")).toEqual({ provider: "other", embed: null });
    expect(videoEmbed("不是地址").embed).toBeNull();
  });
});

describe("管理员添加视频源", () => {
  test("管理员能加能删，游客能看，普通账号不能加", async () => {
    const env = { DB: memoryD1(), ASSETS: { fetch: async () => new Response("x") }, SESSION_SECRET: "test-session-secret-0123456789abcdef", FIRST_ADMIN_CODE: "first-admin-secret" } as unknown as Env;
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
    await call("admin", "POST", "/api/auth/register", { studentNo: "254030411", name: "会长", className: "计科2501", password: "pass-2026-x", confirm: "pass-2026-x", invite: "first-admin-secret" });
    const add = { course: "cs61a", item: "lec01", label: "YouTube：官方", url: "https://youtu.be/gNv81_4X0uU" };
    expect((await call("guest", "POST", "/api/admin/videos", add)).status).toBe(401);
    expect((await call("admin", "POST", "/api/admin/videos", { ...add, url: "javascript:alert(1)" })).status).toBe(400);
    const r = await call("admin", "POST", "/api/admin/videos", add);
    expect(r.status).toBe(200);
    const list = await call("guest", "GET", "/api/videos?course=cs61a&item=lec01");
    expect(list.data.videos).toEqual([{ id: r.data.id, label: add.label, url: "https://youtu.be/gNv81_4X0uU" }]);
    await call("admin", "DELETE", `/api/admin/videos/${r.data.id}`);
    expect((await call("guest", "GET", "/api/videos?course=cs61a&item=lec01")).data.videos).toEqual([]);
  });
});
