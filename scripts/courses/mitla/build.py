"""生成 content/courses/mitla/（MIT 18.06SC 线性代数，2011 年秋季）。

用法（在仓库根目录）：python3 scripts/courses/mitla/build.py

数据来源：MIT OpenCourseWare 18.06SC 的整体课程包（CC BY-NC-SA 4.0），
下载并解压在 .staging/course-cache/mitla/zip/（不进仓库；没有时脚本会自动下载）。
- 课程结构：沿课程包里各页面的「Next」链接得到单元和讲次的顺序。
- 讲义：本目录 notes/<讲次>.md，是官方讲座摘要（lecture summary）的中文翻译。
- 习题：本目录 problems/<讲次>.md，是官方习题与解答的中文翻译；练手题在 practice.py。
- 视频：哔哩哔哩 BV1zx411g7gq（中英双语字幕，35 集）+ 官方 YouTube。
"""
import json, os, re, sys, urllib.request, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "../../.."))
OUT = os.path.join(ROOT, "content/courses/mitla")
CACHE = os.path.join(ROOT, ".staging/course-cache/mitla")
ZIP = os.path.join(CACHE, "zip")
OCW = "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/"
BILI = "BV1zx411g7gq"
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.dirname(HERE))

# 讲次标题 → 哔哩哔哩分集号（这个合集按 2005 年春季录像的 35 讲编号）
BILI_P = {
    "The Geometry of Linear Equations": 1, "Elimination with Matrices": 2, "Multiplication and Inverse Matrices": 3, "Factorization into A = LU": 4,
    "Transposes, Permutations, Vector Spaces": 5, "Column Space and Nullspace": 6, "Solving Ax = 0: Pivot Variables, Special Solutions": 7,
    "Solving Ax = b: Row Reduced Form R": 8, "Independence, Basis and Dimension": 9, "The Four Fundamental Subspaces": 10,
    "Matrix Spaces; Rank 1; Small World Graphs": 11, "Graphs, Networks, Incidence Matrices": 12, "Exam 1 Review": 13,
    "Orthogonal Vectors and Subspaces": 14, "Projections onto Subspaces": 15, "Projection Matrices and Least Squares": 16,
    "Orthogonal Matrices and Gram-Schmidt": 17, "Properties of Determinants": 18, "Determinant Formulas and Cofactors": 19,
    "Cramer's Rule, Inverse Matrix and Volume": 20, "Eigenvalues and Eigenvectors": 21, "Diagonalization and Powers of A": 22,
    "Differential Equations and exp(At)": 23, "Markov Matrices; Fourier Series": 24, "Exam 2 Review": 25,
    "Symmetric Matrices and Positive Definiteness": 26, "Complex Matrices; Fast Fourier Transform (FFT)": 27, "Positive Definite Matrices and Minima": 28,
    "Similar Matrices and Jordan Form": 29, "Singular Value Decomposition": 30, "Linear Transformations and their Matrices": 31,
    "Change of Basis; Image Compression": 32, "Exam 3 Review": 33, "Left and Right Inverses; Pseudoinverse": 34, "Final Course Review": 35,
}
ZH = {
    "Unit I: Ax = b and the Four Subspaces": "单元 1：Ax = b 与四个基本子空间",
    "Unit II: Least Squares, Determinants and Eigenvalues": "单元 2：最小二乘、行列式与特征值",
    "Unit III: Positive Definite Matrices and Applications": "单元 3：正定矩阵及其应用",
    "The Geometry of Linear Equations": "线性方程组的几何解释", "An Overview of Key Ideas": "核心概念概览", "Elimination with Matrices": "矩阵消元",
    "Multiplication and Inverse Matrices": "矩阵乘法与逆矩阵", "Factorization into A = LU": "A = LU 分解", "Transposes, Permutations, Vector Spaces": "转置、置换与向量空间",
    "Column Space and Nullspace": "列空间与零空间", "Solving Ax = 0: Pivot Variables, Special Solutions": "求解 Ax = 0：主变量与特解",
    "Solving Ax = b: Row Reduced Form R": "求解 Ax = b：行最简形 R", "Independence, Basis and Dimension": "线性无关、基与维数",
    "The Four Fundamental Subspaces": "四个基本子空间", "Matrix Spaces; Rank 1; Small World Graphs": "矩阵空间、秩 1 矩阵与小世界图",
    "Graphs, Networks, Incidence Matrices": "图、网络与关联矩阵", "Exam 1 Review": "考试 1 复习", "Exam 1": "考试 1",
    "Orthogonal Vectors and Subspaces": "正交向量与正交子空间", "Projections onto Subspaces": "子空间投影", "Projection Matrices and Least Squares": "投影矩阵与最小二乘",
    "Orthogonal Matrices and Gram-Schmidt": "正交矩阵与 Gram-Schmidt 正交化", "Properties of Determinants": "行列式的性质",
    "Determinant Formulas and Cofactors": "行列式公式与代数余子式", "Cramer's Rule, Inverse Matrix and Volume": "克拉默法则、逆矩阵与体积",
    "Eigenvalues and Eigenvectors": "特征值与特征向量", "Diagonalization and Powers of A": "对角化与 A 的幂", "Differential Equations and exp(At)": "微分方程与 exp(At)",
    "Markov Matrices; Fourier Series": "马尔可夫矩阵与傅里叶级数", "Exam 2 Review": "考试 2 复习", "Exam 2": "考试 2",
    "Symmetric Matrices and Positive Definiteness": "对称矩阵与正定性", "Complex Matrices; Fast Fourier Transform (FFT)": "复矩阵与快速傅里叶变换",
    "Positive Definite Matrices and Minima": "正定矩阵与极小值", "Similar Matrices and Jordan Form": "相似矩阵与若尔当标准形", "Singular Value Decomposition": "奇异值分解",
    "Linear Transformations and their Matrices": "线性变换及其矩阵", "Change of Basis; Image Compression": "基变换与图像压缩",
    "Left and Right Inverses; Pseudoinverse": "左逆、右逆与伪逆", "Exam 3 Review": "考试 3 复习", "Exam 3": "考试 3",
    "Final Course Review": "期末复习", "Final Exam": "期末考试",
}


