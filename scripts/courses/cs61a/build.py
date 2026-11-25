"""生成 content/courses/cs61a/（课程包 + 讲义页）。

用法（在仓库根目录）：python3 scripts/courses/cs61a/build.py

数据来源（下载后缓存在 .staging/course-cache/cs61a/，不进仓库）：
- 课表：CS61A 2026 春季课程网站的存档镜像 github.com/lr2933/cs61a-spring-2026（index.html）。
- 讲义：教材 Composing Programs（John DeNero，CC BY-NC-SA）的中文翻译
  github.com/csfive/composing-programs-zh，固定在下面的提交 ZH_SHA。
- 自编讲义：本目录 notes/lecNN.md（教材没有对应小节的几讲）。
- 题目说明：本目录 assignments/<条目 id>.md。
- 练手题：本目录 practice.py。

课程包的基本信息、中文介绍沿用 content/courses/cs61a/course.json 里已有的内容。
"""
import json, os, re, sys, urllib.parse, urllib.request
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "../../.."))
OUT = os.path.join(ROOT, "content/courses/cs61a")
CACHE = os.path.join(ROOT, ".staging/course-cache/cs61a")
sys.path.insert(0, HERE)

MIRROR = "lr2933/cs61a-spring-2026"
SITE = "https://lr2933.github.io/cs61a-spring-2026/"
ZH_REPO = "csfive/composing-programs-zh"
ZH_SHA = "8943e57c5e890da12f373d109d40fd9beea14271"
BILI = "BV1sy411z7nA"  # 【CS61A 精翻双语】2024，与 2026 春季是同一套 John DeNero 录制的视频


def fetch(url, name):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, name)
    if not os.path.exists(path):
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
        with open(path, "wb") as f:
            f.write(data)
    return open(path, encoding="utf8", errors="ignore").read()


def raw(path, name):
    return fetch(f"https://raw.githubusercontent.com/{MIRROR}/HEAD/{path}", name)


def L(kind, label, url):
    return {"kind": kind, "label": label[:80], "url": url}


# ---------------------------------------------------------------- 教材翻译

def zh_section(chap, sec):
    return fetch(f"https://raw.githubusercontent.com/{ZH_REPO}/{ZH_SHA}/sicp/{chap}/{sec}.md", f"zh-{chap}-{sec}.md")


def tutor_block(m):
    src = m.group(1)
    code = urllib.parse.unquote(re.search(r"#code=([^&]*)", src).group(1))
    enc = urllib.parse.quote(code, safe="")
    link = f"https://pythontutor.com/visualize.html#code={enc}&cumulative=true&curInstr=0&mode=display&origin=opt-frontend.js&py=3&rawInputLstJSON=%5B%5D"
    return f"```py\n{code.rstrip()}\n```\n\n[在 Python Tutor 中逐步运行这段代码，查看环境图]({link})"


def clean(md):
    md = re.sub(r"::: details INFO\s*\n.*?\n:::\s*\n", "", md, flags=re.S)
    md = re.sub(r"<iframe[^>]*?src=\"([^\"]+)\"[^>]*>\s*</iframe>", tutor_block, md)
    md = re.sub(r"\]\(/sicp/([^)]+)\)", lambda m: f"](https://cdn.jsdelivr.net/gh/{ZH_REPO}@{ZH_SHA}/sicp/public/sicp/{m.group(1)})", md)
    return md.strip() + "\n"


def split_sections(md):
    """→ (标题行之前的引言, [(小节编号, 小节全文)])"""
    parts = re.split(r"(?m)^(?=## \d+\.\d+\.\d+ )", md)
    head, subs = parts[0], []
    for p in parts[1:]:
        num = re.match(r"## (\d+\.\d+\.\d+)", p).group(1)
        subs.append((num, p))
    return head, subs


EN_PAGE = {
    (1, 1): "11-getting-started", (1, 2): "12-elements-of-programming", (1, 3): "13-defining-new-functions", (1, 4): "14-designing-functions",
    (1, 5): "15-control", (1, 6): "16-higher-order-functions", (1, 7): "17-recursive-functions", (2, 1): "21-introduction",
    (2, 2): "22-data-abstraction", (2, 3): "23-sequences", (2, 4): "24-mutable-data", (2, 5): "25-object-oriented-programming",
    (2, 6): "26-implementing-classes-and-objects", (2, 7): "27-object-abstraction", (2, 8): "28-efficiency", (2, 9): "29-recursive-objects",
    (3, 1): "31-introduction", (3, 2): "32-functional-programming", (3, 3): "33-exceptions", (3, 4): "34-interpreters-for-languages-with-combination",
    (3, 5): "35-interpreters-for-languages-with-abstraction", (4, 1): "41-introduction", (4, 2): "42-implicit-sequences", (4, 3): "43-declarative-programming",
}


