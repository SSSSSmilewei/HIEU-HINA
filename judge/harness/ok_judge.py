"""在判题沙箱里运行 CS61A 官方 ok 测试，输出 OJ 式的逐用例结果。不需要 ok 客户端，也不需要参考答案。

用法（工作目录是作业的 files/，学员的文件已经覆盖进来）：
    python3 ok_judge.py <问题名> <加密用的作业名> <源文件1> [源文件2 ...]

问题有两种来源，和 ok 一样：
- tests/<问题名>.py：ok_test 文件，里面若干 suite（doctest 会话或选择题），每个 case 是一个用例；
- 源文件里名叫 <问题名> 的函数：它的 docstring 是一段 doctest 会话，每一条有期望输出的语句是一个用例。

期望输出可以是明文，也可以是加密的一行（下一行写 # locked）。加密 = hmac(md5, key=作业名, msg=期望输出)，
判题时把实际输出按同样方式加密再比较，所以不需要官方答案。

最后一行打印 RESULT_MARK + 环境变量 HIANA_NONCE 的值 + 一行 JSON：
    {"name", "total", "passed", "cases": [{"ok", "code", "got", "want", "error"}...], "fatal"}
遇到第一个不通过的用例就停（和 ok 一样，后面的用例往往依赖前面的状态），total 仍是用例总数。
"""
import ast
import re
import hashlib
import hmac
import io
import json
import os
import sys
import textwrap
import traceback
from contextlib import redirect_stdout

RESULT_MARK = "@@HIANA_RESULT@@"
LOCKED = "# locked"
MAX_TEXT = 4000


def lock(key, text):
    return hmac.new(key.encode("utf-8"), text.encode("utf-8"), hashlib.md5).hexdigest()


def clip(text):
    return text if len(text) <= MAX_TEXT else text[:MAX_TEXT] + "\n…（输出太长，已截断）"


# 提示符：Python 的 >>> / ...，Scheme 的 scm> / ....，SQL 的 sqlite> / ...>
PS1 = (">>>", "scm>", "sqlite>")
PS2 = ("....", "...>", "...")


def strip_prompt(stripped, prompts):
    for p in prompts:
        if stripped.startswith(p):
            rest = stripped[len(p):]
            return rest[1:] if rest.startswith(" ") else rest
    return None


def parse_session(src):
    """把一段会话拆成 [(语句, [(期望行, 是否加密), ...]), ...]。"""
    steps = []
    for raw in textwrap.dedent(src).strip("\n").split("\n"):
        line = raw.rstrip()
        stripped = line.strip()
        first = strip_prompt(stripped, PS1)
        more = strip_prompt(stripped, PS2) if first is None else None
        if first is not None:
            steps.append([[first], []])
        elif more is not None and steps and not steps[-1][1]:
            steps[-1][0].append(more)
        elif stripped.startswith("# choice:"):
            continue  # 加密的期望输出后面列的选项（ok 解锁时用），不是输出
        elif stripped == LOCKED:
            # "# locked" 表示这条语句的整段期望输出都是加密的
            if steps:
                steps[-1][1] = [(text, True) for text, _ in steps[-1][1]]
        elif steps:
            if stripped == "" and not steps[-1][1]:
                continue
            if stripped == "":
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
        except BaseException as e:  # noqa: BLE001  学员代码可能抛任何异常
            if isinstance(e, KeyboardInterrupt):
                raise
            err = e
    return buf.getvalue(), err


def short_traceback(e):
    lines = traceback.format_exception(type(e), e, e.__traceback__, chain=False)
    keep = [l for l in lines if "ok_judge.py" not in l and "/lib/python" not in l]
    return clip("".join(keep[-8:]).rstrip())


def line_matches(key, got, want, hashed):
    return lock(key, got) == want if hashed else got == want


def render_want(want):
    return "\n".join("（期望输出已加密，看不到原文）" if h else w for w, h in want)