def L(kind, label, url):
    return {"kind": kind, "label": label[:80], "url": url}


def ensure_zip():
    if os.path.exists(os.path.join(ZIP, "data.json")):
        return
    os.makedirs(CACHE, exist_ok=True)
    z = os.path.join(CACHE, "ocw.zip")
    if not os.path.exists(z):
        urllib.request.urlretrieve(OCW + "18.06sc-fall-2011.zip", z)
    zipfile.ZipFile(z).extractall(ZIP)


def sessions():
    """沿「Next」链接走一遍，得到 [(页面路径, 标题, 资源列表, 阅读建议)]。"""
    cur, out = "pages/ax-b-and-the-four-subspaces", []
    while cur:
        d = json.load(open(os.path.join(ZIP, cur, "data.json"), encoding="utf8"))
        c = d["content"]
        reading = re.findall(r"Read (Section[^<]*?) in the 4", c)
        out.append((cur, d["title"], re.findall(r'resources/([^/]+)/index.html">([^<]*)<', c), reading[0] if reading else None))
        m = re.search(r'<a href="([^"]+)">Next</a>', c)
        nxt = os.path.normpath(os.path.join(cur, m.group(1))).replace("/index.html", "") if m else None
        cur = nxt if nxt and "resource-index" not in nxt else None
    return out


def resource(rid):
    p = os.path.join(ZIP, "resources", rid, "data.json")
    return json.load(open(p, encoding="utf8")) if os.path.exists(p) else {}


