import { execFile } from "node:child_process";
import { chmod, mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { homedir, hostname } from "node:os";
import { join } from "node:path";
import * as vscode from "vscode";
import {
  ApiError,
  codeProblems,
  companionFile,
  credentialLine,
  DEFAULT_SERVER,
  defaultRepoFolder,
  execLanguage,
  findTarget,
  formatExec,
  formatResult,
  Hiana,
  inputCandidates,
  judgeId,
  languageFor,
  normalizeServer,
  type OjIndex,
  ownRepo,
  type ProblemFile,
  repoNameFromUrl,
  type Target,
  VERDICT_TEXT,
} from "./core";

/**
 * 海纳协会学习平台 · VSCode 插件（故事 2.3；第二版 2026-11-28）。
 * - 左侧竖栏的 HIANA：账号、我的仓库（下载、打开、更新）、当前作业（每道题是否通过）。
 * - 一键登录：插件打开浏览器，学员在平台上点「允许」。
 * - Git 用户名和密码由平台交给插件，存在插件自己的目录里，只给平台上的仓库用；学员不用另设 Git 密码。
 * - 「在服务器上运行」：代码和输入发到平台的判题服务器运行，本机不用装 Python、C、C++、Java。
 * - 「运行公开测试」「提交到 OJ」：同第一版。提交 = 拉取 → git commit → git push → 平台判题 → 再拉取一次。
 */

const TOKEN_KEY = "hiana.token";
const PROBLEM_KEY = "hiana.problem:";
/** 在服务器上运行时，一起带上的文件最多这么多、这么大 */
const EXEC_MAX_FILES = 20;
const EXEC_MAX_BYTES = 200 * 1024;

/* VSCode 自带 Git 扩展的接口，只声明用到的部分 */
interface GitRepository {
  rootUri: vscode.Uri;
  state: { remotes: { name: string; fetchUrl?: string; pushUrl?: string }[]; indexChanges: unknown[]; HEAD?: { name?: string; ahead?: number } };
  add(paths: string[]): Promise<void>;
  commit(message: string): Promise<void>;
  pull(): Promise<void>;
  push(): Promise<void>;
  status(): Promise<void>;
}
interface GitAPI {
  git: { path: string };
  repositories: GitRepository[];
  getRepository(uri: vscode.Uri): GitRepository | null;
}

let ctx: vscode.ExtensionContext;
let output: vscode.OutputChannel;
let runOutput: vscode.OutputChannel;
let status: vscode.StatusBarItem;
let tree: HianaTree;
let indexCache: { server: string; at: number; data: OjIndex } | null = null;
/** 这次打开 VSCode 后拿到的 Git 凭据（只缓存用户名和地址，密码写进凭据文件） */
let credCache: { server: string; username: string; base: string } | null = null;

type Me = { name: string; username: string | null; studentNo: string };
type RepoInfo = { name: string; description: string; private: boolean; cloneUrl: string };

function server(): string {
  return normalizeServer(vscode.workspace.getConfiguration("hiana").get<string>("server") || DEFAULT_SERVER);
}

async function client(quiet = false): Promise<Hiana | null> {
  const token = await ctx.secrets.get(TOKEN_KEY);
  if (!token) {
    if (!quiet) {
      const pick = await vscode.window.showWarningMessage("还没有登录海纳协会学习平台。", "登录");
      if (pick === "登录") await vscode.commands.executeCommand("hiana.login");
    }
    return null;
  }
  return new Hiana(server(), token);
}

async function gitApi(): Promise<GitAPI> {
  const ext = vscode.extensions.getExtension<{ getAPI(v: 1): GitAPI }>("vscode.git");
  if (!ext) throw new Error("没有找到 VSCode 自带的 Git 扩展，请确认它没有被禁用");
  return (ext.isActive ? ext.exports : await ext.activate()).getAPI(1);
}

/** 直接调用 git 命令（下载、更新、写仓库设置）。不弹任何输入框：GIT_TERMINAL_PROMPT=0 */
async function runGit(args: string[], cwd?: string): Promise<string> {
  const git = (await gitApi()).git.path || "git";
  return new Promise((resolve, reject) => {
    execFile(git, args, { cwd, env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never" }, maxBuffer: 8 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) reject(new Error(gitMessage(stderr || err.message)));
      else resolve(stdout);
    });
  });
}

/** git 的报错翻译成学员看得懂的话 */
function gitMessage(raw: string): string {
  const s = raw.trim();
  if (/Authentication failed|could not read Username|401|403/i.test(s)) return "仓库服务拒绝了 Git 用户名和密码。插件会重新获取，请再试一次";
  if (/Could not resolve host|Failed to connect|timed out|Connection refused/i.test(s)) return "连不上仓库服务，请检查网络";
  if (/would be overwritten|Your local changes/i.test(s)) return "本地有还没提交的改动和平台上的新提交冲突。请先提交或撤销本地改动，再更新";
  if (/CONFLICT|Automatic merge failed/i.test(s)) return "本地和平台上的提交改了同一处，产生了冲突。请在 VSCode 的「源代码管理」里解决冲突后提交";
  return `Git 出错：${s.split("\n").slice(-3).join(" ")}`;
}

function show(err: unknown) {
  const msg = err instanceof ApiError || err instanceof Error ? err.message : String(err);
  void vscode.window.showErrorMessage(msg);
}

/* ───────────── 登录 ───────────── */

async function setLoggedIn(token: string | null) {
  if (token) await ctx.secrets.store(TOKEN_KEY, token);
  else await ctx.secrets.delete(TOKEN_KEY);
  indexCache = null;
  credCache = null;
  await refresh();
}

/** 一键登录：插件发起，浏览器里确认 */
async function login() {
  const api = new Hiana(server(), null);
  try {
    const start = await api.deviceStart(`VSCode 插件（${hostname().slice(0, 24)}）`);
    const url = api.server + start.url;
    await vscode.env.openExternal(vscode.Uri.parse(url));
    const token = await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: `HIANA：请在浏览器里确认登录，确认码 ${start.userCode}`, cancellable: true },
      async (progress, cancel) => {
        progress.report({ message: "浏览器没有打开时，请手动访问 " + url });
        const until = Date.now() + start.expiresIn * 1000;
        while (!cancel.isCancellationRequested && Date.now() < until) {
          await new Promise((r) => setTimeout(r, start.interval * 1000));
          const r = await api.devicePoll(start.deviceCode);
          if (r.status === "ok" && r.token) return r.token;
          if (r.status === "denied") throw new Error("已在网页上拒绝登录");
          if (r.status === "expired") break;
        }
        if (cancel.isCancellationRequested) return null;
        throw new Error("确认超时了，请重新登录");
      },
    );
    if (!token) return;
    await setLoggedIn(token);
    const me = await new Hiana(server(), token).me();
    void vscode.window.showInformationMessage(`已登录：${me.member?.name ?? ""}。`);
  } catch (e) {
    show(e);
  }
}

