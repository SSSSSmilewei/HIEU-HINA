import type { Env } from "./env";
import { VERDICT_TEXT, type Verdict } from "../shared/judge";

/**
 * 学员仓库（故事 2.1）：每个学员在 Forgejo 上有一个同名账号，每门课一个仓库，刷题一个仓库。
 * 平台用管理员令牌（FORGEJO_URL、FORGEJO_TOKEN）替学员建账号、建仓库、提交文件。
 *
 * - 课程作业：每次「提交」都提交一次。某份作业第一次提交前，先把官方起始代码作为一次提交放进去。
 * - 刷题：通过的题写进 oj-practice 仓库，按题目编号分目录。
 * Forgejo 连不上时判题照常，要提交的内容进 forgejo_queue，定时任务重试。
 */

export const PRACTICE_REPO = "oj-practice";
const TIMEOUT_MS = 8_000;
/** 重试：第 n 次失败后等 2^n 分钟，最多试这么多次 */
const MAX_ATTEMPTS = 8;
const MINUTE_MS = 60_000;
const QUEUE_BATCH = 20;

export function forgejoEnabled(env: Env): boolean {
  return !!(env.FORGEJO_URL && env.FORGEJO_TOKEN);
}

export class ForgejoError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function call<T>(env: Env, method: string, path: string, body?: unknown, okStatus: number[] = []): Promise<{ status: number; data: T | null }> {
  const res = await fetch(`${env.FORGEJO_URL!.replace(/\/$/, "")}/api/v1${path}`, {
    method,
    headers: { authorization: `token ${env.FORGEJO_TOKEN}`, "content-type": "application/json", accept: "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok && !okStatus.includes(res.status)) throw new ForgejoError(res.status, `Forgejo ${method} ${path} → ${res.status}：${(await res.text()).slice(0, 200)}`);
  const text = await res.text();
  return { status: res.status, data: text ? (JSON.parse(text) as T) : null };
}

interface Who {
  id: string;
  name: string;
  studentNo: string;
  username: string | null;
  kind: "campus" | "external";
}

/** 平台账号对应的 Forgejo 用户名：校内 s+学号，校外 x-+用户名 */
export function forgejoName(u: Who): string {
  if (u.kind === "campus") return `s${u.studentNo}`.toLowerCase();
  return `x-${(u.username ?? u.id).toLowerCase().replace(/[^a-z0-9_.-]/g, "-")}`.slice(0, 39);
}

const emailOf = (name: string) => `${name}@users.hiana.local`;

function randomPassword(): string {
  const b = crypto.getRandomValues(new Uint8Array(24));
  return `Hn-${[...b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

/** 建学员的 Forgejo 账号（已经有了就跳过）。学员不用知道这个密码：网页里看仓库走平台，本地用平台签发的令牌。 */
export async function ensureUser(env: Env, u: Who): Promise<string> {
  const name = forgejoName(u);
  const row = await env.DB.prepare("SELECT username FROM forgejo_users WHERE user_id = ?").bind(u.id).first<{ username: string }>();
  if (row) return row.username;
  await call(env, "POST", "/admin/users", { username: name, full_name: u.name, email: emailOf(name), password: randomPassword(), must_change_password: false, visibility: "private" }, [422]);
  await env.DB.prepare("INSERT OR IGNORE INTO forgejo_users (user_id, username, created_at) VALUES (?, ?, ?)").bind(u.id, name, Date.now()).run();
  return name;
}

export async function ensureRepo(env: Env, owner: string, repo: string, description: string): Promise<void> {
  const r = await call(env, "GET", `/repos/${owner}/${repo}`, undefined, [404]);
  if (r.status === 200) return;
  await call(env, "POST", `/admin/users/${owner}/repos`, { name: repo, description, private: true, default_branch: "main" }, [409]);
}

const b64 = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
};

/** 一次提交多个文件：已有的更新（要带上它现在的 sha），没有的新建；内容没变的跳过。全都没变就不提交。 */
export async function commitFiles(env: Env, owner: string, repo: string, files: Record<string, string>, message: string, author: { name: string; email: string }): Promise<boolean> {
  const ops: { operation: "create" | "update"; path: string; content: string; sha?: string }[] = [];
  for (const [path, content] of Object.entries(files)) {
    const cur = await call<{ sha: string; content?: string; encoding?: string }>(env, "GET", `/repos/${owner}/${repo}/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=main`, undefined, [404]);
    if (cur.status === 404 || !cur.data) ops.push({ operation: "create", path, content: b64(content) });
    else if (cur.data.content?.replace(/\n/g, "") !== b64(content)) ops.push({ operation: "update", path, content: b64(content), sha: cur.data.sha });
  }
  if (!ops.length) return false;
  await call(env, "POST", `/repos/${owner}/${repo}/contents`, { branch: "main", message, author, committer: author, files: ops });
  return true;
}

/** 作业包的公开版本（静态文件），用来取仓库目录、起始代码和题目名 */
interface AssignmentLite {
  id: string;
  title: string;
  repoDir: string;
  files: { path: string; content: string; omitted?: boolean }[];
  problems: { id: string; title: string; editable: string[] }[];
}

async function loadAssignment(env: Env, course: string, id: string): Promise<AssignmentLite | null> {
  const res = await env.ASSETS.fetch(new Request(`https://assets.local/oj/assignments/${course}/${id}.json`));
  if (!res.ok || !(res.headers.get("content-type") ?? "").includes("json")) return null;
  return (await res.json()) as AssignmentLite;
}

async function loadProblemTitle(env: Env, id: string): Promise<string> {
  const res = await env.ASSETS.fetch(new Request(`https://assets.local/oj/problems/${id}.json`));
  if (!res.ok) return id;
  return ((await res.json()) as { title?: string }).title ?? id;
}

export interface SubmissionSync {
  user: Who;
  problem: string;
  files: Record<string, string>;
  verdict: Verdict;
  passed: number;
  total: number;
}

/** 把一次提交写进学员仓库 */
export async function syncSubmission(env: Env, s: SubmissionSync): Promise<void> {
  const owner = await ensureUser(env, s.user);
  const author = { name: s.user.name, email: emailOf(owner) };
  const parts = s.problem.split("/");
  const result = `${VERDICT_TEXT[s.verdict]}${s.total ? `（${s.passed}/${s.total}）` : ""}`;
  if (parts.length === 3) {
    const [course, aid, pid] = parts as [string, string, string];
    const a = await loadAssignment(env, course, aid);
    if (!a) return;
    await ensureRepo(env, owner, course, `${course.toUpperCase()} 的作业与项目（海纳协会学习平台）`);
    const dirKey = `${course}/${a.repoDir}`;
    const started = await env.DB.prepare("SELECT 1 AS x FROM forgejo_dirs WHERE user_id = ? AND dir = ?").bind(s.user.id, dirKey).first();
    if (!started) {
      // 太大的数据文件（公开版本里只有开头几行）不放进仓库
      const starter = Object.fromEntries(a.files.filter((f) => !f.omitted).map((f) => [`${a.repoDir}/${f.path}`, f.content]));
      await commitFiles(env, owner, course, starter, `开始${a.title}：官方起始代码`, author);
      await env.DB.prepare("INSERT OR IGNORE INTO forgejo_dirs (user_id, dir, created_at) VALUES (?, ?, ?)").bind(s.user.id, dirKey, Date.now()).run();
    }
    const p = a.problems.find((x) => x.id === pid);
    const mine = Object.fromEntries(Object.entries(s.files).map(([path, content]) => [`${a.repoDir}/${path}`, content]));
    await commitFiles(env, owner, course, mine, `${a.title} · ${p?.title ?? pid}：提交，${result}`, author);
    return;
  }
  // 刷题：只把通过的代码放进仓库
  if (s.verdict !== "AC") return;
  await ensureRepo(env, owner, PRACTICE_REPO, "刷题记录：每道通过的题一个目录（海纳协会学习平台）");
  const title = await loadProblemTitle(env, s.problem);
  const mine = Object.fromEntries(Object.entries(s.files).map(([path, content]) => [`${s.problem}/${path}`, content]));
  await commitFiles(env, owner, PRACTICE_REPO, mine, `${title}：通过`, author);
}

/** 提交后调用：写不进去就排队，不影响判题结果 */
export async function syncOrQueue(env: Env, s: SubmissionSync): Promise<"done" | "queued" | "off"> {
  if (!forgejoEnabled(env)) return "off";
  try {
    await syncSubmission(env, s);
    return "done";
  } catch (e) {
    await env.DB.prepare("INSERT INTO forgejo_queue (id, user_id, payload, attempts, next_at, last_error, created_at) VALUES (?, ?, ?, 0, ?, ?, ?)")
      .bind(crypto.randomUUID(), s.user.id, JSON.stringify(s), Date.now() + MINUTE_MS, String((e as Error).message).slice(0, 500), Date.now())
      .run();
    return "queued";
  }
}

/** 定时任务：重试排队的提交。按排队顺序，同一个人的先后不乱。 */
export async function drainQueue(env: Env, now = Date.now()): Promise<number> {
  if (!forgejoEnabled(env)) return 0;
  const rows = await env.DB.prepare("SELECT id, payload, attempts FROM forgejo_queue WHERE next_at <= ? ORDER BY created_at LIMIT ?").bind(now, QUEUE_BATCH).all<{ id: string; payload: string; attempts: number }>();
  let done = 0;
  for (const r of rows.results) {
    try {
      await syncSubmission(env, JSON.parse(r.payload) as SubmissionSync);
      await env.DB.prepare("DELETE FROM forgejo_queue WHERE id = ?").bind(r.id).run();
      done++;
    } catch (e) {
      const attempts = r.attempts + 1;
      if (attempts >= MAX_ATTEMPTS) await env.DB.prepare("UPDATE forgejo_queue SET attempts = ?, next_at = ?, last_error = ? WHERE id = ?").bind(attempts, Number.MAX_SAFE_INTEGER, String((e as Error).message).slice(0, 500), r.id).run();
      else await env.DB.prepare("UPDATE forgejo_queue SET attempts = ?, next_at = ?, last_error = ? WHERE id = ?").bind(attempts, now + 2 ** attempts * MINUTE_MS, String((e as Error).message).slice(0, 500), r.id).run();
    }
  }
  return done;
}
