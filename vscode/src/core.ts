/**
 * 插件里和 VSCode 无关的部分：平台接口、按文件路径找到题目、把判题结果排成文字。
 * 单独放一个文件，测试（tests/vscode-core.test.ts）不用装 VSCode 就能跑。
 */

export const DEFAULT_SERVER = "https://study.shanmoew-denied.win";
export const PRACTICE_REPO = "oj-practice";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

type FetchLike = (input: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) => Promise<{ ok: boolean; status: number; text(): Promise<string> }>;

/** 平台接口：所有请求都带个人令牌 */
export class Hiana {
  readonly server: string;
  constructor(
    server: string,
    private token: string,
    private fetchImpl: FetchLike = fetch as unknown as FetchLike,
  ) {
    this.server = normalizeServer(server);
  }

  async request<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
    let res: Awaited<ReturnType<FetchLike>>;
    try {
      res = await this.fetchImpl(this.server + path, {
        method,
        headers: { authorization: `Bearer ${this.token}`, accept: "application/json", ...(body === undefined ? {} : { "content-type": "application/json" }) },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new ApiError(`连不上平台（${this.server}），请检查网络和平台地址设置`, 0);
    }
    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new ApiError(`平台返回的不是预期的数据（HTTP ${res.status}），请检查平台地址设置`, res.status);
    }
    if (!res.ok) {
      const msg = (data as { error?: string } | null)?.error;
      if (res.status === 401) throw new ApiError("登录已失效：令牌不对、已撤销，或者改过密码。请在平台「我的仓库」页重新签发令牌，然后运行「HIANA：登录」", 401);
      throw new ApiError(msg ?? `请求失败（HTTP ${res.status}）`, res.status);
    }
    return data as T;
  }

  me() {
    return this.request<{ role: string | null; member?: { name: string; studentNo: string; username: string | null; kind: string } }>("GET", "/api/auth/me");
  }
  repos() {
    return this.request<{ enabled: boolean; owner: string | null; repos: { name: string; description: string; private: boolean; cloneUrl: string }[] }>("GET", "/api/git/repos");
  }
  index() {
    return this.request<OjIndex>("GET", "/oj/index.json");
  }
  assignment(course: string, id: string) {
    return this.request<AssignmentFile>("GET", `/oj/assignments/${encodeURIComponent(course)}/${encodeURIComponent(id)}.json`);
  }
  problem(id: string) {
    return this.request<ProblemFile>("GET", `/oj/problems/${encodeURIComponent(id)}.json`);
  }
  judge(mode: "run" | "submit", body: JudgeBody) {
    return this.request<{ result: JudgeResult; id?: string; firstSolve?: boolean; repo?: string }>("POST", `/api/oj/${mode}`, body);
  }
  submissions(problem: string) {
    return this.request<{ submissions: SubmissionBrief[] }>("GET", `/api/oj/submissions?problem=${encodeURIComponent(problem)}`);
  }
  submission(id: string) {
    return this.request<{ submission: SubmissionBrief & { files: Record<string, string>; result: JudgeResult } }>("GET", `/api/oj/submissions/${encodeURIComponent(id)}`);
  }
}

export function normalizeServer(s: string): string {
  const t = s.trim().replace(/\/+$/, "");
  return /^https?:\/\//.test(t) ? t : `https://${t}`;
}

export interface OjIndex {
  assignments: { course: string; id: string; title: string; repoDir?: string; problems: { id: string; title: string; kind: string }[] }[];
  problems: { id: string; title: string; languages: string[] }[];
}
export interface ProblemFile {
  id: string;
  title: string;
  kind: string;
  languages: string[];
  editable: string[];
}
export interface AssignmentFile {
  course: string;
  id: string;
  title: string;
  repoDir: string;
  problems: ProblemFile[];
}
export interface JudgeBody {
  problem: string;
  language: string;
  files: Record<string, string>;
}
export interface CaseResult {
  index: number;
  verdict: string;
  timeMs: number;
  memoryKb: number;
  hidden: boolean;
  input?: string;
  expected?: string;
  actual?: string;
  message?: string;
}
export interface JudgeResult {
  verdict: string;
  passed: number;
  total: number;
  timeMs: number;
  memoryKb: number;
  cases: CaseResult[];
  message?: string;
  stdout?: string;
  stderr?: string;
}
export interface SubmissionBrief {
  id: string;
  verdict: string;
  passed: number;
  total: number;
  createdAt: number;
}

