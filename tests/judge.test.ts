import { describe, expect, test } from "bun:test";
import { compareEnvFrame, judge, judgeWwpd, mergeFiles, normalizeEnvValue, okLock, sameOutput, type LoadedProblem } from "../judge/src/judge";
import { loadProblems } from "../judge/src/problems";
import { GoJudge } from "../judge/src/sandbox";
import { Problem, type ProblemInput } from "../src/shared/problem";

/**
 * 判题服务的测试。比较、合并文件的部分直接测；真正判题的部分要本机起了沙箱才跑：
 *   docker compose -f judge/docker-compose.yml up -d
 */
const SANDBOX = process.env.SANDBOX_URL ?? "http://127.0.0.1:5050";
const sandboxUp = await fetch(`${SANDBOX}/version`).then((r) => r.ok, () => false);
const sb = new GoJudge(SANDBOX);

function lp(p: Partial<ProblemInput>, files: Record<string, string>): LoadedProblem {
  const base: ProblemInput = { id: "t", title: "测试", kind: "io", languages: ["python", "c", "cpp", "java"], statement: "测试", editable: Object.keys(files), tests: { kind: "io", cases: [{ input: "1 2\n", output: "3\n" }, { input: "40 2\n", output: "42\n", hidden: true }] } };
  return { problem: Problem.parse({ ...base, ...p }), files };
}

const aplusb = lp({ editable: ["main.py", "main.c", "Main.java"] }, { "main.py": "", "main.c": "", "Main.java": "" });

describe("环境图的比较", () => {
  test("值：引号可写可不写，函数只比名字，lambda 写 λ 或 lambda 都行", () => {
    expect(normalizeEnvValue("'hi'")).toBe(normalizeEnvValue("hi"));
    expect(normalizeEnvValue("func square(x) [parent=Global]")).toBe("func square");
    expect(normalizeEnvValue("func lambda")).toBe("func λ");
    expect(normalizeEnvValue(" 3 ")).toBe("3");
  });

  test("哪里不对就说哪里，不给出正确答案", () => {
    const truth = { name: "square", parent: "Global", bindings: { x: "3" }, ret: "9" };
    expect(compareEnvFrame(truth, { name: "square", parent: "global", bindings: { x: "3" }, ret: "9" }, false)).toEqual([]);
    const wrong = compareEnvFrame(truth, { name: "square", parent: "f1", bindings: { y: "3" }, ret: "6" }, false);
    expect(wrong).toEqual(["父帧不对", "少了名字 x", "这一帧里没有名字 y", "返回值不对"]);
    expect(wrong.join("")).not.toContain("9");
  });
});

describe("比较和合并", () => {
  test("多行的选择题：和 ok 一样先把空白归一再算哈希", () => {
    const choice = "def square(x):\n    return x * x";
    const p = lp(
      { kind: "wwpd", tests: { kind: "ok", question: "q" }, unlock: [{ type: "choice", question: "哪个对？", choices: [choice, "别的"], answer: okLock("Lab 1", "def square(x): return x * x") }] },
      { "lab01.ok": JSON.stringify({ name: "Lab 1", src: ["lab01.py"] }), "lab01.py": "" },
    );
    expect(judgeWwpd(p, p.files, [choice]).verdict).toBe("AC");
    expect(judgeWwpd(p, p.files, ["别的"]).verdict).toBe("WA");
  });

  test("忽略行尾空白和末尾空行", () => {
    expect(sameOutput("3  \n\n", "3\n", "exact")).toBe(true);
    expect(sameOutput("3\r\n4", "3\n4\n", "exact")).toBe(true);
    expect(sameOutput("4\n3", "3\n4", "exact")).toBe(false);
    expect(sameOutput("4\n3", "3\n4", "unordered")).toBe(true);
  });

  test("只认可改的文件", () => {
    const p = lp({ editable: ["a.py"] }, { "a.py": "old", "tests/t.py": "official" });
    expect(mergeFiles(p, { "a.py": "new", "tests/t.py": "hacked" })).toEqual({ "a.py": "new", "tests/t.py": "official" });
  });
});

