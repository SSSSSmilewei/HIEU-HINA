import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { CaseResult, JudgeRequest, JudgeResult, Verdict } from "../../src/shared/judge";
import type { Problem, UnlockItem } from "../../src/shared/problem";
import { LANGUAGE_SPECS } from "./languages";
import type { RunOutput, Sandbox } from "./sandbox";

/** 题目和它的起始文件（路径 → 内容） */
export interface LoadedProblem {
  problem: Problem;
  files: Record<string, string>;
}

export type Mode = "run" | "submit";

const HARNESS = readFileSync(join(import.meta.dir, "../harness/ok_judge.py"), "utf8");
const HARNESS_NAME = "__hiana_ok_judge.py";
const ENV_HARNESS = readFileSync(join(import.meta.dir, "../harness/env_trace.py"), "utf8");
const ENV_HARNESS_NAME = "__hiana_env_trace.py";
const ENV_PROGRAM = "program.py";
const RESULT_MARK = "@@HIANA_RESULT@@";
/** ok 题整体的 CPU 时间上限：一道题有很多条语句，按题目限制的这么多倍给 */
const OK_TIME_FACTOR = 5;
const COMPILE_MEMORY_MB = 1024;

/** 把学员的文件盖到起始文件上：只认题目标了可改的文件，其余一律用起始文件 */
export function mergeFiles(lp: LoadedProblem, submitted: Record<string, string>): Record<string, string> {
  const files = { ...lp.files };
  for (const path of lp.problem.editable) if (typeof submitted[path] === "string") files[path] = submitted[path];
  return files;
}

/** 比较输出：忽略每行行尾空白和末尾空行；unordered 时行的顺序无关 */
export function sameOutput(actual: string, expected: string, compare: "exact" | "unordered"): boolean {
  const norm = (s: string) => {
    const lines = s.replace(/\r\n/g, "\n").split("\n").map((l) => l.trimEnd());
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    return compare === "unordered" ? lines.sort() : lines;
  };
  const a = norm(actual);
  const b = norm(expected);
  return a.length === b.length && a.every((l, i) => l === b[i]);
}

function runVerdict(out: RunOutput): Verdict | null {
  switch (out.status) {
    case "ok":
      return null;
    case "tle":
      return "TLE";
    case "mle":
      return "MLE";
    case "ole":
      return "OLE";
    case "exit":
    case "signal":
      return "RE";
    default:
      return "SE";
  }
}

function summarize(cases: CaseResult[], total: number, extra: Partial<JudgeResult> = {}): JudgeResult {
  const firstBad = cases.find((c) => c.verdict !== "AC");
  return {
    verdict: firstBad?.verdict ?? (cases.length === total ? "AC" : "WA"),
    passed: cases.filter((c) => c.verdict === "AC").length,
    total,
    timeMs: Math.max(0, ...cases.map((c) => c.timeMs)),
    memoryKb: Math.max(0, ...cases.map((c) => c.memoryKb)),
    cases,
    ...extra,
  };
}

const systemError = (message: string): JudgeResult => ({ verdict: "SE", passed: 0, total: 0, timeMs: 0, memoryKb: 0, cases: [], message });

/** ok 配置（*.ok）：name 是加密用的作业名，src 是源文件列表 */
function okConfig(files: Record<string, string>): { key: string; src: string[] } | null {
  const path = Object.keys(files).find((p) => p.endsWith(".ok") && !p.includes("/"));
  if (!path) return null;
  try {
    const cfg = JSON.parse(files[path]!) as { name?: string; src?: string[] };
    return cfg.name && cfg.src ? { key: cfg.name, src: cfg.src } : null;
  } catch {
    return null;
  }
}

interface HarnessCase {
  ok: boolean;
  code: string;
  got: string;
  want: string;
  error: string | null;
}
interface HarnessResult {
  total: number;
  passed: number;
  cases: HarnessCase[];
  fatal: string | null;
}

