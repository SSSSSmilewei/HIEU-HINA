import { describe, expect, test } from "bun:test";
import { blockGraph, neighborhood, preOf, siteGraph } from "../src/shared/blockGraph";
import { parseBlock } from "../src/shared/blockSchema";
import { blockPeriods, kindOf, nextCourse, nodeRatio } from "../src/shared/blocks";

const base = { format: "hiana-block@1", slug: "demo", title: "演示知识块" };

describe("知识块：概念节点和先修关系", () => {
  test("概念节点合法，不计课时和进度，也不会被当成下一步", () => {
    const r = parseBlock({ ...base, nodes: [{ id: "why", title: "为什么", body: "说明", sources: [{ label: "出处", url: "https://example.edu" }] }, { id: "c", course: "cs50x", pre: ["why"] }] });
    expect(r.ok).toBe(true);
    const concept = { title: "为什么", body: "说明" };
    expect(kindOf(concept)).toBe("concept");
    expect(nodeRatio(concept, () => 1)).toBeNull();
    expect(blockPeriods({ nodes: [concept, { course: "a", periods: 6 }] })).toBe(6);
    expect(nextCourse({ nodes: [concept, { course: "a" }] }, () => 0)?.course).toBe("a");
  });

  test("拒绝：概念没有标题、id 重复、先修不存在、先修绕圈", () => {
    const errs = (nodes: unknown[]) => {
      const r = parseBlock({ ...base, nodes });
      return r.ok ? "" : r.errors.join("\n");
    };
    expect(errs([{ body: "没有标题" }])).toContain("概念节点要有 title");
    expect(errs([{ id: "a", course: "x" }, { id: "a", course: "y" }])).toContain("id 重复");
    expect(errs([{ id: "a", course: "x", pre: ["nope"] }])).toContain("不存在的节点");
    expect(errs([{ id: "a", course: "x", pre: ["b"] }, { id: "b", course: "y", pre: ["a"] }])).toContain("绕成了圈");
    expect(errs([{ id: "a", course: "x", pre: ["a"] }])).toContain("自己的先修");
  });
});

describe("知识块图谱", () => {
  const block = {
    slug: "demo",
    title: "演示知识块",
    nodes: [
      { id: "why", title: "为什么", body: "说明" },
      { id: "g", title: "阶段一", pre: ["why"], children: [{ course: "a" }, { course: "b" }] },
      { id: "h", title: "阶段二", pre: ["g"], children: [{ course: "a", items: ["x"] }] },
    ],
  };

  test("单个知识块：父子线 + 先修线，同一门课出现两次是两个点", () => {
    const g = blockGraph(block);
    expect(g.nodes.filter((n) => n.kind === "course")).toHaveLength(3);
    expect(g.nodes[0]).toMatchObject({ id: "block:demo", kind: "block", parent: null });
    const pre = g.edges.filter((e) => e.type === "pre");
    expect(pre).toHaveLength(2);
    const g1 = g.nodes.find((n) => n.label === "阶段一");
    const g2 = g.nodes.find((n) => n.label === "阶段二");
    expect(preOf(g, g2?.id ?? "").before.map((n) => n.label)).toEqual(["阶段一"]);
    expect(preOf(g, g1?.id ?? "").after.map((n) => n.label)).toEqual(["阶段二"]);
    expect(neighborhood(g, g1?.id ?? "").size).toBe(6); // 自己、根、两门课、阶段二、概念
  });

  test("全站大图：同一门课合并成一个点，next 画成知识块之间的线", () => {
    const other = { slug: "other", title: "另一个", nodes: [{ course: "a" }], next: ["demo"] };
    const g = siteGraph([{ ...block, next: [] }, other]);
    expect(g.nodes.filter((n) => n.id === "course:a")).toHaveLength(1);
    const parents = g.edges.filter((e) => e.type === "parent" && e.source === "course:a").map((e) => e.target);
    expect(parents.length).toBe(3);
    expect(g.edges.some((e) => e.type === "next" && e.source === "block:other" && e.target === "block:demo")).toBe(true);
  });
});
