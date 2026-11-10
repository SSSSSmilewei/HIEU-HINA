import { nextItem, progress } from "../../shared/courses";
import { getCourse } from "../catalog";
import { HttpError, type Router, json } from "../http";
import { memberId, requireAdmin } from "./common";

/**
 * 新生任务（网页 /start、首页卡片）。三项：
 *  1. 阅读前言：CSDIY 前言 +《我的一些小想法》，在讲义页标记完成
 *  2. CS50x：成员学完后自己点「我已完成」
 *  3. Across the Deep Sea：协会自己编写的课程，筹备中，没有“完成”状态
 *
 * CS50x 原来要交证书链接、管理员确认（2026-11 取消）。「我已完成」仍记在 certificates 表里：
 * status = 'approved'、reviewed_by = 本人，这样旧版 App 读 certificates 也认作完成。
 * 管理员以前确认过的证书照样算完成。证书相关的旧接口保留路径，只回一句提示（旧版 App 还会调用）。
 */
export const DEEP_SEA = "across-the-deep-sea";
export const PREFACES = [
  { course: "csdiy", item: "preface" },
  { course: DEEP_SEA, item: "preface" },
] as const;
const CS50X = "cs50x";

/** 旧版 App 提交证书、管理员确认证书时的回复 */
export const CERT_REMOVED = "课程证书的提交和确认已取消。学完 CS50x 后，请在新生任务页点击「我已完成」";

interface CertRow {
  user_id: string;
  course_slug: string;
  url: string;
  status: "pending" | "approved" | "rejected";
  note: string | null;
  submitted_at: number;
  reviewed_by: string | null;
  reviewed_at: number | null;
}

const certOut = (r: CertRow) => ({ course: r.course_slug, url: r.url, status: r.status, note: r.note, submittedAt: r.submitted_at, reviewedAt: r.reviewed_at });

export function startRoutes(api: Router) {
  /** 我的三项任务进行到哪了。certificates 是给旧版 App 的。 */
  api.get("/api/start", async (c) => {
    const uid = memberId(c);
    const db = c.env.DB;
    const slugs = [...new Set([...PREFACES.map((p) => p.course), CS50X])];
    const [units, certs, cs50] = await Promise.all([
      db
        .prepare(`SELECT course_slug, unit_id FROM unit_progress WHERE user_id = ? AND course_slug IN (${slugs.map(() => "?").join(",")})`)
        .bind(uid, ...slugs)
        .all<{ course_slug: string; unit_id: string }>(),
      db.prepare("SELECT * FROM certificates WHERE user_id = ?").bind(uid).all<CertRow>(),
      getCourse(db, CS50X),
    ]);
    const done = new Set(units.results.map((u) => `${u.course_slug}/${u.unit_id}`));
    const cs50Done = new Set(units.results.filter((u) => u.course_slug === CS50X).map((u) => u.unit_id));
    const cert = certs.results.find((r) => r.course_slug === CS50X);
    const next = cs50 ? nextItem(cs50, cs50Done) : null;
    return json({
      prefaces: PREFACES.map((p) => done.has(`${p.course}/${p.item}`)),
      cs50x: {
        done: cert?.status === "approved",
        /** 是不是本人点的「我已完成」（只有这种能撤销） */
        self: cert?.status === "approved" && cert.reviewed_by === uid,
        progress: cs50 ? progress(cs50, cs50Done) : { doneItems: 0, items: 0, donePeriods: 0, totalPeriods: 0, ratio: 0 },
        next: next ? { id: next.id, title: next.title, pages: next.pages.map((pg) => ({ id: pg.id })) } : null,
      },
      certificates: certs.results.map(certOut),
    });
  });

  /** CS50x「我已完成」 */
  api.put("/api/start/done/cs50x", async (c) => {
    const uid = memberId(c);
    const now = Date.now();
    await c.env.DB.prepare(
      `INSERT INTO certificates (user_id, course_slug, url, status, note, submitted_at, reviewed_by, reviewed_at) VALUES (?, ?, '', 'approved', '本人确认完成', ?, ?, ?)
       ON CONFLICT(user_id, course_slug) DO UPDATE SET url = '', status = 'approved', note = '本人确认完成', submitted_at = excluded.submitted_at, reviewed_by = excluded.reviewed_by, reviewed_at = excluded.reviewed_at`,
    )
      .bind(uid, CS50X, now, uid, now)
      .run();
    return json({ ok: true });
  });

  /** 撤销「我已完成」（点错了的时候）。管理员以前确认过的证书不能撤销。 */
  api.delete("/api/start/done/cs50x", async (c) => {
    const uid = memberId(c);
    const res = await c.env.DB.prepare("DELETE FROM certificates WHERE user_id = ? AND course_slug = ? AND reviewed_by = ?").bind(uid, CS50X, uid).run();
    if (!res.meta.changes) throw new HttpError(409, "没有可以撤销的完成记录");
    return json({ ok: true });
  });

  /* ---------- 已取消的证书接口：旧版 App 还会调用 ---------- */

  api.put("/api/start/certificates/:course", (c) => {
    memberId(c);
    throw new HttpError(410, CERT_REMOVED);
  });

  api.get("/api/admin/certificates", (c) => {
    requireAdmin(c);
    return json([]);
  });

  api.put("/api/admin/certificates/:course/:user", (c) => {
    requireAdmin(c);
    throw new HttpError(410, CERT_REMOVED);
  });
}
