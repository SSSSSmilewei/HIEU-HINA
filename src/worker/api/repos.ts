import type { Env } from "../env";
import { call, callText, ensureUser, ForgejoError, forgejoEnabled } from "../forgejo";
import { type Ctx, HttpError, json, type Router } from "../http";
import { requireUser } from "./common";

/**
 * 平台内的仓库页（故事 2.2）。数据都从 Forgejo 读，平台不另存。只能看、改自己的仓库：
 * 仓库主人固定是当前账号对应的 Forgejo 用户，请求里不带主人。
 *   GET  /api/git/repos                       我的仓库列表，clone 地址
 *   GET  /api/git/repos/:name                 一个仓库：基本信息 + 完整文件树
 *   GET  /api/git/repos/:name/file?path=      一个文件的内容（文本；二进制和太大的文件只给大小）
 *   GET  /api/git/repos/:name/commits?page=   提交历史，每页 PAGE_SIZE 条
 *   GET  /api/git/repos/:name/commits/:sha    一次提交：说明、改了哪些文件、改动对比（unified diff）
 *   POST /api/git/repos/:name/visibility      { private: boolean } 改成公开或私有
 *   POST /api/git/password                    { password } 设置 Git 密码（本地 clone、push 用）
 */

export const PAGE_SIZE = 30;
/** 文件超过这个大小就不在网页里显示 */
export const MAX_FILE_BYTES = 512 * 1024;
/** 一次提交的改动对比最多返回这么多 */
export const MAX_DIFF_BYTES = 1024 * 1024;
const NAME_RE = /^[A-Za-z0-9_.-]{1,100}$/;
const SHA_RE = /^[0-9a-f]{7,64}$/;
export const MIN_PASSWORD = 8;
export const MAX_PASSWORD = 72;

interface FRepo {
  name: string;
  description: string;
  private: boolean;
  empty: boolean;
  size: number;
  updated_at: string;
  default_branch: string;
}

interface FCommit {
  sha: string;
  created: string;
  commit: { message: string; author: { name: string; email: string; date: string } };
  parents: { sha: string }[];
  stats?: { total: number; additions: number; deletions: number };
  files?: { filename: string; status: string }[];
}

/** 当前账号在 Forgejo 上的用户名；还没有账号（还没交过作业）时是 null */
async function ownerOf(env: Env, userId: string): Promise<string | null> {
  const row = await env.DB.prepare("SELECT username FROM forgejo_users WHERE user_id = ?").bind(userId).first<{ username: string }>();
  return row?.username ?? null;
}

function needForgejo(env: Env) {
  if (!forgejoEnabled(env)) throw new HttpError(503, "仓库服务还没有配置");
}

async function needOwner(c: Ctx): Promise<string> {
  needForgejo(c.env);
  const owner = await ownerOf(c.env, requireUser(c).id);
  if (!owner) throw new HttpError(404, "还没有这个仓库");
  return owner;
}

function repoName(c: Ctx): string {
  const name = c.params.name ?? "";
  if (!NAME_RE.test(name) || name === "." || name === "..") throw new HttpError(400, "仓库名不对");
  return name;
}

/** 仓库里的路径：不以 / 开头，不含 . 和 .. 这一级，不含控制字符 */
export function safePath(p: string): string | null {
  if (!p || p.length > 500 || p.startsWith("/") || /[\x00-\x1f]/.test(p)) return null;
  const parts = p.split("/");
  if (parts.some((s) => !s || s === "." || s === "..")) return null;
  return parts.map(encodeURIComponent).join("/");
}

export function cloneUrl(env: Env, owner: string, repo: string): string {
  return `${(env.FORGEJO_PUBLIC_URL || env.FORGEJO_URL || "").replace(/\/$/, "")}/${owner}/${repo}.git`;
}

/** Forgejo 连不上：回 502，说清楚是仓库服务的问题 */
async function viaForgejo<T>(f: () => Promise<T>): Promise<T> {
  try {
    return await f();
  } catch (e) {
    if (e instanceof HttpError) throw e;
    if (e instanceof ForgejoError) throw new HttpError(502, "仓库服务出错了，请稍后再试");
    throw new HttpError(502, "连不上仓库服务，请稍后再试");
  }
}

