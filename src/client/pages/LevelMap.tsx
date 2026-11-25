import { useEffect, useState } from "react";
import { type Chapter, type LevelIndex, nextLevel } from "../../shared/levels";
import { useApi } from "../api";
import { Prose } from "../components/Prose";
import { loadIndex, localPassed } from "../levels/data";
import { Link } from "../router";
import { useMe } from "../session";
import { Empty, ErrorBox, Skeleton, useTitle } from "../ui";

/**
 * 闯关地图：一门课一张，一章（一个官方项目）一条路线，一关一个节点。
 * 过了的关点亮，推荐的下一关高亮；可以跳关，不强制顺序。
 */

export function useLevelIndex(slug: string) {
  const [index, setIndex] = useState<LevelIndex | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let live = true;
    setError(null);
    loadIndex(slug).then(
      (i) => live && setIndex(i),
      (e) => live && setError(e as Error),
    );
    return () => {
      live = false;
    };
  }, [slug, tick]);
  return { index, error, retry: () => setTick((t) => t + 1) };
}

/** 我通过了哪些关：登录后从服务器取，游客看本机记录 */
export function usePassed(slug: string): { passed: Record<string, number>; reload: () => void } {
  const { me } = useMe();
  const remote = useApi<{ passed: Record<string, number> }>(me.role ? `/api/levels/${slug}` : null);
  const [local, setLocal] = useState(() => localPassed(slug));
  if (me.role) return { passed: remote.data?.passed ?? {}, reload: () => remote.reload() };
  return { passed: local, reload: () => setLocal(localPassed(slug)) };
}

export function LevelMapPage({ slug }: { slug: string }) {
  const { index, error, retry } = useLevelIndex(slug);
  const { passed } = usePassed(slug);
  const { me } = useMe();
  useTitle(index?.title ?? "闯关");

  if (error) return <div className="page"><ErrorBox error={error} onRetry={retry} /></div>;
  if (!index)
    return (
      <div className="page" aria-busy="true">
        <Skeleton h={36} w="50%" />
        <Skeleton h={240} />
      </div>
    );

  const playable = index.chapters.filter((c) => !c.soon);
  const total = playable.reduce((n, c) => n + c.levels.filter((l) => !l.optional).length, 0);
  const done = playable.reduce((n, c) => n + c.levels.filter((l) => !l.optional && passed[`${c.id}/${l.id}`]).length, 0);

  return (
    <div className="page level-map">
      <Link to={`/courses/${slug}`} className="back-link">
        返回课程
      </Link>
      <header className="stack" style={{ gap: 8 }}>
        <h1 className="h1">{index.title}</h1>
        <p className="lead">
          每一关是官方项目里的一个问题，代码写在你自己的仓库里，用官方测试判对错。全部通过以后，仓库里就是完整的项目。
        </p>
        <p className="small sub num">
          必做 {done} / {total} 关 · 代码保存在{me.role ? "你的账号" : "这台浏览器（登录后保存到你的账号）"}
        </p>
      </header>
      {index.chapters.map((ch) => (
        <ChapterPath key={ch.id} slug={slug} ch={ch} passed={passed} />
      ))}
      <p className="small sub">{index.license}</p>
    </div>
  );
}

function ChapterPath({ slug, ch, passed }: { slug: string; ch: Chapter; passed: Record<string, number> }) {
  if (ch.soon)
    return (
      <section className="card level-chapter level-chapter-soon" aria-label={ch.title}>
        <h2 className="h3">{ch.title}</h2>
        <p className="small sub">筹备中</p>
      </section>
    );
  const next = nextLevel(ch, passed);
  const doneCount = ch.levels.filter((l) => passed[`${ch.id}/${l.id}`]).length;
  return (
    <section className="card level-chapter stack" aria-label={ch.title} style={{ gap: 16 }}>
      <div className="row wrap" style={{ justifyContent: "space-between", gap: 8 }}>
        <h2 className="h3">{ch.title}</h2>
        <span className="small sub num">
          {doneCount} / {ch.levels.length}
        </span>
      </div>
      {ch.intro && <Prose source={ch.intro} />}
      {ch.levels.length === 0 ? (
        <Empty title="这一章还没有关卡" />
      ) : (
        <ol className="level-path">
          {ch.levels.map((l, i) => {
            const ok = !!passed[`${ch.id}/${l.id}`];
            const isNext = next?.id === l.id;
            return (
              <li key={l.id} className={`level-node${ok ? " is-done" : ""}${isNext ? " is-next" : ""}`}>
                <Link to={`/courses/${slug}/levels/${ch.id}/${l.id}`} className="level-node-link">
                  <span className="level-dot num" aria-hidden="true">
                    {ok ? "✓" : i}
                  </span>
                  <span className="stack" style={{ gap: 2 }}>
                    <span className="level-title">
                      第 {i} 关：{l.title}
                    </span>
                    <span className="small sub">
                      {ok ? "已通过" : isNext ? "推荐下一关" : "未通过"}
                      {l.optional ? " · 选做" : ""}
                      {l.points ? ` · ${l.points} 分` : ""}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
