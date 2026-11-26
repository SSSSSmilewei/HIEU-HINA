import { describe, expect, test } from "bun:test";
import { buildSeaMap, XP } from "../src/client/seaMap";

/** 深海地图的节点状态（故事 3.7） */
const modules = [
  { id: "week-1", title: "第 1 周", items: [
    { id: "lec01", kind: "lecture", title: "第 1 讲", pages: [{ id: "cp-1-1" }] },
    { id: "lab01", kind: "lab", title: "实验 1", pages: [] },
  ] },
  { id: "week-2", title: "第 2 周", items: [
    { id: "lec02", kind: "lecture", title: "第 2 讲", pages: [] },
    { id: "hw01", kind: "assignment", title: "作业 1", pages: [], optional: true },
  ] },
  { id: "week-9", title: "考试", items: [{ id: "exam-final", kind: "exam", title: "期末", pages: [] }] },
];
const assignments = [
  { id: "lab01", item: "lab01", problems: [{ id: "a" }, { id: "b" }, { id: "ec" }] },
  { id: "fa20-lab01", item: "lab01", problems: [{ id: "x" }] },
];

describe("深海地图", () => {
  test("什么都没做：第一周可以做，后面的周暗下来；下一站是第一个点", () => {
    const m = buildSeaMap({ course: "cs61a", modules, done: {}, solved: new Set(), assignments, exams: [] });
    expect(m.weeks[0]!.nodes.map((n) => n.status)).toEqual(["open", "open"]);
    expect(m.weeks[1]!.nodes[0]!.status).toBe("ahead");
    expect(m.next?.id).toBe("lec01");
    expect(m.xp).toBe(0);
    expect(m.weeks[0]!.nodes[1]!.href).toBe("/courses/cs61a/hw/lab01");
    expect(m.weeks[0]!.nodes[0]!.href).toBe("/courses/cs61a/learn/cp-1-1");
  });

  test("lab01 通过一部分是进行中；全部必做题通过（附加题不算）就点亮，取完成得最多的版本", () => {
    const part = buildSeaMap({ course: "cs61a", modules, done: {}, solved: new Set(["cs61a/lab01/a"]), assignments, exams: [] });
    expect(part.weeks[0]!.nodes[1]).toMatchObject({ status: "doing", progress: { solved: 1, total: 2 } });
    const full = buildSeaMap({ course: "cs61a", modules, done: { lec01: 1 }, solved: new Set(["cs61a/fa20-lab01/x"]), assignments, exams: [] });
    expect(full.weeks[0]!.nodes[1]).toMatchObject({ status: "done", href: "/courses/cs61a/hw/fa20-lab01" });
    expect(full.weeks[1]!.nodes[0]!.status).toBe("open");
    expect(full.xp).toBe(XP.lesson + XP.problem + XP.assignment);
    expect(full.badges.find((b) => b.id === "first-ac")!.earned).toBe(true);
  });

  test("测验及格点亮，发「浮出水面」徽章；选学的点不算进必做", () => {
    const m = buildSeaMap({ course: "cs61a", modules, done: {}, solved: new Set(), assignments, exams: [{ id: "f", item: "exam-final", passed: true }] });
    expect(m.weeks[2]!.nodes[0]).toMatchObject({ status: "done", href: "/courses/cs61a/exam/f" });
    expect(m.badges.find((b) => b.id === "final")!.earned).toBe(true);
    expect(m.weeks[1]!.total).toBe(1);
  });
});