async function judgeOk(sb: Sandbox, lp: LoadedProblem, files: Record<string, string>, question: string): Promise<JudgeResult> {
  const cfg = okConfig(files);
  if (!cfg) return systemError("题目缺少 ok 配置文件（*.ok）");
  const nonce = crypto.randomUUID();
  const out = await sb.run({
    args: ["/usr/bin/python3", HARNESS_NAME, question, cfg.key, ...cfg.src],
    files: { ...files, [HARNESS_NAME]: HARNESS },
    env: [`HIANA_NONCE=${nonce}`],
    cpuMs: lp.problem.timeMs * OK_TIME_FACTOR,
    memoryMb: lp.problem.memoryMb,
  });
  const mark = RESULT_MARK + nonce;
  const line = out.stdout.split("\n").find((l) => l.startsWith(mark));
  const bad = runVerdict(out);
  if (!line) {
    // 没有结果行：超时、内存超限，或者学员代码让进程直接退出了
    const verdict = bad && bad !== "SE" ? bad : out.status === "error" ? "SE" : "RE";
    return { verdict, passed: 0, total: 0, timeMs: out.timeMs, memoryKb: out.memoryKb, cases: [], message: out.error ?? (out.stderr.slice(-4000) || "程序没有正常结束"), stdout: out.stdout.slice(0, 4000) };
  }
  let r: HarnessResult;
  try {
    r = JSON.parse(line.slice(mark.length)) as HarnessResult;
  } catch {
    return systemError("判题结果太长，被截断了。请把这道题和你的代码告诉管理员");
  }
  if (!r.fatal && r.total === 0) return systemError(`题目 ${question} 里没有找到可以运行的用例`);
  const printed = out.stdout.slice(0, out.stdout.indexOf(mark)).trim();
  if (r.fatal) {
    const verdict: Verdict = /SyntaxError|IndentationError/.test(r.fatal) ? "CE" : "RE";
    return { verdict, passed: 0, total: r.total, timeMs: out.timeMs, memoryKb: out.memoryKb, cases: [], message: r.fatal, stdout: printed || undefined };
  }
  const cases: CaseResult[] = r.cases.map((c, i) => ({
    index: i + 1,
    verdict: c.ok ? "AC" : c.error ? "RE" : "WA",
    timeMs: 0,
    memoryKb: 0,
    hidden: false,
    input: c.code,
    expected: c.want,
    actual: c.got,
    message: c.error ?? undefined,
  }));
  const res = summarize(cases, r.total, { stdout: printed || undefined });
  res.timeMs = out.timeMs;
  res.memoryKb = out.memoryKb;
  return res;
}

async function judgeIo(sb: Sandbox, lp: LoadedProblem, files: Record<string, string>, req: JudgeRequest, mode: Mode): Promise<JudgeResult> {
  const { problem } = lp;
  if (problem.tests.kind !== "io") return systemError("题目不是输入输出题");
  const spec = LANGUAGE_SPECS[req.language];
  if (!spec) return systemError(`暂不支持 ${req.language}`);
  const main = problem.editable.find((p) => p.endsWith(spec.main.slice(spec.main.lastIndexOf(".")))) ?? spec.main;
  const runFiles: Record<string, string | { cached: string }> = { ...files };
  const toRelease: string[] = [];
  try {
    if (spec.compile) {
      const c = spec.compile(main);
      const out = await sb.run({ args: c.args, files, cpuMs: spec.compileMs ?? problem.timeMs, memoryMb: COMPILE_MEMORY_MB, keep: [c.output] });
      const id = out.cached[c.output];
      if (out.status !== "ok" || !id) {
        if (out.status === "error") return systemError(out.error ?? "编译时沙箱出错");
        return { verdict: "CE", passed: 0, total: 0, timeMs: 0, memoryKb: 0, cases: [], message: (out.stderr || out.stdout).slice(0, 8000) };
      }
      toRelease.push(id);
      runFiles[c.output] = { cached: id };
    }
    const memoryMb = problem.memoryMb + (spec.extraMemoryMb ?? 0);
    const args = spec.run(main, problem.memoryMb);
    // 「运行」且自带输入：只跑这一次，不判对错
    if (mode === "run" && req.stdin !== undefined) {
      const out = await sb.run({ args, files: runFiles, stdin: req.stdin, cpuMs: problem.timeMs, memoryMb });
      const bad = runVerdict(out);
      return { verdict: bad ?? "AC", passed: 0, total: 0, timeMs: out.timeMs, memoryKb: out.memoryKb, cases: [], stdout: out.stdout, stderr: out.stderr, message: out.error };
    }
    const all = problem.tests.cases;
    const picked = mode === "run" ? all.filter((c) => !c.hidden) : all;
    const cases: CaseResult[] = [];
    for (const [i, c] of picked.entries()) {
      const out = await sb.run({ args, files: runFiles, stdin: c.input, cpuMs: problem.timeMs, memoryMb });
      const bad = runVerdict(out);
      const verdict: Verdict = bad ?? (sameOutput(out.stdout, c.output, problem.tests.compare) ? "AC" : "WA");
      cases.push({
        index: i + 1,
        verdict,
        timeMs: out.timeMs,
        memoryKb: out.memoryKb,
        hidden: c.hidden,
        ...(c.hidden ? {} : { input: c.input.slice(0, 4000), expected: c.output.slice(0, 4000), actual: out.stdout.slice(0, 4000) }),
        message: verdict === "RE" ? out.stderr.slice(-4000) : verdict === "SE" ? out.error : undefined,
      });
      if (verdict !== "AC") break;
    }
    return summarize(cases, picked.length);
  } finally {
    if (toRelease.length) await sb.release(toRelease);
  }
}

