import { type Block, type BlockNode, kindOf } from "./blocks";

/**
 * 把知识块变成图谱（网状图）的点和线。
 *   点：知识块（根）、分组、课程、概念、链接
 *   线：parent（子节点 → 所属的分组/知识块）、pre（先修 → 后学）、next（知识块 → 学完以后去的知识块，只在全站图里）
 * 单个知识块：每个节点一个点（同一门课出现两次就是两个点，因为重点看的条目可能不同）。
 * 全站大图：同一门课合并成一个点，于是不同知识块通过共同的课连在一起。
 * 这个文件不 import 任何运行时依赖，网页和测试都能直接用。
 */

export type GraphKind = "block" | "group" | "course" | "concept" | "link";

export interface GraphNode {
  id: string;
  label: string;
  kind: GraphKind;
  /** 树里的父节点（层次布局用）；根是 null */
  parent: string | null;
  /** 所在知识块（全站图里合并的课程取第一次出现的知识块） */
  block: string;
  depth: number;
  /** 原始节点；知识块根是 null */
  node: BlockNode | null;
  optional: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: "parent" | "pre" | "next";
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

function labelOf(n: BlockNode): string {
  const k = kindOf(n);
  if (k === "course") return n.courseTitle ?? (n.course as string);
  if (k === "link") return n.link?.label ?? "";
  return n.title ?? "";
}

function add(g: Graph, block: Pick<Block, "slug" | "title" | "nodes">, merge: boolean, seen: Map<string, GraphNode>) {
  const root = `block:${block.slug}`;
  g.nodes.push({ id: root, label: block.title.replace(/知识块$/, ""), kind: "block", parent: null, block: block.slug, depth: 0, node: null, optional: false });
  const byLocalId = new Map<string, string>();
  const pres: { node: BlockNode; gid: string }[] = [];
  const walk = (ns: BlockNode[], parent: string, depth: number, path: string, optional: boolean) => {
    ns.forEach((n, i) => {
      const kind = kindOf(n) as GraphKind;
      const local = `${block.slug}:${path}${i}`;
      let gid = local;
      if (merge && kind === "course") gid = `course:${n.course}`;
      const opt = optional || !!n.optional;
      const existing = seen.get(gid);
      if (existing) {
        if (!opt) existing.optional = false;
      } else {
        const gn: GraphNode = { id: gid, label: labelOf(n), kind, parent, block: block.slug, depth, node: n, optional: opt };
        g.nodes.push(gn);
        seen.set(gid, gn);
      }
      if (!g.edges.some((e) => e.type === "parent" && e.source === gid && e.target === parent)) g.edges.push({ source: gid, target: parent, type: "parent" });
      if (n.id) byLocalId.set(n.id, gid);
      if (n.pre?.length) pres.push({ node: n, gid });
      if (n.children) walk(n.children, gid, depth + 1, `${path}${i}.`, opt);
    });
  };
  walk(block.nodes, root, 1, "", false);
  for (const { node, gid } of pres)
    for (const p of node.pre ?? []) {
      const from = byLocalId.get(p);
      if (from && from !== gid) g.edges.push({ source: from, target: gid, type: "pre" });
    }
}

export function blockGraph(block: Pick<Block, "slug" | "title" | "nodes">): Graph {
  const g: Graph = { nodes: [], edges: [] };
  add(g, block, false, new Map());
  return g;
}

/** 全站大图：所有知识块，同一门课合并；next 画成知识块之间的线 */
export function siteGraph(blocks: Pick<Block, "slug" | "title" | "nodes" | "next">[]): Graph {
  const g: Graph = { nodes: [], edges: [] };
  const seen = new Map<string, GraphNode>();
  for (const b of blocks) add(g, b, true, seen);
  const slugs = new Set(blocks.map((b) => b.slug));
  for (const b of blocks) for (const s of b.next ?? []) if (slugs.has(s)) g.edges.push({ source: `block:${b.slug}`, target: `block:${s}`, type: "next" });
  return g;
}

/** 某个点的先修和后续（只看 pre 线） */
export function preOf(g: Graph, id: string): { before: GraphNode[]; after: GraphNode[] } {
  const byId = new Map(g.nodes.map((n) => [n.id, n]));
  const before = g.edges.filter((e) => e.type === "pre" && e.target === id).map((e) => byId.get(e.source)).filter((n): n is GraphNode => !!n);
  const after = g.edges.filter((e) => e.type === "pre" && e.source === id).map((e) => byId.get(e.target)).filter((n): n is GraphNode => !!n);
  return { before, after };
}

/** 点的邻居（和它有线相连的点），加上它自己 */
export function neighborhood(g: Graph, id: string | null): Set<string> {
  const out = new Set<string>();
  if (!id) return out;
  out.add(id);
  for (const e of g.edges)
    if (e.source === id || e.target === id) {
      out.add(e.source);
      out.add(e.target);
    }
  return out;
}
