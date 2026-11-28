import type { Assignment, Language, Problem } from "../../shared/problem";

/** 网页拿到的题目（scripts/oj.mjs 生成的公开版本）：隐藏用例只留个数 */
export type PublicTests = Problem["tests"] & { hiddenCount?: number };
export type PublicProblem = Omit<Problem, "tests"> & { tests: PublicTests };
export interface SourceFile {
  path: string;
  content: string;
  /** 太大的只读数据文件：公开版本里只有开头几行 */
  omitted?: boolean;
}
export type PublicAssignment = Omit<Assignment, "problems"> & { problems: PublicProblem[]; files: SourceFile[] };
export type PublicStandalone = PublicProblem & { files: SourceFile[] };

/** 做题界面打开的是什么：课程作业里的一份作业，或者刷题区的一道题 */
export type WorkspaceSource =
  | { kind: "assignment"; course: string; assignment: PublicAssignment }
  | { kind: "problem"; problem: PublicStandalone };

export interface SubmissionBrief {
  id: string;
  problem: string;
  language: Language;
  verdict: string;
  passed: number;
  total: number;
  timeMs: number;
  memoryKb: number;
  createdAt: number;
}

/** 文件扩展名 → Monaco 的语言名 */
export function monacoLanguage(path: string): string {
  const ext = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
  const map: Record<string, string> = { py: "python", c: "c", h: "c", cpp: "cpp", cc: "cpp", hpp: "cpp", java: "java", sql: "sql", scm: "scheme", md: "markdown", ok: "json", json: "json" };
  return map[ext] ?? "plaintext";
}

/** 输入输出题：每种语言对应题目里的哪个文件 */
const EXT: Record<Language, string> = { python: ".py", c: ".c", cpp: ".cpp", java: ".java", sql: ".sql", scheme: ".scm" };
export function fileForLanguage(p: PublicProblem, lang: Language): string {
  return p.editable.find((f) => f.endsWith(EXT[lang])) ?? p.editable[0]!;
}
