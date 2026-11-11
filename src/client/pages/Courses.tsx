import { useEffect, useMemo, useState } from "react";
import { categoriesOf } from "../../shared/courses";
import type { CoursePackage } from "../../shared/package";
import { useApi } from "../api";
import { ImportCourse } from "../components/ImportCourse";
import { LearnTabs, type LearnTab } from "../components/LearnTabs";
import { PinGuideButton } from "../components/PinGuide";
import { PinRows, type TitledPin } from "../components/PinRows";
import { BlockCards } from "./Blocks";
import { Icon } from "../icons";
import { localMeta, localPackages, onLocalChange } from "../library";
import { Link, navigate, useQuery } from "../router";
import type { CourseSummary } from "../types";
import { Empty, ErrorBox, SkeletonCards, useTitle } from "../ui";

/** 难度：csdiy 的星数，0 表示不适用（工具、路线图） */
export function Stars({ n: raw }: { n: number }) {
  const n = Math.max(0, Math.min(5, Math.round(raw)));
  if (!n) return null;
  return (
    <span className="stars" aria-label={`难度 ${n} / 5`}>
      {"★".repeat(n)}
      <i>{"★".repeat(5 - n)}</i>
    </span>
  );
}

function matches(c: CourseSummary, q: string): boolean {
  if (!q) return true;
  const hay = `${c.title} ${c.titleEn ?? ""} ${c.provider} ${c.language} ${c.category} ${c.summary}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((w) => hay.includes(w));
}

function useLocalCourses(): CourseSummary[] {
  const [list, setList] = useState<CoursePackage[]>([]);
  useEffect(() => {
    const load = () => void localPackages().then(setList);
    load();
    return onLocalChange(load);
  }, []);
  return list.map((p) => {
    const m = localMeta(p);
    const items = m.modules.flatMap((x) => x.items);
    const { modules, links, ...rest } = m;
    return { ...rest, itemCount: items.length, learners: 0, enrollment: null, progress: { doneItems: 0, items: items.length, donePeriods: 0, totalPeriods: 0, ratio: 0 } };
  });
}

export function CoursesPage() {
  useTitle("学习");
  const { data, error, reload } = useApi<CourseSummary[]>("/api/courses");
  const local = useLocalCourses();
  const [q, setQ] = useState("");
  const [importing, setImporting] = useState(false);
  const cat = useQuery("c");
  const asked = useQuery("tab");
  const all = useMemo(() => [...(data ?? []), ...local], [data, local]);
  const cats = useMemo(() => categoriesOf(all.filter((c) => !c.slug.startsWith("local-"))), [all]);
  const query = q.trim();
  const list = all.filter((c) => matches(c, query) && (!cat || c.category === cat));
  const browsing = !query && !cat;
  const mine = all.filter((c) => c.enrollment && c.enrollment.status !== "dropped");
  const hosted = all.filter((c) => c.itemCount > 0 && !c.slug.startsWith("local-") && !mine.includes(c));
  const rest = list.filter((c) => c.itemCount === 0 && !mine.includes(c));
  // 没指定标签时：选过课（或导入过课程包）的人看「我的学习」，其他人看「课程目录」
  const tab: LearnTab = cat ? "all" : asked === "mine" || asked === "all" || asked === "blocks" || asked === "questions" ? asked : mine.length || local.length ? "mine" : "all";
  const setCat = (c: string | null) => navigate(c ? `/courses?tab=all&c=${encodeURIComponent(c)}` : "/courses?tab=all", { replace: true });

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="h1">学习</h1>
        <div className="row" style={{ gap: 8 }}>
          <label className="search-box grow">
            <Icon name="search" size={18} />
            <input type="search" className="input" placeholder="搜索课程、学校、语言" value={q} onChange={(e) => setQ(e.target.value)} aria-label="搜索课程" />
          </label>
          <button type="button" className="btn btn-ghost" onClick={() => setImporting(true)}>
            <Icon name="plus" size={16} />
            <span className="hide-sm">导入课程包</span>
          </button>
        </div>
      </header>

      <LearnTabs current={query ? "all" : tab} />

      {tab === "all" && data && (
        <div className="chips-scroll" role="group" aria-label="分类">
          <button type="button" className="chip" aria-pressed={!cat} onClick={() => setCat(null)}>
            全部 <span className="num chip-count">{all.length}</span>
          </button>
          {cats.map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(cat === c ? null : c)}>
              {c}
            </button>
          ))}
        </div>
      )}

      {error && !data ? (
        <ErrorBox error={error} onRetry={reload} />
      ) : !data ? (
        <SkeletonCards n={6} h={120} />
      ) : !browsing ? (
        list.length > 0 ? (
          <section className="section" aria-label="结果">
            <span className="small sub num">{list.length} 门</span>
            <ol className="catalog card card-flush">
              {list.map((c) => (
                <CatalogRow key={c.slug} c={c} />
              ))}
            </ol>
          </section>
        ) : (
          <p className="sub">没有找到{query ? `“${query}”` : "课程"}</p>
        )
      ) : tab === "questions" ? (
        <RecentPins />
      ) : tab === "blocks" ? (
        <section className="section" aria-label="知识块">
          <span className="small sub">每个知识块是一个方向的学习路线：该学哪些课程、按什么顺序学。</span>
          <BlockCards />
        </section>
      ) : tab === "mine" ? (
        <>
          {mine.length > 0 && (
            <section className="section" aria-labelledby="mine-h">
              <h2 id="mine-h" className="h2">
                我的课程
              </h2>
              <div className="grid-cards">
                {mine.map((c) => (
                  <CourseCard key={c.slug} c={c} />
                ))}
              </div>
            </section>
          )}
          {local.length > 0 && (
            <section className="section" aria-labelledby="local-h">
              <div className="section-head">
                <h2 id="local-h" className="h2">
                  导入到本机的
                </h2>
              </div>
              <div className="grid-cards">
                {local.map((c) => (
                  <CourseCard key={c.slug} c={c} />
                ))}
              </div>
            </section>
          )}
          {!mine.length && !local.length && (
            <Empty
              title="还没有选课"
              action={
                <Link to="/courses?tab=all" className="btn btn-primary">
                  浏览课程目录
                </Link>
              }
            >
              在课程目录里打开一门课程，点击「加入我的课程」后，它就会出现在这里。
            </Empty>
          )}
        </>
      ) : (
        <>
          {hosted.length > 0 && (
            <section className="section" aria-labelledby="hosted-h">
              <div className="section-head">
                <h2 id="hosted-h" className="h2">
                  站内学习
                </h2>
                <span className="small sub">讲义、练手题都在站内</span>
              </div>
              <div className="grid-cards">
                {hosted.map((c) => (
                  <CourseCard key={c.slug} c={c} />
                ))}
              </div>
            </section>
          )}
          {cats
            .map((k) => ({ k, items: rest.filter((c) => c.category === k) }))
            .filter((g) => g.items.length)
            .map((g) => (
              <section key={g.k} className="section" aria-label={g.k}>
                <div className="section-head">
                  <h2 className="h2">{g.k}</h2>
                  <span className="small sub num">{g.items.length} 门</span>
                </div>
                <ol className="catalog card card-flush">
                  {g.items.map((c) => (
                    <CatalogRow key={c.slug} c={c} />
                  ))}
                </ol>
              </section>
            ))}
        </>
      )}
      {importing && <ImportCourse onClose={() => setImporting(false)} />}
    </div>
  );
}

/** 「问题」标签：最近钉在讲义上的问题，还没人回答的在前 */
function RecentPins() {
  const { data, error, reload } = useApi<TitledPin[]>("/api/pins/recent");
  if (error && !data) return <ErrorBox error={error} onRetry={reload} />;
  if (!data) return <SkeletonCards n={3} h={90} />;
  return (
    <section className="section" aria-label="最近的问题">
      <div className="row wrap" style={{ gap: 8, justifyContent: "space-between", alignItems: "center" }}>
        <span className="small sub">同学们钉在讲义上的问题。还没有人回答的排在前面，点击一条可以跳到讲义的原处回答或继续讨论。</span>
        <PinGuideButton />
      </div>
      {data.length ? (
        <PinRows pins={data} />
      ) : (
        <div className="card">
          <Empty title="还没有人提问">读讲义时遇到不懂的地方，点击讲义上方的「提问或标记」，问题会出现在这里。</Empty>
        </div>
      )}
    </section>
  );
}

function Status({ c }: { c: CourseSummary }) {
  const st = c.enrollment?.status;
  if (st === "done") return <span className="tag tag-ok">学完</span>;
  if (st === "active") return <span className="tag tag-accent">在学</span>;
  if (st === "paused") return <span className="tag tag-muted">暂停</span>;
  return null;
}

function CourseCard({ c }: { c: CourseSummary }) {
  const st = c.enrollment?.status;
  return (
    <Link to={`/courses/${c.slug}`} className="card course-card" vt="course-title">
      <span className="course-code">
        <span className="ellipsis">{c.provider || c.category}</span>
        <Status c={c} />
      </span>
      <span className="course-title">
        <span data-vt>{c.title}</span>
      </span>
      <p className="small sub pretty clamp-2">{c.summary}</p>
      <span className="course-foot small sub">
        {c.itemCount > 0 && <span className="num">{c.itemCount} 项</span>}
        {c.hours && <span>{c.hours}</span>}
        <Stars n={c.difficulty} />
      </span>
      {(st === "active" || st === "done" || st === "paused") && c.progress.items > 0 && (
        <span className="bar" aria-label={`进度 ${Math.round(c.progress.ratio * 100)}%`}>
          <i style={{ width: `${c.progress.ratio * 100}%` }} />
        </span>
      )}
    </Link>
  );
}

function CatalogRow({ c }: { c: CourseSummary }) {
  return (
    <li>
      <Link to={`/courses/${c.slug}`} className="catalog-row">
        <span className="catalog-main">
          <span className="catalog-title">{c.title}</span>
          <span className="small sub pretty clamp-2">{c.summary}</span>
        </span>
        <span className="catalog-meta small sub">
          <Status c={c} />
          {c.provider && <span>{c.provider}</span>}
          <Stars n={c.difficulty} />
        </span>
      </Link>
    </li>
  );
}
