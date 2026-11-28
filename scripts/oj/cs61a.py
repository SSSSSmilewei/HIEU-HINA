"""CS61A 作业 → OJ 作业包（故事 3.1）。

    python3 -I scripts/oj/cs61a.py <cs61a-spring-2026 存档目录> lab01 [hw01 ...]
    python3 -I scripts/oj/cs61a.py <存档目录> --all
    python3 -I scripts/oj/cs61a.py --fa20 <CS61A-CN 目录> --all

两个来源，同一个课程条目可以有两个版本，做题时可以切换（像视频换源）：
- 2026 春季（默认）：github.com/lr2933/cs61a-spring-2026（学员整理的 UC Berkeley CS 61A 2026 春季课程网站存档），英文原文，
  中文由我们翻译，放在 content/oj/sources/cs61a/zh/<作业>.json；
- 2020 秋季（--fa20）：github.com/chillyhigh/CS61A-CN（2020 秋季课程网站镜像，带社区中文翻译，MIT 许可），
  每个作业目录有中文 index.html、英文 EN.html 和起始代码 zip。作业编号加前缀 fa20-，按主题对应到 2026 春季的课程条目。
每份作业：
- 起始代码：<类型>/<作业>/<作业>.zip 原样解压（不要 ok 客户端本身）；
- 题目：<类型>/<作业>/index.html 里每个「Qn: 标题」小节，要有 `python3 ok -q <问题名>` 才算一道 OJ 题；
  题面里官方藏起来的解答（<solution>、.solution）一律去掉；
- 中文：content/oj/sources/cs61a/zh/<作业>.json（人工或 AI 翻译后人工核对），没有的题先用英文原文并注明。
输出 content/oj/assignments/cs61a/<作业>/assignment.json 和 files/。重复运行结果相同。
"""
import html
import io
import urllib.parse
import json
import os
import re
import shutil
import sys
import textwrap
import zipfile
from html.parser import HTMLParser

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "content", "oj", "assignments", "cs61a")
ZH = os.path.join(ROOT, "content", "oj", "sources", "cs61a", "zh")
SEMESTER = "sp26"
SITE = "https://cs61a.org"
LICENSE = "题目、起始代码与测试 © UC Berkeley CS 61A（2026 春季，存档见 github.com/lr2933/cs61a-spring-2026），仅供协会内部学习交流；中文翻译 海纳协会"
FA20_SITE = "https://inst.eecs.berkeley.edu/~cs61a/fa20"
FA20_LICENSE = "题目、起始代码与测试 © UC Berkeley CS 61A（2020 秋季）；中文翻译来自 github.com/chillyhigh/CS61A-CN（MIT 许可）。仅供协会内部学习交流"
# 2020 秋季作业 → 2026 春季课程条目（按主题对应）。期中复习（lab03、lab09）和 Scheme（hw06）不收
FA20_ITEM = {
    "lab01": "lab01", "lab02": "lab02", "lab04": "lab03", "lab05": "lab04", "lab06": "lab05", "lab07": "lab06", "lab08": "lab07",
    "hw01": "hw01", "hw02": "hw03", "hw03": "hw04", "hw04": "hw05", "hw05": "hw06",
}
CJK = re.compile(r"[\u4e00-\u9fff]")
KINDS = {"lab": "lab", "hw": "hw", "disc": "disc", "proj": "proj"}
PROJECTS = ["hog", "cats", "ants", "scheme"]
# 项目里只用于图形界面、本地服务器的文件不收（图形界面在站内另做）
PROJECT_SKIP = ("libs/", "static/", "gui_files/", "images/", "favicons/", "multiplayer/", "diagram/")
SKIP_FILES = {"ok"}
UNTRANSLATED = "> 中文翻译还没做好，下面是官方英文原文。\n\n"