/** 备用：粘贴在网页上签发的令牌 */
async function loginWithToken() {
  const token = await vscode.window.showInputBox({
    title: "HIANA：使用令牌登录",
    prompt: "个人令牌（hnp_ 开头），在平台「我的 → 我的仓库」页的「VSCode 插件」一节签发。",
    password: true,
    ignoreFocusOut: true,
    validateInput: (v) => (v.trim().startsWith("hnp_") ? null : "令牌以 hnp_ 开头"),
  });
  if (!token) return;
  try {
    const me = await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: "正在验证令牌…" }, () => new Hiana(server(), token.trim()).me());
    if (!me.role || !me.member) throw new ApiError("令牌不对或已撤销，请在平台上重新签发", 401);
    await setLoggedIn(token.trim());
    void vscode.window.showInformationMessage(`已登录：${me.member.name}。`);
  } catch (e) {
    show(e);
  }
}

async function logout() {
  await setLoggedIn(null);
  void vscode.window.showInformationMessage("已退出登录。这台电脑的令牌没有撤销，不再使用的话，请在平台「我的仓库」页撤销。");
}

async function setServer() {
  const cfg = vscode.workspace.getConfiguration("hiana");
  const url = await vscode.window.showInputBox({ title: "HIANA：平台地址", prompt: "一般不用改。在本机试用开发版时填 http://localhost:8788。", value: server(), ignoreFocusOut: true });
  if (!url?.trim()) return;
  await cfg.update("server", normalizeServer(url), vscode.ConfigurationTarget.Global);
}

/* ───────────── Git 凭据和仓库设置 ───────────── */

function credentialFile(): string {
  return join(ctx.globalStorageUri.fsPath, "git-credentials");
}

