import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type Graph, type GraphNode, neighborhood } from "../../shared/blockGraph";

/**
 * 知识块图谱（Obsidian 式网状图）。SVG 手写，没有第三方库。
 * 布局算法改编自 AITopia-Shao/ai-learning-atlas 的 graph/layout.js（作者同意使用）：
 *   网络布局：根节点固定在锚点，子节点按黄金角绕父节点排开，再做若干轮斥力 + 弹簧的模拟，稳定后停止；
 *   层次布局：按深度分列的整齐树。
 * 交互：拖空白处平移，滚轮或双指缩放，拖节点固定位置，点节点选中（其余变暗，只亮相邻的点和线）。
 * 系统设置了「减少动态效果」时直接算好最终位置，不播动画。
 */

export type Layout = "network" | "tree";

interface Pos {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  pinned: boolean;
}

const SIZE: Record<GraphNode["kind"], number> = { block: 14, group: 9, course: 7, concept: 7, link: 5 };
const FONT: Record<GraphNode["kind"], number> = { block: 14, group: 13, course: 12, concept: 12, link: 11 };
const ITER = 260;

function reducedMotion() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initialNetwork(g: Graph, old: Map<string, Pos>): Map<string, Pos> {
  const pos = new Map<string, Pos>();
  const roots = g.nodes.filter((n) => n.kind === "block");
  const anchors = new Map<string, { x: number; y: number }>();
  roots.forEach((r, i) => {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / Math.max(roots.length, 1);
    anchors.set(r.id, roots.length === 1 ? { x: 0, y: 0 } : { x: Math.cos(a) * 520, y: Math.sin(a) * 420 });
  });
  const kids = new Map<string, string[]>();
  for (const n of g.nodes) if (n.parent) kids.set(n.parent, [...(kids.get(n.parent) ?? []), n.id]);
  const place = (n: GraphNode) => {
    if (pos.has(n.id)) return;
    const keep = old.get(n.id);
    const anchor = anchors.get(`block:${n.block}`) ?? { x: 0, y: 0 };
    if (keep) {
      pos.set(n.id, { ...keep, vx: 0, vy: 0, ax: anchor.x, ay: anchor.y });
      return;
    }
    let x = anchor.x;
    let y = anchor.y;
    if (n.parent) {
      const parent = g.nodes.find((m) => m.id === n.parent);
      if (parent) place(parent);
      const p = pos.get(n.parent) ?? { x, y };
      const i = (kids.get(n.parent) ?? []).indexOf(n.id);
      const angle = i * 2.39996 + n.depth;
      const r = n.depth === 1 ? 150 + 18 * Math.sqrt(Math.max(i, 0)) : n.depth === 2 ? 95 + 12 * Math.sqrt(Math.max(i, 0)) : 60;
      x = p.x + Math.cos(angle) * r;
      y = p.y + Math.sin(angle) * r;
    }
    pos.set(n.id, { x, y, vx: 0, vy: 0, ax: anchor.x, ay: anchor.y, pinned: false });
  };
  for (const n of g.nodes) place(n);
  return pos;
}

function treeLayout(g: Graph): Map<string, Pos> {
  const pos = new Map<string, Pos>();
  const kids = new Map<string, string[]>();
  for (const n of g.nodes) if (n.parent) kids.set(n.parent, [...(kids.get(n.parent) ?? []), n.id]);
  let cursor = 0;
  const byId = new Map(g.nodes.map((n) => [n.id, n]));
  const visit = (id: string, depth: number): number => {
    const ks = kids.get(id) ?? [];
    const ys = ks.map((k) => visit(k, depth + 1));
    const y = ys.length ? (ys[0] + ys[ys.length - 1]) / 2 : (cursor += 44);
    pos.set(id, { x: depth * 250, y, vx: 0, vy: 0, ax: 0, ay: 0, pinned: true });
    return y;
  };
  for (const n of g.nodes)
    if (!n.parent || !byId.has(n.parent)) {
      visit(n.id, 0);
      cursor += 60;
    }
  return pos;
}

