import { z } from "zod/v4";

/**
 * OJ 题目与作业包格式（PRD：docs/prd/hiana-oj.md，故事 1.1）。
 *
 * - hiana-problem@1：一道题。课程作业里的题和独立刷题区的题用同一种格式。
 * - hiana-assignment@1：一份课程作业（如 CS61A lab01），带起始代码文件树和若干道题。
 *
 * 源文件放在 content/oj/：
 *   assignments/<course>/<id>/assignment.json + files/（起始代码，原样）
 *   problems/<id>/problem.json + files/（刷题题目）
 * 不含参考解：对错由测试判，思路和质量由 AI 判（PRD 决定 9）。
 */

export const PROBLEM_FORMAT = "hiana-problem@1";
export const ASSIGNMENT_FORMAT = "hiana-assignment@1";

/** 题型。function：写一个函数；io：读输入写输出；project：多文件项目的一步；wwpd：预测输出；
 *  envdiagram：环境图；scheme / sql：用这两种语言写；writetests：写测试抓 bug；fixbug：改错 */
export const PROBLEM_KINDS = ["function", "io", "project", "wwpd", "envdiagram", "scheme", "sql", "writetests", "fixbug"] as const;
export type ProblemKind = (typeof PROBLEM_KINDS)[number];

export const LANGUAGES = ["python", "c", "cpp", "java", "sql", "scheme"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABEL: Record<Language, string> = {
  python: "Python 3",
  c: "C (gcc, C17)",
  cpp: "C++ (g++, C++17)",
  java: "Java 17",
  sql: "SQLite",
  scheme: "Scheme",
};

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;

/** 判题默认限制 */
export const DEFAULT_TIME_MS = 2000;
export const DEFAULT_MEMORY_MB = 256;
const MAX_TIME_MS = 20_000;
const MAX_MEMORY_MB = 1024;
const MAX_HINTS = 3;

const id = z.string().regex(/^[a-z0-9][a-z0-9_-]{0,47}$/, "只能用小写字母、数字、下划线和连字符，1–48 个字符");
const relPath = z
  .string()
  .min(1)
  .max(200)
  .refine((p) => !p.startsWith("/") && !p.split("/").includes(".."), "要写相对路径，不能含 ..");

const Knowledge = z.object({
  label: z.string().min(1).max(40),
  /** 站内链接：课程条目或讲义段落，如 /courses/cs61a/lecture-03#高阶函数 */
  href: z.string().regex(/^\/\S*$/, "要写站内路径").optional(),
});

/**
 * 官方 ok 测试：question 是 ok 的问题名（源文件里的函数名，类里的方法写成 Card.power，或 tests/<名>.py）。
 * 一道题对应几个 ok 问题时用空格隔开，用例按顺序合在一起判。
 */
const OkTests = z.object({ kind: z.literal("ok"), question: z.string().regex(/^[\w.-]+( [\w.-]+)*$/).max(200) });
/** 输入输出用例：hidden 的用例只在「提交」时跑，结果只显示序号 */
const IoCase = z.object({ input: z.string().max(1_000_000), output: z.string().max(1_000_000), hidden: z.boolean().default(false) });
const IoTests = z.object({
  kind: z.literal("io"),
  cases: z.array(IoCase).min(1).max(200),
  /** exact：逐字节（忽略行尾空白和末尾空行）；unordered：行的顺序无关（SQL 常用） */
  compare: z.enum(["exact", "unordered"]).default("exact"),
});
/**
 * 环境图：判题服务在沙箱里实际运行 code，记下程序结束时的全部帧（帧名、父帧、绑定、返回值），
 * 和学员填的逐帧比对。每一帧一个用例，全局帧是第 1 个。
 */
const EnvTests = z.object({ kind: z.literal("envdiagram"), code: z.string().min(1).max(20_000) });
export const TestSpec = z.discriminatedUnion("kind", [OkTests, IoTests, EnvTests]);

/**
 * 预测输出题（wwpd）要学员填的东西，取自官方 ok 测试里加密的用例（ok 的「解锁」）。
 * session：一段交互式会话，每条语句后面是期望显示的若干行，text 是明文（直接给学员看），hash 是加密的（要学员填）；
 * choice：选择题，answer 是正确选项文字加密后的值。加密方式见 judge/harness/ok_judge.py。
 */
const UnlockLine = z.object({ text: z.string().optional(), hash: z.string().regex(/^[0-9a-f]{32}$/).optional() });
const UnlockItem = z.discriminatedUnion("type", [
  z.object({ type: z.literal("session"), steps: z.array(z.object({ code: z.string().max(4000), want: z.array(UnlockLine).max(50) })).min(1).max(60) }),
  z.object({ type: z.literal("choice"), question: z.string().max(4000), choices: z.array(z.string().max(4000)).min(2).max(10), answer: z.string().regex(/^[0-9a-f]{32}$/) }),
]);
export type UnlockItem = z.infer<typeof UnlockItem>;
/** 一道预测输出题里学员要填的空一共有几个（每个加密行一个，每道选择题一个） */
export function unlockBlanks(items: readonly UnlockItem[]): number {
  return items.reduce((n, it) => n + (it.type === "choice" ? 1 : it.steps.reduce((m, s) => m + s.want.filter((w) => w.hash).length, 0)), 0);
}

const ProblemBase = z.object({
  format: z.literal(PROBLEM_FORMAT).default(PROBLEM_FORMAT),
  id,
  title: z.string().min(1).max(80),
  titleEn: z.string().max(80).optional(),
  kind: z.enum(PROBLEM_KINDS),
  /** 允许的语言，第一个是默认 */
  languages: z.array(z.enum(LANGUAGES)).min(1),
  difficulty: z.enum(DIFFICULTIES).optional(),
  /** 中文题面（Markdown） */
  statement: z.string().min(1).max(60_000),
  statementEn: z.string().max(60_000).optional(),
  /** 学员能改的文件（相对作业或题目的 files/），其余文件只读 */
  editable: z.array(relPath).max(20),
  /** 打开题目时编辑器定位到的文件和函数 */
  focus: z.object({ file: relPath, symbol: z.string().max(60).optional() }).optional(),
  tests: TestSpec,
  timeMs: z.number().int().min(100).max(MAX_TIME_MS).default(DEFAULT_TIME_MS),
  memoryMb: z.number().int().min(16).max(MAX_MEMORY_MB).default(DEFAULT_MEMORY_MB),
  knowledge: z.array(Knowledge).max(10).default([]),
  /** 预测输出题要学员填的内容（kind 为 wwpd 时必填） */
  unlock: z.array(UnlockItem).max(40).optional(),
  /** 三级提示：方向 → 关键一步 → 伪代码 */
  hints: z.array(z.string().min(1).max(2000)).max(MAX_HINTS).default([]),
  /** 通过后才能看的讲解 */
  explain: z.string().max(20_000).optional(),
  tags: z.array(z.string().min(1).max(20)).max(10).default([]),
});

export const Problem = ProblemBase.refine((p) => p.kind !== "wwpd" || (p.unlock?.length ?? 0) > 0, { message: "预测输出题（wwpd）要有 unlock", path: ["unlock"] }).refine((p) => p.kind === "envdiagram" || p.editable.length > 0, { message: "要写明哪些文件可以改（环境图题除外）", path: ["editable"] }).refine(
  (p) => (p.kind === "envdiagram") === (p.tests.kind === "envdiagram"),
  { message: "环境图题（envdiagram）的 tests 要写成 { kind: \"envdiagram\", code }，反过来也一样", path: ["tests"] },
);

export const Assignment = z
  .object({
    format: z.literal(ASSIGNMENT_FORMAT),
    course: id,
    id,
    title: z.string().min(1).max(80),
    /** 学期，如 sp26 */
    semester: z.string().regex(/^(sp|su|fa)\d{2}$/, "写成 sp26 这样"),
    /** 官方原文地址 */
    source: z.string().url().optional(),
    license: z.string().min(1).max(400),
    /** 题面的语言：zh 是中文（翻译过），en 是英文原文。同一个课程条目有几个版本时，用来标出哪个是中文版 */
    language: z.enum(["zh", "en"]).optional(),
    /** 对应的课程条目 id（课程包里的 item） */
    item: z.string().max(80).optional(),
    /** 进学员仓库的目录，如 lab/lab01 */
    repoDir: relPath,
    /** 中文总说明（Markdown），题目之前显示 */
    intro: z.string().max(60_000).default(""),
    problems: z.array(Problem).min(1).max(60),
  })
  .superRefine((a, ctx) => {
    const seen = new Set<string>();
    a.problems.forEach((p, i) => {
      if (seen.has(p.id)) ctx.addIssue({ code: "custom", path: ["problems", i, "id"], message: `题目编号重复：${p.id}` });
      seen.add(p.id);
    });
  });

export type Problem = z.infer<typeof Problem>;
export type ProblemInput = z.input<typeof Problem>;
export type Assignment = z.infer<typeof Assignment>;
export type TestSpec = z.infer<typeof TestSpec>;

type Parsed<T> = { ok: true; value: T } | { ok: false; errors: string[] };

function issues(error: z.ZodError, what: string): string[] {
  return error.issues.slice(0, 20).map((i) => `${i.path.join(".") || what}：${i.message}`);
}

/**
 * 校验一道题。files 是题目 files/ 目录下实际存在的文件（相对路径）；给了就检查 editable 和 focus 都指向存在的文件。
 */
export function parseProblem(raw: unknown, files?: readonly string[]): Parsed<Problem> {
  const r = Problem.safeParse(raw);
  if (!r.success) return { ok: false, errors: issues(r.error, "题目") };
  const errors = files ? missingFiles(r.data, files, "") : [];
  return errors.length ? { ok: false, errors } : { ok: true, value: r.data };
}

export function parseAssignment(raw: unknown, files?: readonly string[]): Parsed<Assignment> {
  const r = Assignment.safeParse(raw);
  if (!r.success) return { ok: false, errors: issues(r.error, "作业") };
  const errors = files ? r.data.problems.flatMap((p, i) => missingFiles(p, files, `problems.${i}.`)) : [];
  return errors.length ? { ok: false, errors } : { ok: true, value: r.data };
}

function missingFiles(p: Problem, files: readonly string[], prefix: string): string[] {
  const have = new Set(files);
  const errors = p.editable.filter((f) => !have.has(f)).map((f) => `${prefix}editable：起始文件里没有 ${f}`);
  if (p.focus && !have.has(p.focus.file)) errors.push(`${prefix}focus.file：起始文件里没有 ${p.focus.file}`);
  return errors;
}

export function problemJsonSchema() {
  return { $id: "https://study.shanmoew-denied.win/schema/problem-v1.json", title: "hiana-problem@1 题目", ...z.toJSONSchema(Problem, { io: "input" }) };
}

export function assignmentJsonSchema() {
  return { $id: "https://study.shanmoew-denied.win/schema/assignment-v1.json", title: "hiana-assignment@1 作业包", ...z.toJSONSchema(Assignment, { io: "input" }) };
}