/** 从平台拿 Git 用户名和密码，写进插件自己的凭据文件（只有本人可读） */
async function ensureCredential(api: Hiana, reset = false): Promise<{ username: string; base: string }> {
  if (!reset && credCache && credCache.server === api.server) return credCache;
  const c = await api.credential(reset);
  await mkdir(ctx.globalStorageUri.fsPath, { recursive: true });
  await writeFile(credentialFile(), credentialLine(c.base, c.username, c.password) + "\n", { mode: 0o600 });
  await chmod(credentialFile(), 0o600).catch(() => undefined);
  credCache = { server: api.server, username: c.username, base: c.base };
  return credCache;
}

/**
 * 给一个仓库写本地设置：只用插件的凭据文件（不弹系统的密码框），提交作者用平台用户名（仓库可能公开，不写真名和私人邮箱）。
 * 平台用户名改过、远程地址里还是旧名字的，改成新地址。
 */
async function configureRepo(root: string, cred: { username: string; base: string }, repo: string) {
  const helper = `store --file="${credentialFile().replace(/\\/g, "/")}"`;
  await runGit(["config", "--local", "--unset-all", "credential.helper"], root).catch(() => undefined);
  await runGit(["config", "--local", "--add", "credential.helper", ""], root);
  await runGit(["config", "--local", "--add", "credential.helper", helper], root);
  await runGit(["config", "--local", "user.name", cred.username], root);
  await runGit(["config", "--local", "user.email", `${cred.username}@users.hiana.local`], root);
  const want = `${cred.base}/${cred.username}/${repo}.git`;
  const now = (await runGit(["remote", "get-url", "origin"], root).catch(() => "")).trim();
  let sameHost = false;
  try {
    sameHost = new URL(now).host === new URL(cred.base).host;
  } catch {
    /* SSH 地址之类：不动 */
  }
  if (now && now !== want && sameHost) await runGit(["remote", "set-url", "origin", want], root);
}

function repoFolder(): string {
  return defaultRepoFolder(homedir(), vscode.workspace.getConfiguration("hiana").get<string>("repoFolder"));
}

/** 这个仓库在本机的位置：VSCode 里已经打开的优先，其次是默认下载位置 */
async function localRepo(name: string, owner: string, base: string): Promise<string | null> {
  for (const r of (await gitApi()).repositories) {
    const url = r.state.remotes.find((x) => x.name === "origin")?.fetchUrl ?? "";
    if (ownRepo(url, base, owner) === name) return r.rootUri.fsPath;
  }
  const dir = join(repoFolder(), name);
  return (await stat(join(dir, ".git")).catch(() => null)) ? dir : null;
}

async function cloneRepo(name?: string) {
  const api = await client();
  if (!api) return;
  try {
    const list = await api.repos();
    if (!list.enabled) throw new Error("平台的仓库服务还没有配置，请联系管理员");
    if (!list.repos.length) throw new Error("还没有仓库。先在平台的作业台提交一次作业，平台会自动建好这门课的仓库");
    let repo = list.repos.find((r) => r.name === name);
    if (!repo) {
      const pick = await vscode.window.showQuickPick(
        list.repos.map((r) => ({ label: r.name, description: r.private ? "私有" : "公开", detail: r.description, repo: r })),
        { title: "HIANA：下载仓库", placeHolder: "选择要下载到本机的仓库" },
      );
      if (!pick) return;
      repo = pick.repo;
    }
    const cred = await ensureCredential(api);
    const existing = await localRepo(repo.name, cred.username, cred.base);
    if (existing) return openFolder(existing);
    const dir = join(repoFolder(), repo.name);
    if ((await readdir(dir).catch(() => [])).length) throw new Error(`${dir} 已经存在，而且不是这个仓库。请把它挪走，或者在设置里把「hiana.repoFolder」改成别的位置`);
    await mkdir(repoFolder(), { recursive: true });
    const helper = `credential.helper=store --file="${credentialFile().replace(/\\/g, "/")}"`;
    const r = repo;
    await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: `正在下载 ${r.name} 到 ${dir}…` }, async () => {
      await runGit(["-c", "credential.helper=", "-c", helper, "clone", r.cloneUrl, dir]).catch(async (e) => {
        if (!/拒绝了/.test((e as Error).message)) throw e;
        await ensureCredential(api, true);
        await runGit(["-c", "credential.helper=", "-c", helper, "clone", r.cloneUrl, dir]);
      });
      await configureRepo(dir, cred, r.name);
    });
    void tree.refresh();
    await openFolder(dir);
  } catch (e) {
    show(e);
  }
}

