"""写练手题用的小工具（各门课的生成脚本共用）。

题目格式见 src/shared/package.ts。代码题的预期输出一律用参考答案实际运行得到，不手写。
"""
import sqlite3, subprocess, sys, textwrap

HARNESS = '''

# ---- 以下是判题用的代码，请不要修改 ----
import sys
for _line in sys.stdin.read().split("\\n"):
    if not _line.strip():
        continue
    try:
        _code = compile(_line, "<测试>", "eval")
    except SyntaxError:
        exec(_line)
    else:
        _value = eval(_code)
        if _value is not None:
            print(repr(_value))
'''


def choice(id, prompt, options, answer, explain, origin="official"):
    opts = list(options)
    assert 0 <= answer < len(opts), id
    return {"id": id, "type": "choice", "prompt": prompt, "options": opts, "answer": answer, "explain": explain, "origin": origin}


def text(id, prompt, answers, explain, origin="official"):
    if isinstance(answers, str):
        answers = [answers]
    return {"id": id, "type": "text", "prompt": prompt, "answer": list(answers), "explain": explain, "origin": origin}


def _run(src, stdin):
    r = subprocess.run([sys.executable, "-I", "-c", src], input=stdin, capture_output=True, text=True, timeout=30)
    if r.returncode != 0:
        raise SystemExit(f"参考答案运行出错：\n{src}\n---\n{r.stderr}")
    return r.stdout


def func(id, title, prompt, starter, solution, calls, hint=None, explain=None, origin="official"):
    """函数题：学员实现 starter 里的函数；每个测试是若干行代码，判题时逐行执行，和交互式解释器一样：
    表达式打印返回值的 repr（None 不打印），赋值等语句只执行；函数自己 print 的内容也算输出。
    calls：[(测试名, ["f(1)", "f(2)"]), ...]"""
    starter = textwrap.dedent(starter).strip("\n") + "\n" + HARNESS
    solution = textwrap.dedent(solution).strip("\n") + "\n" + HARNESS
    tests = []
    for name, lines in calls:
        stdin = "\n".join(lines) + "\n"
        tests.append({"name": name, "stdin": stdin, "stdout": _run(solution, stdin)})
    q = {"id": id, "type": "code", "lang": "python", "title": title, "prompt": prompt, "starter": starter, "tests": tests, "solution": solution, "origin": origin}
    if hint:
        q["hint"] = hint
    if explain:
        q["explain"] = explain
    return q


def program(id, title, prompt, starter, solution, inputs, hint=None, origin="official"):
    """读标准输入、写标准输出的完整程序题。inputs：[(测试名, 标准输入), ...]"""
    solution = textwrap.dedent(solution).strip("\n") + "\n"
    tests = [{"name": n, "stdin": s, "stdout": _run(solution, s)} for n, s in inputs]
    q = {"id": id, "type": "code", "lang": "python", "title": title, "prompt": prompt, "starter": textwrap.dedent(starter).strip("\n") + "\n",
         "tests": tests, "solution": solution, "origin": origin}
    if hint:
        q["hint"] = hint
    return q


def sql(id, title, prompt, setup, solution, ordered=False, hint=None, origin="official"):
    db = sqlite3.connect(":memory:")
    db.executescript(setup)
    rows = db.execute(solution).fetchall()
    assert rows, f"{id}：参考答案没有查到任何行"
    q = {"id": id, "type": "code", "lang": "sql", "title": title, "prompt": prompt, "starter": "SELECT ", "tests": [], "setup": setup,
         "solution": solution, "origin": origin}
    if ordered:
        q["ordered"] = True
    if hint:
        q["hint"] = hint
    return q


WWPD_NOTE = "（如果会报错，填 `Error`；如果显示的是一个函数，填 `Function`；如果什么都不显示，填 `Nothing`。字符串要带上引号，和解释器显示的一样。）"
_ALIASES = {"Error": ["错误", "报错"], "Function": ["函数"], "Nothing": ["无", "什么都不显示", "不显示"]}


def wwpd(id, setup, expr, answers, explain, source, lang="py", origin="official"):
    """「Python 会显示什么」题（What Would Python Display）→ 填空题。
    setup：已经依次输入的代码（可以为空）；expr：接着输入的表达式；answers：可接受的答案。"""
    if isinstance(answers, str):
        answers = [answers]
    acc = list(answers)
    for a in answers:
        acc += _ALIASES.get(a, [])
        if len(a) >= 2 and a[0] == a[-1] == "'":
            acc.append('"' + a[1:-1] + '"')
    ctx = f"下面的代码已经在交互式解释器里依次输入：\n\n```{lang}\n{setup.strip()}\n```\n\n" if setup.strip() else ""
    prompt = f"{source}\n\n{ctx}接着输入 `{expr}`，解释器会显示什么？\n\n{WWPD_NOTE}"
    return text(id, prompt, acc, explain, origin)
