"""生成 content/courses/cs61b/（UC Berkeley CS61B，2026 年春季）。

用法（在仓库根目录）：python3 scripts/courses/cs61b/build.py

数据来源（缓存在 .staging/course-cache/cs61b/，不进仓库）：
- 课表：官网 https://sp26.datastructur.es/ 首页（schedule.py 解析，site/ 是全站页面缓存）。
- 教材：官方 GitHub 仓库 Berkeley-CS61B/sp26-gitbook（book/）。
- 讨论课：官网 /assets/discussions/ 下的 PDF。

本目录里的翻译（都是官方原文的中文翻译）：
- book/chNN.md：教材第 NN 章（一章一页；一章分给两讲时拆成 chNNa、chNNb）。
- hw/hwNN.md：编程作业说明。
- proj/<id>.md：项目说明（proj0…proj3、proj4a…proj4d、proj5a…proj5c 以及项目的公共页）。
- disc/discNN.md：讨论课题目与解答。
- guide.md：学习指南（「开始之前」）。
- 练手题：practice.py。
"""
import json, os, re, sys, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "../../.."))
OUT = os.path.join(ROOT, "content/courses/cs61b")
SITE = "https://sp26.datastructur.es"
BOOK = "https://cs61b-2.gitbook.io/cs61b-textbook-spring-2026"
sys.path.insert(0, HERE)
from schedule import parse

# 每讲的中文标题和讲义页（教材章节翻译文件，按顺序）
LECTURES = {
    1: ("欢迎来到 61B，Java 入门", ["ch01"]),
    2: ("定义和使用类，列表", ["ch02"]),
    3: ("列表、数组、映射与引用", ["ch03a"]),
    4: ("测试", ["ch04"]),
    5: ("包、递归与 IntList", ["ch03b"]),
    6: ("SLList、嵌套类与哨兵节点", ["ch05"]),
    7: ("DLList 与基础 AList", ["ch06"]),
    8: ("调整大小的数组与循环数组", ["ch07"]),
    9: ("接口继承与实现继承", ["ch08"]),
    10: ("迭代器、可迭代对象与 equals", ["ch10"]),
    11: ("子类型多态、Comparable 与 Comparator", ["ch09"]),
    12: ("复习与期中练习", []),
    13: ("渐近分析（一）", ["ch11"]),
    14: ("并查集", ["ch14"]),
    15: ("渐近分析（二）", ["ch12"]),
    16: ("渐近分析（三）", ["ch13"]),
    17: ("集合、extends 与二叉搜索树", ["ch15"]),
    18: ("B 树", ["ch16"]),
    19: ("红黑树", ["ch17"]),
    20: ("堆、优先队列与树的表示", ["ch18"]),
    21: ("树和图的遍历", ["ch19"]),
    22: ("图的遍历与实现", ["ch20"]),
    23: ("最短路径", ["ch21"]),
    24: ("最小生成树", ["ch22"]),
    25: ("有向无环图", ["ch23"]),
    26: ("哈希（一）", ["ch24"]),
    27: ("哈希（二）", ["ch25"]),
    28: ("字典树", ["ch26"]),
    29: ("软件工程（一）", ["ch27"]),
    30: ("期中考试 2 复习", []),
    31: ("软件工程（二）：BYOW 热身", ["ch28"]),
    32: ("基础排序", ["ch29a"]),
    33: ("插入排序与快速排序入门", ["ch29b"]),
    34: ("快速排序", ["ch30", "ch31"]),
    35: ("排序与算法的下界", ["ch32"]),
    36: ("基数排序", ["ch33", "ch34"]),
    37: ("计算的社会影响", []),
    38: ("软件工程（三）：软件工程中的 AI", ["ch35", "ch36"]),
    39: ("压缩", ["ch37", "ch38"]),
    40: ("总结与趣味内容", []),
}

DISC = {
    1: "Python 复习，欢迎来到 Java", 2: "类、列表、映射、数组与引用", 3: "IntList 与 SLList",
    4: "DLList、默认方法与 AList", 5: "Comparable/Comparator、迭代器与可迭代对象", 6: "渐近分析与并查集",
    7: "渐近分析（二）", 8: "二叉搜索树、B 树与左倾红黑树", 9: "树的遍历与图", 10: "最短路径与最小生成树",
    11: "哈希与字典树", 12: "再谈哈希与字典树", 13: "排序", 14: "排序（二）",
}