async function openFolder(dir: string) {
  const uri = vscode.Uri.file(dir);
  if (vscode.workspace.workspaceFolders?.some((f) => f.uri.fsPath === uri.fsPath)) {
    // 已经打开的文件夹里刚下载好仓库：让 VSCode 的 Git 扩展认出它
    await vscode.commands.executeCommand("git.openRepository", dir).then(undefined, () => undefined);
    void vscode.window.showInformationMessage("这个仓库已经在当前窗口里打开了。");
    return;
  }
  const hasFolder = !!vscode.workspace.workspaceFolders?.length;
  await vscode.commands.executeCommand("vscode.openFolder", uri, { forceNewWindow: hasFolder });
}

async function updateRepo(name?: string) {
  const api = await client();
  if (!api) return;
  try {
    const cred = await ensureCredential(api);
    const dir = name ? await localRepo(name, cred.username, cred.base) : null;
    if (!dir || !name) throw new Error("本机还没有这个仓库，请先下载");
    await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: `正在更新 ${name}…` }, async () => {
      await configureRepo(dir, cred, name);
      const pull = () => runGit(["pull", "--no-rebase", "--no-edit"], dir);
      const out = await pull().catch(async (e) => {
        if (!/拒绝了/.test((e as Error).message)) throw e;
        await ensureCredential(api, true);
        return pull();
      });
      void vscode.window.showInformationMessage(/Already up to date|已经是最新/.test(out) ? `${name} 已经是最新的。` : `${name} 已更新。`);
    });
  } catch (e) {
    show(e);
  }
}

/* ───────────── 作业：找到题目、运行公开测试、提交 ───────────── */

async function loadIndex(api: Hiana): Promise<OjIndex> {
  if (indexCache && indexCache.server === api.server && Date.now() - indexCache.at < 10 * 60_000) return indexCache.data;
  const data = await api.index();
  indexCache = { server: api.server, at: Date.now(), data };
  return data;
}

/** 编辑器里的文件对应平台上的哪份作业（不弹提示；找不到返回 null） */
async function targetOf(api: Hiana, uri: vscode.Uri): Promise<{ repo: GitRepository; repoName: string; relPath: string; target: Target } | null> {
  if (uri.scheme !== "file") return null;
  const repo = (await gitApi()).getRepository(uri);
  if (!repo) return null;
  const remote = repo.state.remotes.find((r) => r.name === "origin") ?? repo.state.remotes[0];
  const repoName = (remote && repoNameFromUrl(remote.fetchUrl ?? remote.pushUrl ?? "")) ?? repo.rootUri.path.split("/").pop()!;
  const relPath = uri.path.slice(repo.rootUri.path.length + 1);
  const target = findTarget(await loadIndex(api), repoName, relPath);
  return target ? { repo, repoName, relPath, target } : null;
}

async function problemsOf(api: Hiana, t: Target): Promise<ProblemFile[]> {
  return t.kind === "assignment" ? (await api.assignment(t.course, t.assignment)).problems : [await api.problem(t.problem)];
}

interface Picked {
  api: Hiana;
  repo: GitRepository;
  repoName: string;
  target: Target;
  problem: ProblemFile;
  /** 要交的文件：仓库里的相对路径 → 题目里的文件名 */
  files: { repoPath: string; name: string }[];
}

/** 当前编辑器里的文件 → 仓库、作业、题目（同一个文件对应多道题时让人选，并记住） */
async function pickProblem(verb: string): Promise<Picked | null> {
  const api = await client();
  if (!api) return null;
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.uri.scheme !== "file") {
    void vscode.window.showWarningMessage(`请先打开要${verb}的作业文件，比如 lab01.py。`);
    return null;
  }
  if (!(await gitApi()).getRepository(editor.document.uri)) {
    void vscode.window.showWarningMessage("这个文件不在 Git 仓库里。请先在左侧 HIANA 栏里下载课程仓库，再在里面写作业。");
    return null;
  }
  const found = await targetOf(api, editor.document.uri);
  if (!found) {
    void vscode.window.showWarningMessage("在平台上找不到这个文件对应的作业。作业文件要放在下载下来的目录结构里（比如 lab/lab01/lab01.py）。");
    return null;
  }
  const { repo, repoName, relPath, target } = found;
  const all = await problemsOf(api, target);
  const problems = codeProblems(all, target.file);
  if (!problems.length) {
    const webOnly = all.some((p) => p.editable.includes(target.file));
    void vscode.window.showWarningMessage(webOnly ? "这个文件对应的题目是预测输出或环境图，要逐空作答，请在平台的作业台里做。" : `${target.file} 不是这份作业里要提交的文件。`);
    return null;
  }
  const key = `${PROBLEM_KEY}${repoName}/${relPath}`;
  let problem = problems[0]!;
  if (problems.length > 1) {
    const last = ctx.workspaceState.get<string>(key);
    const items = problems.map((p) => ({ label: p.title, description: p.id === last ? "上次选的" : p.id, problem: p }));
    if (last) items.sort((a, b) => (a.problem.id === last ? -1 : b.problem.id === last ? 1 : 0));
    const pick = await vscode.window.showQuickPick(items, { title: `HIANA：${verb}哪一题？`, placeHolder: target.title });
    if (!pick) return null;
    problem = pick.problem;
    await ctx.workspaceState.update(key, problem.id);
  }
  const base = target.kind === "assignment" ? target.repoDir : target.problem;
  return { api, repo, repoName, target, problem, files: problem.editable.map((name) => ({ repoPath: `${base}/${name}`, name })) };
}

