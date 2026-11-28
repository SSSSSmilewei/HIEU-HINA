import { describe, expect, test } from "bun:test";
import { memoryD1 } from "../scripts/local-d1";
import { crc32, zip } from "../scripts/vsix.mjs";
import type { Env } from "../src/worker/env";
import worker from "../src/worker/index";
import { ApiError, codeProblems, findTarget, formatResult, Hiana, judgeId, languageFor, normalizeServer, type OjIndex, type ProblemFile, repoNameFromUrl } from "../vscode/src/core";

/** VSCode 插件（故事 2.3）里和 VSCode 无关的部分 */
const index: OjIndex = {
  assignments: [
    { course: "cs61a", id: "lab01", title: "实验 1：函数", repoDir: "lab/lab01", problems: [] },
    { course: "cs61a", id: "ants", title: "项目 3：Ants", repoDir: "proj/ants", problems: [] },
    { course: "cs61a", id: "ants2", title: "假想的另一份", repoDir: "proj/ants2", problems: [] },
    { course: "cs61b", id: "lab01", title: "CS61B 实验 1", repoDir: "lab/lab01", problems: [] },
  ],
  problems: [{ id: "a-plus-b", title: "A + B", languages: ["python", "cpp"] }],
};
const p = (over: Partial<ProblemFile>): ProblemFile => ({ id: "digit", title: "取出某一位数字", kind: "function", languages: ["python"], editable: ["lab01.py"], ...over });

describe("从文件路径找到题目", () => {
  test("课程作业：按仓库名和作业目录，目录前缀相同时取最长的", () => {
    expect(findTarget(index, "cs61a", "lab/lab01/lab01.py")).toEqual({ kind: "assignment", course: "cs61a", assignment: "lab01", title: "实验 1：函数", repoDir: "lab/lab01", file: "lab01.py" });
    expect(findTarget(index, "cs61b", "lab/lab01/lab01.py")?.course).toBe("cs61b");
    expect(findTarget(index, "cs61a", "proj/ants2/ants.py")?.assignment).toBe("ants2");
    expect(findTarget(index, "cs61a", "proj/ants/tests/01.py")?.file).toBe("tests/01.py");
    expect(findTarget(index, "cs61a", "README.md")).toBeNull();
    expect(findTarget(index, "cs61a", "lab\\lab01\\lab01.py")?.file).toBe("lab01.py");
  });

  test("刷题仓库：第一级目录是题号", () => {
    expect(findTarget(index, "oj-practice", "a-plus-b/main.py")).toEqual({ kind: "practice", problem: "a-plus-b", title: "A + B", file: "main.py" });
    expect(findTarget(index, "oj-practice", "no-such/main.py")).toBeNull();
  });

  test("预测输出和环境图不在插件里交", () => {
    const list = [p({}), p({ id: "wwpd", kind: "wwpd" }), p({ id: "env", kind: "envdiagram" }), p({ id: "other", editable: ["other.py"] })];
    expect(codeProblems(list, "lab01.py").map((x) => x.id)).toEqual(["digit"]);
  });

  test("判题编号和语言", () => {
    const t = findTarget(index, "cs61a", "lab/lab01/lab01.py")!;
    expect(judgeId(t, "digit")).toBe("cs61a/lab01/digit");
    expect(judgeId(findTarget(index, "oj-practice", "a-plus-b/main.cpp")!, "a-plus-b")).toBe("a-plus-b");
    expect(languageFor(p({ languages: ["python", "cpp"] }), "main.cpp")).toBe("cpp");
    expect(languageFor(p({ languages: ["scheme"] }), "questions.scm")).toBe("scheme");
    expect(languageFor(p({ languages: ["python"] }), "notes.txt")).toBe("python");
  });

  test("地址和仓库名", () => {
    expect(normalizeServer("study.example.edu/")).toBe("https://study.example.edu");
    expect(normalizeServer("http://localhost:8788")).toBe("http://localhost:8788");
    expect(repoNameFromUrl("https://git.example.edu/s254030411/cs61a.git")).toBe("cs61a");
    expect(repoNameFromUrl("http://127.0.0.1:3310/s254030411/oj-practice")).toBe("oj-practice");
  });
});

describe("判题结果排版", () => {
  test("总结果、失败用例的输入期望实际、隐藏用例不给细节", () => {
    const text = formatResult(
      "submit",
      "实验 1 · 取出某一位数字",
      {
        verdict: "WA",
        passed: 1,
        total: 3,
        timeMs: 40,
        memoryKb: 9000,
        cases: [
          { index: 1, verdict: "AC", timeMs: 10, memoryKb: 1, hidden: false },
          { index: 2, verdict: "WA", timeMs: 12, memoryKb: 1, hidden: false, input: "digit(3579, 2)", expected: "5", actual: "7" },
          { index: 3, verdict: "WA", timeMs: 12, memoryKb: 1, hidden: true },
        ],
      },
      new Date(2026, 10, 28, 12, 0, 0),
    );
    expect(text).toContain("WA  答案错误    通过 1 / 3");
    expect(text).toContain("✗ 用例 2  WA  12 ms\n  输入：\n    digit(3579, 2)\n  期望：\n    5\n  实际：\n    7");
    expect(text).toContain("✗ 用例 3  WA  12 ms  （隐藏用例）");
    expect(text).not.toContain("用例 1  AC  10 ms\n  输入");
  });
});

describe("插件用令牌调平台接口", () => {
  test("登录、读题目索引；令牌不对时给出清楚的提示", async () => {
    const env = {
      DB: memoryD1(),
      ASSETS: { fetch: async (r: Request) => (new URL(r.url).pathname === "/oj/index.json" ? Response.json(index) : new Response("x")) },
      SESSION_SECRET: "test-session-secret-0123456789abcdef",
      FIRST_ADMIN_CODE: "first-admin-secret",
    } as unknown as Env;
    let cookie = "";
    const web = async (method: string, path: string, body?: unknown) => {
      const res = await worker.fetch(new Request(`http://localhost${path}`, { method, headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) }, body: JSON.stringify(body) }), env);
      const set = res.headers.get("set-cookie");
      if (set) cookie = set.split(";")[0]!;
      return (await res.json()) as Record<string, any>;
    };
    await web("POST", "/api/auth/register", { studentNo: "254030411", name: "会长", className: "计科2501", password: "pass-2026-x", confirm: "pass-2026-x", invite: "first-admin-secret" });
    const token = (await web("POST", "/api/tokens", { name: "测试" })).token as string;
    const viaWorker = (async (url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) => worker.fetch(new Request(url, init), env)) as never;

    const api = new Hiana("http://localhost", token, viaWorker);
    expect((await api.me()).member?.studentNo).toBe("254030411");
    expect((await api.index()).assignments).toHaveLength(4);

    const bad = new Hiana("http://localhost", "hnp_wrong", viaWorker);
    const err = await bad.repos().catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(401);
    expect((err as ApiError).message).toContain("重新签发令牌");
  });
});

describe(".vsix 打包", () => {
  test("crc32 和 zip 结构", () => {
    expect(crc32(new TextEncoder().encode("123456789"))).toBe(0xcbf43926);
    const z = zip([
      ["a.txt", "你好"],
      ["dir/b.bin", new Uint8Array([0, 1, 2])],
    ]);
    expect(z.readUInt32LE(0)).toBe(0x04034b50);
    expect(z.readUInt32LE(z.length - 22)).toBe(0x06054b50);
    expect(z.readUInt16LE(z.length - 22 + 10)).toBe(2);
  });
});
