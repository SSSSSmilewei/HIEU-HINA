"""在浏览器（Pyodide）里运行 CS61A 官方 ok 测试，不需要 ok 客户端，也不需要参考答案。

官方测试文件（tests/01.py 等）定义一个字典 test：若干 suite，每个 suite 有若干 case。
doctest 类型的 case 是一段交互式会话：
    >>> 语句            （续行以 ... 开头）
    期望输出             （可以是明文，也可以是「加密」后的一行，下一行写 # locked）
加密 = hmac(md5, key=作业名, msg=期望输出这一行)。判题时把学生代码的实际输出按同样方式加密再比较，
所以站内不需要、也不保存官方答案。concept 类型是选择题，answer 是正确选项文字加密后的值。

对外两个函数，返回值都是可以 json.dumps 的字典：
    run_test(test_path, key)   运行一个测试文件，遇到第一个不通过的 case 就停（和 ok 一样）
    check_guess(key, hashed, text)  「解锁」时检查学生预测的输出对不对
本文件由 scripts/build.mjs 原样复制到 /levels/ok_runner.py。
"""
import hashlib
import hmac
import io
import sys
import textwrap
import traceback
from contextlib import redirect_stdout

LOCKED = "# locked"


def lock(key, text):
    return hmac.new(key.encode("utf-8"), text.encode("utf-8"), hashlib.md5).hexdigest()


def check_guess(key, hashed, text):
    return {"ok": lock(key, text.strip()) == hashed}


def parse_session(src):
    """把一段会话拆成 [(语句, [(期望行, 是否加密), ...]), ...]。"""
    lines = textwrap.dedent(src).strip("\n").split("\n")
    steps = []
    for raw in lines:
        line = raw.rstrip()
        stripped = line.strip()
        if stripped.startswith(">>>"):
            steps.append([[stripped[4:] if stripped.startswith(">>> ") else stripped[3:]], []])
        elif stripped.startswith("...") and steps and not steps[-1][1]:
            steps[-1][0].append(stripped[4:] if stripped.startswith("... ") else stripped[3:])
        elif stripped == LOCKED:
            if steps and steps[-1][1]:
                text, _ = steps[-1][1][-1]
                steps[-1][1][-1] = (text, True)
        elif steps:
            if stripped == "" and not steps[-1][1]:
                continue
            steps[-1][1].append((stripped, False))
    return [("\n".join(code), want) for code, want in steps]


def execute(code, env):
    """像交互式解释器一样执行一条语句：表达式的值不是 None 就打印 repr。返回 (输出, 异常或 None)。"""
    buf = io.StringIO()
    err = None
    with redirect_stdout(buf):
        try:
            try:
                compiled = compile(code, "<测试>", "eval")
            except SyntaxError:
                exec(compile(code, "<测试>", "exec"), env)
            else:
                value = eval(compiled, env)
                if value is not None:
                    print(repr(value))
        except BaseException as e:  # noqa: BLE001  学生代码可能抛任何异常
            if isinstance(e, KeyboardInterrupt):
                raise
            err = e
    return buf.getvalue(), err


def short_traceback(e):
    lines = traceback.format_exception(type(e), e, e.__traceback__)
    keep = [l for l in lines if "ok_runner.py" not in l and "/lib/python" not in l]
    return "".join(keep[-8:]).rstrip()


def line_matches(key, got, want, hashed):
    return lock(key, got) == want if hashed else got == want


def run_session(src, env, key):
    """运行一段会话。返回 None（通过）或失败详情。"""
    for code, want in parse_session(src):
        out, err = execute(code, env)
        got = [l.strip() for l in out.rstrip("\n").split("\n")] if out.strip() else []
        if err is not None:
            # 期望输出最后一行写 Error 或异常类名，表示这里应该报错
            names = {"Error", type(err).__name__}
            if want:
                last, hashed = want[-1]
                expected_error = any(line_matches(key, n, last, hashed) for n in names)
            else:
                expected_error = False
            if not expected_error:
                return {"code": code, "got": "\n".join(got), "want": render_want(want), "error": short_traceback(err)}
            want = want[:-1]
        if len(got) != len(want) or not all(line_matches(key, g, w, h) for g, (w, h) in zip(got, want)):
            return {"code": code, "got": "\n".join(got), "want": render_want(want), "error": None}
    return None


def render_want(want):
    return "\n".join("（这一行的期望输出已加密）" if h else w for w, h in want)


def show_case(src):
    """给学生看的 case 原文：加密行换成提示。"""
    out = []
    for code, want in parse_session(src):
        for i, line in enumerate(code.split("\n")):
            out.append((">>> " if i == 0 else "... ") + line)
        out.extend("？" if h else w for w, h in want)
    return "\n".join(out)


def fresh_modules():
    """每次运行前清掉学生代码和测试模块，保证用的是最新保存的文件。"""
    for name in list(sys.modules):
        mod = sys.modules[name]
        path = getattr(mod, "__file__", None) or ""
        if path.startswith("/home/pyodide/work/") or name == "tests" or name.startswith("tests."):
            del sys.modules[name]


def load_test(test_path):
    env = {}
    with open(test_path, encoding="utf-8") as f:
        exec(compile(f.read(), test_path, "exec"), env)
    return env["test"]


def run_test(test_path, key):
    fresh_modules()
    test = load_test(test_path)
    total = passed = 0
    for si, suite in enumerate(test["suites"]):
        if suite.get("type") != "doctest":
            continue
        for ci, case in enumerate(suite["cases"]):
            total += 1
            env = {}
            fail = None
            try:
                for part in (suite.get("setup") or "", case["code"]):
                    fail = run_session(part, env, key)
                    if fail:
                        break
            finally:
                if suite.get("teardown"):
                    run_session(suite["teardown"], env, key)
            if fail:
                fail.update({"suite": si + 1, "case": ci + 1, "show": show_case(case["code"])})
                return {"name": test["name"], "ok": False, "passed": passed, "total": None, "fail": fail}
            passed += 1
    return {"name": test["name"], "ok": True, "passed": passed, "total": total, "fail": None}


def unlock_items(test_path, limit=3):
    """「先检验理解」用的题：前几个含加密行的 case，加上全部选择题。"""
    test = load_test(test_path)
    items = []
    cases = 0
    for suite in test["suites"]:
        for case in suite["cases"]:
            if suite.get("type") == "concept":
                items.append({"type": "choice", "question": case["question"], "choices": case["choices"], "answer": case["answer"]})
            elif suite.get("type") == "doctest" and cases < limit and LOCKED in case["code"]:
                cases += 1
                steps = []
                for code, want in parse_session(case["code"]):
                    steps.append({"code": code, "want": [{"text": None if h else w, "hash": w if h else None} for w, h in want]})
                items.append({"type": "session", "steps": steps})
    return items
