import { z } from "zod/v4";
import { BLOCK_FORMAT, type BlockNode as BlockNodeType } from "./blocks";

/** 知识块 hiana-block@1 的校验（格式说明见 ./blocks.ts） */

const slug = z.string().regex(/^[a-z0-9][a-z0-9-]{1,47}$/, "只能用小写字母、数字和连字符，2–48 个字符");
const courseSlug = z.string().regex(/^[a-z0-9][a-z0-9-]{0,47}$/, "要写课程的 slug");
const nodeId = z.string().regex(/^[a-z0-9][a-z0-9-]{0,47}$/, "节点 id 只能用小写字母、数字和连字符");
const Link = z.object({ label: z.string().min(1).max(80), url: z.string().regex(/^(https?:\/\/|\/)\S+$/, "要是 https:// 开头的网址或站内路径") });

export const BlockNode: z.ZodType<BlockNodeType> = z.lazy(() =>
  z
    .object({
      id: nodeId.optional(),
      title: z.string().min(1).max(80).optional(),
      note: z.string().max(400).optional(),
      course: courseSlug.optional(),
      items: z.array(courseSlug).max(40).optional(),
      link: Link.optional(),
      children: z.array(BlockNode).min(1).max(40).optional(),
      pick: z.number().int().min(1).optional(),
      optional: z.boolean().optional(),
      pre: z.array(nodeId).max(10).optional(),
      body: z.string().min(1).max(4000).optional(),
      sources: z.array(Link).max(10).optional(),
    })
    .superRefine((n, ctx) => {
      const kinds = [n.course, n.link, n.children, n.body !== undefined && !n.children].filter(Boolean).length;
      if (kinds !== 1) ctx.addIssue({ code: "custom", message: "每个节点只能是一种：分组（children）、课程（course）、链接（link）或概念（body）" });
      if (n.body !== undefined && !n.children && !n.title) ctx.addIssue({ code: "custom", message: "概念节点要有 title" });
      if (n.children && !n.title) ctx.addIssue({ code: "custom", message: "分组要有 title" });
      if (n.pick && !(n.children && n.pick <= n.children.length)) ctx.addIssue({ code: "custom", message: "pick 只能用在分组上，而且不能比子节点多" });
      if (n.items && !n.course) ctx.addIssue({ code: "custom", message: "items 只能用在课程节点上" });
    }),
);

export const BlockBase = z.object({
  format: z.literal(BLOCK_FORMAT),
  slug,
  title: z.string().min(1).max(40),
  summary: z.string().max(120).default(""),
  audience: z.string().max(80).optional(),
  intro: z.string().max(20_000).optional(),
  nodes: z.array(BlockNode).min(1).max(40),
  next: z.array(slug).default([]),
});

/** 节点 id 不能重复；pre 只能引用同一个知识块里存在的 id，也不能引用自己 */
export const Block = BlockBase.superRefine((b, ctx) => {
  const ids = new Set<string>();
  const all: BlockNodeType[] = [];
  const walk = (ns: BlockNodeType[]) => {
    for (const n of ns) {
      all.push(n);
      if (n.id) {
        if (ids.has(n.id)) ctx.addIssue({ code: "custom", message: `节点 id 重复：${n.id}`, path: ["nodes"] });
        ids.add(n.id);
      }
      if (n.children) walk(n.children);
    }
  };
  walk(b.nodes);
  for (const n of all)
    for (const p of n.pre ?? []) {
      if (!ids.has(p)) ctx.addIssue({ code: "custom", message: `pre 引用了不存在的节点：${p}`, path: ["nodes"] });
      if (p === n.id) ctx.addIssue({ code: "custom", message: `节点不能是自己的先修：${p}`, path: ["nodes"] });
    }
  // 先修关系不能绕成圈（A 要先学 B，B 又要先学 A）
  const pre = new Map(all.filter((n) => n.id).map((n) => [n.id as string, n.pre ?? []]));
  const state = new Map<string, 1 | 2>();
  const visit = (id: string, trail: string[]): boolean => {
    if (state.get(id) === 2) return false;
    if (state.get(id) === 1) {
      ctx.addIssue({ code: "custom", message: `先修关系绕成了圈：${[...trail, id].join(" → ")}`, path: ["nodes"] });
      return true;
    }
    state.set(id, 1);
    for (const p of pre.get(id) ?? []) if (pre.has(p) && visit(p, [...trail, id])) return true;
    state.set(id, 2);
    return false;
  };
  for (const id of pre.keys()) if (visit(id, [])) break;
});

export function parseBlock(raw: unknown): { ok: true; block: z.infer<typeof Block> } | { ok: false; errors: string[] } {
  const r = Block.safeParse(raw);
  if (r.success) return { ok: true, block: r.data };
  return { ok: false, errors: r.error.issues.slice(0, 20).map((i) => `${i.path.join(".") || "知识块"}：${i.message}`) };
}

export function blockJsonSchema() {
  return { $id: "https://study.shanmoew-denied.win/schema/block-v1.json", title: "hiana-block@1 知识块", ...z.toJSONSchema(BlockBase, { io: "input" }) };
}