async function readFiles(p: Picked): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const f of p.files) {
    const uri = vscode.Uri.joinPath(p.repo.rootUri, ...f.repoPath.split("/"));
    const open = vscode.workspace.textDocuments.find((d) => d.uri.toString() === uri.toString());
    if (open?.isDirty) await open.save();
    try {
      out[f.name] = new TextDecoder().decode(await vscode.workspace.fs.readFile(uri));
    } catch {
      throw new Error(`读不到 ${f.repoPath}。这份作业要提交的文件都要在仓库里。`);
    }
  }
  return out;
}

async function runTests() {
  try {
    const p = await pickProblem("运行");
    if (!p) return;
    const files = await readFiles(p);
    const body = { problem: judgeId(p.target, p.problem.id), language: languageFor(p.problem, p.target.file), files };
    const r = await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: `正在运行公开测试：${p.problem.title}` }, () => p.api.judge("run", body));
    output.appendLine(formatResult("run", `${p.target.title} · ${p.problem.title}`, r.result));
    output.appendLine("");
    output.show(true);
  } catch (e) {
    show(e);
  }
}

async function submit() {
  try {
    const p = await pickProblem("提交");
    if (!p) return;
    const title = `${p.target.title} · ${p.problem.title}`;
    const r = await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: `提交：${p.problem.title}` }, async (progress) => {
      const files = await readFiles(p);
      // 平台上的仓库：先写好凭据和提交作者，推送时不弹密码框
      const cred = await ensureCredential(p.api).catch(() => null);
      const own = cred && ownRepo(p.repo.state.remotes.find((x) => x.name === "origin")?.fetchUrl ?? "", cred.base, cred.username);
      if (cred && own) await configureRepo(p.repo.rootUri.fsPath, cred, own);
      progress.report({ message: "拉取平台上的新提交…" });
      await p.repo.pull();
      progress.report({ message: "提交到本地仓库…" });
      await p.repo.add(p.files.map((f) => vscode.Uri.joinPath(p.repo.rootUri, ...f.repoPath.split("/")).fsPath));
      await p.repo.status();
      const changed = p.repo.state.indexChanges.length > 0;
      if (changed) await p.repo.commit(`${title}：在 VSCode 里提交`);
      await p.repo.status();
      if (changed || (p.repo.state.HEAD?.ahead ?? 0) > 0) {
        progress.report({ message: "推送到平台上的仓库…" });
        await p.repo.push();
      }
      progress.report({ message: "判题中…" });
      const res = await p.api.judge("submit", { problem: judgeId(p.target, p.problem.id), language: languageFor(p.problem, p.target.file), files });
      // 平台判完会更新仓库里的 README，拉下来，免得下次推送冲突
      progress.report({ message: "同步平台更新的 README…" });
      await p.repo.pull().catch(() => undefined);
      return res;
    });
    output.appendLine(formatResult("submit", title, r.result));
    if (r.firstSolve) output.appendLine("第一次通过这道题。");
    if (r.repo === "queued") output.appendLine("平台的仓库服务暂时连不上，这次提交已经排队，稍后会自动写进仓库。");
    output.appendLine("");
    output.show(true);
    const v = r.result.verdict;
    const msg = `${title}：${VERDICT_TEXT[v] ?? v}（${r.result.passed} / ${r.result.total}）`;
    if (v === "AC") void vscode.window.showInformationMessage(msg);
    else void vscode.window.showWarningMessage(msg);
    void tree.refresh();
  } catch (e) {
    show(e);
  }
}

