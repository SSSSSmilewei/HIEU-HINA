import { type Router, HttpError, json } from "../http";
import { requireAdmin } from "./common";

/**
 * 视频源（故事 3.6）。课程包里自带的视频源在静态文件里；这里是管理员后来加的。
 *   GET    /api/videos?course=&item=   某一讲额外的视频源（游客也能看）
 *   POST   /api/admin/videos           添加 { course, item, label, url }
 *   DELETE /api/admin/videos/:id       删除
 */

const MAX_PER_ITEM = 10;
const slug = /^[a-z0-9][a-z0-9-]{0,79}$/;

export function videoRoutes(api: Router) {
  api.get("/api/videos", async (c) => {
    const course = c.url.searchParams.get("course") ?? "";
    const item = c.url.searchParams.get("item") ?? "";
    if (!slug.test(course) || !slug.test(item)) throw new HttpError(400, "课程或条目编号不对");
    const rows = await c.env.DB.prepare("SELECT id, label, url FROM video_sources WHERE course = ? AND item = ? ORDER BY created_at").bind(course, item).all<{ id: string; label: string; url: string }>();
    return json({ videos: rows.results });
  });

  api.post("/api/admin/videos", async (c) => {
    const { userId } = requireAdmin(c);
    const b = await c.body<{ course?: string; item?: string; label?: string; url?: string }>();
    if (!b.course || !slug.test(b.course) || !b.item || !slug.test(b.item)) throw new HttpError(400, "课程或条目编号不对");
    const label = (b.label ?? "").trim();
    if (!label || label.length > 80) throw new HttpError(400, "名称要写，最多 80 个字");
    let url: URL;
    try {
      url = new URL((b.url ?? "").trim());
    } catch {
      throw new HttpError(400, "视频地址不对");
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new HttpError(400, "视频地址要以 http 或 https 开头");
    const n = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM video_sources WHERE course = ? AND item = ?").bind(b.course, b.item).first<{ n: number }>();
    if ((n?.n ?? 0) >= MAX_PER_ITEM) throw new HttpError(400, `一讲最多加 ${MAX_PER_ITEM} 个视频源`);
    const id = crypto.randomUUID();
    await c.env.DB.prepare("INSERT INTO video_sources (id, course, item, label, url, added_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(id, b.course, b.item, label, url.href, userId, Date.now()).run();
    return json({ id });
  });

  api.delete("/api/admin/videos/:id", async (c) => {
    requireAdmin(c);
    await c.env.DB.prepare("DELETE FROM video_sources WHERE id = ?").bind(c.params.id!).run();
    return json({ ok: true });
  });
}
