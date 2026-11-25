import { z } from "zod";
import { recordActivityOnce } from "../activity";
import { getCourse } from "../catalog";
import { HttpError, type Router, json } from "../http";
import { memberId } from "./common";

/**
 * 闯关：每人每门课一个「仓库」（只存本人写的文件），以及过关记录。
 * 关卡、起始代码、官方测试是静态文件（/levels/<课>/），判题在浏览器里（Pyodide），
 * 所以这里只负责保存代码和记录「第一次通过」，和练手题的做法一样。
 * 游客不调用这些接口，代码存在浏览器本地。
 */

export const REPO_LIMITS = { files: 60, fileBytes: 200_000 };
const PATH_RE = /^[a-z0-9_][a-z0-9_.-]{0,40}(\/[a-z0-9_][a-z0-9_.-]{0,40}){0,4}$/i;
const LEVEL_RE = /^[a-z0-9][a-z0-9-]{0,31}\/[a-z0-9][a-z0-9-]{0,31}$/;

const FileBody = z.object({ path: z.string(), content: z.string() });

/** 关卡目录是静态文件（/levels/<课>/index.json），通过 ASSETS 读，确认这一关真的存在 */
async function levelExists(env: { ASSETS: Fetcher }, base: URL, slug: string, chapter: string, level: string): Promise<boolean> {
  try {
    const res = await env.ASSETS.fetch(new Request(new URL(`/levels/${slug}/index.json`, base)));
    if (!res.ok) return false;
    const index = (await res.json()) as { chapters?: { id: string; levels?: { id: string }[] }[] };
    return !!index.chapters?.some((c) => c.id === chapter && c.levels?.some((l) => l.id === level));
  } catch {
    return false;
  }
}

async function needCourse(db: D1Database, slug: string) {
  const course = await getCourse(db, slug);
  if (!course) throw new HttpError(404, "没有这门课");
  return course;
}

export function levelRoutes(api: Router) {
  /** 我在这门课的仓库：全部文件 */
  api.get("/api/repos/:slug", async (c) => {
    const uid = memberId(c);
    await needCourse(c.env.DB, c.params.slug);
    const rows = await c.env.DB.prepare("SELECT path, content, updated_at FROM repo_files WHERE user_id = ? AND course_slug = ? ORDER BY path")
      .bind(uid, c.params.slug)
      .all<{ path: string; content: string; updated_at: number }>();
    return json({ files: rows.results.map((r) => ({ path: r.path, content: r.content, updatedAt: r.updated_at })) });
  });

  /** 保存一个文件（新建或覆盖） */
  api.put("/api/repos/:slug/files", async (c) => {
    const uid = memberId(c);
    const slug = c.params.slug;
    await needCourse(c.env.DB, slug);
    const body = FileBody.safeParse(await c.body());
    if (!body.success) throw new HttpError(400, "请求格式不对");
    const { path, content } = body.data;
    if (!PATH_RE.test(path) || path.split("/").some((p) => p === "." || p === "..")) throw new HttpError(400, "文件路径不对");
    if (new TextEncoder().encode(content).length > REPO_LIMITS.fileBytes) throw new HttpError(413, "文件太大（上限 200KB）");
    const exists = await c.env.DB.prepare("SELECT 1 AS x FROM repo_files WHERE user_id = ? AND course_slug = ? AND path = ?").bind(uid, slug, path).first();
    if (!exists) {
      const n = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM repo_files WHERE user_id = ? AND course_slug = ?").bind(uid, slug).first<{ n: number }>();
      if ((n?.n ?? 0) >= REPO_LIMITS.files) throw new HttpError(409, `一门课的仓库最多 ${REPO_LIMITS.files} 个文件`);
    }
    const now = Date.now();
    await c.env.DB.prepare(
      "INSERT INTO repo_files (user_id, course_slug, path, content, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT (user_id, course_slug, path) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at",
    )
      .bind(uid, slug, path, content, now)
      .run();
    return json({ ok: true, updatedAt: now });
  });

  /** 删除一个文件（「恢复初始代码」时用：删掉以后重新从起始代码开始） */
  api.delete("/api/repos/:slug/files", async (c) => {
    const uid = memberId(c);
    const path = c.url.searchParams.get("path") ?? "";
    if (!PATH_RE.test(path)) throw new HttpError(400, "文件路径不对");
    await c.env.DB.prepare("DELETE FROM repo_files WHERE user_id = ? AND course_slug = ? AND path = ?").bind(uid, c.params.slug, path).run();
    return json({ ok: true });
  });

  /** 我在这门课通过了哪些关 */
  api.get("/api/levels/:slug", async (c) => {
    const uid = memberId(c);
    const rows = await c.env.DB.prepare("SELECT level_id, passed_at FROM level_passes WHERE user_id = ? AND course_slug = ?")
      .bind(uid, c.params.slug)
      .all<{ level_id: string; passed_at: number }>();
    return json({ passed: Object.fromEntries(rows.results.map((r) => [r.level_id, r.passed_at])) });
  });

  /** 通过一关：只在第一次通过时记录，同一关一天只记一次学习记录 */
  api.put("/api/levels/:slug/:chapter/:level", async (c) => {
    const uid = memberId(c);
    const slug = c.params.slug;
    await needCourse(c.env.DB, slug);
    const id = `${c.params.chapter}/${c.params.level}`;
    if (!LEVEL_RE.test(id)) throw new HttpError(400, "关卡 id 不对");
    if (!(await levelExists(c.env, c.url, slug, c.params.chapter, c.params.level))) throw new HttpError(404, "没有这一关");
    const now = Date.now();
    const r = await c.env.DB.prepare("INSERT OR IGNORE INTO level_passes (user_id, course_slug, level_id, passed_at) VALUES (?, ?, ?, ?)")
      .bind(uid, slug, id, now)
      .run();
    const first = (r.meta.changes ?? 0) > 0;
    if (first) await recordActivityOnce(c.env.DB, uid, "level", `${slug}/${id}`, now);
    return json({ ok: true, first });
  });
}
