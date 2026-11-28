import * as vscode from "vscode";
import { ApiError, codeProblems, DEFAULT_SERVER, findTarget, formatResult, Hiana, judgeId, languageFor, normalizeServer, type OjIndex, type ProblemFile, repoNameFromUrl, type Target, VERDICT_TEXT } from "./core";

/**
 * 海纳协会学习平台 · VSCode 插件（故事 2.3）。
 * 在自己电脑上写作业：克隆平台上的课程仓库，运行公开测试，提交到 OJ，结果显示在「HIANA OJ」输出面板。
 * 提交 = 拉取 → git commit → git push → 调平台的提交接口 → 再拉取一次（平台会更新 README）。
 * git 操作都交给 VSCode 自带的 Git 扩展，账号密码由它弹框询问（用户名和 Git 密码在平台「我的仓库」页查看和设置）。
 */

const TOKEN_KEY = "hiana.token";
const PROBLEM_KEY = "hiana.problem:";

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
  repositories: GitRepository[];
  getRepository(uri: vscode.Uri): GitRepository | null;
}

let output: vscode.OutputChannel;
let status: vscode.StatusBarItem;
let indexCache: { server: string; at: number; data: OjIndex } | null = null;

function server(): string {
  return normalizeServer(vscode.workspace.getConfiguration("hiana").get<string>("server") || DEFAULT_SERVER);
}

async function client(ctx: vscode.ExtensionContext, quiet = false): Promise<Hiana | null> {
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

async function git(): Promise<GitAPI> {
  const ext = vscode.extensions.getExtension<{ getAPI(v: 1): GitAPI }>("vscode.git");
  if (!ext) throw new Error("没有找到 VSCode 自带的 Git 扩展，请确认它没有被禁用");
  const api = (ext.isActive ? ext.exports : await ext.activate()).getAPI(1);
  return api;
}

function show(err: unknown) {
  const msg = err instanceof ApiError || err instanceof Error ? err.message : String(err);
  void vscode.window.showErrorMessage(msg);
}

async function refreshStatus(ctx: vscode.ExtensionContext) {
  const api = await client(ctx, true);
  void vscode.commands.executeCommand("setContext", "hiana.loggedIn", !!api);
  if (!api) {
    status.text = "$(account) HIANA：未登录";
    status.tooltip = "点击登录海纳协会学习平台";
    status.command = "hiana.login";
    return;
  }
  try {
    const me = await api.me();
    if (!me.role || !me.member) throw new ApiError("登录已失效", 401);
    status.text = `$(account) HIANA：${me.member.name}`;
    status.tooltip = `已登录 ${api.server}\n点击查看操作`;
    status.command = "hiana.menu";
  } catch (e) {
    status.text = "$(warning) HIANA：需要重新登录";
    status.tooltip = e instanceof Error ? e.message : "请重新登录";
    status.command = "hiana.login";
  }
}

async function login(ctx: vscode.ExtensionContext) {
  const cfg = vscode.workspace.getConfiguration("hiana");
  const url = await vscode.window.showInputBox({
    title: "HIANA：登录（第 1 步，共 2 步）",
    prompt: "平台地址。一般不用改，直接按回车。",
    value: cfg.get<string>("server") || DEFAULT_SERVER,
    ignoreFocusOut: true,
  });
  if (url === undefined) return;
  const token = await vscode.window.showInputBox({
    title: "HIANA：登录（第 2 步，共 2 步）",
    prompt: "个人令牌（hnp_ 开头）。在平台「我的 → 我的仓库」页的「VSCode 插件」一节签发。",
    password: true,
    ignoreFocusOut: true,
    validateInput: (v) => (v.trim().startsWith("hnp_") ? null : "令牌以 hnp_ 开头"),
  });
  if (!token) return;
  const api = new Hiana(url, token.trim());
  try {
    const me = await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: "正在验证令牌…" }, () => api.me());
    if (!me.role || !me.member) throw new ApiError("令牌不对或已撤销，请在平台上重新签发", 401);
    if (normalizeServer(url) !== normalizeServer(cfg.get<string>("server") || DEFAULT_SERVER)) await cfg.update("server", normalizeServer(url), vscode.ConfigurationTarget.Global);
    await ctx.secrets.store(TOKEN_KEY, token.trim());
    indexCache = null;
    void vscode.window.showInformationMessage(`已登录：${me.member.name}。`);
  } catch (e) {
    show(e);
  }
  await refreshStatus(ctx);
}

async function logout(ctx: vscode.ExtensionContext) {
  await ctx.secrets.delete(TOKEN_KEY);
  await refreshStatus(ctx);
  void vscode.window.showInformationMessage("已退出登录。令牌本身没有撤销，如果不再使用，请在平台「我的仓库」页撤销。");
}

async function clone(ctx: vscode.ExtensionContext) {
  const api = await client(ctx);
  if (!api) return;
  try {
    const list = await api.repos();
    if (!list.enabled) throw new Error("平台的仓库服务还没有配置，请联系管理员");
    if (!list.repos.length) throw new Error("还没有仓库。先在平台的作业台提交一次作业，平台会自动建好这门课的仓库");
    const pick = await vscode.window.showQuickPick(
      list.repos.map((r) => ({ label: r.name, description: r.private ? "私有" : "公开", detail: r.description, url: r.cloneUrl })),
      { title: "HIANA：克隆我的课程仓库", placeHolder: "选择要克隆的仓库" },
    );
    if (!pick) return;
    void vscode.window.showInformationMessage(`接下来 VSCode 会询问保存位置；如果询问账号密码，用户名填 ${list.owner}，密码填你在平台「我的仓库」页设置的 Git 密码。`);
    await vscode.commands.executeCommand("git.clone", pick.url);
  } catch (e) {
    show(e);
  }
}