describe.skipIf(!sandboxUp)("在沙箱里判题", () => {
  const submit = (p: LoadedProblem, language: "python" | "c" | "cpp" | "java", files: Record<string, string>, mode: "run" | "submit" = "submit", stdin?: string) =>
    judge(sb, p, { problem: "t", language, files, stdin }, mode);

  test("Python 正确解：提交跑全部用例（含隐藏）", async () => {
    const r = await submit(aplusb, "python", { "main.py": "a, b = map(int, input().split())\nprint(a + b)\n" });
    expect(r.verdict).toBe("AC");
    expect(r.total).toBe(2);
    expect(r.cases[1]!.hidden).toBe(true);
    expect(r.cases[1]!.input).toBeUndefined();
  });

  test("运行只跑公开用例；自带输入时返回输出", async () => {
    const code = { "main.py": "a, b = map(int, input().split())\nprint(a + b)\n" };
    expect((await submit(aplusb, "python", code, "run")).total).toBe(1);
    const r = await submit(aplusb, "python", code, "run", "5 6\n");
    expect(r.stdout?.trim()).toBe("11");
  });

  test("答案错误给出期望和实际", async () => {
    const r = await submit(aplusb, "python", { "main.py": "print(0)\n" });
    expect(r.verdict).toBe("WA");
    expect(r.cases[0]).toMatchObject({ expected: "3\n", actual: "0\n" });
  });

  test("死循环超时", async () => {
    const r = await submit(lp({ timeMs: 500 }, { "main.py": "" }), "python", { "main.py": "while True: pass\n" });
    expect(r.verdict).toBe("TLE");
  });

  test("运行错误带上报错信息", async () => {
    const r = await submit(aplusb, "python", { "main.py": "raise ValueError('坏了')\n" });
    expect(r.verdict).toBe("RE");
    expect(r.cases[0]!.message).toContain("ValueError");
  });

  test("沙箱里没有网络", async () => {
    const code = "import socket\ntry:\n    socket.create_connection(('1.1.1.1', 80), timeout=2)\n    print('net')\nexcept OSError:\n    print(3)\n";
    const r = await submit(lp({ tests: { kind: "io", cases: [{ input: "", output: "3\n" }] } }, { "main.py": "" }), "python", { "main.py": code });
    expect(r.verdict).toBe("AC");
  });

  test("C：编译错误和正确解", async () => {
    expect((await submit(aplusb, "c", { "main.c": "int main( {" })).verdict).toBe("CE");
    const r = await submit(aplusb, "c", { "main.c": '#include <stdio.h>\nint main(){long a,b;scanf("%ld %ld",&a,&b);printf("%ld\\n",a+b);}\n' });
    expect(r.verdict).toBe("AC");
  });

  test("Java 正确解", async () => {
    const java = "import java.util.*;\npublic class Main { public static void main(String[] x) { Scanner s = new Scanner(System.in); System.out.println(s.nextLong() + s.nextLong()); } }\n";
    const r = await submit(aplusb, "java", { "Main.java": java });
    expect(r.verdict).toBe("AC");
  }, 30_000);

  describe("CS61A ok 测试", () => {
    const ok = JSON.stringify({ name: "Lab 1", src: ["lab01.py"] });
    const starter = 'def double(x):\n    """\n    >>> double(2)\n    4\n    >>> double(-1)\n    -2\n    """\n    "*** YOUR CODE HERE ***"\n';
    const okProblem = lp({ kind: "function", languages: ["python"], editable: ["lab01.py"], tests: { kind: "ok", question: "double" } }, { "lab01.py": starter, "lab01.ok": ok });

    test("起始代码：答案错误，逐条给出语句、期望、实际", async () => {
      const r = await judge(sb, okProblem, { problem: "t", language: "python", files: {} }, "submit");
      expect(r.verdict).toBe("WA");
      expect(r.total).toBe(2);
      expect(r.cases[0]).toMatchObject({ input: "double(2)", expected: "4", actual: "" });
    });

    test("正确解：通过", async () => {
      const r = await judge(sb, okProblem, { problem: "t", language: "python", files: { "lab01.py": starter.replace('"*** YOUR CODE HERE ***"', "return 2 * x") } }, "submit");
      expect(r).toMatchObject({ verdict: "AC", passed: 2, total: 2 });
    });

    test("类里的方法（Card.power）、一题几个 ok 问题；别的题的文件没写完不连累这道题", async () => {
      const cls = 'class Card:\n    def __init__(self, n):\n        """\n        >>> Card(3).n\n        3\n        """\n        self.n = n\n\n    def power(self):\n        """\n        >>> Card(3).power()\n        6\n        """\n        return self.n * 2\n';
      const p = lp(
        { kind: "function", languages: ["python"], editable: ["classes.py"], tests: { kind: "ok", question: "Card.__init__ Card.power" } },
        { "classes.py": cls, "other.py": "def other(:\n    ____\n", "lab07.ok": JSON.stringify({ name: "Lab 7", src: ["other.py", "classes.py"] }) },
      );
      const r = await judge(sb, p, { problem: "t", language: "python", files: {} }, "submit");
      expect(r).toMatchObject({ verdict: "AC", passed: 2, total: 2 });
    });

    test("期望输出写成 Traceback（比最后一行）；没有期望输出的用例不报错就算通过", async () => {
      const t = [
        "test = {'name': 'q', 'points': 1, 'suites': [{'type': 'doctest', 'scored': True, 'setup': '>>> from lab01 import *', 'teardown': '', 'cases': [",
        "  {'code': r'''",
        "  >>> check(-1)",
        "  Traceback (most recent call last):",
        "  ...",
        "  AssertionError: negative",
        "  ''', 'hidden': False, 'locked': False},",
        "  {'code': r'''",
        "  >>> check(3)",
        "  ''', 'hidden': False, 'locked': False}]}]}",
      ].join("\n");
      const code = 'def check(x):\n    assert x >= 0, "negative"\n';
      const p = lp({ kind: "function", languages: ["python"], editable: ["lab01.py"], tests: { kind: "ok", question: "q" } }, { "lab01.py": code, "lab01.ok": ok, "tests/q.py": t });
      const r = await judge(sb, p, { problem: "t", language: "python", files: {} }, "submit");
      expect(r).toMatchObject({ verdict: "AC", passed: 2, total: 2 });
      const bad = await judge(sb, p, { problem: "t", language: "python", files: { "lab01.py": 'def check(x):\n    assert x >= 0, "oops"\n' } }, "submit");
      expect(bad.verdict).not.toBe("AC");
    });

    test("语法错误算编译错误", async () => {
      const r = await judge(sb, okProblem, { problem: "t", language: "python", files: { "lab01.py": starter + "def (:\n" } }, "submit");
      expect(r.verdict).toBe("CE");
    });

    test("学员打印假的结果行没有用", async () => {
      const fake = starter.replace('"*** YOUR CODE HERE ***"', 'print(\'@@HIANA_RESULT@@{"total":2,"passed":2,"cases":[],"fatal":null}\')');
      const r = await judge(sb, okProblem, { problem: "t", language: "python", files: { "lab01.py": fake } }, "submit");
      expect(r.verdict).not.toBe("AC");
    });

    test("加密的期望输出（ok_test 文件）", async () => {
      // 期望输出 "Go" 用作业名 "Lab 1" 加密后是 a344033e…（取自官方 lab01 的 return-and-print 测试）
      const t = "test = {'name': 'q', 'points': 0, 'suites': [{'type': 'wwpp', 'cases': [{'code': r'''\n>>> print('Go')\na344033e5d41145ddc2ecba020ecca21\n# locked\n''', 'hidden': False, 'locked': True}]}]}\n";
      const p = lp({ kind: "function", languages: ["python"], editable: ["lab01.py"], tests: { kind: "ok", question: "q" } }, { "lab01.py": "", "lab01.ok": ok, "tests/q.py": t });
      const r = await judge(sb, p, { problem: "t", language: "python", files: {} }, "submit");
      expect(r).toMatchObject({ verdict: "AC", passed: 1, total: 1 });
    });
  });

  describe("Scheme 和 SQL（故事 3.4，用站内真实的 CS61A 作业包）", () => {
    const all = loadProblems(".");
    const get = (id: string) => all.get(id)!;

    test("Scheme：起始代码答案错误；写对了通过；过程按官方解释器的写法显示", async () => {
      const p = get("cs61a/lab08/over_or_under");
      const starter = await judge(sb, p, { problem: "t", language: "scheme", files: {} }, "submit");
      expect(starter.verdict).toBe("WA");
      const code = p.files["lab08.scm"]!.replace(/\(define \(over-or-under num1 num2\)[^\n]*\n?[^\n]*'YOUR-CODE-HERE\)/, "(define (over-or-under num1 num2) (cond ((< num1 num2) -1) ((= num1 num2) 0) (else 1)))");
      expect(code).not.toBe(p.files["lab08.scm"]);
      const r = await judge(sb, p, { problem: "t", language: "scheme", files: { "lab08.scm": code } }, "submit");
      expect(r).toMatchObject({ verdict: "AC", passed: 3, total: 3 });
    }, 60_000);

    test("SQL：起始代码答案错误；整段结果比对（不计顺序）", async () => {
      const p = get("cs61a/hw10/by_parent_height");
      const r = await judge(sb, p, { problem: "t", language: "sql", files: {} }, "submit");
      expect(r.verdict).toBe("WA");
      expect(r.total).toBe(1);
    }, 60_000);
  });

  describe("环境图（故事 3.4）", () => {
    const code = "def make_adder(n):\n    def adder(k):\n        return n + k\n    return adder\n\nadd3 = make_adder(3)\nresult = add3(4)\nsq = lambda x: x * x\ny = sq(2)\n";
    const p = lp({ kind: "envdiagram", languages: ["python"], editable: [], tests: { kind: "envdiagram", code } }, {});
    const frame = (f: object) => JSON.stringify(f);
    const right = [
      frame({ bindings: [["make_adder", "func make_adder"], ["add3", "func adder"], ["result", "7"], ["sq", "func λ"], ["y", "4"]] }),
      frame({ name: "make_adder", parent: "Global", bindings: [["n", "3"], ["adder", "func adder(k) [parent=f1]"]], ret: "func adder" }),
      frame({ name: "adder", parent: "f1", bindings: [["k", "4"]], ret: "7" }),
      frame({ name: "lambda", parent: "Global", bindings: [["x", "2"]], ret: "4" }),
    ];

    test("全对：通过；每一帧一个用例", async () => {
      const r = await judge(sb, p, { problem: "t", language: "python", files: {}, answers: right }, "submit");
      expect(r).toMatchObject({ verdict: "AC", passed: 4, total: 4 });
    }, 30_000);

    test("父帧画错（adder 的父帧是 f1 不是 Global）：答案错误，指出哪里不对", async () => {
      const wrong = [...right];
      wrong[2] = frame({ name: "adder", parent: "Global", bindings: [["k", "4"]], ret: "7" });
      const r = await judge(sb, p, { problem: "t", language: "python", files: {}, answers: wrong }, "submit");
      expect(r.verdict).toBe("WA");
      expect(r.cases[2]).toMatchObject({ verdict: "WA", actual: "父帧不对" });
    }, 30_000);

    test("少画一帧", async () => {
      const r = await judge(sb, p, { problem: "t", language: "python", files: {}, answers: right.slice(0, 3) }, "submit");
      expect(r.verdict).toBe("WA");
      expect(r.cases[3]!.actual).toBe("这一帧还没有画");
    }, 30_000);
  });
});