class Md(HTMLParser):
    """够用就好的 HTML → Markdown：段落、代码块、行内代码、粗斜体、链接、列表、引用。"""

    def __init__(self, base):
        super().__init__(convert_charrefs=True)
        self.base = base
        self.out = []
        self.skip = 0  # 在要跳过的元素里（解答、脚本、按钮）
        self.pre = 0
        self.lists = []
        self.href = []

    def emit(self, s):
        if not self.skip:
            self.out.append(s)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class") or ""
        if self.skip or tag in ("solution", "script", "button", "style") or "solution" in cls.split() or "alt" in cls.split() and self.pre:
            if tag not in ("br", "img", "input", "hr"):
                self.skip += 1
            return
        if tag == "pre":
            self.pre += 1
            self.emit("\n\n```\n")
        elif tag == "code" and not self.pre:
            self.emit("`")
        elif tag in ("strong", "b"):
            self.emit("**")
        elif tag in ("em", "i"):
            self.emit("*")
        elif tag == "a":
            href = a.get("href") or ""
            if href and not href.startswith(("http", "#", "mailto")):
                href = urllib.parse.urljoin(self.base + "/", href)
            self.href.append(href)
            self.emit("[")
        elif tag == "p":
            self.emit("\n\n")
        elif tag == "br":
            self.emit("\n")
        elif tag in ("ul", "ol"):
            self.lists.append([tag, 0])
            self.emit("\n")
        elif tag == "li":
            kind = self.lists[-1] if self.lists else ["ul", 0]
            kind[1] += 1
            self.emit("\n" + "  " * (len(self.lists) - 1) + ("- " if kind[0] == "ul" else f"{kind[1]}. "))
        elif tag in ("h4", "h5"):
            self.emit("\n\n#### ")
        elif tag == "blockquote":
            self.emit("\n\n> ")
        elif tag == "div" and "alt" in cls.split():
            pass

    def handle_endtag(self, tag):
        if self.skip:
            if tag not in ("br", "img", "input", "hr"):
                self.skip -= 1
            return
        if tag == "pre":
            self.pre = max(0, self.pre - 1)
            self.emit("\n```\n\n")
        elif tag == "code" and not self.pre:
            self.emit("`")
        elif tag in ("strong", "b"):
            self.emit("**")
        elif tag in ("em", "i"):
            self.emit("*")
        elif tag == "a":
            href = self.href.pop() if self.href else ""
            self.emit(f"]({href})" if href else "]")
        elif tag in ("ul", "ol"):
            if self.lists:
                self.lists.pop()
            self.emit("\n\n")
        elif tag == "p":
            self.emit("\n\n")

    def handle_data(self, data):
        if self.skip:
            return
        if not self.pre:
            data = re.sub(r"\s+", " ", data)
        self.emit(data)

    def text(self):
        s = "".join(self.out)
        s = re.sub(r"[ \t]+\n", "\n", s)
        # 「用 ok 测试」的说明和命令在站内没有用：站内直接点运行、提交
        s = re.sub(r"(?:(?:Use Ok to|使用 ?Ok)[^\n]*\n+)?```\npython3 ok[^\n]*\n```\n", "", s)
        s = re.sub(r"^>\s*$", "", s, flags=re.M)
        s = re.sub(r"\n{3,}", "\n\n", s)
        return s.strip() + "\n"


def to_md(fragment, base):
    p = Md(base)
    p.feed(fragment)
    return p.text()


def sections(page):
    """index.html 里每个 <h3>Qn: 标题</h3> 到下一个 h2/h3 之间的内容。"""
    # 正文到右侧目录栏为止
    cut = page.find("<div class='col-md-3")
    page = page[:cut] if cut > 0 else page
    heads = list(re.finditer(r"<h([23])[^>]*>(.*?)</h\1>", page, re.S))
    out = []
    for i, m in enumerate(heads):
        title = html.unescape(re.sub(r"<[^>]+>", "", m.group(2))).strip()
        q = re.match(r"Q(\d+):\s*(.+)", title)
        # 项目页的写法：Problem 3 (2 pt)、Optional: Problem 12 (0 pt)、Extra Credit
        pq = re.match(r"(?:Optional:\s*)?Problem\s+(\w+)\b.*", title)
        if m.group(1) != "3" or not (q or pq):
            continue
        end = heads[i + 1].start() if i + 1 < len(heads) else len(page)
        if q:
            out.append((int(q.group(1)), q.group(2).strip(), page[m.end() : end]))
        else:
            out.append((0, title, page[m.end() : end]))
    return out