async function history() {
  try {
    const p = await pickProblem("查看");
    if (!p) return;
    const id = judgeId(p.target, p.problem.id);
    const list = await p.api.submissions(id);
    if (!list.submissions.length) {
      void vscode.window.showInformationMessage(`${p.problem.title} 还没有提交记录。`);
      return;
    }
    const pick = await vscode.window.showQuickPick(
      list.submissions.map((s) => ({
        label: `${s.verdict === "AC" ? "$(pass)" : "$(error)"} ${VERDICT_TEXT[s.verdict] ?? s.verdict}  ${s.passed} / ${s.total}`,
        description: new Date(s.createdAt).toLocaleString("zh-CN", { hour12: false }),
        id: s.id,
      })),
      { title: `HIANA：${p.problem.title} 的提交记录`, placeHolder: "选择一次提交查看详细结果" },
    );
    if (!pick) return;
    const d = await p.api.submission(pick.id);
    output.appendLine(formatResult("submit", `${p.target.title} · ${p.problem.title}`, d.submission.result, new Date(d.submission.createdAt)));
    output.appendLine("");
    output.show(true);
  } catch (e) {
    show(e);
  }
}

async function openWeb() {
  try {
    const p = await pickProblem("打开");
    if (!p) return;
    const path = p.target.kind === "assignment" ? `/courses/${p.target.course}/hw/${p.target.assignment}/${p.problem.id}` : `/oj/p/${p.target.problem}`;
    await vscode.env.openExternal(vscode.Uri.parse(p.api.server + path));
  } catch (e) {
    show(e);
  }
}

/* ───────────── 在服务器上运行 ───────────── */

async function execOnServer(arg?: vscode.Uri) {
  const api = await client();
  if (!api) return;
  try {
    const uri = arg instanceof vscode.Uri ? arg : vscode.window.activeTextEditor?.document.uri;
    if (!uri || uri.scheme !== "file") throw new Error("请先打开要运行的代码文件。");
    const mainName = uri.path.slice(uri.path.lastIndexOf("/") + 1);
    const lang = execLanguage(mainName);
    if (!lang) throw new Error("在服务器上运行支持 Python（.py）、C（.c）、C++（.cpp）和 Java（.java）。");
    const dir = vscode.Uri.joinPath(uri, "..");
    for (const d of vscode.workspace.textDocuments) if (d.isDirty && d.uri.path.startsWith(dir.path + "/")) await d.save();

    const read = async (u: vscode.Uri) => new TextDecoder().decode(await vscode.workspace.fs.readFile(u));
    const files: Record<string, string> = { [mainName]: await read(uri) };
    let bytes = files[mainName]!.length;
    for (const [name, type] of await vscode.workspace.fs.readDirectory(dir)) {
      if (type !== vscode.FileType.File || name === mainName || !companionFile(lang, name)) continue;
      if (Object.keys(files).length >= EXEC_MAX_FILES) break;
      const text = await read(vscode.Uri.joinPath(dir, name));
      if (bytes + text.length > EXEC_MAX_BYTES) continue;
      files[name] = text;
      bytes += text.length;
    }
    let stdin = "";
    let inputName: string | null = null;
    for (const name of inputCandidates(mainName)) {
      const text = await read(vscode.Uri.joinPath(dir, name)).catch(() => null);
      if (text !== null) {
        stdin = text;
        inputName = name;
        break;
      }
    }
    const r = await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: `正在服务器上运行 ${mainName}…` }, () =>
      api.exec({ language: lang, main: mainName, files, stdin }),
    );
    runOutput.appendLine(formatExec(mainName, inputName, r.result));
    runOutput.appendLine("");
    runOutput.show(true);
  } catch (e) {
    show(e);
  }
}

/* ───────────── 左侧 HIANA 栏 ───────────── */

type Node =
  | { kind: "account"; me: Me; server: string }
  | { kind: "section"; id: "repos" | "work"; label: string }
  | { kind: "repo"; repo: RepoInfo; local: string | null }
  | { kind: "problem"; problem: ProblemFile; solved: boolean; file: vscode.Uri | null; web: string }
  | { kind: "note"; text: string; command?: vscode.Command };

class HianaTree implements vscode.TreeDataProvider<Node> {
  private changed = new vscode.EventEmitter<Node | undefined>();
  readonly onDidChangeTreeData = this.changed.event;
  private me: Me | null = null;
  private loggedIn = false;
  private error: string | null = null;

  async refresh() {
    this.changed.fire(undefined);
  }

