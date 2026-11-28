// OJ 题目与作业包：校验 content/oj/ 下的源文件，生成网页用的公开版本（dist/client/oj/）。
// 公开版本去掉隐藏用例的内容，只留个数；判题服务直接读 content/oj/，拿得到全部用例。
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { parseAssignment, parseProblem } from "../src/shared/problem.ts";

/** 起始文件里只收文本文件，单个不超过这个大小（lab11 的电影数据库 imdb1000.sql 有 3.6 MB） */
const MAX_FILE_BYTES = 8 * 1024 * 1024;
/** 网页用的公开版本里，超过这个大小的文件（只读的数据）只给开头几行看看，判题服务读的是全文 */
export const PUBLIC_FILE_BYTES = 256 * 1024;
const PREVIEW_LINES = 200;

/** 大文件在公开版本里的样子：开头 200 行 + 说明，标 omitted */
export function publicFile(f) {
  if (f.content.length <= PUBLIC_FILE_BYTES) return f;
  const head = f.content.split("\n").slice(0, PREVIEW_LINES).join("\n");
  const note = f.path.endsWith(".sql") ? "-- " : f.path.endsWith(".scm") ? "; " : "# ";
  return { path: f.path, content: `${head}\n\n${note}……文件太大（${Math.round(f.content.length / 1024)} KB），这里只显示开头 ${PREVIEW_LINES} 行；判题时用的是完整的文件。\n`, omitted: true };
}

/** 列出 dir 下的所有文件（相对路径，用 / 分隔），跳过缓存目录 */
export function listFiles(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  const walk = (d) => {
    for (const name of readdirSync(d).sort()) {
      if (name === "__pycache__" || name.startsWith(".")) continue;
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else out.push(relative(dir, p).split("\\").join("/"));
    }
  };
  walk(dir);
  return out;
}

function readFiles(dir) {
  return listFiles(dir).map((path) => {
    const buf = readFileSync(join(dir, path));
    if (buf.length > MAX_FILE_BYTES) throw new Error(`${join(dir, path)} 超过 ${MAX_FILE_BYTES / 1024} KB`);
    return { path, content: buf.toString("utf8") };
  });
}

/** 网页拿到的题目：隐藏用例只留个数 */
function publicProblem(p) {
  if (p.tests.kind !== "io") return p;
  const shown = p.tests.cases.filter((c) => !c.hidden);
  return { ...p, tests: { ...p.tests, cases: shown, hiddenCount: p.tests.cases.length - shown.length } };
}

/** 读取并校验全部题目；有错就抛出，构建失败 */
export function loadOj(root) {
  const base = join(root, "content/oj");
  const errors = [];
  const assignments = [];
  const problems = [];
  const aRoot = join(base, "assignments");
  for (const course of existsSync(aRoot) ? readdirSync(aRoot).sort() : []) {
    for (const id of readdirSync(join(aRoot, course)).sort()) {
      const dir = join(aRoot, course, id);
      const file = join(dir, "assignment.json");
      if (!existsSync(file)) continue;
      const files = readFiles(join(dir, "files"));
      const r = parseAssignment(JSON.parse(readFileSync(file, "utf8")), files.map((f) => f.path));
      if (!r.ok) errors.push(...r.errors.map((e) => `${relative(root, file)} ${e}`));
      else if (r.value.course !== course || r.value.id !== id) errors.push(`${relative(root, file)}：course / id 要和目录名一致（${course}/${id}）`);
      else assignments.push({ ...r.value, files });
    }
  }
  const pRoot = join(base, "problems");
  for (const id of existsSync(pRoot) ? readdirSync(pRoot).sort() : []) {
    const dir = join(pRoot, id);
    const file = join(dir, "problem.json");
    if (!existsSync(file)) continue;
    const files = readFiles(join(dir, "files"));
    const r = parseProblem(JSON.parse(readFileSync(file, "utf8")), files.map((f) => f.path));
    if (!r.ok) errors.push(...r.errors.map((e) => `${relative(root, file)} ${e}`));
    else if (r.value.id !== id) errors.push(`${relative(root, file)}：id 要和目录名一致（${id}）`);
    else problems.push({ ...r.value, files });
  }
  if (errors.length) throw new Error(`OJ 题目校验失败：\n${errors.join("\n")}`);
  return { assignments, problems };
}

/** 生成 dist/client/oj/：index.json、assignments/<course>/<id>.json、problems/<id>.json */
export function buildOj(root, out) {
  const { assignments, problems } = loadOj(root);
  const dir = join(out, "oj");
  mkdirSync(join(dir, "problems"), { recursive: true });
  for (const a of assignments) {
    mkdirSync(join(dir, "assignments", a.course), { recursive: true });
    writeFileSync(join(dir, "assignments", a.course, `${a.id}.json`), JSON.stringify({ ...a, files: a.files.map(publicFile), problems: a.problems.map(publicProblem) }));
  }
  for (const p of problems) writeFileSync(join(dir, "problems", `${p.id}.json`), JSON.stringify(publicProblem(p)));
  const index = {
    assignments: assignments.map((a) => ({ course: a.course, id: a.id, title: a.title, item: a.item, semester: a.semester, language: a.language, repoDir: a.repoDir, problems: a.problems.map((p) => ({ id: p.id, title: p.title, kind: p.kind })) })),
    problems: problems.map((p) => ({ id: p.id, title: p.title, difficulty: p.difficulty, tags: p.tags, languages: p.languages })),
  };
  writeFileSync(join(dir, "index.json"), JSON.stringify(index));
  return { assignments: assignments.length, problems: problems.length + assignments.reduce((n, a) => n + a.problems.length, 0) };
}