def build():
    from practice import PRACTICE

    mods, bodies, n_lec = [], {}, 0
    for path, title, res, reading in sessions():
        if title.startswith("Unit "):
            mods.append({"id": f"unit-{len(mods) + 1}", "title": ZH[title], "items": []})
            continue
        if not mods:
            continue
        zh = ZH.get(title, title)
        kind = "exam" if re.fullmatch(r"Exam \d|Final Exam", title) else "lecture"
        key = None
        for rid, _ in res:
            m = re.match(r"mit18_06scf11_(ses\d-\d+|ex\d|final_ex|finalrev)", rid)
            if m:
                key = m.group(1).replace("-", ".")
                break
        if kind == "lecture":
            n_lec += 1
        iid = key.replace(".", "-").replace("_", "-") if key else re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
        if title == "Final Course Review":
            iid = "final-review"
        pages, videos, links = [], [], []
        for sub, ptitle in (("notes", "讲座摘要"), ("problems", "试卷与解答" if kind == "exam" else "习题与解答")):
            f = os.path.join(HERE, sub, f"{key}.md") if key else None
            if f and os.path.exists(f):
                pid = f"{iid}-{sub}"
                pages.append({"id": pid, "title": ptitle})
                bodies[pid] = open(f, encoding="utf8").read()
        if title in BILI_P:
            videos.append(L("video", "哔哩哔哩：讲座视频（中英双语字幕）", f"https://www.bilibili.com/video/{BILI}/?p={BILI_P[title]}"))
        for rid, label in res:
            d = resource(rid)
            yt = (d.get("video_metadata") or {}).get("youtube_id")
            if d.get("resourcetype") == "Video" and yt:
                lrt = d.get("learning_resource_types") or []
                if re.search(r"[一-鿿]", label):
                    videos.append(L("video", f"习题讲解（普通话）：{label}", f"https://www.youtube.com/watch?v={yt}"))
                elif "Problem-solving Videos" in lrt:
                    videos.append(L("video", "习题讲解视频（官方，英文）", f"https://www.youtube.com/watch?v={yt}"))
                else:
                    videos.append(L("video", "讲座视频（官方 YouTube）", f"https://www.youtube.com/watch?v={yt}"))
            elif d.get("file"):
                name = {"lecture summary (PDF)": "讲座摘要原文（PDF）", "Problems (PDF)": "习题原文（PDF）", "Solutions (PDF)": "解答原文（PDF）", "Exams (PDF)": "试卷原文（PDF）",
                        "Lecture video transcript (PDF)": "讲座文字稿（PDF，英文）", "Recitation video transcript (PDF)": "习题讲解文字稿（PDF，英文）"}.get(label, label)
                links.append(L("notes" if "summary" in label else "exams" if kind == "exam" else "other", name, "https://ocw.mit.edu" + d["file"]))
        links.insert(0, L("website", "OCW 本讲页面", OCW + path.replace("pages/", "pages/", 1) + "/"))
        if reading:
            links.append(L("textbook", f"教材 Introduction to Linear Algebra（第 4 或第 5 版）{reading.replace('Section', '第').replace(' through ', ' 至 ').replace(' and ', '、')} 节", "https://math.mit.edu/~gs/linearalgebra/"))
        prefix = f"第 {n_lec} 讲：" if kind == "lecture" else ""
        it = {"id": iid, "kind": kind, "title": (prefix + zh)[:100], "periods": 3 if kind == "lecture" else 3, "pages": pages, "videos": videos, "links": links,
              "practice": PRACTICE.get(key, []) if key else []}
        if title in ("An Overview of Key Ideas",):
            it["optional"] = True
        mods[-1]["items"].append(it)
    guide = {"id": "guide", "kind": "reading", "title": "开始之前：这门课怎么学", "periods": 1, "pages": [{"id": "guide", "title": "学习指南"}], "videos": [],
             "links": [L("website", "MIT OCW 18.06SC 课程网站", OCW), L("textbook", "教材 Introduction to Linear Algebra 主页", "https://math.mit.edu/~gs/linearalgebra/"),
                       L("video", "哔哩哔哩：全部 35 讲（中英双语字幕）", f"https://www.bilibili.com/video/{BILI}/")], "practice": []}
    bodies["guide"] = open(os.path.join(HERE, "guide.md"), encoding="utf8").read()
    mods.insert(0, {"id": "start", "title": "开始之前", "items": [guide]})
    return mods, bodies


def main():
    ensure_zip()
    mods, bodies = build()
    c = json.load(open(os.path.join(OUT, "course.json"), encoding="utf8"))
    c["title"] = "MIT 18.06SC：线性代数（Linear Algebra）"
    c["titleEn"] = "MIT 18.06SC Linear Algebra, Fall 2011"
    c["provider"] = "MIT"
    c["instructors"] = ["Gilbert Strang"]
    c["language"] = "中文（翻译）、英文视频"
    c["license"] = "讲座摘要、习题与解答 © MIT OpenCourseWare（Gilbert Strang），CC BY-NC-SA 4.0；中文翻译 海纳协会，同协议"
    c["links"] = [L("website", "网站 · OCW 18.06SC（站内课程内容按这一版整理）", OCW), L("video", "视频 · 哔哩哔哩中英双语字幕（35 讲）", f"https://www.bilibili.com/video/{BILI}/")] + \
                 [l for l in c["links"] if "18-06sc" not in l["url"] and BILI not in l["url"]]
    c["modules"] = mods
    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT):
        if f.endswith(".md"):
            os.remove(os.path.join(OUT, f))
    used = [p["id"] for m in mods for it in m["items"] for p in it["pages"]]
    assert len(used) == len(set(used)) and set(used) == set(bodies), set(used) ^ set(bodies)
    for pid, body in bodies.items():
        open(os.path.join(OUT, pid + ".md"), "w", encoding="utf8").write(body)
    open(os.path.join(OUT, "course.json"), "w", encoding="utf8").write(json.dumps(c, ensure_ascii=False, indent=1) + "\n")
    items = [it for m in mods for it in m["items"]]
    print("模块", len(mods), "条目", len(items), "页面", len(used), "练手题", sum(len(it["practice"]) for it in items),
          "缺讲义", [it["id"] for it in items if it["kind"] == "lecture" and not any(p["title"] == "讲座摘要" for p in it["pages"])])


if __name__ == "__main__":
    main()