def book_page(chap, sec, subs=None):
    """教材第 chap.sec 节（subs 为空表示整节；否则只取这些小节，引言只在含第一个小节时保留）。
    返回 (页面 id, 页面标题, 正文)。"""
    md = clean(zh_section(chap, sec))
    title = re.match(r"# (.+)", md).group(1).strip()
    head, parts = split_sections(md)
    head = re.sub(r"^# .+\n", "", head).strip()
    name = re.sub(r"^\d+\.\d+\s*", "", title)
    if subs:
        nums = [f"{chap}.{sec}.{n}" for n in subs]
        chosen = [p for n, p in parts if n in nums]
        assert len(chosen) == len(nums), (chap, sec, subs)
        body = ((head + "\n\n") if subs[0] == 1 else "") + "\n".join(chosen)
        rng = f"{nums[0]}" if len(nums) == 1 else f"{nums[0]}–{nums[-1]}"
        page_title, pid = f"{rng} {name}", f"cp-{chap}-{sec}-{subs[0]}"
        h1 = f"# {rng} {name}"
    else:
        body = head + "\n\n" + "\n".join(p for _, p in parts)
        page_title, pid, h1 = title, f"cp-{chap}-{sec}", f"# {title}"
    en = f"https://www.composingprograms.com/pages/{EN_PAGE[(chap, sec)]}.html"
    zh = f"https://composingprograms.netlify.app/{chap}/{sec}"
    note = (f"> 本页是 CS61A 教材 Composing Programs 第 {chap}.{sec} 节的中文翻译。"
            f"原文：[{EN_PAGE[(chap, sec)]}]({en})（John DeNero，CC BY-NC-SA 许可）；"
            f"译文：[csfive/composing-programs-zh]({zh})。")
    return pid, page_title[:80], f"{h1}\n\n{note}\n\n{body.strip()}\n"


# ---------------------------------------------------------------- 每一讲

# 讲次 → (中文标题, 教材页面[(章, 节, 小节列表或 None)], 哔哩哔哩分集号)
LECTURES = {
    1: ("欢迎", [(1, 1, None)], 1),
    2: ("函数", [(1, 2, None), (1, 3, None)], 2),
    3: ("控制", [(1, 4, None), (1, 5, None)], 3),
    4: ("高阶函数", [(1, 6, [1, 2, 3, 4, 5])], 4),
    5: ("环境", [(1, 6, [6, 7, 8])], 5),
    6: ("函数抽象", [], 7),
    7: ("函数举例", [(1, 6, [9])], 8),
    8: ("Quest 复习", [], None),
    9: ("递归", [(1, 7, [1, 2, 3])], 9),
    10: ("树形递归", [(1, 7, [4, 5])], 10),
    11: ("序列", [(2, 1, None), (2, 3, [1, 2, 3])], 11),
    12: ("容器", [(2, 3, [4, 5])], 12),
    13: ("数据抽象", [(2, 2, None)], 13),
    14: ("树", [(2, 3, [6])], 14),
    15: ("可变性", [(2, 4, [1, 2, 3, 4, 5, 6])], 15),
    16: ("迭代器", [(4, 1, None), (4, 2, [1, 2, 3, 4])], 16),
    17: ("生成器", [(4, 2, [5, 6, 7, 8, 9, 10])], 17),
    18: ("对象", [(2, 5, [1, 2, 3])], 18),
    19: ("属性", [(2, 5, [4])], 19),
    20: ("继承", [(2, 5, [5, 6, 7, 8])], 20),
    21: ("表示", [(2, 7, None), (2, 6, None)], 21),
    22: ("组合", [(2, 3, [7]), (2, 9, [1, 2])], 22),
    23: ("分解", [(2, 9, [3]), (2, 4, [7, 8, 9])], 24),
    24: ("效率", [(2, 8, None)], 23),
    25: ("期中复习", [], 25),
    26: ("Scheme", [(3, 1, None), (3, 2, [1, 2])], 26),
    27: ("Scheme 列表", [(3, 2, [3, 4, 5])], 27),
    28: ("计算器", [(3, 3, None), (3, 4, None)], 28),
    29: ("解释器", [(3, 5, None)], 29),
    30: ("程序即数据", [], 31),
    31: ("宏", [], 32),
    32: ("SQL", [(4, 3, [1, 2])], 33),
    33: ("表", [(4, 3, [3, 4])], 34),
    34: ("聚合", [(4, 3, [5, 6])], 35),
    35: ("数据库", [], 36),
    36: ("趣味编程（选学）", [], None),
    37: ("设计函数", [], None),
    38: ("总结", [], None),
}