/** 本地仓库里的一个文件对应到平台的哪份作业（或刷题区的哪道题） */
export type Target =
  | { kind: "assignment"; course: string; assignment: string; title: string; repoDir: string; file: string }
  | { kind: "practice"; problem: string; title: string; file: string };

/**
 * repo：本地仓库对应的平台仓库名（课程名，比如 cs61a；刷题是 oj-practice）。
 * relPath：文件在仓库里的路径，用 / 分隔。
 */
export function findTarget(index: OjIndex, repo: string, relPath: string): Target | null {
  const path = relPath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (repo === PRACTICE_REPO) {
    const [id, ...rest] = path.split("/");
    const p = index.problems.find((x) => x.id === id);
    return p && rest.length ? { kind: "practice", problem: p.id, title: p.title, file: rest.join("/") } : null;
  }
  // 目录最长的优先（防止 proj/ants 和 proj/ants2 这类前缀相同的目录认错）
  const candidates = index.assignments.filter((a) => a.course === repo && a.repoDir && path.startsWith(`${a.repoDir}/`)).sort((a, b) => b.repoDir!.length - a.repoDir!.length);
  const a = candidates[0];
  if (!a) return null;
  return { kind: "assignment", course: a.course, assignment: a.id, title: a.title, repoDir: a.repoDir!, file: path.slice(a.repoDir!.length + 1) };
}

/** 插件里能交的题：要交代码文件的。预测输出、环境图要逐空作答，只能在网页里做 */
export function codeProblems(problems: ProblemFile[], file: string): ProblemFile[] {
  return problems.filter((p) => p.kind !== "wwpd" && p.kind !== "envdiagram" && p.editable.includes(file));
}

export function judgeId(t: Target, problemId: string): string {
  return t.kind === "assignment" ? `${t.course}/${t.assignment}/${problemId}` : t.problem;
}

const EXT_LANG: Record<string, string> = { py: "python", c: "c", cpp: "cpp", cc: "cpp", java: "java", sql: "sql", scm: "scheme" };

/** 按正在编辑的文件选语言，选不出就用题目的第一种语言 */
export function languageFor(p: ProblemFile, file: string): string {
  const lang = EXT_LANG[file.slice(file.lastIndexOf(".") + 1).toLowerCase()];
  return lang && p.languages.includes(lang) ? lang : p.languages[0]!;
}

export const VERDICT_TEXT: Record<string, string> = {
  AC: "通过",
  WA: "答案错误",
  TLE: "超出时间限制",
  MLE: "超出内存限制",
  OLE: "输出超出限制",
  RE: "运行错误",
  CE: "编译错误",
  SE: "判题系统错误",
};

function indent(s: string, prefix = "    "): string {
  return s
    .replace(/\s+$/, "")
    .split("\n")
    .map((l) => prefix + l)
    .join("\n");
}

/** 判题结果排成输出面板里的文字，格式和平台做题界面一致：先总结果，再逐个用例 */
export function formatResult(mode: "run" | "submit", title: string, r: JudgeResult, at = new Date()): string {
  const head = `${mode === "run" ? "运行" : "提交"} · ${title} · ${at.toLocaleString("zh-CN", { hour12: false })}`;
  const lines = [head, "─".repeat(Math.min(60, head.length * 2)), `${r.verdict}  ${VERDICT_TEXT[r.verdict] ?? r.verdict}    通过 ${r.passed} / ${r.total}    最长用时 ${r.timeMs} ms    最大内存 ${Math.round(r.memoryKb / 1024)} MB`];
  if (r.message) lines.push("", indent(r.message));
  for (const c of r.cases) {
    const mark = c.verdict === "AC" ? "✓" : "✗";
    lines.push(`${mark} 用例 ${c.index}  ${c.verdict}  ${c.timeMs} ms${c.hidden ? "  （隐藏用例）" : ""}`);
    if (c.verdict === "AC" || c.hidden) continue;
    if (c.input !== undefined) lines.push("  输入：", indent(c.input));
    if (c.expected !== undefined) lines.push("  期望：", indent(c.expected));
    if (c.actual !== undefined) lines.push("  实际：", indent(c.actual));
    if (c.message) lines.push("  报错：", indent(c.message));
  }
  if (r.stdout) lines.push("", "标准输出：", indent(r.stdout));
  if (r.stderr) lines.push("", "标准错误：", indent(r.stderr));
  return lines.join("\n");
}

/** 仓库地址（…/<owner>/<repo>.git）里的仓库名 */
export function repoNameFromUrl(url: string): string | null {
  const m = /\/([^/]+?)(?:\.git)?\/?$/.exec(url.trim());
  return m ? m[1]! : null;
}