async function loadIndex(api: Hiana): Promise<OjIndex> {
  if (indexCache && indexCache.server === api.server && Date.now() - indexCache.at < 10 * 60_000) return indexCache.data;
  const data = await api.index();
  indexCache = { server: api.server, at: Date.now(), data };
  return data;
}

interface Picked {
  api: Hiana;
  repo: GitRepository;
  target: Target;
  problem: ProblemFile;
  /** 要交的文件：仓库里的相对路径 → 题目里的文件名 */
  files: { repoPath: string; name: string }[];
}

/** 当前编辑器里的文件 → 仓库、作业、题目（同一个文件对应多道题时让人选，并记住） */
async function pickProblem(ctx: vscode.ExtensionContext, verb: string): Promise<Picked | null> {
  const api = await client(ctx);
  if (!api) return null;
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.uri.scheme !== "file") {
    void vscode.window.showWarningMessage(`请先打开要${verb}的作业文件，比如 lab01.py。`);
    return null;
  }
  const repo = (await git()).getRepository(editor.document.uri);
  if (!repo) {
    void vscode.window.showWarningMessage("这个文件不在 Git 仓库里。请先用「HIANA：克隆我的课程仓库」把仓库克隆下来，再在里面写作业。");
    return null;
  }
  const remote = repo.state.remotes.find((r) => r.name === "origin") ?? repo.state.remotes[0];
  const repoName = (remote && repoNameFromUrl(remote.fetchUrl ?? remote.pushUrl ?? "")) ?? repo.rootUri.path.split("/").pop()!;
  const relPath = editor.document.uri.path.slice(repo.rootUri.path.length + 1);
  const index = await loadIndex(api);
  const target = findTarget(index, repoName, relPath);
  if (!target) {
    void vscode.window.showWarningMessage(`在平台上找不到 ${repoName}/${relPath} 对应的作业。作业文件要放在克隆下来的目录结构里（比如 lab/lab01/lab01.py）。`);
    return null;
  }
  const all: ProblemFile[] = target.kind === "assignment" ? (await api.assignment(target.course, target.assignment)).problems : [await api.problem(target.problem)];
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
  return { api, repo, target, problem, files: problem.editable.map((name) => ({ repoPath: `${base}/${name}`, name })) };
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

async function run(ctx: vscode.ExtensionContext) {
  try {
    const p = await pickProblem(ctx, "运行");
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

async function submit(ctx: vscode.ExtensionContext) {
  try {
    const p = await pickProblem(ctx, "提交");
    if (!p) return;
    const title = `${p.target.title} · ${p.problem.title}`;
    const r = await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: `提交：${p.problem.title}` }, async (progress) => {
      const files = await readFiles(p);
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
  } catch (e) {
    show(e);
  }
}

async function history(ctx: vscode.ExtensionContext) {
  try {
    const p = await pickProblem(ctx, "查看");
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

async function openWeb(ctx: vscode.ExtensionContext) {
  try {
    const p = await pickProblem(ctx, "打开");
    if (!p) return;
    const path = p.target.kind === "assignment" ? `/courses/${p.target.course}/hw/${p.target.assignment}/${p.problem.id}` : `/oj/p/${p.target.problem}`;
    await vscode.env.openExternal(vscode.Uri.parse(p.api.server + path));
  } catch (e) {
    show(e);
  }
}

export function activate(ctx: vscode.ExtensionContext) {
  output = vscode.window.createOutputChannel("HIANA OJ");
  status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  status.show();
  const cmd = (id: string, f: () => unknown) => ctx.subscriptions.push(vscode.commands.registerCommand(id, f));
  cmd("hiana.login", () => login(ctx));
  cmd("hiana.logout", () => logout(ctx));
  cmd("hiana.clone", () => clone(ctx));
  cmd("hiana.run", () => run(ctx));
  cmd("hiana.submit", () => submit(ctx));
  cmd("hiana.history", () => history(ctx));
  cmd("hiana.openWeb", () => openWeb(ctx));
  cmd("hiana.menu", async () => {
    const items = [
      { label: "$(play) 运行公开测试", id: "hiana.run" },
      { label: "$(cloud-upload) 提交到 OJ", id: "hiana.submit" },
      { label: "$(history) 查看提交记录", id: "hiana.history" },
      { label: "$(repo-clone) 克隆我的课程仓库", id: "hiana.clone" },
      { label: "$(globe) 在平台上打开这道题", id: "hiana.openWeb" },
      { label: "$(sign-out) 退出登录", id: "hiana.logout" },
    ];
    const pick = await vscode.window.showQuickPick(items, { title: "HIANA" });
    if (pick) await vscode.commands.executeCommand(pick.id);
  });
  ctx.subscriptions.push(output, status);
  ctx.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => e.affectsConfiguration("hiana.server") && ((indexCache = null), void refreshStatus(ctx))));
  void refreshStatus(ctx);
}

export function deactivate() {}
