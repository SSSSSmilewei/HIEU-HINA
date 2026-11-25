"""生成 content/courses/mit-1801/（MIT 18.01SC 单变量微积分，2010 年秋季）。

用法（在仓库根目录）：python3 scripts/courses/mit1801/build.py

数据来源：MIT OpenCourseWare 18.01SC 的整体课程包（CC BY-NC-SA 4.0），
下载并解压在 .staging/course-cache/mit1801/zip/（不进仓库；没有时脚本会自动下载）。
- 课程结构：沿课程包里各页面的「Next」链接得到单元、部分和各节的顺序。
- 讲义：notes/ses<N>.md，是这一节各视频片段配套讲义（SesNa、SesNb……）的中文翻译。
- 例题：examples/ses<N>.md，是这一节「Worked Example」题目与解答的中文翻译。
- 习题课：psets/ps<N>.md，是官方指定练习题（Jerison、Mattuck 编）及解答的中文翻译。
- 考试：exams/<exam1…exam4|final>.md，是考试与解答的中文翻译。
- 练手题：practice.py。
- 视频：官方 YouTube（2006 年秋季 David Jerison 讲座，按片段的起始时间跳转）。
"""
import json, os, re, sys, urllib.request, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "../../.."))
OUT = os.path.join(ROOT, "content/courses/mit-1801")
CACHE = os.path.join(ROOT, ".staging/course-cache/mit1801")
ZIP = os.path.join(CACHE, "zip")
OCW = "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/"
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.dirname(HERE))
from titles import ZH, SESSION

EXAM_SESSION = {22: "exam1", 42: "exam2", 67: "exam3", 86: "exam4", 102: "final"}
REVIEW_SESSION = {21, 41, 66, 85}


def L(kind, label, url):
    return {"kind": kind, "label": label[:80], "url": url}


def ensure_zip():
    if os.path.exists(os.path.join(ZIP, "data.json")):
        return
    os.makedirs(CACHE, exist_ok=True)
    z = os.path.join(CACHE, "ocw.zip")
    if not os.path.exists(z):
        urllib.request.urlretrieve(OCW + "18.01sc-fall-2010.zip", z)
    zipfile.ZipFile(z).extractall(ZIP)


def walk():
    """沿「Next」链接走一遍，得到 [(层级, 页面路径, 标题, 资源列表)]。"""
    cur, out = "pages/1.-differentiation", []
    while cur:
        d = json.load(open(os.path.join(ZIP, cur, "data.json"), encoding="utf8"))
        c = d["content"]
        res = re.findall(r'resources/([^/]+)/index.html">([^<]*)<', c)
        i = c.find('id="recitation-video')
        if i >= 0:
            for t, yt in re.findall(r'<h4 id="[^"]*">([^<]+)</h4>.*?id="video-player-([\w-]{11})-', c[i:], re.S):
                res.append(("@rec:" + yt, t.strip()))
        for href, t in re.findall(r'<a href="(/ans7870/[^"]+)">([^<]+)</a>', c):
            res.append(("@mathlet:" + href, t.strip()))
        out.append((cur.count("/"), cur, d["title"], res))
        m = re.search(r'<a href="([^"]+)">Next', c)
        nxt = os.path.normpath(os.path.join(cur, m.group(1))).replace("/index.html", "") if m else None
        cur = nxt if nxt and os.path.exists(os.path.join(ZIP, nxt, "data.json")) else None
    return out


def resource(rid):
    p = os.path.join(ZIP, "resources", rid, "data.json")
    return json.load(open(p, encoding="utf8")) if os.path.exists(p) else {}


STATIC = {}


def static(name):
    """按文件名结尾（如 Ses1a.pdf）找课程包里的 PDF，返回 ocw.mit.edu 上的地址。"""
    if not STATIC:
        for f in os.listdir(os.path.join(ZIP, "static_resources")):
            m = re.search(r"_mit18_01scf10_(.+)$", f.lower())
            if m:
                STATIC[m.group(1)] = f
    f = STATIC.get(name.lower())
    return OCW + f if f else None


def page(sub, key):
    f = os.path.join(HERE, sub, key + ".md")
    return open(f, encoding="utf8").read() if os.path.exists(f) else None