def question_kind(files, q):
    path = f"tests/{q}.py"
    if path not in files:
        return "function"
    types = set(re.findall(r"'type':\s*'(\w+)'", files[path]))
    if types & {"concept", "wwpp"}:
        return "wwpd"
    # Scheme 的「预测输出」（What Would Scheme Display）：scheme 会话里有加密的期望输出
    # 写代码题的测试也可能被锁着（ok 要先解锁再写），所以只认官方的命名 wwsd-*（What Would Scheme Display）
    if "scheme" in types and q.lower().startswith("wwsd"):
        return "wwpd"
    return "function"


sys.path.insert(0, os.path.join(ROOT, "judge", "harness"))
from ok_judge import parse_session  # noqa: E402  和判题用同一个会话解析


def suite_types(test_src):
    env = {}
    exec(compile(test_src, "test", "exec"), env)
    return [suite.get("type") for suite in env["test"]["suites"]]


def unlock_items(test_src, only=None):
    """预测输出题：官方 ok 测试里的会话（wwpp）和选择题（concept）→ 题目的 unlock。"""
    env = {}
    exec(compile(test_src, "test", "exec"), env)
    items = []
    for suite in env["test"]["suites"]:
        if only and suite.get("type") not in only:
            continue
        for case in suite["cases"]:
            if suite.get("type") == "concept":
                items.append({"type": "choice", "question": textwrap.dedent(case["question"]).strip(), "choices": [textwrap.dedent(c).strip() for c in case["choices"]], "answer": case["answer"]})
            elif suite.get("type") in ("wwpp", "doctest", "scheme"):
                steps = [{"code": code, "want": [{"hash": w} if h else {"text": w} for w, h in want]} for code, want in parse_session(case["code"])]
                items.append({"type": "session", "steps": steps})
    return items


def read_zip(path):
    files = {}
    with zipfile.ZipFile(path) as z:
        for info in z.infolist():
            if info.is_dir():
                continue
            parts = info.filename.split("/")[1:]  # 去掉顶层的 lab01/
            rel = "/".join(parts)
            if not rel or rel in SKIP_FILES or "__pycache__" in parts or rel.endswith(".pyc") or rel.startswith(("editor/static/", "editor/libraries/") + PROJECT_SKIP):
                continue
            data = z.read(info)
            try:
                files[rel] = data.decode("utf-8")
            except UnicodeDecodeError:
                continue  # 二进制文件（图片等）先不收
    return files


LANG_BY_EXT = {".py": "python", ".scm": "scheme", ".sql": "sql"}


def src_for_test(srcs, test_src):
    """ok_test 文件对应哪个源文件：sqlite 测试 → .sql，scheme 测试 → .scm，否则第一个"""
    kinds = set(re.findall(r"'type':\s*'(\w+)'", test_src))
    want = ".sql" if "sqlite" in kinds else ".scm" if "scheme" in kinds else ".py"
    return next((f for f in srcs if f.endswith(want)), srcs[0])


TUTOR = re.compile(r'src="https://pythontutor\.com/[^"]*?[#?&]code=([^&"]+)')


def env_problem(title, frag, base, taken):
    """「画环境图」的题：程序在 PythonTutor 嵌入地址的 code= 参数里 → 环境图题（判题服务实际运行后逐帧比对）"""
    m = TUTOR.search(html.unescape(frag))
    if not m:
        return None
    code = urllib.parse.unquote_plus(m.group(1))
    if "import " in code or "input(" in code:
        return None
    pid = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:40] or "env"
    while pid in taken:
        pid += "-2"
    en = to_md(frag, base)
    return {
        "id": pid,
        "title": f"环境图：{title}"[:80],
        "titleEn": title[:80],
        "kind": "envdiagram",
        "languages": ["python"],
        "statement": UNTRANSLATED + en,
        "statementEn": en,
        "editable": [],
        "tests": {"kind": "envdiagram", "code": code},
    }