def check_step(code, want, run, key):
    """运行一条语句并和期望比较，返回用例结果。run(code) -> (输出, 异常或 None)。"""
    out, err = run(code)
    # 和 ok 一样，学员自己打印的 DEBUG: 开头的调试行不算输出
    got = [l.strip() for l in out.rstrip("\n").split("\n") if not l.startswith("DEBUG:")] if out.strip() else []
    if err is not None:
        # 期望输出最后一行写 Error 或异常类名，表示这里应该报错；
        # 也可以整段写成 Traceback（ok 的写法）：第一行 Traceback (most recent call last):，最后一行「异常名: 信息」
        names = {"Error", "SchemeError", type(err).__name__, f"{type(err).__name__}: {err}"}
        if want and not want[0][1] and want[0][0] == "Traceback (most recent call last):":
            matched = line_matches(key, f"{type(err).__name__}: {err}", want[-1][0], want[-1][1]) or line_matches(key, type(err).__name__, want[-1][0], want[-1][1])
            if not matched:
                return {"ok": False, "code": code, "got": clip("\n".join(got)), "want": render_want(want), "error": short_traceback(err)}
            return {"ok": len(got) == 0, "code": code, "got": clip("\n".join(got)), "want": render_want(want), "error": None}
        expected = bool(want) and any(line_matches(key, n, want[-1][0], want[-1][1]) for n in names)
        if not expected:
            return {"ok": False, "code": code, "got": clip("\n".join(got)), "want": render_want(want), "error": short_traceback(err)}
        want = want[:-1]
    ok = len(got) == len(want) and all(line_matches(key, g, w, h) for g, (w, h) in zip(got, want))
    return {"ok": ok, "code": code, "got": clip("\n".join(got)), "want": render_want(want), "error": None}


def run_session(src, run, key, cases):
    """运行一段会话，每条有期望输出（或报错）的语句记一个用例；遇到不通过就返回 False。
    run 是 Python 的全局变量字典（按 Python 执行），或者 run(code) -> (输出, 异常) 函数（Scheme）。"""
    if isinstance(run, dict):
        scope = run
        run = lambda code: execute(code, scope)  # noqa: E731
    for code, want in parse_session(src):
        r = check_step(code, want, run, key)
        if want or not r["ok"]:
            cases.append(r)
        if not r["ok"]:
            return False
    return True


def run_setup(src, run, cases):
    """setup 和 teardown：和 ok 一样只执行、不比较输出；出错（比如学员的文件加载失败）才算不通过。"""
    if isinstance(run, dict):
        scope = run
        run = lambda code: execute(code, scope)  # noqa: E731
    for code, _ in parse_session(src):
        out, err = run(code)
        if err is not None:
            cases.append({"ok": False, "code": code, "got": clip(out.strip()), "want": "", "error": short_traceback(err) if err.__traceback__ else str(err)})
            return False
    return True


def count_cases(src):
    return sum(1 for _, want in parse_session(src) if want)


def load_module(path):
    """把学员的源文件当作模块执行，返回它的全局变量。"""
    name = os.path.splitext(os.path.basename(path))[0]
    env = {"__name__": name, "__file__": path}
    with open(path, encoding="utf-8") as f:
        exec(compile(f.read(), path, "exec"), env)
    return env


DEFS = (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)


def find_docstring(question, sources):
    """在源文件里找名叫 question 的函数或类，返回 (文件, docstring)。
    带点的名字是类里的方法，如 Card.power（ok 的写法）。"""
    head, _, method = question.partition(".")
    broken = None
    for path in sources:
        with open(path, encoding="utf-8") as f:
            text = f.read()
        try:
            tree = ast.parse(text, path)
        except SyntaxError as e:
            # 别的题的文件还没写完（例如还留着 ____），不影响这道题；这道题要找的函数在坏文件里时才报错
            if re.search(rf"^\s*(?:def|class) {re.escape(head)}\b", text, re.M):
                raise
            broken = broken or e
            continue
        for node in ast.walk(tree):
            if isinstance(node, DEFS) and node.name == head:
                if not method:
                    return path, ast.get_docstring(node, clean=False) or ""
                for sub in node.body:
                    if isinstance(sub, DEFS) and sub.name == method:
                        return path, ast.get_docstring(sub, clean=False) or ""
    if broken:
        raise broken
    return None, None


def judge_doctest(question, key, sources):
    path, doc = find_docstring(question, sources)
    if path is None:
        return {"name": question, "total": 0, "passed": 0, "cases": [], "fatal": f"源文件里找不到函数 {question}"}
    total = count_cases(doc)
    cases = []
    try:
        env = load_module(path)
    except BaseException as e:  # noqa: BLE001
        return {"name": question, "total": total, "passed": 0, "cases": [], "fatal": short_traceback(e)}
    run_session(doc, env, key, cases)
    return {"name": question, "total": total, "passed": sum(c["ok"] for c in cases), "cases": cases, "fatal": None}


