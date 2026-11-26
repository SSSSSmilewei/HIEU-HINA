import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ASSIGNMENT_FORMAT, assignmentJsonSchema, DEFAULT_TIME_MS, parseAssignment, parseProblem, problemJsonSchema } from "../src/shared/problem";
// @ts-expect-error 构建脚本是 .mjs，没有类型声明
import { buildOj, loadOj } from "../scripts/oj.mjs";

const fn = {
  id: "digit",
  title: "取某一位数字",
  kind: "function",
  languages: ["python"],
  statement: "实现 `digit(n, k)`。",
  editable: ["lab01.py"],
  focus: { file: "lab01.py", symbol: "digit" },
  tests: { kind: "ok", question: "digit" },
};

const assignment = {
  format: ASSIGNMENT_FORMAT,
  course: "cs61a",
  id: "lab01",
  title: "Lab 1：函数与控制",
  semester: "sp26",
  license: "© UC Berkeley CS 61A",
  repoDir: "lab/lab01",
  problems: [fn],
};

describe("hiana-problem@1", () => {
  test("合法的题目通过校验，并补上默认值", () => {
    const r = parseProblem(fn, ["lab01.py"]);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.timeMs).toBe(DEFAULT_TIME_MS);
      expect(r.value.hints).toEqual([]);
    }
  });

  test("缺题面、题型未知时报错并指出字段", () => {
    const r = parseProblem({ ...fn, statement: "", kind: "quiz" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.some((e) => e.startsWith("statement"))).toBe(true);
      expect(r.errors.some((e) => e.startsWith("kind"))).toBe(true);
    }
  });

  test("可改文件不在起始文件里时报错", () => {
    const r = parseProblem(fn, ["other.py"]);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join("\n")).toContain("lab01.py");
  });

  test("路径不能跳出目录", () => {
    expect(parseProblem({ ...fn, editable: ["../x.py"] }).ok).toBe(false);
    expect(parseProblem({ ...fn, editable: ["/etc/passwd"] }).ok).toBe(false);
  });

  test("输入输出题：隐藏用例默认不隐藏，比较方式默认逐字", () => {
    const r = parseProblem({ ...fn, kind: "io", tests: { kind: "io", cases: [{ input: "1 2\n", output: "3\n" }] } });
    expect(r.ok).toBe(true);
    if (r.ok && r.value.tests.kind === "io") {
      expect(r.value.tests.cases[0]!.hidden).toBe(false);
      expect(r.value.tests.compare).toBe("exact");
    }
  });
});

describe("hiana-assignment@1", () => {
  test("合法的作业包通过校验", () => {
    expect(parseAssignment(assignment, ["lab01.py", "tests/q1.py"]).ok).toBe(true);
  });

  test("题目编号重复时报错", () => {
    const r = parseAssignment({ ...assignment, problems: [fn, fn] });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join("\n")).toContain("重复");
  });

  test("学期写法不对时报错", () => {
    expect(parseAssignment({ ...assignment, semester: "2026春" }).ok).toBe(false);
  });

  test("JSON Schema 和 content/schema 下的文件一致（改了格式要跑 npx tsx scripts/schema.ts）", () => {
    expect(JSON.parse(JSON.stringify(problemJsonSchema()))).toEqual(JSON.parse(readFileSync("content/schema/problem-v1.json", "utf8")));
    expect(JSON.parse(JSON.stringify(assignmentJsonSchema()))).toEqual(JSON.parse(readFileSync("content/schema/assignment-v1.json", "utf8")));
  });
});

describe("构建：scripts/oj.mjs", () => {
  function fixture(raw: unknown, files: Record<string, string>) {
    const root = mkdtempSync(join(tmpdir(), "oj-"));
    const dir = join(root, "content/oj/assignments/cs61a/lab01");
    mkdirSync(join(dir, "files/tests"), { recursive: true });
    writeFileSync(join(dir, "assignment.json"), JSON.stringify(raw));
    for (const [p, c] of Object.entries(files)) writeFileSync(join(dir, "files", p), c);
    return root;
  }

  test("合法的作业包能构建，隐藏用例不进公开文件", () => {
    const io = { ...fn, id: "sum", kind: "io", tests: { kind: "io", cases: [{ input: "1\n", output: "1\n" }, { input: "secret\n", output: "x\n", hidden: true }] } };
    const root = fixture({ ...assignment, problems: [fn, io] }, { "lab01.py": "def digit(n, k): ...\n", "tests/q1.py": "test = {}\n" });
    const out = join(root, "dist");
    expect(buildOj(root, out)).toEqual({ assignments: 1, problems: 2 });
    const pub = readFileSync(join(out, "oj/assignments/cs61a/lab01.json"), "utf8");
    expect(pub).not.toContain("secret");
    expect(JSON.parse(pub).problems[1].tests.hiddenCount).toBe(1);
    expect(JSON.parse(pub).files.map((f: { path: string }) => f.path)).toEqual(["lab01.py", "tests/q1.py"]);
  });

  test("写错的作业包让构建失败，错误里有文件路径", () => {
    const root = fixture({ ...assignment, problems: [{ ...fn, editable: ["missing.py"] }] }, { "lab01.py": "" });
    expect(() => loadOj(root)).toThrow(/assignment\.json.*missing\.py/);
  });

  test("目录名和 course / id 不一致时报错", () => {
    const root = fixture({ ...assignment, id: "lab02" }, { "lab01.py": "" });
    expect(() => loadOj(root)).toThrow(/目录名/);
  });
});

describe("站内的 CS61A 作业包（故事 3.2）", () => {
  const { assignments } = loadOj(".");
  const cs61a = assignments.filter((a: { course: string }) => a.course === "cs61a");

  test("lab 和 homework 都导进来了，全部通过格式校验", () => {
    expect(cs61a.length).toBeGreaterThanOrEqual(14);
  });

  test("每道题都有官方测试：写代码的题有 tests/<题>.py 或源文件里的 doctest，预测输出的题有加密的答案", () => {
    for (const a of cs61a) {
      const paths = new Map<string, string>(a.files.map((f: { path: string; content: string }) => [f.path, f.content]));
      for (const p of a.problems) {
        if (p.kind === "wwpd") {
          expect(p.unlock?.length, `${a.id}/${p.id}`).toBeGreaterThan(0);
          continue;
        }
        if (p.kind === "envdiagram") {
          expect(p.tests.code.length, `${a.id}/${p.id}`).toBeGreaterThan(0);
          continue;
        }
        for (const q of (p.tests.question as string).split(" ")) {
          const head = q.split(".")[0];
          const hasTest = paths.has(`tests/${q}.py`) || new RegExp(`^(def|class) ${head}\\b`, "m").test(paths.get(p.editable[0]) ?? "");
          expect(hasTest, `${a.id}/${p.id}/${q}`).toBe(true);
        }
      }
    }
  });
});