def ok_questions(frag):
    """小节里所有 `python3 ok -q 名字`，按出现顺序去重（一节可能有几个，如 Card.__init__、Card.power）"""
    out = []
    for q in re.findall(r"python3 ok -q ([\w.-]+)", html.unescape(frag)):
        if q not in out:
            out.append(q)
    return out


def page_title(page):
    """2020 秋季镜像的标题是「实验2: 高阶函数 Lab 2: ...」，取中文部分并统一写法"""
    m = re.search(r"<h1>(.*?)</h1>", page, re.S)
    t = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", m.group(1)))).strip() if m else ""
    t = re.split(r"\s+(?:Lab|Homework)\s+\d", t)[0]
    m = re.match(r"(实验|作业)\s*(\d+)\s*[:：]\s*(.+)", t)
    return f"{m.group(1)} {int(m.group(2))}：{m.group(3).strip()}" if m else t


def build(src, aid, fa20=False, kind=None):
    """kind 为 proj 时是项目（hog、cats、ants、scheme）：按 Problem 分题，题与题共用同一份代码，可改的是 ok 配置里的全部源文件"""
    project = kind == "proj"
    kind = kind or re.match(r"[a-z]+", aid).group(0)
    folder = os.path.join(src, KINDS[kind], aid)
    page = open(os.path.join(folder, "index.html"), encoding="utf-8").read()
    files = read_zip(os.path.join(folder, f"{aid}.zip"))
    okfile = next(p for p in files if p.endswith(".ok") and "/" not in p)
    ok = json.loads(files[okfile])
    out_id = f"fa20-{aid}" if fa20 else aid
    zh_path = os.path.join(ZH, f"{out_id}.json")
    zh = json.load(open(zh_path, encoding="utf-8")) if os.path.exists(zh_path) else {}
    zq = zh.get("problems", {})
    if fa20:
        base = f"{FA20_SITE}/{KINDS[kind]}/{aid}"
        en_path = os.path.join(folder, "EN.html")
        en_sections = {}
        if os.path.exists(en_path):
            for _, t_en, f_en in sections(open(en_path, encoding="utf-8").read()):
                qs = ok_questions(f_en)
                if qs:
                    en_sections[qs[0]] = (t_en, f_en)
    else:
        base = f"{SITE}/{KINDS[kind]}/{aid}"
    problems = []
    for n, title, frag in sections(page):
        qs = ok_questions(frag)
        if not qs:
            ep = None if fa20 else env_problem(title, frag, base, {p["id"] for p in problems})
            if ep:
                problems.append(ep)
            continue
        q = qs[0]
        if "survey" in q:
            continue  # 问卷（要填官方表单拿口令），不是题
        t = zq.get(q, {})
        if fa20:
            md = to_md(frag, base)
            title_en, frag_en = en_sections.get(q, (title, frag))
            en = to_md(frag_en, base)
            # 有中文，或者去掉代码后没有英文句子（只有代码的题面不用翻译）
            prose = re.sub(r"```.*?```|`[^`]*`", "", md, flags=re.S)
            translated = len(CJK.findall(md)) >= 10 or not re.search(r"[A-Za-z]{2,}(?: [A-Za-z]{2,}){3}", prose)
            statement = t.get("statement") or (md if translated else UNTRANSLATED + en)
            title_zh = t.get("title") or re.sub(r"^WWPD:\s*", "预测输出：", title)
        else:
            title_en = title
            en = to_md(frag, base)
            statement = t.get("statement") or (UNTRANSLATED + en)
            title_zh = t.get("title") or title_en
        k = question_kind(files, q)
        concept_first = None
        if project:
            # 项目的测试一般是：先回答几道理解题（concept），再跑代码测试。只有理解题的才算预测输出题；
            # 其余按写代码判（代码测试里加密的期望输出照样能比），理解题拆成前面单独的一道
            types = [t for x in qs if f"tests/{x}.py" in files for t in suite_types(files[f"tests/{x}.py"])]
            k = "wwpd" if types and all(t == "concept" for t in types) else "function"
            if k == "function" and "concept" in types:
                items = [it for x in qs if f"tests/{x}.py" in files for it in unlock_items(files[f"tests/{x}.py"], only={"concept"})]
                concept_first = items
        head = q.split(".")[0]
        # 要改的文件：定义了这个函数或类的源文件（lab07 的卡牌游戏在 classes.py 里）
        src_file = next((f for f in ok["src"] if re.search(rf"^(?:def|class) {re.escape(head)}\b", files.get(f, ""), re.M)), None) or src_for_test(ok["src"], files.get(f"tests/{q}.py", ""))
        if project:
            # 项目：主文件（hog.py、cats.py……）优先显示，所有源文件都能改
            src_file = next((f for f in ok["src"] if f.startswith(aid + ".")), ok["src"][0])
        has_def = re.search(rf"^(?:def|class) {re.escape(head)}\b", files.get(src_file, ""), re.M)
        pid = head if re.fullmatch(r"[a-z0-9][a-z0-9_-]*", head) else head.lower().replace("_", "-")
        p = {
            "id": pid,
            "title": title_zh[:80],
            "titleEn": title_en[:80],
            "kind": k,
            "languages": [LANG_BY_EXT[os.path.splitext(src_file)[1]]],
            "statement": statement,
            "statementEn": en,
            "editable": ([src_file] + [f for f in ok["src"] if f != src_file]) if project else [src_file],
            "tests": {"kind": "ok", "question": " ".join(qs)},
        }
        if has_def:
            p["focus"] = {"file": src_file, "symbol": head}
        if k == "wwpd":
            p["unlock"] = unlock_items(files[f"tests/{q}.py"], only={"concept"} if project else None)
        if concept_first:
            problems.append({
                **{key: p[key] for key in ("languages", "statementEn")},
                "id": f"{p['id']}-concept",
                "title": f"{p['title']} · 先回答几个问题"[:80],
                "titleEn": f"{title_en} · Understanding"[:80],
                "kind": "wwpd",
                "statement": "动手写代码之前，先回答几道理解题，确认读懂了题目要求（官方 ok 要求先「解锁」这些题才能跑测试）。题目说明见下一道题。\n",
                "editable": p["editable"],
                "tests": {"kind": "ok", "question": " ".join(qs)},
                "unlock": concept_first,
            })
        for key in ("hints", "knowledge", "explain"):
            if t.get(key):
                p[key] = t[key]
        problems.append(p)
    if not problems:
        print(f"{aid}: 跳过，没有能在 OJ 上判的题（例如 lab00 是装环境）")
        return
    untranslated = sum(1 for p in problems if p["statement"].startswith(UNTRANSLATED))
    assignment = {
        "format": "hiana-assignment@1",
        "course": "cs61a",
        "id": out_id,
        "title": zh.get("title") or (page_title(page) if fa20 else course_item_title(f"proj-{aid}" if project else aid)) or ok.get("name", aid),
        "semester": "fa20" if fa20 else SEMESTER,
        "language": "zh" if untranslated * 2 < len(problems) else "en",
        "source": f"{base}/",
        "license": FA20_LICENSE if fa20 else LICENSE,
        "item": FA20_ITEM[aid] if fa20 else f"proj-{aid}" if project else aid,
        "repoDir": f"fa20/{KINDS[kind]}/{aid}" if fa20 else f"{KINDS[kind]}/{aid}",
        "intro": zh.get("intro", ""),
        "problems": problems,
    }
    out = os.path.join(OUT, out_id)
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(os.path.join(out, "files"))
    for rel, content in sorted(files.items()):
        dst = os.path.join(out, "files", rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        with open(dst, "w", encoding="utf-8", newline="\n") as f:
            f.write(content)
    with open(os.path.join(out, "assignment.json"), "w", encoding="utf-8") as f:
        json.dump(assignment, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"{out_id}: {len(problems)} 道题（{untranslated} 道还没有中文），{len(files)} 个文件")


EDITOR = re.compile(r"activateEditor\('((?:[^'\\]|\\.)*)',\s*\"(\w+)\",\s*\"([\w-]+)-input\"\)")


def js_string(raw):
    """activateEditor('...') 里的 JS 字符串 → 源代码"""
    out = re.sub(r"\\(.)", lambda m: {"n": "\n", "t": "\t"}.get(m.group(1), m.group(1)), raw)
    return html.unescape(out)


def fix_indent(code):
    """页面里有的代码第一行顶格、后面多缩进了一层（disc10 的 print_evals），统一成标准的 4 格"""
    code = textwrap.dedent(code)
    lines = code.split("\n")
    rest = [l for l in lines[1:] if l.strip()]
    if lines and not lines[0].startswith(" ") and rest:
        extra = min(len(l) - len(l.lstrip(" ")) for l in rest) - 4
        if extra > 0:
            lines = lines[:1] + [l[extra:] if l.startswith(" " * extra) else l for l in lines[1:]]
    return "\n".join(lines)


HELPERS = "cs61a_helpers.py"
HELPER_NAMES = re.compile(r"\b(?:tree|label|branches|is_leaf|is_tree|print_tree|copy_tree|Link|Tree)\b")


def helpers_source(src):
    """讨论课网页上默认能用的 tree 抽象数据类型、Link、Tree 类：从 2026 春季 lab05 的 tree.py 和 hw06.py 里原样取出"""
    import ast
    import warnings
    tree_py = read_zip(os.path.join(src, "lab", "lab05", "lab05.zip"))["tree.py"]
    hw06 = read_zip(os.path.join(src, "hw", "hw06", "hw06.zip"))["hw06.py"]
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", SyntaxWarning)  # 官方 hw06.py 的文档字符串里有 "\s"，不影响
        mod = ast.parse(hw06)
    classes = []
    for node in mod.body:
        if isinstance(node, ast.ClassDef) and node.name in ("Link", "Tree") and node.name not in [c[0] for c in classes]:
            classes.append((node.name, ast.get_source_segment(hw06, node)))
    head = '"""讨论课默认提供的工具：tree 抽象数据类型（lab05 的 tree.py）、Link 和 Tree 类（hw06）。只读。"""\n\n'
    return head + tree_py.strip() + "\n\n\n" + "\n\n\n".join(c[1] for c in classes) + "\n"


def course_item_title(item):
    course = json.load(open(os.path.join(ROOT, "content", "courses", "cs61a", "course.json"), encoding="utf-8"))
    for m in course["modules"]:
        for it in m["items"]:
            if it["id"] == item:
                return it["title"]
    return item


def build_disc(src, aid):
    """讨论课（2026 春季）：没有 zip 和 ok 测试。每道写代码的题，起始代码在页面的 activateEditor('…') 里，
    自带 doctest；一题一个文件，补一个 .ok 配置，就能和 lab 一样判。解答页的官方解答和提示 → explain、hints（通过后才显示讲解）。"""
    folder = os.path.join(src, "disc", aid)
    page = open(os.path.join(folder, "index.html"), encoding="utf-8").read()
    sol_path = os.path.join(src, "disc", f"sol-{aid}", "index.html")
    sol = {}
    if os.path.exists(sol_path):
        for _, _, frag in sections(open(sol_path, encoding="utf-8").read()):
            m = EDITOR.search(frag)
            if m:
                sol[m.group(3)] = frag
    base = f"{SITE}/disc/{aid}"
    files, problems = {}, []
    for n, title_en, frag in sections(page):
        m = EDITOR.search(frag)
        if not m:
            ep = env_problem(title_en, frag, base, {p["id"] for p in problems})
            if ep:
                problems.append(ep)
            continue
        if m.group(2) != "python":
            continue
        code, name = fix_indent(js_string(m.group(1))), m.group(3)
        if ">>>" not in code or not re.search(rf"^(?:def|class) {re.escape(name)}\b", code, re.M):
            continue  # 没有 doctest 的题（画环境图、口头讨论）判不了
        if re.search(r"\bnil\b", code):
            continue  # 用 Scheme 解释器里的 Pair / nil 的题，等 Scheme 部分（故事 3.4）
        path = f"{name}.py"
        if HELPER_NAMES.search(code):
            code = f"from cs61a_helpers import *  # tree、Link、Tree 等讨论课默认提供的工具\n\n\n{code}"
            files[HELPERS] = helpers_source(src)
        files[path] = code.rstrip() + "\n"
        en = to_md(frag, base)
        p = {
            "id": name if re.fullmatch(r"[a-z0-9][a-z0-9_-]*", name) else name.lower().replace("_", "-"),
            "title": title_en[:80],
            "titleEn": title_en[:80],
            "kind": "function",
            "languages": ["python"],
            "statement": UNTRANSLATED + en,
            "statementEn": en,
            "editable": [path],
            "focus": {"file": path, "symbol": name},
            "tests": {"kind": "ok", "question": name},
        }
        sf = sol.get(name)
        if sf:
            hints = [to_md(h, base).strip() for h in re.findall(r'<div class="solution toggle-\d+">(.*?)</div>', sf, re.S)]
            hints = [h for h in hints if h][:3]
            if hints:
                p["hints"] = hints
            code_sol = re.search(r"<b>Solution</b>\s*<pre><code>(.*?)</code></pre>", sf, re.S)
            if code_sol:
                p["explain"] = "官方解答：\n\n```python\n" + fix_indent(html.unescape(code_sol.group(1))).rstrip() + "\n```\n"
        problems.append(p)
    if not problems:
        shutil.rmtree(os.path.join(OUT, aid), ignore_errors=True)  # 以前导出过的旧版本也去掉
        print(f"{aid}: 跳过，没有带 doctest 的 Python 题")
        return
    num = int(re.sub(r"\D", "", aid))
    files[f"{aid}.ok"] = json.dumps({"name": f"Discussion {num}", "src": sorted(f for f in files if f.endswith(".py") and f != HELPERS)}, indent=4) + "\n"
    assignment = {
        "format": "hiana-assignment@1",
        "course": "cs61a",
        "id": aid,
        "title": course_item_title(aid),
        "semester": SEMESTER,
        "language": "en",
        "source": f"{base}/",
        "license": LICENSE,
        "item": aid,
        "repoDir": f"disc/{aid}",
        "intro": "讨论课的题目原本是小组在纸上一起做的。这里收了能自动判对错的两类题：写代码的题（用官方 doctest 判，做对之后题目下方显示官方解答），和画环境图的题（先在纸上画，再把每一帧填进来，判题服务实际运行程序后逐帧比对）。口头讨论的题请看讲义页的官方讲义。",
        "problems": problems,
    }
    out = os.path.join(OUT, aid)
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(os.path.join(out, "files"))
    for rel, content in sorted(files.items()):
        with open(os.path.join(out, "files", rel), "w", encoding="utf-8", newline="\n") as f:
            f.write(content)
    with open(os.path.join(out, "assignment.json"), "w", encoding="utf-8") as f:
        json.dump(assignment, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"{aid}: {len(problems)} 道题（讨论课）")


def main():
    args = sys.argv[1:]
    fa20 = args[:1] == ["--fa20"]
    if fa20:
        args = args[1:]
    src, names = args[0], args[1:]
    if names == ["--all"]:
        if fa20:
            names = list(FA20_ITEM)
        else:
            names = []
            for kind in ("lab", "hw", "disc"):
                d = os.path.join(src, kind)
                names += sorted(n for n in os.listdir(d) if re.fullmatch(rf"{kind}\d+", n) and (kind == "disc" or os.path.exists(os.path.join(d, n, f"{n}.zip"))))
            names += [p for p in PROJECTS if os.path.exists(os.path.join(src, "proj", p, f"{p}.zip"))]
    for aid in names:
        if aid in PROJECTS and not fa20:
            build(src, aid, kind="proj")
        elif aid.startswith("disc") and not fa20:
            build_disc(src, aid)
        else:
            build(src, aid, fa20)


if __name__ == "__main__":
    main()