/** ok 的加密：hmac(md5, key=作业名, msg=文字) */
export function okLock(key: string, text: string): string {
  return createHmac("md5", key).update(text).digest("hex");
}

/**
 * 预测输出题：学员按顺序填每个空，和官方加密的答案比对。不运行代码。
 * 每个空是一个用例；看不到正确答案（是加密的），只告诉对错。
 */
export function judgeWwpd(lp: LoadedProblem, files: Record<string, string>, answers: readonly string[]): JudgeResult {
  const cfg = okConfig(files);
  const items: UnlockItem[] = lp.problem.unlock ?? [];
  if (!cfg || !items.length) return systemError("题目缺少预测输出的内容");
  const cases: CaseResult[] = [];
  const push = (ok: boolean, input: string, actual: string) =>
    cases.push({ index: cases.length + 1, verdict: ok ? "AC" : "WA", timeMs: 0, memoryKb: 0, hidden: false, input, actual, expected: ok ? actual : "（答案是加密的，再想一想）" });
  for (const it of items) {
    if (it.type === "choice") {
      // ok 客户端给选择题算哈希前先把空白归一（client/utils/format.py 的 normalize）
      const a = (answers[cases.length] ?? "").trim();
      push(!!a && okLock(cfg.key, a.split(/\s+/).join(" ")) === it.answer, it.question, a);
      continue;
    }
    for (const step of it.steps)
      for (const w of step.want) {
        if (!w.hash) continue;
        const a = (answers[cases.length] ?? "").trim();
        push(!!a && okLock(cfg.key, a) === w.hash, step.code, a);
      }
  }
  return summarize(cases, cases.length);
}

/** 环境图里的一帧（判题服务跑出来的，或学员填的） */
export interface EnvFrame {
  name: string;
  parent: string | null;
  bindings: Record<string, string>;
  ret: string | null;
}