def lecture(n, en, official_video, slides, extra_links):
    zh, book, bili = LECTURES[n]
    iid = f"lec{n:02d}"
    pages, bodies = [], {}
    for chap, sec, subs in book:
        pid, title, body = book_page(chap, sec, subs)
        pages.append({"id": pid, "title": title})
        bodies[pid] = body
    own = os.path.join(HERE, "notes", f"{iid}.md")
    if os.path.exists(own):
        pages.insert(0, {"id": iid, "title": "讲义"})
        bodies[iid] = open(own, encoding="utf8").read()
    videos = []
    if bili:
        videos.append(L("video", "哔哩哔哩：中英双语字幕（2024 版，同一位讲师）", f"https://www.bilibili.com/video/{BILI}/?p={bili}"))
    if official_video:
        videos.append(L("video", "YouTube：官方视频（John DeNero）", official_video))
    links = []
    if slides:
        links.append(L("slides", "幻灯片（官方，英文）", slides))
    links += extra_links
    for chap, sec, _ in book:
        links.append(L("textbook", f"教材原文 {chap}.{sec} 节（英文）", f"https://www.composingprograms.com/pages/{EN_PAGE[(chap, sec)]}.html"))
    it = {"id": iid, "kind": "lecture", "title": f"第 {n} 讲：{zh}", "periods": 2, "pages": pages, "videos": videos, "links": links, "practice": []}
    if "Optional" in en or "可选" in zh or "选学" in zh:
        it["optional"] = True
    return it, bodies


# ---------------------------------------------------------------- 课表

EXAM = """# {title}

> 本页由海纳协会编写。

自学者参加不了官方考试，可以用往年试题自测：

1. 打开官方的往年试题页面（[Resources]({url})，页面下方也有链接），选一份对应的往年试卷。官方提供 PDF 试卷和参考答案，有些学期还有讲解视频。
2. **限时**完成：Quest 约 1 小时，期中考试 2 小时，期末考试 3 小时。和正式考试一样，只允许带一张自己写的笔记纸。
3. 对照参考答案批改，把做错的题按主题记下来，回到对应的讲义和练手题复习。

考试范围和复习方法见第 8 讲（Quest 复习）、第 25 讲（期中复习）和第 38 讲（总结）的讲义。
"""
HW11 = """# 作业 11：收尾

> 本页由海纳协会编写。

官方的最后一次作业是学期末的几份课程反馈问卷，以及为 Scheme 递归艺术作品投票，只对选课学生开放，自学者可以跳过。

学完这门课之后，建议回头看看自己的四个项目，并想一想接下来要学什么：第 38 讲的讲义列出了 CS61 系列的后续课程。
"""

ZIP_ROOT = f"https://raw.githubusercontent.com/{MIRROR}/HEAD/"


def zip_of(iid):
    m = re.fullmatch(r"(lab|hw)(\d\d)", iid)
    if m:
        return f"{ZIP_ROOT}{m.group(1)}/{iid}/{iid}.zip"
    m = re.fullmatch(r"proj-(hog|cats|ants|scheme)", iid)
    if m:
        return f"{ZIP_ROOT}proj/{m.group(1)}/{m.group(1)}.zip"
    return None