HW = {
    "hw01": "工具作业 1：环境配置", "hw02": "编程作业 2：Java 入门", "hw03": "编程作业 3：IntList",
    "hw04": "编程作业 4：上机考试练习", "hw05": "理论作业 5：渐近分析", "hw06": "编程作业 6：BSTMap",
    "hw07": "理论作业 7：期中复习", "hw08": "编程作业 8：HashMap", "hw09": "编程作业 9：LLRB 树",
    "hw10": "理论作业 10：期末复习",
}

PROJ = {
    "proj0": "小项目 0：粒子模拟器", "proj1": "小项目 1：LinkedListDeque", "proj2": "小项目 2：ArrayDeque",
    "proj3": "小项目 3：渗流（Percolation）", "proj4a": "设计项目 4A：TimeSeries 与 NGramMap",
    "proj4b": "设计项目 4B：WordNet（设计）", "proj4c": "设计项目 4C：WordNet（k = 0）",
    "proj4d": "设计项目 4D：WordNet（k ≠ 0）", "proj5a": "设计项目 5A：组队与 BYOW 设计",
    "proj5b": "设计项目 5B：BYOW 世界生成", "proj5c": "设计项目 5C：BYOW 交互",
}
# 项目公共页（挂在第一次出现的那一段上）
PROJ_EXTRA = {
    "proj4a": [("proj4", "项目 4 总览"), ("proj4-data", "数据文件"), ("proj4-testing", "测试说明")],
    "proj4d": [("proj4-bonus", "附加功能")],
    "proj5a": [("proj5", "项目 5 总览"), ("proj5-partnerships", "组队说明")],
    "proj5c": [("proj5-ambition", "进阶功能（Ambition）"), ("proj5-bugs", "常见问题"), ("proj5-checkoff", "验收")],
}


def L(kind, label, url):
    return {"kind": kind, "label": label[:80], "url": url}


ASSETS = "https://raw.githubusercontent.com/Berkeley-CS61B/sp26-gitbook/main/.gitbook/assets/"


def asset(name):
    return ASSETS + urllib.parse.quote(name.replace("\\_", "_"), safe="")


def gitbook(md):
    """把 GitBook 的写法换成站内 Markdown 能显示的写法。"""
    P = r"(?:\.\./)*\.gitbook/assets/"
    md = re.sub(r'src="' + P + r'([^"]+)"', lambda m: f'src="{asset(m.group(1))}"', md)
    md = re.sub(r"\]\(<" + P + r"([^>]+)>\)", lambda m: f"]({asset(m.group(1))})", md)
    md = re.sub(r"\]\(" + P + r"([^)\s]+)\)", lambda m: f"]({asset(m.group(1))})", md)
    md = re.sub(r"!\[([^\]]*)\]\(<([^>]+)>\)", r"![\1](\2)", md)
    md = re.sub(r"<figure>(<img [^>]*>)(?:<figcaption>(?:<p>)?(.*?)(?:</p>)?</figcaption>)?</figure>",
                lambda m: m.group(1) + (f"\n\n*{m.group(2)}*" if m.group(2) else ""), md)
    # 旧版教材网站的图片已经失效，改用网页存档
    md = re.sub(r"https://joshhug\.gitbooks\.io[^) \"]*",
                lambda m: "https://web.archive.org/web/2020id_/" + m.group(0).replace("\\_", "_"), md)
    md = re.sub(r'\{% embed url="([^"]+)" %\}', lambda m: f"视频（英文）：<{m.group(1)}>", md)
    md = re.sub(r"\{% endembed %\}\n?", "", md)

    # GitBook 的行内公式写成 $$…$$；站内 $$…$$ 是独立公式，所以和文字同一行的改成 $…$
    md = "\n".join(l if l.strip().startswith("$$") and l.strip().endswith("$$") and l.strip().count("$$") == 2
                    else re.sub(r"\$\$(.+?)\$\$", r"$\1$", l) for l in md.split("\n"))

    def hint(m):
        body = m.group(2).strip("\n")
        return "\n".join("> " + l if l else ">" for l in body.split("\n"))
    md = re.sub(r'\{% hint style="(\w+)" %\}(.*?)\{% endhint %\}', hint, md, flags=re.S)
    return md


