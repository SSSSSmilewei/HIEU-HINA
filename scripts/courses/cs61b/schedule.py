"""把 CS61B 2026 春季官网首页的课表解析成结构化数据。

用法：python3 scripts/courses/cs61b/schedule.py  → 打印 JSON
输入：.staging/course-cache/cs61b/site/index.html（官网首页的缓存）
"""
import html, json, os, re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
SITE = os.path.join(ROOT, ".staging/course-cache/cs61b/site")
BASE = "https://sp26.datastructur.es"


def links(cell):
    out = []
    for href, text in re.findall(r'<a [^>]*href="([^"]+)"[^>]*>(.*?)</a>', cell, re.S):
        text = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", text))).strip()
        out.append((BASE + href if href.startswith("/") else href, text))
    return out


def text(cell):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", cell))).strip()


def parse():
    """按 rowspan 还原表格：列依次是 周、日期、讲座、讨论课、作业、项目。"""
    s = open(os.path.join(SITE, "index.html"), encoding="utf8").read()
    s = s[s.find('id="course-calendar"'):]
    s = s[s.find("<table"):s.find("</table>")]
    rows = re.findall(r"<tr[^>]*>(.*?)</tr>", s, re.S)[1:]
    span = [0] * 6          # 每列还要被上面的格子占几行
    hold = [None] * 6       # 占位的格子内容
    grid = []
    for r in rows:
        cells = re.findall(r"<t[dh]([^>]*)>(.*?)</t[dh]>", r, re.S)
        line, k = [None] * 6, 0
        for col in range(6):
            if span[col] > 0:
                line[col] = hold[col]
                span[col] -= 1
                continue
            if k >= len(cells):
                continue
            attr, body = cells[k]
            k += 1
            n = int((re.search(r'rowspan="(\d+)"', attr) or [0, 1])[1])
            line[col] = body
            hold[col], span[col] = body, n - 1
        grid.append(line)
    out = []
    for line in grid:
        wk = text(line[0] or "")
        m = re.match(r"(\d+)", wk)
        out.append({
            "week": int(m.group(1)) if m else None,
            "date": text(line[1] or ""),
            **{name: {"text": text(line[i] or ""), "links": links(line[i] or "")} for i, name in ((2, "lecture"), (3, "section"), (4, "hw"), (5, "project"))},
        })
    return out


if __name__ == "__main__":
    print(json.dumps(parse(), ensure_ascii=False, indent=1))