def build():
    from practice import PRACTICE

    mods, bodies, unit = [], {}, ""
    for depth, path, title, res in walk():
        if depth == 1 and not title.startswith("Session"):
            unit = ZH[title].split("：")[0]
            continue
        if depth == 2:
            mods.append({"id": f"m{len(mods) + 1}", "title": f"{unit} · {ZH[title]}", "items": []})
            continue
        m = re.match(r"Session (\d+)", title)
        p = re.match(r"Problem Set (\d+)", title)
        pages, videos, links = [], [], [L("website", "OCW 本节页面", OCW + path + "/")]
        if p:
            n = int(p.group(1))
            key, iid, kind, zh = f"ps{n}", f"ps{n}", "assignment", f"习题课 {n}"
            body = page("psets", key)
            if body:
                pages.append({"id": iid, "title": "题目与解答"})
                bodies[iid] = body
        elif m and int(m.group(1)) in EXAM_SESSION:
            n = int(m.group(1))
            key = iid = EXAM_SESSION[n]
            kind, zh = "exam", SESSION[n]
            body = page("exams", key)
            if body:
                pages.append({"id": iid, "title": "试卷与解答"})
                bodies[iid] = body
        else:
            n = int(m.group(1))
            key = iid = f"ses{n}"
            kind, zh = "lecture", f"第 {n} 节：{SESSION[n]}"
            for sub, ptitle in (("notes", "讲义"), ("examples", "例题与解答")):
                body = page(sub, key)
                if body:
                    pid = f"{iid}-{sub}"
                    pages.append({"id": pid, "title": ptitle})
                    bodies[pid] = body
        clip = 0
        for rid, label in res:
            if rid.startswith("@rec:"):
                videos.append(L("video", f"习题讲解视频（官方 YouTube，英文）：{label}", f"https://www.youtube.com/watch?v={rid[5:]}"))
                continue
            if rid.startswith("@mathlet:"):
                links.append(L("other", f"交互演示（Mathlet，英文）：{label}", "https://ocw.mit.edu" + rid[9:]))
                continue
            d = resource(rid)
            yt = (d.get("video_metadata") or {}).get("youtube_id")
            if d.get("resourcetype") == "Video" and yt:
                t = int(float(d.get("start_time") or 0))
                if label.startswith("Clip"):
                    clip += 1
                    videos.append(L("video", f"讲座片段 {clip}（官方 YouTube，英文）：{label.split(': ', 1)[-1]}", f"https://www.youtube.com/watch?v={yt}" + (f"&t={t}s" if t else "")))
                else:
                    videos.append(L("video", f"习题讲解视频（官方 YouTube，英文）：{label}", f"https://www.youtube.com/watch?v={yt}"))
            elif d.get("file"):
                name = "例题原文（PDF）" if label == "Problem (PDF)" else "例题解答原文（PDF）" if label == "Solution (PDF)" else \
                       "试卷原文（PDF）" if re.match(r"(Exam|Final)", label) else "试卷解答原文（PDF）" if label.startswith("Solutions to Exam") or label.startswith("Solutions to Final") else \
                       f"习题原文（PDF）：{label.replace(' (PDF)', '')}" if not label.startswith("Solutions") else f"习题解答原文（PDF）：{label.replace('Solutions to ', '').replace(' problems (PDF)', '')}"
                links.append(L("exams" if kind == "exam" else "other", name, "https://ocw.mit.edu" + d["file"]))
        if kind == "lecture":
            for k in range(26):
                u = static(f"Ses{n}{chr(97 + k)}.pdf")
                if not u:
                    break
                links.append(L("notes", f"讲义原文（PDF）第 {k + 1} 份", u))
        seen, uniq = set(), []
        for l in links:
            if l["url"] not in seen:
                seen.add(l["url"])
                uniq.append(l)
        it = {"id": iid, "kind": kind, "title": zh[:100], "periods": 2 if kind == "lecture" else 3, "pages": pages, "videos": videos, "links": uniq,
              "practice": PRACTICE.get(key, [])}
        if not mods or (kind == "exam" and n == 102):
            mods.append({"id": f"m{len(mods) + 1}", "title": "期末考试", "items": []})
        mods[-1]["items"].append(it)
    guide = {"id": "guide", "kind": "reading", "title": "开始之前：这门课怎么学", "periods": 1, "pages": [{"id": "guide", "title": "学习指南"}], "videos": [],
             "links": [L("website", "MIT OCW 18.01SC 课程网站", OCW)], "practice": []}
    bodies["guide"] = open(os.path.join(HERE, "guide.md"), encoding="utf8").read()
    mods.insert(0, {"id": "start", "title": "开始之前", "items": [guide]})
    return mods, bodies


def main():
    ensure_zip()
    mods, bodies = build()
    c = json.load(open(os.path.join(OUT, "course.json"), encoding="utf8"))
    c["title"] = "MIT 18.01SC：单变量微积分（Single Variable Calculus）"
    c["titleEn"] = "MIT 18.01SC Single Variable Calculus, Fall 2010"
    c["provider"] = "MIT"
    c["instructors"] = ["David Jerison"]
    c["language"] = "中文（翻译）、英文视频"
    c["prerequisites"] = "高中代数和三角函数"
    c["license"] = "讲义、例题、习题与考试 © MIT OpenCourseWare（David Jerison 等），CC BY-NC-SA 4.0；中文翻译 海纳协会，同协议；课程介绍文字 © csdiy.wiki，MIT 许可"
    c["links"] = [L("website", "网站 · OCW 18.01SC（站内课程内容按这一版整理）", OCW)] + [l for l in c["links"] if "18-01sc" not in l["url"]]
    c["modules"] = mods
    os.makedirs(OUT, exist_ok=True)
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
          "缺讲义", len([1 for it in items if it["kind"] == "lecture" and not it["pages"]]))


if __name__ == "__main__":
    main()