def read(sub, key):
    f = os.path.join(HERE, sub, key + ".md")
    return gitbook(open(f, encoding="utf8").read()) if os.path.exists(f) else None


def build():
    from practice import PRACTICE

    rows = parse()
    mods, bodies, seen = {}, {}, set()

    def module(week):
        if week not in mods:
            mods[week] = {"id": f"w{week:02d}", "title": f"第 {week} 周", "items": []}
        return mods[week]["items"]

    def add_pages(it, sub, keys):
        for key, title in keys:
            body = read(sub, key)
            if body:
                it["pages"].append({"id": key, "title": title})
                bodies[key] = body

    for r in rows:
        w = r["week"]
        lec = r["lecture"]
        m = re.match(r"(\d+)\. ", lec["text"])
        if m:
            n = int(m.group(1))
            zh, chs = LECTURES[n]
            it = {"id": f"lec{n:02d}", "kind": "lecture", "title": f"第 {n} 讲：{zh}", "periods": 2,
                  "pages": [], "videos": [], "links": [], "practice": PRACTICE.get(f"lec{n:02d}", [])}
            for ch in chs:
                num = int(re.match(r"ch(\d+)", ch).group(1))
                body = read("book", ch)
                if body:
                    it["pages"].append({"id": ch, "title": f"教材第 {num} 章" + ("（上）" if ch.endswith("a") else "（下）" if ch.endswith("b") else "")})
                    bodies[ch] = body
            if not chs:
                body = read("notes", f"lec{n:02d}")
                if body:
                    it["pages"].append({"id": f"lec{n:02d}", "title": "讲义"})
                    bodies[f"lec{n:02d}"] = body
            for url, t in lec["links"]:
                if "youtu" in url:
                    it["videos"].append(L("video", f"{'附加视频' if t.startswith('Bonus') else '讲座视频'}（官方 YouTube，英文）", url))
                elif "gitbook" in url:
                    it["links"].append(L("textbook", f"教材原文（英文）：{t}", url))
                elif "docs.google.com/presentation" in url or url.endswith(".pdf"):
                    it["links"].append(L("slides", "幻灯片（英文）", url))
            module(w).append(it)
        sec = r["section"]
        m = re.match(r"(\d+)\. ", sec["text"])
        if m and f"disc{int(m.group(1)):02d}" not in seen:
            n = int(m.group(1))
            key = f"disc{n:02d}"
            seen.add(key)
            it = {"id": key, "kind": "section", "title": f"讨论课 {n}：{DISC[n]}", "periods": 2,
                  "pages": [], "videos": [], "links": [], "practice": PRACTICE.get(key, [])}
            add_pages(it, "disc", [(key, "题目与解答")])
            for url, t in sec["links"]:
                lab = {"Worksheet": "题目", "Solutions": "解答", "Video": "讲解录像"}.get(t, t)
                pre = "考试难度练习" if "examprep" in url else "讨论课"
                it["videos" if t == "Video" else "links"].append(L("video" if t == "Video" else "other", f"{pre}{lab}原文（{'Zoom' if t == 'Video' else 'PDF'}，英文）", url))
            module(w).append(it)
        for url, t in r["hw"]["links"]:
            m = re.search(r"HW(\d+)", t)
            key = f"hw{int(m.group(1)):02d}"
            if key in seen:
                continue
            seen.add(key)
            theory = "gradescope" in url
            it = {"id": key, "kind": "assignment", "title": HW[key], "periods": 2 if theory else 3,
                  "pages": [], "videos": [], "links": [], "practice": PRACTICE.get(key, [])}
            add_pages(it, "hw", [(key, "作业说明")])
            it["links"].append(L("other", "作业原文（英文）" if not theory else "Gradescope 作业（需伯克利账号）", url))
            if not theory:
                it["submit"] = L("other", "Gradescope（伯克利账号）", "https://www.gradescope.com/")
            module(w).append(it)
        for url, t in r["project"]["links"]:
            key = url.rstrip("/").split("/")[-1]
            if key in seen or key not in PROJ:
                continue
            seen.add(key)
            it = {"id": key, "kind": "project", "title": PROJ[key], "periods": 6,
                  "pages": [], "videos": [], "links": [L("other", "项目原文（英文）", url)], "practice": PRACTICE.get(key, [])}
            add_pages(it, "proj", [(key, "项目说明")] + PROJ_EXTRA.get(key, []))
            module(w).append(it)
        if lec["text"].startswith("Final Exam"):
            module(w).append({"id": "final", "kind": "exam", "title": "期末考试", "periods": 3, "pages": [], "videos": [],
                              "links": [L("exams", "往年试题汇总（官方）", SITE + "/resources/exam-archive/")], "practice": PRACTICE.get("final", [])})
            add_pages(module(w)[-1], "exams", [("final", "复习与往年试题")])
    out = [mods[k] for k in sorted(mods)]
    guide = {"id": "guide", "kind": "reading", "title": "开始之前：这门课怎么学", "periods": 1, "pages": [], "videos": [],
             "links": [L("website", "CS61B 2026 春季官网", SITE + "/"), L("repo", "作业起始代码 skeleton-sp26", "https://github.com/Berkeley-CS61B/skeleton-sp26")],
             "practice": []}
    add_pages(guide, ".", [("guide", "学习指南")])
    out.insert(0, {"id": "start", "title": "开始之前", "items": [guide]})
    return out, bodies