def overview(it):
    """实验、作业、讨论课的「要做什么」页：说明站内练手题和本地做法（海纳协会编写）。"""
    kind = {"lab": "实验", "assignment": "作业", "section": "讨论课"}[it["kind"]]
    titles = [q.get("title") or q["prompt"].split("\n")[0][:40] for q in it["practice"]]
    lines = [f"# {it['title']}", "", "> 本页由海纳协会编写，说明这次" + kind + "在站内怎样完成。题目改编自官方材料，官方原文见页面下方的链接。", "",
             "## 这次要做什么", "", f"这次{kind}的题目已经改编成页面下方的 {len(titles)} 道练手题，可以直接在浏览器里作答：", ""]
    lines += [f"{i + 1}. {t}" for i, t in enumerate(titles)]
    langs = {q.get("lang") for q in it["practice"] if q["type"] == "code"}
    lines += ["", "代码题在浏览器里运行：写完函数后点「运行测试」，测试会逐行执行调用表达式，并和参考答案的输出比较。" if "python" in langs else "",
              "SQL 题在浏览器里运行：写出 SELECT 查询，结果会和参考答案的查询结果比较。" if "sql" in langs else ""]
    if it["kind"] == "section":
        lines += ["", "## 怎么用", "", "讨论课原本是小组在纸上完成的练习。建议先自己在纸上想清楚思路，再到练手题里写代码验证。官方的题目和参考答案见页面下方的链接；参考答案请在认真想过之后再看。"]
    else:
        z = zip_of(it["id"])
        name = z.rsplit("/", 1)[1][:-4] if z else ""
        lines += ["", "## 用官方起始代码在本地做（可选）", "",
                  f"1. 下载起始代码 [{name}.zip]({z})，解压到一个文件夹里。" if z else "1. 到官方原文页面下载起始代码。",
                  f"2. 在这个文件夹里打开终端，补全起始文件里标着 `YOUR CODE HERE` 的部分。",
                  f"3. 运行 `python3 ok -q 题目名 --local` 测试某一题，运行 `python3 ok --score --local` 查看全部得分。自学者没有伯克利的账号，命令后面要加上 `--local`，也不需要提交。",
                  "", "## 参考答案", "", "官方参考答案见页面下方的链接。建议做完、或者认真想过之后再看。"]
    return "\n".join(l for l in lines if l is not None).replace("\n\n\n", "\n\n") + "\n"


