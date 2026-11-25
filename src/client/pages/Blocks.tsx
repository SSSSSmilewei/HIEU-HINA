import { useMemo } from "react";
import type { BlockSummary, CourseProgress } from "../../shared/blocks";
import { periodsToHours } from "../../shared/courses";
import { useApi } from "../api";
import { Link } from "../router";
import { StartBlockCard } from "./Start";
import type { CourseSummary } from "../types";
import { ErrorBox, SkeletonCards } from "../ui";

/**
 * 知识块：一个方向的路线图（格式见 shared/blocks.ts）。这里是首页和学习页上的卡片（首屏要用）；
 * 详情页和全站知识图谱在 BlockDetail.tsx，按需加载。进度来自 /api/courses（游客没有进度）。
 */

export const BLOCKS_INDEX = "/data/blocks/index.json";

export function hoursText(periods: number): string {
  return periods ? `约 ${periodsToHours(periods)} 小时` : "";
}

/** 每门课的完成度：学完 = 1，在学按条目进度，没选 = 0 */
export function useCourseProgress(): { progress: CourseProgress } {
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