  /** 登录状态有变化时调用：更新状态栏、上下文 */
  async reload() {
    this.error = null;
    this.me = null;
    const api = await client(true);
    this.loggedIn = !!api;
    if (api) {
      try {
        const me = await api.me();
        if (!me.role || !me.member) throw new ApiError("登录已失效，请重新登录", 401);
        this.me = { name: me.member.name, username: me.member.username, studentNo: me.member.studentNo };
      } catch (e) {
        this.error = e instanceof Error ? e.message : String(e);
        if (e instanceof ApiError && e.status === 401) this.loggedIn = false;
      }
    }
    await vscode.commands.executeCommand("setContext", "hiana.loggedIn", this.loggedIn);
    status.text = this.me ? `$(account) HIANA：${this.me.name}` : this.loggedIn ? "$(warning) HIANA" : "$(account) HIANA：未登录";
    status.tooltip = this.me ? `已登录 ${server()}\n点击打开操作菜单` : (this.error ?? "点击登录海纳协会学习平台");
    status.command = this.me ? "hiana.menu" : "hiana.login";
    this.changed.fire(undefined);
  }

  getTreeItem(n: Node): vscode.TreeItem {
    switch (n.kind) {
      case "account": {
        const t = new vscode.TreeItem(n.me.name);
        t.description = [n.me.username ? `@${n.me.username}` : null, new URL(n.server).host].filter(Boolean).join(" · ");
        t.tooltip = `已登录 ${n.server}`;
        t.iconPath = new vscode.ThemeIcon("account");
        t.contextValue = "account";
        return t;
      }
      case "section": {
        const t = new vscode.TreeItem(n.label, vscode.TreeItemCollapsibleState.Expanded);
        t.contextValue = `section.${n.id}`;
        return t;
      }
      case "repo": {
        const t = new vscode.TreeItem(n.repo.name);
        t.description = `${n.repo.private ? "私有" : "公开"} · ${n.local ? "已下载" : "未下载"}`;
        t.tooltip = new vscode.MarkdownString(`**${n.repo.name}**\n\n${n.repo.description}\n\n${n.local ? `本机位置：${n.local}` : "还没有下载到本机。点击下载。"}`);
        t.iconPath = new vscode.ThemeIcon(n.local ? "repo" : "cloud-download");
        t.contextValue = n.local ? "repo.local" : "repo.remote";
        t.command = n.local ? { command: "hiana.openRepo", title: "打开", arguments: [n] } : { command: "hiana.clone", title: "下载", arguments: [n] };
        return t;
      }
      case "problem": {
        const web = n.problem.kind === "wwpd" || n.problem.kind === "envdiagram";
        const t = new vscode.TreeItem(n.problem.title);
        t.description = n.solved ? "已通过" : web ? "在网页上作答" : "未通过";
        t.iconPath = new vscode.ThemeIcon(n.solved ? "pass-filled" : web ? "globe" : "circle-large-outline", new vscode.ThemeColor(n.solved ? "testing.iconPassed" : "descriptionForeground"));
        t.command = n.file && !web ? { command: "vscode.open", title: "打开文件", arguments: [n.file] } : { command: "vscode.open", title: "在平台上打开", arguments: [vscode.Uri.parse(n.web)] };
        return t;
      }
      case "note": {
        const t = new vscode.TreeItem(n.text);
        t.iconPath = new vscode.ThemeIcon("info");
        t.tooltip = n.text;
        if (n.command) t.command = n.command;
        return t;
      }
    }
  }

