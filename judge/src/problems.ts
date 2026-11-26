// @ts-expect-error 构建脚本是 .mjs，没有类型声明
import { loadOj } from "../../scripts/oj.mjs";
import type { Assignment, Problem } from "../../src/shared/problem";
import type { LoadedProblem } from "./judge";

type FileList = { path: string; content: string }[];

/**
 * 读 content/oj/ 下的全部题目（含隐藏用例），按编号建索引：
 * 课程作业的题是 <course>/<assignment>/<problem>，刷题区的题是 <problem>。
 */
export function loadProblems(root: string): Map<string, LoadedProblem> {
  const { assignments, problems } = loadOj(root) as {
    assignments: (Assignment & { files: FileList })[];
    problems: (Problem & { files: FileList })[];
  };
  const map = new Map<string, LoadedProblem>();
  const toMap = (files: FileList) => Object.fromEntries(files.map((f) => [f.path, f.content]));
  for (const a of assignments) {
    const files = toMap(a.files);
    for (const p of a.problems) map.set(`${a.course}/${a.id}/${p.id}`, { problem: p, files });
  }
  for (const { files, ...p } of problems) map.set(p.id, { problem: p, files: toMap(files) });
  return map;
}