/** 斥力 + 弹簧 + 锚点引力，参数取自 ai-learning-atlas */
function simulate(g: Graph, pos: Map<string, Pos>, steps: number, iter: { n: number }) {
  const ps = g.nodes.map((n) => pos.get(n.id) as Pos);
  const depth = new Map(g.nodes.map((n) => [n.id, n.depth]));
  for (let s = 0; s < steps; s++) {
    const cool = Math.max(0.1, 1 - iter.n / ITER);
    for (let i = 0; i < ps.length; i++) {
      const a = ps[i];
      for (let j = i + 1; j < ps.length; j++) {
        const b = ps[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d2 = dx * dx + dy * dy + 0.1;
        if (d2 > 200000) continue;
        let d = Math.sqrt(d2);
        if (d < 1) {
          dx = 0.5;
          dy = 0.7;
          d2 = 1;
          d = 1;
        }
        const f = Math.min(5, 1400 / d2);
        a.vx -= (dx / d) * f;
        a.vy -= (dy / d) * f;
        b.vx += (dx / d) * f;
        b.vy += (dy / d) * f;
      }
    }
    for (const e of g.edges) {
      const a = pos.get(e.source);
      const b = pos.get(e.target);
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      const hier = e.type === "parent";
      const level = Math.max(depth.get(e.source) ?? 0, depth.get(e.target) ?? 0);
      const length = hier ? (level <= 1 ? 160 : level === 2 ? 115 : 85) : 240;
      const f = (d - length) * (hier ? 0.014 : 0.0008);
      a.vx += (dx / d) * f;
      a.vy += (dy / d) * f;
      b.vx -= (dx / d) * f;
      b.vy -= (dy / d) * f;
    }
    g.nodes.forEach((n, i) => {
      const p = ps[i];
      if (p.pinned) {
        p.vx = p.vy = 0;
        return;
      }
      const strength = n.kind === "block" ? 0.04 : 0.001;
      p.vx = (p.vx + (p.ax - p.x) * strength) * 0.75;
      p.vy = (p.vy + (p.ay - p.y) * strength) * 0.75;
      p.x += Math.max(-9, Math.min(9, p.vx)) * cool;
      p.y += Math.max(-9, Math.min(9, p.vy)) * cool;
    });
    iter.n++;
  }
}

function textWidth(s: string, font: number) {
  let w = 0;
  for (const c of s) w += /[㐀-鿿＀-￯]/.test(c) ? font : font * 0.58;
  return w;
}

export function KnowledgeGraph({
  graph,
  ratioOf,
  selected,
  onSelect,
  layout,
  height = 560,
}: {
  graph: Graph;
  /** 完成度 0–1；不计进度的点是 null */
  ratioOf: (n: GraphNode) => number | null;
  selected: string | null;
  onSelect: (id: string | null) => void;
  layout: Layout;
  height?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pos = useRef<Map<string, Pos>>(new Map());
  const iter = useRef({ n: 0 });
  const raf = useRef(0);
  const [, setFrame] = useState(0);
  const [size, setSize] = useState({ w: 800, h: height });
  const [t, setT] = useState({ k: 1, x: 400, y: height / 2 });
  const [hovered, setHovered] = useState<string | null>(null);
  const byId = useMemo(() => new Map(graph.nodes.map((n) => [n.id, n])), [graph]);

  // 量尺寸
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.max(240, r.width), h: Math.max(240, r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fit = useCallback(() => {
    const ps = [...pos.current.values()];
    if (!ps.length) return;
    const minX = Math.min(...ps.map((p) => p.x)) - 90;
    const maxX = Math.max(...ps.map((p) => p.x)) + 90;
    const minY = Math.min(...ps.map((p) => p.y)) - 40;
    const maxY = Math.max(...ps.map((p) => p.y)) + 40;
    const k = Math.min(1.4, Math.max(0.08, Math.min((size.w - 32) / (maxX - minX), (size.h - 64) / (maxY - minY))));
    setT({ k, x: size.w / 2 - ((minX + maxX) / 2) * k, y: size.h / 2 - ((minY + maxY) / 2) * k });
  }, [size.w, size.h]);

  // 换图或换布局：重新排
  // biome-ignore lint/correctness/useExhaustiveDependencies: fit 依赖尺寸，尺寸变化单独处理
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    iter.current.n = 0;
    if (layout === "tree") {
      pos.current = treeLayout(graph);
      setFrame((f) => f + 1);
      requestAnimationFrame(fit);
      return;
    }
    pos.current = initialNetwork(graph, new Map());
    if (reducedMotion()) {
      simulate(graph, pos.current, ITER, iter.current);
      setFrame((f) => f + 1);
      requestAnimationFrame(fit);
      return;
    }
    let fitted = false;
    const tick = () => {
      simulate(graph, pos.current, 3, iter.current);
      setFrame((f) => f + 1);
      if (!fitted && iter.current.n > 60) {
        fitted = true;
        fit();
      }
      if (iter.current.n < ITER && !document.hidden) raf.current = requestAnimationFrame(tick);
      else fit();
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [graph, layout]);

  // ---------------------------------------------------------- 手势
  const gesture = useRef<{ id: string | null; start: { x: number; y: number }; last: { x: number; y: number }; moved: boolean } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; x: number; y: number } | null>(null);

  const point = (e: React.PointerEvent | React.WheelEvent) => {
    const r = (svgRef.current as SVGSVGElement).getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const zoomAt = useCallback((factor: number, x: number, y: number) => {
    setT((t0) => {
      const k = Math.max(0.08, Math.min(4, t0.k * factor));
      return { k, x: x - ((x - t0.x) * k) / t0.k, y: y - ((y - t0.y) * k) / t0.k };
    });
  }, []);

  // 滚轮缩放要阻止页面滚动，React 的 onWheel 是 passive，只能自己挂
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(Math.exp(-Math.max(-150, Math.min(150, e.deltaY)) * 0.004), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onDown = (e: React.PointerEvent, id: string | null) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const p = point(e);
    pointers.current.set(e.pointerId, p);
    svgRef.current?.setPointerCapture(e.pointerId);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      gesture.current = null;
      return;
    }
    gesture.current = { id, start: p, last: p, moved: false };
  };

  const onMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    const p = point(e);
    pointers.current.set(e.pointerId, p);
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const x = (a.x + b.x) / 2;
      const y = (a.y + b.y) / 2;
      const prev = pinch.current;
      zoomAt(d / Math.max(prev.d, 1), prev.x, prev.y);
      setT((t0) => ({ ...t0, x: t0.x + x - prev.x, y: t0.y + y - prev.y }));
      pinch.current = { d, x, y };
      return;
    }
    const g = gesture.current;
    if (!g) return;
    const dx = p.x - g.last.x;
    const dy = p.y - g.last.y;
    if (Math.hypot(p.x - g.start.x, p.y - g.start.y) > 4) g.moved = true;
    if (g.moved) {
      if (g.id) {
        const q = pos.current.get(g.id);
        if (q) {
          q.x += dx / t.k;
          q.y += dy / t.k;
          q.pinned = true;
          setFrame((f) => f + 1);
        }
      } else setT((t0) => ({ ...t0, x: t0.x + dx, y: t0.y + dy }));
    }
    g.last = p;
  };

  const onUp = (e: React.PointerEvent) => {
    const g = gesture.current;
    gesture.current = null;
    pointers.current.delete(e.pointerId);
    pinch.current = null;
    if (g && !g.moved && e.type === "pointerup") onSelect(g.id);
  };

  // ---------------------------------------------------------- 画
  const focus = hovered ?? selected;
  const near = useMemo(() => neighborhood(graph, focus), [graph, focus]);

  // 标签：重要的先放，和已放的重叠就不显示（选中和相邻的总显示）
  const shown = new Set<string>();
  {
    const boxes: { x: number; y: number; w: number; h: number }[] = [];
    const rank = (n: GraphNode) => (n.id === focus ? -100 : near.has(n.id) ? -10 : n.depth);
    const order = [...graph.nodes].sort((a, b) => rank(a) - rank(b));
    for (const n of order) {
      const p = pos.current.get(n.id);
      if (!p) continue;
      const sx = p.x * t.k + t.x;
      const sy = p.y * t.k + t.y;
      const font = FONT[n.kind];
      const w = textWidth(n.label, font);
      const tree = layout === "tree";
      const box = tree ? { x: sx + 12, y: sy - font, w: w + 6, h: font + 6 } : { x: sx - w / 2, y: sy + SIZE[n.kind] * Math.min(t.k, 1.4) + 2, w: w + 6, h: font + 6 };
      const off = box.x + box.w < 0 || box.x > size.w || box.y < 0 || box.y > size.h;
      const semantic = n.kind === "link" ? t.k > 0.7 || near.has(n.id) : n.depth >= 2 ? t.k > 0.45 || near.has(n.id) : true;
      const hit = boxes.some((b) => box.x < b.x + b.w && box.x + box.w > b.x && box.y < b.y + b.h && box.y + box.h > b.y);
      if (!off && semantic && (!hit || n.id === focus)) {
        shown.add(n.id);
        boxes.push(box);
      }
    }
  }

  const edgePath = (s: string, d: string, type: string) => {
    const a = pos.current.get(s);
    const b = pos.current.get(d);
    const na = byId.get(s);
    const nb = byId.get(d);
    if (!a || !b || !na || !nb) return "";
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const r = SIZE[nb.kind] + (type === "parent" ? 2 : 6);
    const st = SIZE[na.kind] + 2;
    const x1 = a.x + (dx / len) * st;
    const y1 = a.y + (dy / len) * st;
    const x2 = b.x - (dx / len) * r;
    const y2 = b.y - (dy / len) * r;
    if (layout === "tree" && type === "parent") {
      const xm = (x1 + x2) / 2;
      return `M${x1} ${y1}C${xm} ${y1} ${xm} ${y2} ${x2} ${y2}`;
    }
    if (layout === "tree" && type === "pre") {
      const bend = Math.max(a.x, b.x) + 60 + Math.min(120, Math.abs(dy) * 0.3);
      return `M${a.x + st} ${a.y}C${bend} ${a.y} ${bend} ${b.y} ${b.x + r} ${b.y}`;
    }
    return `M${x1} ${y1}L${x2} ${y2}`;
  };

  return (
    <div className="kg" style={{ height: `min(${height}px, 62vh)` }}>
      <svg
        ref={svgRef}
        className="kg-svg"
        role="img"
        aria-label="知识图谱：可拖动、缩放，点一个节点查看详情"
        onPointerDown={(e) => onDown(e, null)}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <defs>
          <marker id="kg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" className="kg-arrow" />
          </marker>
        </defs>
        <g transform={`translate(${t.x} ${t.y}) scale(${t.k})`}>
          {graph.edges.map((e, i) => {
            const active = !!focus && (e.source === focus || e.target === focus);
            return (
              <path
                // biome-ignore lint/suspicious/noArrayIndexKey: 线没有 id，顺序固定
                key={i}
                d={edgePath(e.source, e.target, e.type)}
                className={`kg-edge kg-edge-${e.type}${active ? " is-active" : focus ? " is-dimmed" : ""}`}
                markerEnd={e.type === "parent" ? undefined : "url(#kg-arrow)"}
                style={{ strokeWidth: (active ? 2 : 1.1) / Math.max(t.k, 0.4) }}
              />
            );
          })}
          {graph.nodes.map((n) => {
            const p = pos.current.get(n.id);
            if (!p) return null;
            const r = ratioOf(n);
            const status = r === null ? "" : r >= 1 ? " is-done" : r > 0 ? " is-started" : "";
            const label = shown.has(n.id);
            const tree = layout === "tree";
            const scale = 1 / t.k;
            return (
              <g
                key={n.id}
                transform={`translate(${p.x} ${p.y})`}
                className={`kg-node kg-${n.kind}${status}${n.optional ? " is-optional" : ""}${n.id === selected ? " is-selected" : ""}${focus && !near.has(n.id) ? " is-dimmed" : ""}`}
                onPointerDown={(e) => onDown(e, n.id)}
                onPointerEnter={() => setHovered(n.id)}
                onPointerLeave={() => setHovered((h) => (h === n.id ? null : h))}
              >
                <circle r={Math.max(SIZE[n.kind] + 6, 14 * scale)} className="kg-hit" />
                <circle r={SIZE[n.kind]} className="kg-dot" />
                {r !== null && r > 0 && r < 1 && (
                  <circle r={SIZE[n.kind] + 3} className="kg-ring" pathLength={1} strokeDasharray={`${r} 1`} transform="rotate(-90)" />
                )}
                {label && (
                  <text
                    className="kg-label"
                    x={tree ? 12 * scale : 0}
                    y={tree ? 4 * scale : (SIZE[n.kind] * Math.min(t.k, 1.4) + 14) * scale}
                    textAnchor={tree ? "start" : "middle"}
                    style={{ fontSize: FONT[n.kind] * scale }}
                  >
                    {n.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <div className="kg-tools">
        <button type="button" className="btn btn-sm" onClick={() => zoomAt(1.25, size.w / 2, size.h / 2)} aria-label="放大">
          ＋
        </button>
        <button type="button" className="btn btn-sm" onClick={() => zoomAt(0.8, size.w / 2, size.h / 2)} aria-label="缩小">
          －
        </button>
        <button type="button" className="btn btn-sm" onClick={fit}>
          适应
        </button>
        <span className="small sub num">{Math.round(t.k * 100)}%</span>
      </div>
    </div>
  );
}
