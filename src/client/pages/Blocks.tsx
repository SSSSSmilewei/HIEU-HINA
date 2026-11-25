import { useEffect, useMemo, useState } from "react";
import { type Graph, type GraphNode, blockGraph, preOf, siteGraph } from "../../shared/blockGraph";
import { KnowledgeGraph, type Layout } from "../components/KnowledgeGraph";
import { type Block, type BlockNode, type BlockSummary, type CourseProgress, blockPeriods, blockRatio, kindOf, nextCourse, nodeRatio } from "../../shared/blocks";
import { periodsToHours } from "../../shared/courses";
import { useApi } from "../api";
import { Prose } from "../components/Prose";
import { Icon } from "../icons";
import { Link } from "../router";
import { useMe } from "../session";
import { BackLink } from "./Course";
import { StartBlockCard } from "./Start";
import type { CourseSummary } from "../types";
import { ErrorBox, Skeleton, SkeletonCards, useTitle } from "../ui";

/**
 * 知识块：一个方向的路线图（格式见 shared/blocks.ts）。
 * 上面是 Obsidian 式的网状图谱（分组、课程、概念，先修关系画成箭头），点一个节点在旁边看详情；
 * 下面是大纲（宽屏横向展开，手机上竖着）。/blocks 是全站大图：所有知识块画在一起，同一门课合并成一个点。
 * 进度来自 /api/courses（游客没有进度）。
 */

export const BLOCKS_INDEX = "/data/blocks/index.json";

function hoursText(periods: number): string {
  return periods ? `约 ${periodsToHours(periods)} 小时` : "";
}

/** 每门课的完成度：学完 = 1，在学按条目进度，没选 = 0 */
function useCourseProgress(): { progress: CourseProgress } {
  const { data } = useApi<CourseSummary[]>("/api/courses");
  return useMemo(() => {
    const map = data ? new Map(data.map((c) => [c.slug, c])) : null;
    const progress: CourseProgress = (slug) => {
      const c = map?.get(slug);
      if (!c?.enrollment) return 0;
      if (c.enrollment.status === "done") return 1;
      if (c.enrollment.status === "dropped") return 0;
      return c.progress.items > 0 ? c.progress.ratio : 0;
    };
    return { progress };
  }, [data]);
}

/** 课程页、首页上的知识块卡片 */
export function BlockCards({ limit }: { limit?: number }) {
  const { data, error, reload } = useApi<BlockSummary[]>(BLOCKS_INDEX);
  const { progress } = useCourseProgress();
  if (error && !data) return <ErrorBox error={error} onRetry={reload} />;
  if (!data) return <SkeletonCards n={4} h={120} />;
  return (
    <div className="stack" style={{ gap: 12 }}>
      <Link to="/blocks" className="small" style={{ alignSelf: "flex-start" }}>
        查看全站知识图谱：所有知识块画在一张图里
      </Link>
    <div className="grid-cards block-cards">
      <StartBlockCard />
      {data.slice(0, limit).map((b) => {
        const started = b.courses.some((s) => progress(s) > 0);
        return (
          <Link key={b.slug} to={`/blocks/${b.slug}`} className="card course-card block-card">
            <span className="course-code">
              <span className="ellipsis">{b.audience}</span>
              {started && <span className="tag tag-accent">在学</span>}
            </span>
            <span className="course-title">{b.title}</span>
            <p className="small sub pretty clamp-2">{b.summary}</p>
            <span className="course-foot small sub">
              <span className="num">{b.courses.length} 门课</span>
              {b.periods > 0 && <span className="num">{hoursText(b.periods)}起</span>}
            </span>
          </Link>
        );
      })}
    </div>
    </div>
  );
}

