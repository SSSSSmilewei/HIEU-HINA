import type { Env } from "../env";
import { HttpError, json, type Router } from "../http";
import { requireUser } from "./common";

/**
 * 个人令牌（故事 2.3）：给 VSCode 插件用，在「我的仓库」页签发和撤销。
 *   GET    /api/tokens        我的令牌（不含已撤销的；令牌本身只在签发时返回一次）
 *   POST   /api/tokens        { name } 签发一个新令牌
 *   DELETE /api/tokens/:id    撤销
 *
 * 用令牌请求时（Authorization: Bearer hnp_…）只能用 TOKEN_SCOPES 里的接口，其余接口一律当作没登录：
 * 令牌泄露了也改不了密码、签不了到、签发不了新令牌。
 */

export const TOKEN_PREFIX = "hnp_";
export const MAX_TOKENS = 10;
/** 「最近使用」最多每小时记一次，免得每个请求都写数据库 */
const TOUCH_MS = 60 * 60 * 1000;

/** 令牌能用的接口：方法 + 路径前缀 */
const TOKEN_SCOPES: [string, RegExp][] = [
  ["GET", /^\/api\/auth\/me$/],
  ["POST", /^\/api\/oj\/(run|submit|exec)$/],
  ["GET", /^\/api\/oj\/(submissions|solved)(\/|$)/],
  ["GET", /^\/api\/git\/repos(\/|$)/],
  ["POST", /^\/api\/git\/credential$/],
];

export function tokenAllowed(method: string, path: string): boolean {
  return TOKEN_SCOPES.some(([m, re]) => m === method && re.test(path));
}

export function isPersonalToken(token: string | null): token is string {
  return !!token && token.startsWith(TOKEN_PREFIX);
}

export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return TOKEN_PREFIX + [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** 令牌对应的账号 id 和签发时的 session_version；令牌不存在或已撤销时是 null */
export async function tokenOwner(env: Env, token: string, now = Date.now()): Promise<{ uid: string; sv: number } | null> {
  const row = await env.DB.prepare("SELECT id, user_id, sv, last_used_at FROM api_tokens WHERE hash = ? AND revoked_at IS NULL")
    .bind(await hashToken(token))
    .first<{ id: string; user_id: string; sv: number; last_used_at: number | null }>();
  if (!row) return null;
  if (!row.last_used_at || now - row.last_used_at > TOUCH_MS) await env.DB.prepare("UPDATE api_tokens SET last_used_at = ? WHERE id = ?").bind(now, row.id).run();
  return { uid: row.user_id, sv: row.sv };
}

/** 签发一个令牌（网页上手动签发、插件一键登录都走这里）。超过 MAX_TOKENS 个时报 400 */
export async function issueToken(env: Env, userId: string, sv: number, name: string): Promise<{ id: string; name: string; token: string }> {
  const n = await env.DB.prepare("SELECT COUNT(*) AS n FROM api_tokens WHERE user_id = ? AND revoked_at IS NULL AND sv = ?").bind(userId, sv).first<{ n: number }>();
  if ((n?.n ?? 0) >= MAX_TOKENS) throw new HttpError(400, `最多同时有 ${MAX_TOKENS} 个令牌，请先在「我的仓库」页撤销不用的`);
  const token = newToken();
  const id = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO api_tokens (id, user_id, name, hash, hint, sv, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(id, userId, name, await hashToken(token), token.slice(-4), sv, Date.now())
    .run();
  return { id, name, token };
}

export function tokenRoutes(api: Router) {
  api.get("/api/tokens", async (c) => {
    const u = requireUser(c);
    // 改过密码以后，以前签发的令牌已经失效，不再列出
    const rows = await c.env.DB.prepare("SELECT id, name, hint, created_at, last_used_at FROM api_tokens WHERE user_id = ? AND revoked_at IS NULL AND sv = ? ORDER BY created_at DESC")
      .bind(u.id, u.sessionVersion)
      .all<{ id: string; name: string; hint: string; created_at: number; last_used_at: number | null }>();
    return json({ tokens: rows.results.map((r) => ({ id: r.id, name: r.name, hint: r.hint, createdAt: r.created_at, lastUsedAt: r.last_used_at })) });
  });

  api.post("/api/tokens", async (c) => {
    const u = requireUser(c);
    const b = await c.body<{ name?: unknown }>();
    const name = typeof b.name === "string" ? b.name.trim() : "";
    if (!name || name.length > 40) throw new HttpError(400, "给令牌起个名字，最多 40 个字，例如「宿舍的笔记本」");
    return json(await issueToken(c.env, u.id, u.sessionVersion, name));
  });

  api.delete("/api/tokens/:id", async (c) => {
    const u = requireUser(c);
    const r = await c.env.DB.prepare("UPDATE api_tokens SET revoked_at = ? WHERE id = ? AND user_id = ? AND revoked_at IS NULL").bind(Date.now(), c.params.id!, u.id).run();
    if (!r.meta.changes) throw new HttpError(404, "没有这个令牌");
    return json({ ok: true });
  });
}