class SchemeRunner:
    """用作业包里官方的 61A Code 解释器（editor/）逐条求值 Scheme，和 ok 的 scm> 会话一样：
    有值就显示值（Scheme 的写法），display 打印的内容在前；出错算作异常。每个用例一个新的全局环境。"""

    def __init__(self):
        path = os.path.abspath("editor")
        if path not in sys.path:
            sys.path.insert(0, path)
        import execution  # noqa: PLC0415  editor/ 里的模块
        import log  # noqa: PLC0415
        import special_forms  # noqa: PLC0415

        self.special_forms = special_forms
        self.execution = execution
        self.logger = log.logger
        self.logger.autodraw = False  # 不画图，不往输出里写 AUTODRAW
        self.frame = None
        self.stored = None

    def show_procedure(self, proc):
        """过程按官方 Scheme 解释器（ok 判题用的那个）的写法显示：(lambda (x) 函数体)，
        而不是 61A Code 的 (lambda x) [parent = Global]"""
        sf = self.special_forms
        kind = "mu" if isinstance(proc, sf.MuObject) else "macro" if isinstance(proc, sf.MacroObject) else "lambda"
        params = " ".join(map(repr, proc.params))
        if proc.var_param is not None:
            params = f"{params} . {proc.var_param!r}".strip()
        body = " ".join(map(repr, proc.body))
        return f"({kind} ({params}) {body})"

    def __call__(self, code):
        lg = self.logger
        errors = []
        real_out = type(lg).out

        def out(val, end="\n"):
            if isinstance(val, BaseException):
                errors.append(val)
            elif isinstance(val, self.special_forms.ProcedureObject):
                lg.raw_out(self.show_procedure(val) + end)
            else:
                real_out(lg, val, end)

        if self.stored is None:
            lg.new_query()
        else:
            lg.new_query(self.stored, lg.i, lg.f_delta)
        lg.out = out
        buf = io.StringIO()
        try:
            with redirect_stdout(buf):
                self.execution.string_exec([code], out, False, self.frame)
        except BaseException as e:  # noqa: BLE001  解析错误等
            if isinstance(e, KeyboardInterrupt):
                raise
            errors.append(e)
        finally:
            del lg.out
        if self.frame is None and lg.global_frame is not None:
            self.stored = lg.global_frame
            self.frame = lg.global_frame.base
        text = "".join("".join(x) for x in lg._out)
        text = text.split("Traceback (most recent call last)")[0]  # 出错时解释器打印的调用栈不算输出
        return text, (errors[0] if errors else None)


class StudentSchemeRunner:
    """Scheme 项目：和 ok 一样用学员自己写的解释器（当前目录的 scheme.py）求值 scm> 会话"""

    def __init__(self):
        if os.getcwd() not in sys.path:
            sys.path.insert(0, os.getcwd())
        import scheme  # noqa: PLC0415  学员的项目文件

        self.scheme = scheme
        make = getattr(scheme, "create_global_frame_with_eval_apply", None) or scheme.create_global_frame
        self.frame = make()

    def __call__(self, code):
        buf = io.StringIO()
        err = None
        with redirect_stdout(buf):
            try:
                if code.strip():
                    value = self.scheme.scheme_eval(self.scheme.read_line(code), self.frame)
                    if value is not None:
                        print(self.scheme.repl_str(value))
            except BaseException as e:  # noqa: BLE001
                if isinstance(e, KeyboardInterrupt):
                    raise
                err = e
        return buf.getvalue(), err


def judge_scheme_case(suite, case, key, cases):
    run = StudentSchemeRunner() if os.path.isfile("scheme.py") else SchemeRunner()
    if suite.get("setup") and not run_setup(suite["setup"], run, cases):
        return False
    return run_session(case["code"], run, key, cases)