/** 值的比较口径：去掉多余空白；字符串引号可写可不写；函数只比名字（func f(x) [parent=Global] 写成 func f 也算对，lambda 写 λ 或 lambda 都行） */
export function normalizeEnvValue(v: string | null | undefined): string {
  let t = (v ?? "").trim().replace(/\s+/g, " ");
  const fn = /^func\s+([^\s(\[]+)/i.exec(t);
  if (fn) return `func ${fn[1] === "lambda" ? "λ" : fn[1]}`;
  if (/^(['"]).*\1$/.test(t)) t = t.slice(1, -1);
  return t;
}
const normalizeFrameName = (n: string | null | undefined) => {
  const t = (n ?? "").trim();
  return t === "lambda" ? "λ" : t;
};
const normalizeParent = (p: string | null | undefined) => {
  const t = (p ?? "").trim();
  return /^global$/i.test(t) ? "Global" : t.toLowerCase();
};

/** 学员填的一帧（answers 里的一项是一帧的 JSON）；格式不对的当作空帧 */
export function parseEnvAnswer(raw: string | undefined): EnvFrame {
  try {
    const o = JSON.parse(raw ?? "") as Partial<EnvFrame> & { bindings?: unknown };
    const bindings: Record<string, string> = {};
    if (Array.isArray(o.bindings)) for (const b of o.bindings) if (Array.isArray(b) && typeof b[0] === "string" && b[0].trim()) bindings[b[0].trim()] = String(b[1] ?? "");
    if (o.bindings && !Array.isArray(o.bindings) && typeof o.bindings === "object") for (const [k, v] of Object.entries(o.bindings)) if (k.trim()) bindings[k.trim()] = String(v ?? "");
    return { name: String(o.name ?? ""), parent: o.parent == null ? null : String(o.parent), bindings, ret: o.ret == null || o.ret === "" ? null : String(o.ret) };
  } catch {
    return { name: "", parent: null, bindings: {}, ret: null };
  }
}

/** 一帧对不对；不对时说哪里不对，不给出正确答案（和预测输出题一样） */
export function compareEnvFrame(truth: EnvFrame, mine: EnvFrame, isGlobal: boolean): string[] {
  const wrong: string[] = [];
  if (!isGlobal) {
    if (normalizeFrameName(mine.name) !== normalizeFrameName(truth.name)) wrong.push("帧名（被调用的函数）不对");
    if (normalizeParent(mine.parent) !== normalizeParent(truth.parent)) wrong.push("父帧不对");
  }
  const names = new Set([...Object.keys(truth.bindings), ...Object.keys(mine.bindings)]);
  for (const n of [...names].sort()) {
    if (!(n in mine.bindings)) wrong.push(`少了名字 ${n}`);
    else if (!(n in truth.bindings)) wrong.push(`这一帧里没有名字 ${n}`);
    else if (normalizeEnvValue(mine.bindings[n]) !== normalizeEnvValue(truth.bindings[n])) wrong.push(`${n} 绑定的值不对`);
  }
  if (!isGlobal && normalizeEnvValue(mine.ret) !== normalizeEnvValue(truth.ret)) wrong.push("返回值不对");
  return wrong;
}

async function judgeEnv(sb: Sandbox, lp: LoadedProblem, answers: readonly string[]): Promise<JudgeResult> {
  const t = lp.problem.tests;
  if (t.kind !== "envdiagram") return systemError("题目缺少环境图的程序");
  const nonce = crypto.randomUUID();
  const out = await sb.run({
    args: ["/usr/bin/python3", ENV_HARNESS_NAME, ENV_PROGRAM],
    files: { [ENV_PROGRAM]: t.code, [ENV_HARNESS_NAME]: ENV_HARNESS },
    env: [`HIANA_NONCE=${nonce}`],
    cpuMs: lp.problem.timeMs * OK_TIME_FACTOR,
    memoryMb: lp.problem.memoryMb,
  });
  const mark = RESULT_MARK + nonce;
  const line = out.stdout.split("\n").find((l) => l.startsWith(mark));
  if (!line) return systemError(`环境图的程序没有跑完：${out.error ?? out.stderr.slice(-2000)}`);
  const truth = (JSON.parse(line.slice(mark.length)) as { frames: EnvFrame[] }).frames;
  const cases: CaseResult[] = truth.map((f, i) => {
    const label = i === 0 ? "全局帧 Global" : `f${i}: ${f.name}`;
    const wrong = i < answers.length ? compareEnvFrame(f, parseEnvAnswer(answers[i]), i === 0) : ["这一帧还没有画"];
    return { index: i + 1, verdict: wrong.length ? "WA" : "AC", timeMs: 0, memoryKb: 0, hidden: false, input: i === 0 ? label : `第 ${i} 个函数帧（f${i}）`, actual: wrong.length ? wrong.join("；") : "对", expected: wrong.length ? "（看不到标准答案，按提示再想一想）" : "对" };
  });
  if (answers.length > truth.length) {
    cases.push({ index: cases.length + 1, verdict: "WA", timeMs: 0, memoryKb: 0, hidden: false, input: "多出来的帧", actual: `多画了 ${answers.length - truth.length} 个帧`, expected: `一共 ${truth.length - 1} 个函数帧` });
  }
  return summarize(cases, cases.length);
}

export async function judge(sb: Sandbox, lp: LoadedProblem, req: JudgeRequest, mode: Mode): Promise<JudgeResult> {
  if (!lp.problem.languages.includes(req.language)) return systemError(`这道题不能用 ${req.language}`);
  const files = mergeFiles(lp, req.files);
  if (lp.problem.kind === "wwpd") return judgeWwpd(lp, files, req.answers ?? []);
  if (lp.problem.kind === "envdiagram") return judgeEnv(sb, lp, req.answers ?? []);
  const t = lp.problem.tests;
  if (t.kind === "envdiagram") return systemError("环境图的 tests 只能用在环境图题上");
  return t.kind === "ok" ? judgeOk(sb, lp, files, t.question) : judgeIo(sb, lp, files, req, mode);
}