async function getRepo(env: Env, owner: string, name: string): Promise<FRepo> {
  const r = await call<FRepo>(env, "GET", `/repos/${owner}/${name}`, undefined, [404]);
  if (r.status === 404 || !r.data) throw new HttpError(404, "还没有这个仓库");
  return r.data;
}

const firstLine = (s: string) => s.split("\n")[0]!.trim();

/** 前 8000 字节里有 0 字节就当二进制 */
export function looksBinary(bytes: Uint8Array): boolean {
  const n = Math.min(bytes.length, 8000);
  for (let i = 0; i < n; i++) if (bytes[i] === 0) return true;
  return false;
}

export function repoRoutes(api: Router) {
  api.get("/api/git/repos", async (c) => {
    const u = requireUser(c);
    if (!forgejoEnabled(c.env)) return json({ enabled: false, owner: null, repos: [] });
    const owner = await ownerOf(c.env, u.id);
    if (!owner) return json({ enabled: true, owner: null, repos: [] });
    const r = await viaForgejo(() => call<FRepo[]>(c.env, "GET", `/users/${owner}/repos?limit=50`));
    const repos = (r.data ?? []).map((x) => ({ name: x.name, description: x.description, private: x.private, empty: x.empty, sizeKb: x.size, updatedAt: Date.parse(x.updated_at), cloneUrl: cloneUrl(c.env, owner, x.name) }));
    repos.sort((a, b) => b.updatedAt - a.updatedAt);
    return json({ enabled: true, owner, repos });
  });

  api.post("/api/git/password", async (c) => {
    const u = requireUser(c);
    needForgejo(c.env);
    const b = await c.body<{ password?: unknown }>();
    const password = typeof b.password === "string" ? b.password : "";
    if (password.length < MIN_PASSWORD || password.length > MAX_PASSWORD) throw new HttpError(400, `Git 密码要 ${MIN_PASSWORD} 到 ${MAX_PASSWORD} 个字符`);
    if (/\s/.test(password)) throw new HttpError(400, "Git 密码里不能有空格");
    const owner = await viaForgejo(() => ensureUser(c.env, { id: u.id, name: u.name, studentNo: u.studentNo, username: u.username, kind: u.kind }));
    await viaForgejo(async () => {
      const r = await call(c.env, "PATCH", `/admin/users/${owner}`, { password, must_change_password: false, login_name: owner, source_id: 0 }, [400, 422]);
      if (r.status !== 200) throw new HttpError(400, "仓库服务不接受这个密码，请换一个更复杂的");
    });
    return json({ ok: true, owner });
  });

  api.get("/api/git/repos/:name", async (c) => {
    const owner = await needOwner(c);
    const name = repoName(c);
    return viaForgejo(async () => {
      const repo = await getRepo(c.env, owner, name);
      let tree: { path: string; type: "file" | "dir"; size: number }[] = [];
      let truncated = false;
      if (!repo.empty) {
        const t = await call<{ tree: { path: string; type: string; size: number }[]; truncated: boolean }>(c.env, "GET", `/repos/${owner}/${name}/git/trees/${encodeURIComponent(repo.default_branch)}?recursive=true&per_page=10000`, undefined, [404]);
        tree = (t.data?.tree ?? []).filter((e) => e.type === "blob" || e.type === "tree").map((e) => ({ path: e.path, type: e.type === "tree" ? "dir" : "file", size: e.size }));
        truncated = !!t.data?.truncated;
      }
      return json({ name: repo.name, description: repo.description, private: repo.private, empty: repo.empty, branch: repo.default_branch, owner, cloneUrl: cloneUrl(c.env, owner, name), tree, truncated });
    });
  });

  api.get("/api/git/repos/:name/file", async (c) => {
    const owner = await needOwner(c);
    const name = repoName(c);
    const path = safePath(c.url.searchParams.get("path") ?? "");
    if (!path) throw new HttpError(400, "文件路径不对");
    return viaForgejo(async () => {
      const r = await call<{ type: string; size: number; content?: string; encoding?: string } | unknown[]>(c.env, "GET", `/repos/${owner}/${name}/contents/${path}`, undefined, [404]);
      if (r.status === 404 || !r.data || Array.isArray(r.data) || r.data.type !== "file") throw new HttpError(404, "没有这个文件");
      const f = r.data;
      if (f.size > MAX_FILE_BYTES || f.content === undefined) return json({ size: f.size, tooLarge: true });
      const bytes = Uint8Array.from(atob(f.content.replace(/\n/g, "")), (ch) => ch.charCodeAt(0));
      if (looksBinary(bytes)) return json({ size: f.size, binary: true });
      return json({ size: f.size, content: new TextDecoder().decode(bytes) });
    });
  });

  api.get("/api/git/repos/:name/commits", async (c) => {
    const owner = await needOwner(c);
    const name = repoName(c);
    const page = Math.max(1, Math.min(1000, Number(c.url.searchParams.get("page")) || 1));
    return viaForgejo(async () => {
      const repo = await getRepo(c.env, owner, name);
      if (repo.empty) return json({ commits: [], total: 0, hasMore: false });
      const r = await call<FCommit[]>(c.env, "GET", `/repos/${owner}/${name}/commits?sha=${encodeURIComponent(repo.default_branch)}&page=${page}&limit=${PAGE_SIZE}&stat=true&files=false&verification=false`, undefined, [404, 409]);
      const commits = (r.status === 200 ? (r.data ?? []) : []).map((x) => ({
        sha: x.sha,
        title: firstLine(x.commit.message),
        author: x.commit.author.name,
        at: Date.parse(x.commit.author.date || x.created),
        additions: x.stats?.additions ?? 0,
        deletions: x.stats?.deletions ?? 0,
      }));
      const total = Number(r.headers.get("x-total-count") ?? r.headers.get("x-total") ?? commits.length);
      return json({ commits, total, hasMore: r.headers.get("x-hasmore") === "true" || page * PAGE_SIZE < total });
    });
  });

  api.get("/api/git/repos/:name/commits/:sha", async (c) => {
    const owner = await needOwner(c);
    const name = repoName(c);
    const sha = c.params.sha ?? "";
    if (!SHA_RE.test(sha)) throw new HttpError(400, "提交编号不对");
    return viaForgejo(async () => {
      const r = await call<FCommit>(c.env, "GET", `/repos/${owner}/${name}/git/commits/${sha}?stat=true&files=true&verification=false`, undefined, [404, 422]);
      if (r.status !== 200 || !r.data) throw new HttpError(404, "没有这次提交");
      const x = r.data;
      const d = await callText(c.env, `/repos/${owner}/${name}/git/commits/${x.sha}.diff`, MAX_DIFF_BYTES);
      return json({
        sha: x.sha,
        message: x.commit.message.trim(),
        author: x.commit.author.name,
        at: Date.parse(x.commit.author.date || x.created),
        parents: x.parents.map((p) => p.sha),
        additions: x.stats?.additions ?? 0,
        deletions: x.stats?.deletions ?? 0,
        files: (x.files ?? []).map((f) => ({ path: f.filename, status: f.status })),
        diff: d.text,
        diffTruncated: d.truncated,
      });
    });
  });

  api.post("/api/git/repos/:name/visibility", async (c) => {
    const owner = await needOwner(c);
    const name = repoName(c);
    const b = await c.body<{ private?: unknown }>();
    if (typeof b.private !== "boolean") throw new HttpError(400, "要说明改成公开还是私有");
    return viaForgejo(async () => {
      await getRepo(c.env, owner, name);
      const r = await call<FRepo>(c.env, "PATCH", `/repos/${owner}/${name}`, { private: b.private });
      return json({ private: r.data?.private ?? b.private });
    });
  });
}