  async getChildren(n?: Node): Promise<Node[]> {
    if (!this.loggedIn) return []; // 显示「登录」欢迎页（package.json 的 viewsWelcome）
    const api = await client(true);
    if (!api) return [];
    try {
      if (!n) {
        if (!this.me) return [{ kind: "note", text: this.error ?? "正在连接平台…", command: { command: "hiana.refresh", title: "重试" } }];
        return [
          { kind: "account", me: this.me, server: api.server },
          { kind: "section", id: "repos", label: "我的仓库" },
          { kind: "section", id: "work", label: "当前作业" },
        ];
      }
      if (n.kind === "section" && n.id === "repos") {
        const list = await api.repos();
        if (!list.enabled) return [{ kind: "note", text: "平台的仓库服务还没有配置" }];
        if (!list.repos.length) return [{ kind: "note", text: "还没有仓库：在平台的作业台提交一次作业后自动建好" }];
        const cred = list.owner ? { username: list.owner, base: new URL(list.repos[0]!.cloneUrl).origin } : null;
        return Promise.all(list.repos.map(async (r) => ({ kind: "repo" as const, repo: r, local: cred ? await localRepo(r.name, cred.username, cred.base) : null })));
      }
      if (n.kind === "section" && n.id === "work") {
        const uri = vscode.window.activeTextEditor?.document.uri;
        const found = uri ? await targetOf(api, uri) : null;
        if (!found) return [{ kind: "note", text: "打开作业文件后，这里显示每道题是否通过" }];
        const { target, repo } = found;
        const problems = await problemsOf(api, target);
        const prefix = target.kind === "assignment" ? `${target.course}/${target.assignment}/` : target.problem;
        const solved = new Set((await api.solved(prefix)).solved.map((s) => s.problem));
        const base = target.kind === "assignment" ? target.repoDir : target.problem;
        return [
          { kind: "note", text: target.title },
          ...problems.map((p) => ({
            kind: "problem" as const,
            problem: p,
            solved: solved.has(judgeId(target, p.id)),
            file: p.editable[0] ? vscode.Uri.joinPath(repo.rootUri, ...`${base}/${p.editable[0]}`.split("/")) : null,
            web: api.server + (target.kind === "assignment" ? `/courses/${target.course}/hw/${target.assignment}/${p.id}` : `/oj/p/${target.problem}`),
          })),
        ];
      }
    } catch (e) {
      return [{ kind: "note", text: e instanceof Error ? e.message : String(e), command: { command: "hiana.refresh", title: "重试" } }];
    }
    return [];
  }
}

async function refresh() {
  await tree.reload();
}

/** 编辑器换了文件：更新「当前作业」和编辑器右上角按钮 */
async function onEditor() {
  const api = await client(true);
  const uri = vscode.window.activeTextEditor?.document.uri;
  const found = api && uri ? await targetOf(api, uri).catch(() => null) : null;
  await vscode.commands.executeCommand("setContext", "hiana.inAssignment", !!found);
  void tree.refresh();
}

export function activate(context: vscode.ExtensionContext) {
  ctx = context;
  output = vscode.window.createOutputChannel("HIANA OJ");
  runOutput = vscode.window.createOutputChannel("HIANA 运行");
  status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  status.show();
  tree = new HianaTree();
  ctx.subscriptions.push(vscode.window.createTreeView("hiana.view", { treeDataProvider: tree, showCollapseAll: false }));
  const cmd = (id: string, f: (...a: any[]) => unknown) => ctx.subscriptions.push(vscode.commands.registerCommand(id, f));
  const repoArg = (n?: Node) => (n && n.kind === "repo" ? n.repo.name : undefined);
  cmd("hiana.login", () => login());
  cmd("hiana.loginWithToken", () => loginWithToken());
  cmd("hiana.logout", () => logout());
  cmd("hiana.setServer", () => setServer());
  cmd("hiana.refresh", () => refresh());
  cmd("hiana.clone", (n?: Node) => cloneRepo(repoArg(n)));
  cmd("hiana.openRepo", (n?: Node) => n && n.kind === "repo" && n.local && openFolder(n.local));
  cmd("hiana.updateRepo", (n?: Node) => updateRepo(repoArg(n)));
  cmd("hiana.exec", (u?: vscode.Uri) => execOnServer(u));
  cmd("hiana.run", () => runTests());
  cmd("hiana.submit", () => submit());
  cmd("hiana.history", () => history());
  cmd("hiana.openWeb", () => openWeb());
  cmd("hiana.menu", async () => {
    const items = [
      { label: "$(run) 在服务器上运行", id: "hiana.exec" },
      { label: "$(beaker) 运行公开测试", id: "hiana.run" },
      { label: "$(cloud-upload) 提交到 OJ", id: "hiana.submit" },
      { label: "$(history) 查看提交记录", id: "hiana.history" },
      { label: "$(cloud-download) 下载仓库", id: "hiana.clone" },
      { label: "$(globe) 在平台上打开这道题", id: "hiana.openWeb" },
      { label: "$(settings) 平台地址", id: "hiana.setServer" },
      { label: "$(sign-out) 退出登录", id: "hiana.logout" },
    ];
    const pick = await vscode.window.showQuickPick(items, { title: "HIANA" });
    if (pick) await vscode.commands.executeCommand(pick.id);
  });
  ctx.subscriptions.push(output, runOutput, status);
  ctx.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => void onEditor()));
  ctx.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("hiana.server")) {
        indexCache = null;
        credCache = null;
        void refresh();
      } else if (e.affectsConfiguration("hiana.repoFolder")) void tree.refresh();
    }),
  );
  void refresh().then(onEditor);
}

export function deactivate() {}
