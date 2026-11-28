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

export async function call<T>(env: Env, method: string, path: string, body?: unknown, okStatus: number[] = []): Promise<{ status: number; data: T | null; headers: Headers }> {
  const res = await fetch(`${env.FORGEJO_URL!.replace(/\/$/, "")}/api/v1${path}`, {
    method,
    headers: { authorization: `token ${env.FORGEJO_TOKEN}`, "content-type": "application/json", accept: "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok && !okStatus.includes(res.status)) throw new ForgejoError(res.status, `Forgejo ${method} ${path} → ${res.status}：${(await res.text()).slice(0, 200)}`);
  const text = await res.text();
  return { status: res.status, data: text ? (JSON.parse(text) as T) : null, headers: res.headers };
}

/** 和 call 一样，但返回纯文本（改动对比 .diff）；内容超过 maxBytes 只取前面一段 */
export async function callText(env: Env, path: string, maxBytes: number): Promise<{ status: number; text: string; truncated: boolean }> {
  const res = await fetch(`${env.FORGEJO_URL!.replace(/\/$/, "")}/api/v1${path}`, {
    headers: { authorization: `token ${env.FORGEJO_TOKEN}` },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (res.status === 404) return { status: 404, text: "", truncated: false };
  if (!res.ok) throw new ForgejoError(res.status, `Forgejo GET ${path} → ${res.status}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  const truncated = buf.length > maxBytes;
  return { status: res.status, text: new TextDecoder().decode(truncated ? buf.slice(0, maxBytes) : buf), truncated };
}

export interface Who {
  id: string;
  name: string;
  studentNo: string;
  username: string | null;
  kind: "campus" | "external";
}

/**
 * 平台账号对应的 Forgejo 用户名（2026-11-28 起）：设了平台用户名就用它，仓库地址里不再出现学号；
 * 还没设用户名的老账号沿用以前的名字（校内 s+学号，校外 x-+用户名），设了以后自动改名。
 */
export function forgejoName(u: Who): string {
  return u.username ? u.username.toLowerCase() : legacyName(u);
}

function legacyName(u: Who): string {
  if (u.kind === "campus") return `s${u.studentNo}`.toLowerCase();
  return `x-${(u.username ?? u.id).toLowerCase().replace(/[^a-z0-9_.-]/g, "-")}`.slice(0, 39);
}

const emailOf = (name: string) => `${name}@users.hiana.local`;

function randomPassword(): string {
  const b = crypto.getRandomValues(new Uint8Array(24));
  return `Hn-${[...b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

/** 在 Forgejo 建账号。422 = 名字已存在或者 Forgejo 不收（保留字）：已存在就当作建好了，不收返回 false */
async function createUser(env: Env, name: string): Promise<boolean> {
  // full_name 也用用户名：仓库公开以后，Forgejo 页面上不能出现真名
  const r = await call(env, "POST", "/admin/users", { username: name, full_name: name, email: emailOf(name), password: randomPassword(), must_change_password: false, visibility: "private" }, [422]);
  if (r.status !== 422) return true;
  return (await call(env, "GET", `/users/${name}`, undefined, [404])).status === 200;
}

/**
 * 建学员的 Forgejo 账号（已经有了就跳过；平台用户名变了就跟着改名）。返回 Forgejo 用户名。
 * 这个随机密码学员不知道：网页里看仓库走平台；本地 clone、push 用仓库页设的 Git 密码，或者 VSCode 插件拿到的凭据。
 */
export async function ensureUser(env: Env, who: Who): Promise<string> {
  // 用户名以数据库里现在的为准：排队重试的提交带的是提交那一刻的账号信息，中间可能改过用户名
  const cur = await env.DB.prepare("SELECT username FROM users WHERE id = ?").bind(who.id).first<{ username: string | null }>();
  const u = cur ? { ...who, username: cur.username } : who;
  const want = forgejoName(u);
  const row = await env.DB.prepare("SELECT username FROM forgejo_users WHERE user_id = ?").bind(u.id).first<{ username: string }>();
  if (row) return row.username === want ? row.username : renameUser(env, u.id, row.username, want);
  let name = want;
  if (!(await createUser(env, name))) {
    name = legacyName(u);
    await createUser(env, name);
  }
  await env.DB.prepare("INSERT OR IGNORE INTO forgejo_users (user_id, username, created_at) VALUES (?, ?, ?)").bind(u.id, name, Date.now()).run();
  return name;
}

/** Forgejo 账号改名（仓库跟着走，旧地址 Forgejo 会自动跳转）。改不成（新名字被占、保留字）就沿用旧名字 */
async function renameUser(env: Env, userId: string, from: string, to: string): Promise<string> {
  try {
    const r = await call(env, "POST", `/admin/users/${from}/rename`, { new_username: to }, [404, 422]);
    if (r.status === 404) {
      // Forgejo 那边没有旧账号了（比如被管理员删了）：按新名字重建
      if (!(await createUser(env, to))) return from;
    } else if (r.status === 422) return from;
    await call(env, "PATCH", `/admin/users/${to}`, { full_name: to, email: emailOf(to), login_name: to, source_id: 0 }, [422]);
    await env.DB.prepare("UPDATE forgejo_users SET username = ? WHERE user_id = ?").bind(to, userId).run();
    return to;
  } catch (err) {
    console.error("Forgejo 改名失败", from, to, err);
    return from;
  }
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

/** 课程仓库 README 里的一份作业 */
export interface ReadmeAssignment {
  id: string;
  title: string;
  repoDir: string;
  problems: { id: string; title: string }[];
}

/**
 * 课程仓库的 README（故事 2.2）：学了什么、过了哪些题、做了哪些项目。每次同步提交时重新生成，没变就不提交。
 * 只列学员动过的作业（仓库里有目录的）。
 */
export function courseReadme(input: { course: string; name: string; assignments: ReadmeAssignment[]; solved: Set<string>; started: Set<string> }): string {
  const { course, name, assignments, solved, started } = input;
  const mine = assignments.filter((a) => started.has(`${course}/${a.repoDir}`));
  const lines = [
    `# ${course.toUpperCase()} · ${name}`,
    "",
    "这个仓库由海纳协会学习平台自动维护：每次在作业台「提交」，代码都会作为一次提交放进来。第一次做某份作业时，先放入官方起始代码。",
    "",
  ];
  let total = 0;
  let done = 0;
  const rows = mine.map((a) => {
    const n = a.problems.filter((p) => solved.has(`${course}/${a.id}/${p.id}`)).length;
    total += a.problems.length;
    done += n;
    const mark = n === a.problems.length && n > 0 ? "✅" : n > 0 ? "🟡" : "⬜";
    return `| ${mark} | [${a.title}](${a.repoDir}/) | ${n} / ${a.problems.length} |`;
  });
  lines.push(`## 进度`, "", `做过 ${mine.length} 份作业，通过 ${done} / ${total} 道题。`, "");
  if (rows.length) lines.push("| | 作业 | 通过 |", "| --- | --- | --- |", ...rows, "");
  const passed = mine.flatMap((a) => a.problems.filter((p) => solved.has(`${course}/${a.id}/${p.id}`)).map((p) => `- ${a.title} · ${p.title}`));
  if (passed.length) lines.push("## 通过的题", "", ...passed, "");
  lines.push("---", "", "题目、起始代码与测试的版权归原课程所有，仅供学习交流。");
  return lines.join("\n") + "\n";
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
  // 提交作者写仓库用户名，不写真名（仓库可以公开）
  const author = { name: owner, email: emailOf(owner) };
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
    await updateReadme(env, s.user, owner, course, author);
    return;
  }
  // 刷题：只把通过的代码放进仓库
  if (s.verdict !== "AC") return;
  await ensureRepo(env, owner, PRACTICE_REPO, "刷题记录：每道通过的题一个目录（海纳协会学习平台）");
  const title = await loadProblemTitle(env, s.problem);
  const mine = Object.fromEntries(Object.entries(s.files).map(([path, content]) => [`${s.problem}/${path}`, content]));
  await commitFiles(env, owner, PRACTICE_REPO, mine, `${title}：通过`, author);
}

/** 重新生成课程仓库的 README：读通过记录和学员动过的作业目录（从静态的作业目录取题目名） */
async function updateReadme(env: Env, user: Who, owner: string, course: string, author: { name: string; email: string }): Promise<void> {
  const dirs = await env.DB.prepare("SELECT dir FROM forgejo_dirs WHERE user_id = ? AND dir LIKE ?").bind(user.id, `${course}/%`).all<{ dir: string }>();
  const solved = await env.DB.prepare("SELECT problem FROM oj_solved WHERE user_id = ? AND substr(problem, 1, ?) = ?").bind(user.id, course.length + 1, `${course}/`).all<{ problem: string }>();
  const started = new Set(dirs.results.map((r) => r.dir));
  const assignments: ReadmeAssignment[] = [];
  for (const d of started) {
    const id = d.split("/").pop()!;
    const a = await loadAssignment(env, course, id);
    if (a) assignments.push({ id: a.id, title: a.title, repoDir: a.repoDir, problems: a.problems.map((p) => ({ id: p.id, title: p.title })) });
  }
  const md = courseReadme({ course, name: owner, assignments, solved: new Set(solved.results.map((r) => r.problem)), started });
  await commitFiles(env, owner, course, { "README.md": md }, "更新 README：学习进度", author);
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