def main():
    mods, bodies = build()
    c = json.load(open(os.path.join(OUT, "course.json"), encoding="utf8"))
    c["title"] = "CS61B：数据结构与算法（Data Structures and Algorithms）"
    c["titleEn"] = "CS61B: Data Structures, Spring 2026"
    c["instructors"] = ["Josh Hug", "Kay Ousterhout"]
    c["license"] = ("教材、作业与项目说明、讨论课题目 © UC Berkeley CS61B 课程组（Josh Hug、Kay Ousterhout 等），中文翻译 海纳协会，"
                    "仅供非商业学习使用；课程介绍文字 © csdiy.wiki，MIT 许可")
    c["links"] = [L("website", "网站 · 2026 春季（站内课程内容按这一学期整理）", SITE + "/"),
                  L("textbook", "官方教材 · 2026 春季版（GitHub）", "https://github.com/Berkeley-CS61B/sp26-gitbook"),
                  L("repo", "作业起始代码 · skeleton-sp26", "https://github.com/Berkeley-CS61B/skeleton-sp26"),
                  L("video", "讲座录像 · YouTube 播放列表", "https://www.youtube.com/playlist?list=PL8FaHk7qbOD44fDmItR1wrkor8XdfUXC6")] + \
                 [l for l in c["links"] if "datastructur.es" in l["url"] and "sp26" not in l["url"] and "fa26" not in l["url"]]
    c["modules"] = mods
    for f in os.listdir(OUT):
        if f.endswith(".md"):
            os.remove(os.path.join(OUT, f))
    for m in mods:
        for it in m["items"]:
            for q in it["practice"]:
                assert re.fullmatch(r"[a-z0-9-]+", q["id"]), (it["id"], q["id"])
    used = [p["id"] for m in mods for it in m["items"] for p in it["pages"]]
    assert len(used) == len(set(used)) and set(used) == set(bodies), set(used) ^ set(bodies)
    for pid, body in bodies.items():
        open(os.path.join(OUT, pid + ".md"), "w", encoding="utf8").write(body)
    open(os.path.join(OUT, "course.json"), "w", encoding="utf8").write(json.dumps(c, ensure_ascii=False, indent=1) + "\n")
    items = [it for m in mods for it in m["items"]]
    print("模块", len(mods), "条目", len(items), "页面", len(used), "练手题", sum(len(it["practice"]) for it in items),
          "无页面条目", [it["id"] for it in items if not it["pages"]])


if __name__ == "__main__":
    main()