class Rows(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows, self.row, self.cell, self.a, self.skip = [], None, None, None, 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.skip += 1
        elif tag == "tr":
            self.row = []
        elif tag in ("td", "th") and self.row is not None:
            self.cell = []
        elif tag == "a" and self.cell is not None:
            self.a = [dict(attrs).get("href") or "", ""]

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip -= 1
        elif tag == "a" and self.a is not None:
            self.cell.append(("a", re.sub(r"\s+", " ", self.a[1]).strip(), self.a[0]))
            self.a = None
        elif tag in ("td", "th") and self.cell is not None:
            self.row.append(self.cell)
            self.cell = None
        elif tag == "tr" and self.row is not None:
            self.rows.append(self.row)
            self.row = None

    def handle_data(self, data):
        if self.skip or self.cell is None:
            return
        if self.a is not None:
            self.a[1] += data
        elif data.strip():
            self.cell.append(("t", re.sub(r"\s+", " ", data).strip()))


TERMS = {
    "Getting Started": "入门准备", "Functions": "函数", "Control": "控制", "Environment Diagrams": "环境图",
    "Higher-Order Functions": "高阶函数", "Lambda Expressions": "lambda 表达式", "Recursion": "递归",
    "Tree Recursion": "树形递归", "Python Lists": "Python 列表", "Sequences": "序列", "Data Abstraction": "数据抽象",
    "Trees": "树", "Iterators": "迭代器", "Mutability": "可变性", "Generators": "生成器", "OOP": "面向对象编程",
    "Object-Oriented Programming": "面向对象编程", "Inheritance": "继承", "Linked Lists": "链表", "Mutable Trees": "可变的树",
    "Scheme": "Scheme", "Scheme Lists": "Scheme 列表", "Interpreters": "解释器", "Programs as Data": "程序即数据", "Macros": "宏",
    "SQL": "SQL", "Finale": "收尾",
}
WEEKS = {1: "欢迎、函数", 2: "控制、高阶函数、环境", 3: "函数抽象与函数举例", 4: "递归、树形递归", 5: "序列、容器", 6: "数据抽象、树、可变性",
         7: "迭代器、生成器、对象", 8: "属性、继承、表示", 9: "组合、分解、效率", 11: "期中考试、Scheme", 12: "Scheme 列表、计算器、解释器",
         13: "程序即数据、宏、SQL", 14: "表、聚合、数据库", 15: "设计函数与总结", 17: "期末考试"}
PROJECTS = {
    "Hog": ("proj-hog", "项目 1：Hog（掷骰子游戏）", 10),
    "Cats": ("proj-cats", "项目 2：Cats（打字测速与自动纠错）", 12),
    "Ants": ("proj-ants", "项目 3：Ants（蚂蚁大战蜜蜂）", 16),
    "Scheme": ("proj-scheme", "项目 4：Scheme 解释器", 20),
}


def zh_topic(s):
    return "、".join(TERMS.get(t.strip(), t.strip()) for t in s.split(","))


def build():
    import practice as P  # noqa: E402

    index = raw("index.html", "index.html")
    p = Rows()
    p.feed(index)
    weeks, bodies, week = {}, {}, 0
    url = lambda u: urllib.parse.urljoin(SITE, u.strip())
    seen = set()
    for row in p.rows:
        if row and row[0] and row[0][0][0] == "t" and re.fullmatch(r"\d+", row[0][0][1]):
            week = int(row[0][0][1])
        items = weeks.setdefault(week, [])
        for cell in row:
            ctx, lec = None, None
            toks = list(cell)
            # 讲座：一个单元格里是「N. 标题」加若干链接
            first = toks[0] if toks else None
            if first and first[0] == "t" and re.match(r"\d+\. ", first[1]):
                n, en = int(first[1].split(".")[0]), first[1].split(". ", 1)[1].strip()
                video = next((url(t[2]) for t in toks if t[0] == "a" and t[1] == "Videos"), None)
                slides = next((url(t[2]) for t in toks if t[0] == "a" and t[1].startswith("Slides")), None)
                extra = [L("other", f"课堂演示代码 {t[1]}", url(t[2])) for t in toks if t[0] == "a" and re.search(r"\.(py|scm|sql)$", t[1])]
                extra += [L("other", "Type Hints（类型注解）阅读材料（官方，英文）", url(t[2])) for t in toks if t[0] == "a" and t[1] == "Type Hints Reading"]
                it, b = lecture(n, en, video, slides, extra)
                items.append(it)
                bodies.update(b)
                continue
            for tok in toks:
                text = tok[1]
                if tok[0] == "t":
                    kind = "midterm" if text.startswith("Midterm (") else "final" if text.startswith("Final (") else "quest" if "Quest (" in text else None
                    if kind and kind not in seen:
                        seen.add(kind)
                        title = {"midterm": "期中考试", "final": "期末考试", "quest": "小测验（Quest）"}[kind]
                        items.append({"id": f"exam-{kind}", "kind": "exam", "title": title, "periods": 3, "pages": [], "videos": [],
                                      "links": [L("exams", "往年试题与解答（官方 Resources 页面）", url("resources.html"))], "practice": []})
                    continue
                href = url(tok[2])
                m = re.match(r"(Lab|Disc|HW) (\d+): (.+)", text)
                if m:
                    k, n, topic = m.group(1), int(m.group(2)), m.group(3)
                    kind, name, per = {"Lab": ("lab", "实验", 3), "Disc": ("section", "讨论课", 2), "HW": ("assignment", "作业", 4)}[k]
                    ctx = {"id": f"{k.lower()}{n:02d}", "kind": kind, "title": f"{name} {n}：{zh_topic(topic)}", "periods": per, "pages": [],
                           "videos": [], "links": [L("labs" if k == "Lab" else "assignments" if k == "HW" else "notes", f"官方原文：{text}", href)], "practice": []}
                    items.append(ctx)
                elif text in PROJECTS and text not in seen:
                    seen.add(text)
                    pid, title, per = PROJECTS[text]
                    ctx = {"id": pid, "kind": "project", "title": title, "periods": per, "pages": [], "videos": [],
                           "links": [L("assignments", f"官方原文：{text} 项目说明", href)], "practice": []}
                    items.append(ctx)
                elif text == "(Optional) Scheme Contest":
                    ctx = {"id": "proj-scheme-contest", "kind": "project", "title": "Scheme 递归艺术比赛（选做）", "periods": 4, "optional": True,
                           "pages": [], "videos": [], "links": [L("assignments", "官方原文：Scheme Contest", href), L("other", "往届作品（Scheme Gallery）", url("proj/scheme_gallery.html"))], "practice": []}
                    items.append(ctx)
                elif text == "Solutions" and items and items[-1]["kind"] in ("lab", "section", "assignment"):
                    items[-1]["links"].append(L("other", "官方参考答案（英文）", href))
                elif text in ("Video", "Getting Started Videos") and items and items[-1]["kind"] in ("lab", "section", "assignment", "project"):
                    items[-1]["videos"].append(L("video", "官方讲解视频（YouTube）" if text == "Video" else "项目入门讲解视频（YouTube）", href))

    # 题目说明、练手题
    for its in weeks.values():
        for it in its:
            it["practice"] = P.PRACTICE.get(it["id"], [])
            f = os.path.join(HERE, "assignments", f"{it['id']}.md")
            if os.path.exists(f):
                body = open(f, encoding="utf8").read()
            elif it["kind"] in ("lab", "assignment", "section") and it["practice"]:
                body = overview(it)
            elif it["kind"] == "exam":
                body = EXAM.format(title=it["title"], url=url("resources.html"))
            elif it["id"] == "hw11":
                it["optional"] = True
                body = HW11
            else:
                body = None
            if body:
                it["pages"] = [{"id": it["id"], "title": "要做什么"}] + it["pages"]
                bodies[it["id"]] = body
            z = zip_of(it["id"])
            if z:
                it["links"].insert(0, L("assignments", f"起始代码 {z.rsplit('/', 1)[1]}（GitHub）", z))

    mods = []
    for w in sorted(weeks):
        if weeks[w]:
            mods.append({"id": f"week-{w}", "title": f"第 {w} 周：{WEEKS[w]}", "items": weeks[w]})
    guide = {"id": "guide", "kind": "reading", "title": "开始之前：这门课怎么学", "periods": 1, "pages": [{"id": "guide", "title": "学习指南"}],
             "videos": [], "links": [L("website", "2026 春季学期课程网站（存档）", SITE), L("textbook", "教材 Composing Programs（英文）", "https://www.composingprograms.com/"),
                                     L("translation", "教材中文翻译（csfive）", "https://composingprograms.netlify.app/"),
                                     L("other", "Python Tutor：在线画环境图", "https://pythontutor.com/cp/composingprograms.html")], "practice": []}
    bodies["guide"] = open(os.path.join(HERE, "guide.md"), encoding="utf8").read()
    mods.insert(0, {"id": "start", "title": "开始之前", "items": [guide]})
    return mods, bodies


def main():
    mods, bodies = build()
    c = json.load(open(os.path.join(OUT, "course.json"), encoding="utf8"))
    c["instructors"] = ["Dan Garcia", "Manuel A Sabin"]
    c["license"] = ("讲义译自教材 Composing Programs（© John DeNero，CC BY-NC-SA），中文译文来自 csfive/composing-programs-zh；"
                    "题目说明与练手题据 UC Berkeley CS61A 2026 春季的官方材料改写，版权归原课程组；其余文字 © 海纳协会")
    keep = [l for l in c["links"] if "2026 春季" not in l["label"]]
    c["links"] = [L("website", "网站 · 2026 春季（站内课程内容按这一学期整理）", SITE), L("translation", "教材中文翻译 · csfive", "https://composingprograms.netlify.app/")] + \
                 [l for l in keep if "composingprograms.netlify.app" not in l["url"]]
    c["modules"] = mods
    for f in os.listdir(OUT):
        if f.endswith(".md"):
            os.remove(os.path.join(OUT, f))
    used = [p["id"] for m in mods for it in m["items"] for p in it["pages"]]
    assert len(used) == len(set(used)) and set(used) == set(bodies), set(used) ^ set(bodies)
    for pid, body in bodies.items():
        open(os.path.join(OUT, pid + ".md"), "w", encoding="utf8").write(body)
    open(os.path.join(OUT, "course.json"), "w", encoding="utf8").write(json.dumps(c, ensure_ascii=False, indent=1) + "\n")
    items = [it for m in mods for it in m["items"]]
    print("模块", len(mods), "条目", len(items), "页面", len(used), "无正文条目", [it["id"] for it in items if not it["pages"]],
          "练手题", sum(len(it["practice"]) for it in items))


if __name__ == "__main__":
    main()
