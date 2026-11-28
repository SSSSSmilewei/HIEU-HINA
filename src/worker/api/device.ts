import { z } from "zod";
import { HttpError, json, type Router } from "../http";
import { requireUser } from "./common";
import { limit } from "./oj";
import { hashToken, issueToken } from "./tokens";

/**
 * VSCode 插件一键登录（2026-11-28），做法同 GitHub CLI 的设备登录：
 *   1. 插件 POST /api/device/start，拿到 deviceCode（只有插件知道）和 userCode（给人看的确认码），打开浏览器到 /link?code=<userCode>
 *   2. 学员在网页上（要已登录，用 Cookie）看到「VSCode 插件请求登录」和确认码，点「允许」：POST /api/device/approve
 *      平台签发一个个人令牌，暂存在这一行里
 *   3. 插件每隔几秒 POST /api/device/poll { deviceCode }，拿到令牌后这一行的令牌就清掉
 * 10 分钟内没确认就过期。个人令牌不能调 approve（不在令牌的接口范围里），所以插件不能自己批准自己。
 */

export const DEVICE_TTL_MS = 10 * 60_000;
export const POLL_INTERVAL_S = 3;
const STARTS_PER_MINUTE = 10;
/** 确认码字母表：去掉了容易看错的 0 O 1 I L */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function userCode(): string {
  const b = crypto.getRandomValues(new Uint8Array(8));
  const s = [...b].map((x) => ALPHABET[x % ALPHABET.length]).join("");
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}

function deviceCode(): string {
  return [...crypto.getRandomValues(new Uint8Array(32))].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const normCode = (s: string) => s.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^(.{4})(.{4})$/, "$1-$2");

interface Row {
  device_hash: string;
  user_code: string;
  client: string;
  status: "pending" | "approved" | "denied" | "used";
  user_id: string | null;
  token: string | null;
  created_at: number;
  expires_at: number;
}

export function deviceRoutes(api: Router) {
  api.post("/api/device/start", async (c) => {
    const { client } = z.object({ client: z.string().max(80).default("VSCode 插件") }).parse(await c.body());
    const now = Date.now();
    await limit(c.env.DB, `device:${c.req.headers.get("cf-connecting-ip") ?? "local"}`, STARTS_PER_MINUTE, now);
    await c.env.DB.prepare("DELETE FROM device_logins WHERE expires_at < ?").bind(now - DEVICE_TTL_MS).run();
    const device = deviceCode();
    const name = client.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 40) || "VSCode 插件";
    for (let i = 0; ; i++) {
      const code = userCode();
      try {
        await c.env.DB.prepare("INSERT INTO device_logins (device_hash, user_code, client, created_at, expires_at) VALUES (?, ?, ?, ?, ?)")
          .bind(await hashToken(device), code, name, now, now + DEVICE_TTL_MS)
          .run();
        return json({ deviceCode: device, userCode: code, url: `/link?code=${code}`, interval: POLL_INTERVAL_S, expiresIn: DEVICE_TTL_MS / 1000 });
      } catch (err) {
        if (i >= 3 || !String(err).includes("UNIQUE")) throw err;
      }
    }
  });

  /** 确认页要显示的内容：哪个客户端、还剩多久 */
  api.get("/api/device/:code", async (c) => {
    requireUser(c);
    const row = await c.env.DB.prepare("SELECT * FROM device_logins WHERE user_code = ?").bind(normCode(c.params.code ?? "")).first<Row>();
    if (!row || row.expires_at < Date.now()) throw new HttpError(404, "确认码不对或者已经过期了，请在 VSCode 里重新点「登录」");
    return json({ client: row.client, userCode: row.user_code, status: row.status === "used" ? "approved" : row.status, expiresAt: row.expires_at });
  });

  api.post("/api/device/approve", async (c) => {
    const u = requireUser(c);
    const { code, allow } = z.object({ code: z.string().max(20), allow: z.boolean() }).parse(await c.body());
    const now = Date.now();
    const row = await c.env.DB.prepare("SELECT * FROM device_logins WHERE user_code = ?").bind(normCode(code)).first<Row>();
    if (!row || row.expires_at < now) throw new HttpError(404, "确认码不对或者已经过期了，请在 VSCode 里重新点「登录」");
    if (row.status !== "pending") throw new HttpError(409, "这个登录请求已经处理过了");
    if (!allow) {
      await c.env.DB.prepare("UPDATE device_logins SET status = 'denied' WHERE device_hash = ? AND status = 'pending'").bind(row.device_hash).run();
      return json({ ok: true, status: "denied" });
    }
    const t = await issueToken(c.env, u.id, u.sessionVersion, row.client);
    const r = await c.env.DB.prepare("UPDATE device_logins SET status = 'approved', user_id = ?, token = ? WHERE device_hash = ? AND status = 'pending'").bind(u.id, t.token, row.device_hash).run();
    if (!r.meta.changes) {
      await c.env.DB.prepare("UPDATE api_tokens SET revoked_at = ? WHERE id = ?").bind(now, t.id).run();
      throw new HttpError(409, "这个登录请求已经处理过了");
    }
    return json({ ok: true, status: "approved" });
  });

  api.post("/api/device/poll", async (c) => {
    const { deviceCode: dc } = z.object({ deviceCode: z.string().length(64) }).parse(await c.body());
    const hash = await hashToken(dc);
    const row = await c.env.DB.prepare("SELECT * FROM device_logins WHERE device_hash = ?").bind(hash).first<Row>();
    if (!row || row.status === "used") return json({ status: "expired" });
    if (row.status === "denied") return json({ status: "denied" });
    if (row.status === "pending") return json({ status: row.expires_at < Date.now() ? "expired" : "pending" });
    // 已批准：令牌只交出去一次
    const r = await c.env.DB.prepare("UPDATE device_logins SET status = 'used', token = NULL WHERE device_hash = ? AND status = 'approved'").bind(hash).run();
    if (!r.meta.changes || !row.token) return json({ status: "expired" });
    return json({ status: "ok", token: row.token });
  });
}