def judge_sqlite_case(suite, case, key, cases):
    """和 ok 一样：setup、用例、teardown 的语句连起来交给作业包里的 sqlite_shell.py（模仿 sqlite3 命令行），
    比较全部输出行；ordered 为假时不计顺序。一个 case 是一个用例。"""
    import sqlite_shell  # noqa: PLC0415  作业包里的文件

    code, want = [], []
    for part in (suite.get("setup") or "", case["code"], suite.get("teardown") or ""):
        for stmt, lines in parse_session(part):
            code.append(stmt)
            want.extend(lines)
    stdin, stdout, stderr = io.StringIO("\n".join(code) + "\n"), io.StringIO(), io.StringIO()
    sqlite_shell.main("sqlite3", stdin=stdin, stdout=stdout, stderr=stderr)
    got = [l.rstrip() for l in (stderr.getvalue() + "\n" + stdout.getvalue()).strip().split("\n") if l.strip()]
    texts = [w for w, h in want]
    if any(h for _, h in want):
        ok = len(got) == len(want) and all(line_matches(key, g, w, h) for g, (w, h) in zip(got, want))
    elif suite.get("ordered"):
        ok = got == texts
    else:
        ok = sorted(got) == sorted(texts)
    shown = "\n".join(l for l in case["code"].strip().split("\n") if strip_prompt(l.strip(), PS1 + PS2) is not None)
    cases.append({"ok": ok, "code": textwrap.dedent(shown), "got": clip("\n".join(got)), "want": render_want(want), "error": None})
    return ok


def judge_ok_test(test_path, key):
    env = {}
    with open(test_path, encoding="utf-8") as f:
        exec(compile(f.read(), test_path, "exec"), env)
    test = env["test"]
    # doctest：调用学员代码；wwpp（"What Would Python Print"）：会话格式相同，解锁后 ok 也是这样跑
    # scheme：scm> 会话；sqlite：整段交给 sqlite3，一个 case 一个用例
    suites = [s for s in test["suites"] if s.get("type") in ("doctest", "wwpp", "scheme", "sqlite")]
    total = sum(1 if s.get("type") == "sqlite" else max(1, count_cases(c["code"])) for s in suites for c in s["cases"])
    cases = []
    for suite in suites:
        for case in suite["cases"]:
            before = len(cases)
            if suite.get("type") in ("scheme", "sqlite"):
                judge_case = judge_scheme_case if suite["type"] == "scheme" else judge_sqlite_case
                if not judge_case(suite, case, key, cases):
                    return {"name": test["name"], "total": total, "passed": sum(c["ok"] for c in cases), "cases": cases, "fatal": None}
                no_output_case(case, cases, before)
                continue
            scope = {}
            ok = True
            try:
                if suite.get("setup") and not run_setup(suite["setup"], scope, cases):
                    ok = False
                elif not run_session(case["code"], scope, key, cases):
                    ok = False
            finally:
                if suite.get("teardown"):
                    run_setup(suite["teardown"], scope, [])
            if not ok:
                return {"name": test["name"], "total": total, "passed": sum(c["ok"] for c in cases), "cases": cases, "fatal": None}
            no_output_case(case, cases, before)
    return {"name": test["name"], "total": total, "passed": sum(c["ok"] for c in cases), "cases": cases, "fatal": None}


def no_output_case(case, cases, before):
    """整个 case 都没有期望输出（只要求不报错，例如 hog 的 check_strategy）：跑完没出错就记一个通过的用例"""
    if len(cases) == before and count_cases(case["code"]) == 0:
        steps = [code for code, _ in parse_session(case["code"])]
        cases.append({"ok": True, "code": clip("\n".join(steps)), "got": "", "want": "", "error": None})


def main():
    question, key, sources = sys.argv[1], sys.argv[2], sys.argv[3:]
    # 结果行带一个随机串，学员代码打印的假结果对不上；读完就从环境里删掉
    nonce = os.environ.pop("HIANA_NONCE", "")
    sys.path.insert(0, os.getcwd())
    # 一道题可以对应几个 ok 问题（空格隔开，例如 "Card.__init__ Card.power"），用例按顺序合在一起
    parts = []
    for q in question.split():
        test_path = os.path.join("tests", q + ".py")
        try:
            parts.append(judge_ok_test(test_path, key) if os.path.exists(test_path) else judge_doctest(q, key, sources))
        except BaseException as e:  # noqa: BLE001
            parts.append({"name": q, "total": 0, "passed": 0, "cases": [], "fatal": short_traceback(e)})
    result = {
        "name": question,
        "total": sum(r["total"] for r in parts),
        "passed": sum(r["passed"] for r in parts),
        "cases": [c for r in parts for c in r["cases"]],
        "fatal": next((r["fatal"] for r in parts if r["fatal"]), None),
    }
    # 沙箱的输出有上限：通过的用例只留语句开头，不留输出（用例多的题，比如 hog 第 5 题有 100 个）
    for c in result["cases"]:
        if c["ok"]:
            c["code"] = c["code"][:200]
            c["got"] = c["want"] = ""
    sys.stdout.flush()
    print("\n" + RESULT_MARK + nonce + json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