export function BlockPage({ slug }: { slug: string }) {
  const { data: block, error, reload } = useApi<Block>(`/data/blocks/${slug}.json`);
  const { data: all } = useApi<BlockSummary[]>(BLOCKS_INDEX);
  const { progress } = useCourseProgress();
  const { me } = useMe();
  useTitle(block?.title ?? "知识块");

  if (error && !block) return <div className="page">{error.status === 404 ? <ErrorBox error={new Error("没有这个知识块")} /> : <ErrorBox error={error} onRetry={reload} />}</div>;
  if (!block)
    return (
      <div className="page">
        <Skeleton h={40} w="40%" />
        <Skeleton h={320} />
      </div>
    );

  const total = blockPeriods(block);
  const ratio = blockRatio(block, progress);
  const next = nextCourse(block, progress);
  const signedIn = !!me.role;
  const graph = blockGraph(block);
  const nextBlocks = (block.next ?? []).map((s) => all?.find((b) => b.slug === s)).filter((b): b is BlockSummary => !!b);

  return (
    <div className="page block-page">
      <header className="page-head block-head">
        <BackLink />
        <div className="stack" style={{ gap: 6 }}>
          <h1 className="h1">{block.title}</h1>
          <p className="sub pretty">{block.summary}</p>
          <div className="row wrap small sub" style={{ gap: "4px 16px" }}>
            {block.audience && <span>适合：{block.audience}</span>}
            {total > 0 && <span className="num">必学部分{hoursText(total)}起</span>}
          </div>
        </div>
      </header>

      {signedIn && ratio > 0 && (
        <div className="stack" style={{ gap: 6 }}>
          <span className="small sub num">完成 {Math.round(ratio * 100)}%</span>
          <span className="bar">
            <i style={{ width: `${ratio * 100}%` }} />
          </span>
        </div>
      )}

      {next?.course && (
        <Link to={`/courses/${next.course}`} className="card block-next">
          <span className="small sub">{ratio > 0 ? "接下来" : "从这里开始"}</span>
          <span className="block-next-title">{next.courseTitle ?? next.course}</span>
          {next.note && <span className="small sub">{next.note}</span>}
          <Icon name="arrowRight" size={18} />
        </Link>
      )}

      {block.intro && <Prose source={block.intro} />}

      <GraphSection graph={graph} progress={progress} title="知识图谱" />

      <section className="section" aria-label="大纲">
        <h2 className="h2">大纲</h2>
        <div className="mindmap" role="tree" aria-label={block.title}>
          <div className="mm-root">
            <span className="mm-root-title">{block.title.replace(/知识块$/, "")}</span>
          </div>
          <ul className="mm-children" role="group">
            {block.nodes.map((n, i) => (
              <MapNode key={i} n={n} progress={progress} />
            ))}
          </ul>
        </div>
      </section>

      {nextBlocks.length > 0 && (
        <section className="section" aria-labelledby="next-h">
          <h2 id="next-h" className="h2">
            学完以后
          </h2>
          <div className="row wrap" style={{ gap: 8 }}>
            {nextBlocks.map((b) => (
              <Link key={b.slug} to={`/blocks/${b.slug}`} className="chip">
                {b.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MapNode({ n, progress }: { n: BlockNode; progress: CourseProgress }) {
  const kind = kindOf(n);
  const r = nodeRatio(n, progress);
  const done = r !== null && r >= 1;
  const cls = `mm-node mm-${kind}${n.optional ? " is-optional" : ""}${done ? " is-done" : r ? " is-started" : ""}`;

  if (kind === "link" && n.link) {
    const external = /^https?:/.test(n.link.url);
    return (
      <li className="mm-item" role="treeitem" aria-selected={false}>
        <a className={cls} href={n.link.url} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
          <span className="mm-title">{n.link.label}</span>
          <Icon name="external" size={14} />
        </a>
      </li>
    );
  }

  if (kind === "course") {
    return (
      <li className="mm-item" role="treeitem" aria-selected={false}>
        <Link to={`/courses/${n.course}`} className={cls}>
          <span className="mm-title">{n.courseTitle ?? n.course}</span>
          {n.note && <span className="mm-note">{n.note}</span>}
          {n.itemTitles && (
            <span className="mm-note">
              重点：{n.itemTitles.slice(0, 3).join("、")}
              {n.itemTitles.length > 3 ? ` 等 ${n.itemTitles.length} 项` : ""}
            </span>
          )}
          <span className="mm-meta small sub">
            {done ? <span className="tag tag-ok">学完</span> : r ? <span className="tag tag-accent">在学 {Math.round(r * 100)}%</span> : null}
            {n.optional && <span className="tag">选学</span>}
            {n.periods ? <span className="num">{hoursText(n.periods)}</span> : null}
          </span>
        </Link>
      </li>
    );
  }

  if (kind === "concept") {
    return (
      <li className="mm-item" role="treeitem" aria-selected={false}>
        <div className={cls}>
          <span className="mm-title">{n.title}</span>
          {n.note && <span className="mm-note">{n.note}</span>}
          <span className="mm-meta small sub">
            <span className="tag">概念</span>
            {n.optional && <span className="tag">选学</span>}
          </span>
        </div>
      </li>
    );
  }

  const kids = n.children ?? [];
  return (
    <li className="mm-item" role="treeitem" aria-selected={false} aria-expanded>
      <div className={cls}>
        <span className="mm-title">{n.title}</span>
        {n.note && <span className="mm-note">{n.note}</span>}
        <span className="mm-meta small sub">
          {n.pick && <span className="tag tag-accent">{kids.length} 选 {n.pick}</span>}
          {n.optional && <span className="tag">选学</span>}
          {done && <span className="tag tag-ok">完成</span>}
        </span>
      </div>
      <ul className="mm-children" role="group">
        {kids.map((c, i) => (
          <MapNode key={i} n={c} progress={progress} />
        ))}
      </ul>
    </li>
  );
}

// ---------------------------------------------------------------- 图谱

const KIND_LABEL: Record<GraphNode["kind"], string> = { block: "知识块", group: "分组", course: "课程", concept: "概念", link: "站外资源" };

function ratioFor(n: GraphNode, progress: CourseProgress): number | null {
  if (n.kind === "block" || !n.node) return null;
  return nodeRatio(n.node, progress);
}

function GraphSection({ graph, progress, title }: { graph: Graph; progress: CourseProgress; title: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [layout, setLayout] = useState<Layout>("network");
  const node = graph.nodes.find((n) => n.id === selected) ?? null;
  return (
    <section className="section kg-section" aria-label={title}>
      <div className="row wrap" style={{ gap: 8, justifyContent: "space-between" }}>
        <h2 className="h2">{title}</h2>
        <div className="row" style={{ gap: 4 }} role="group" aria-label="布局">
          <button type="button" className={`btn btn-sm${layout === "network" ? " btn-primary" : ""}`} onClick={() => setLayout("network")} aria-pressed={layout === "network"}>
            网络
          </button>
          <button type="button" className={`btn btn-sm${layout === "tree" ? " btn-primary" : ""}`} onClick={() => setLayout("tree")} aria-pressed={layout === "tree"}>
            层次
          </button>
        </div>
      </div>
      <p className="small sub">拖动空白处平移，滚轮或双指缩放，点一个节点查看详情。虚线箭头表示先修：箭头指向的内容要在箭头起点之后学。</p>
      <div className="kg-wrap">
        <KnowledgeGraph graph={graph} ratioOf={(n) => ratioFor(n, progress)} selected={selected} onSelect={setSelected} layout={layout} />
        <aside className="kg-detail card" aria-live="polite">
          {node ? <NodeDetail graph={graph} node={node} progress={progress} onSelect={setSelected} /> : <Legend />}
        </aside>
      </div>
    </section>
  );
}

function Legend() {
  return (
    <div className="stack small" style={{ gap: 8 }}>
      <strong>图例</strong>
      <span className="row" style={{ gap: 8 }}><i className="kg-swatch kg-swatch-block" />知识块</span>
      <span className="row" style={{ gap: 8 }}><i className="kg-swatch kg-swatch-group" />分组（阶段）</span>
      <span className="row" style={{ gap: 8 }}><i className="kg-swatch kg-swatch-course" />课程（学完变成实心强调色）</span>
      <span className="row" style={{ gap: 8 }}><i className="kg-swatch kg-swatch-concept" />概念：这个方向要研究明白什么</span>
      <span className="row" style={{ gap: 8 }}><i className="kg-swatch kg-swatch-link" />站外资源</span>
      <span className="sub">点一个节点，这里显示它的说明、出处和先修关系。</span>
    </div>
  );
}

function NodeDetail({ graph, node, progress, onSelect }: { graph: Graph; node: GraphNode; progress: CourseProgress; onSelect: (id: string) => void }) {
  const n = node.node;
  const r = ratioFor(node, progress);
  const { before, after } = preOf(graph, node.id);
  const parent = graph.nodes.find((m) => m.id === node.parent);
  return (
    <div className="stack" style={{ gap: 10 }}>
      <span className="small sub">
        {KIND_LABEL[node.kind]}
        {node.optional ? " · 选学" : ""}
        {parent && parent.kind !== "block" ? ` · 属于「${parent.label}」` : ""}
      </span>
      <strong className="kg-detail-title">{node.label}</strong>
      {node.kind === "block" && (
        <Link to={`/blocks/${node.block}`} className="btn btn-sm" style={{ alignSelf: "flex-start" }}>
          打开这个知识块
        </Link>
      )}
      {n?.note && <p className="small">{n.note}</p>}
      {n?.body && <Prose source={n.body} className="prose prose-sm" />}
      {n?.course && (
        <div className="stack small" style={{ gap: 6 }}>
          {r !== null && <span className="num">{r >= 1 ? "已学完" : r > 0 ? `在学，完成 ${Math.round(r * 100)}%` : "还没开始"}</span>}
          {n.periods ? <span className="sub num">{hoursText(n.periods)}</span> : null}
          {n.itemTitles && <span className="sub">重点：{n.itemTitles.join("、")}</span>}
          <Link to={`/courses/${n.course}`} className="btn btn-sm btn-primary" style={{ alignSelf: "flex-start" }}>
            打开课程
          </Link>
        </div>
      )}
      {n?.link && (
        <a className="btn btn-sm" href={n.link.url} target={/^https?:/.test(n.link.url) ? "_blank" : undefined} rel="noreferrer" style={{ alignSelf: "flex-start" }}>
          打开{n.link.label}
        </a>
      )}
      {n?.children && n.pick && <span className="small sub">{n.children.length} 个里选 {n.pick} 个</span>}
      {before.length > 0 && (
        <div className="stack small" style={{ gap: 4 }}>
          <span className="sub">先学</span>
          {before.map((b) => (
            <button key={b.id} type="button" className="kg-jump" onClick={() => onSelect(b.id)}>
              {b.label}
            </button>
          ))}
        </div>
      )}
      {after.length > 0 && (
        <div className="stack small" style={{ gap: 4 }}>
          <span className="sub">学完可以接着学</span>
          {after.map((b) => (
            <button key={b.id} type="button" className="kg-jump" onClick={() => onSelect(b.id)}>
              {b.label}
            </button>
          ))}
        </div>
      )}
      {n?.sources && n.sources.length > 0 && (
        <div className="stack small" style={{ gap: 4 }}>
          <span className="sub">出处</span>
          <ul className="kg-sources">
            {n.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** /blocks：全站知识图谱 */
export function SiteGraphPage() {
  const { data: index, error, reload } = useApi<BlockSummary[]>(BLOCKS_INDEX);
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  const { progress } = useCourseProgress();
  useTitle("全站知识图谱");
  const slugs = index?.map((b) => b.slug).join(",");
  // biome-ignore lint/correctness/useExhaustiveDependencies: slugs 代表 index
  useEffect(() => {
    if (!index) return;
    let live = true;
    Promise.all(
      index.map((b) =>
        fetch(`/data/blocks/${b.slug}.json`).then((r) => {
          if (!r.ok) throw new Error(`读取知识块 ${b.slug} 失败`);
          return r.json() as Promise<Block>;
        }),
      ),
    ).then(
      (bs) => live && setBlocks(bs),
      () => live && setBlocks([]),
    );
    return () => {
      live = false;
    };
  }, [slugs]);
  const graph = useMemo(() => (blocks ? siteGraph(blocks) : null), [blocks]);
  if (error && !index) return <div className="page"><ErrorBox error={error} onRetry={reload} /></div>;
  return (
    <div className="page block-page">
      <header className="page-head block-head">
        <BackLink />
        <div className="stack" style={{ gap: 6 }}>
          <h1 className="h1">全站知识图谱</h1>
          <p className="sub pretty">所有知识块画在一张图里。同一门课只画一次，所以几个方向共用的基础课会连着好几个知识块；知识块之间的箭头指向「学完以后可以去」的方向。</p>
        </div>
      </header>
      {graph ? <GraphSection graph={graph} progress={progress} title="图谱" /> : <Skeleton h={560} />}
    </div>
  );
}
