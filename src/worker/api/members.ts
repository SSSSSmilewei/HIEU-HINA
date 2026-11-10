import { z } from "zod";
import { getSetting, setSetting } from "../db";
import { HttpError, type Router, json } from "../http";
import { createInvites, listInvites, MAX_INVITES_PER_BATCH, revokeInvite } from "../invites";
import { AccountError, createResetCode, idleMembers, listMembers, setMemberRole, setMemberStatus, updateMember } from "../members";
import { requireSecret } from "../session";
import { DAY_RE, requireAdmin } from "./common";

/* 管理员：成员、邀请码、“最近没动静”名单、站点设置。 */

export function memberRoutes(api: Router) {
  /* ---------- 管理员：成员 ---------- */

  api.get("/api/admin/members", async (c) => {
    requireAdmin(c);
    return json(await listMembers(c.env.DB));
  });

  /** 忘记密码：生成一次性重置码，旧密码和已登录的设备马上失效。重置码只返回这一次。 */
  /** 修改成员信息：校内（姓名、班级、学号）、校外（昵称、用户名、邮箱、学校 / 单位）。只改传了的字段。 */
  api.put("/api/admin/members/:id", async (c) => {
    requireAdmin(c);
    const input = z
      .object({
        name: z.string().max(60).optional(),
        className: z.string().max(60).optional(),
        studentNo: z.string().max(20).optional(),
        username: z.string().max(40).optional(),
        email: z.string().max(200).optional(),
        org: z.string().max(100).optional(),
      })
      .parse(await c.body());
    try {
      await updateMember(c.env.DB, c.params.id, input);
    } catch (err) {
      if (err instanceof AccountError) throw new HttpError(err.status, err.message);
      throw err;
    }
    const m = (await listMembers(c.env.DB)).find((x) => x.id === c.params.id);
    return json(m);
  });

  api.post("/api/admin/members/:id/reset", async (c) => {
    requireAdmin(c);
    const code = await createResetCode(c.env.DB, requireSecret(c.env), c.params.id);
    if (!code) throw new HttpError(404, "找不到这个成员");
    return json({ code });
  });

  api.post("/api/admin/members/:id/status", async (c) => {
    const { userId } = requireAdmin(c);
    const { status } = z.object({ status: z.enum(["active", "archived"]) }).parse(await c.body());
    if (userId === c.params.id && status === "archived") throw new HttpError(400, "不能停用自己的账号");
    await setMemberStatus(c.env.DB, c.params.id, status);
    return json({ ok: true });
  });

  /** 设为管理员（会长、老师）或改回成员。不能把自己改回成员，避免把后台锁死。 */
  api.post("/api/admin/members/:id/role", async (c) => {
    const { userId } = requireAdmin(c);
    const { role } = z.object({ role: z.enum(["member", "admin"]) }).parse(await c.body());
    if (userId === c.params.id && role === "member") throw new HttpError(400, "不能取消自己的管理员身份，请让另一位管理员操作");
    if (!(await setMemberRole(c.env.DB, c.params.id, role))) throw new HttpError(404, "找不到这个成员");
    return json({ ok: true });
  });

  /* ---------- 管理员：邀请码 ---------- */

  api.get("/api/admin/invites", async (c) => {
    requireAdmin(c);
    return json(await listInvites(c.env.DB));
  });

  /** 批量生成邀请码。kind 决定注册出来是校内还是校外账号（默认校内）。days 为空表示不过期。生成的码只在这次返回。 */
  api.post("/api/admin/invites", async (c) => {
    const { userId } = requireAdmin(c);
    const input = z
      .object({
        count: z.number().int().min(1).max(MAX_INVITES_PER_BATCH),
        days: z.number().int().min(1).max(365).nullable().default(null),
        note: z.string().trim().max(40).optional(),
        kind: z.enum(["campus", "external"]).default("campus"),
      })
      .parse(await c.body());
    return json(await createInvites(c.env.DB, requireSecret(c.env), { count: input.count, days: input.days, note: input.note || null, by: userId, kind: input.kind }));
  });

  api.delete("/api/admin/invites/:id", async (c) => {
    requireAdmin(c);
    if (!(await revokeInvite(c.env.DB, c.params.id))) throw new HttpError(400, "这个邀请码已经用过或已经作废了");
    return json({ ok: true });
  });

  api.get("/api/admin/idle", async (c) => {
    requireAdmin(c);
    const days = Math.min(60, Math.max(1, Number(c.url.searchParams.get("days") ?? 7) || 7));
    return json(idleMembers(await listMembers(c.env.DB), days));
  });

  api.get("/api/admin/settings", async (c) => {
    requireAdmin(c);
    const keys = ["semester_start", "app_latest_version", "app_min_version", "app_apk_url", "registration_open"];
    const values = await Promise.all(keys.map((k) => getSetting(c.env.DB, k)));
    return json(Object.fromEntries(keys.map((k, i) => [k, values[i]])));
  });

  api.put("/api/admin/settings", async (c) => {
    requireAdmin(c);
    const body = z
      .object({
        semester_start: z.string().regex(DAY_RE, "开学日期格式是 2026-09-07").optional(),
        app_latest_version: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
        app_min_version: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
        // 空字符串：不单独指定，用本站转发的安装包（/api/app/apk）
        app_apk_url: z.union([z.string().url().max(400), z.literal("")]).optional(),
        // "1" 开放注册（仍然需要邀请码），"0" 关闭注册
        registration_open: z.enum(["0", "1"]).optional(),
      })
      .parse(await c.body());
    for (const [k, v] of Object.entries(body)) if (v !== undefined) await setSetting(c.env.DB, k, v);
    return json({ ok: true });
  });
}
