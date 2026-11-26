import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { useCourse } from "../courseData";
import { loadOjIndex, type OjAssignmentBrief } from "../ojIndex";
import { Link } from "../router";
import { buildSeaMap, type NodeStatus, type SeaExam } from "../seaMap";
import { useMe } from "../session";
import { ITEM_KIND_LABEL } from "../../shared/light";
import { ErrorBox, Skeleton, useTitle } from "../ui";
import "../styles/sea.css";

/**
 * 深海地图（故事 3.7）：/courses/:slug/sea。一周一段深度，一个条目一个点，完成的点亮起来。
 * 地图只是入口：点进去是讲义、作业台或测验。所有点都能进，前面一周不到一半时后面的点暗一些，只是建议。
 */

const STATUS_LABEL: Record<NodeStatus, string> = { done: "已完成", doing: "进行中", open: "可以做", ahead: "建议先完成前面的" };
const KIND_SHORT: Record<string, string> = { lecture: "讲", section: "讨", reading: "读", video: "视", assignment: "作", lab: "实", project: "项", quiz: "测", exam: "考" };

export function SeaMapPage({ slug }: { slug: string }) {
  const { me } = useMe();
  const { pkg, pkgError, state, reload } = useCourse(slug);
  useTitle(pkg ? `${pkg.title} · 深海地图` : "深海地图");
  const [assignments, setAssignments] = useState<OjAssignmentBrief[]>([]);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [exams, setExams] = useState<SeaExam[]>([]);

  useEffect(() => {
    let alive = true;
    void loadOjIndex().then((ix) => alive && setAssignments(ix.assignments.filter((a) => a.course === slug)));
    void api<{ exams: { id: string; item?: string; mine: { passed: boolean } | null }[] }>(`/api/exams?course=${encodeURIComponent(slug)}`).then(
      (r) => alive && setExams(r.exams.map((e) => ({ id: e.id, item: e.item, passed: !!e.mine?.passed }))),
      () => undefined,
    );
    if (me.role)
      void api<{ solved: { problem: string }[] }>(`/api/oj/solved?prefix=${encodeURIComponent(`${slug}/`)}`).then(
        (r) => alive && setSolved(new Set(r.solved.map((s) => s.problem))),
        () => undefined,
      );
    return () => {
      alive = false;
    };
  }, [slug, me.role]);

  const map = useMemo(
    () => (pkg ? buildSeaMap({ course: slug, modules: pkg.modules, done: state?.done ?? {}, solved, assignments, exams }) : null),
    [pkg, slug, state, solved, assignments, exams],
  );

  if (pkgError)
    return (
      <div className="page">
        <ErrorBox error={pkgError} onRetry={reload} />
      </div>
    );
  if (!pkg || !map)
    return (
      <div className="page">
        <Skeleton h={400} />
      </div>
    );

  const total = map.weeks.reduce((n, w) => n + w.total, 0);
  const doneAll = map.weeks.reduce((n, w) => n + w.done, 0);
  return (
    <div className="sea">
      <header className="sea-head">
        <div>
          <Link to={`/courses/${slug}`} className="sea-back">
            ← {pkg.title}
          </Link>
          <h1 className="sea-title">深海地图</h1>
          <p className="sea-sub">
            一周是一段深度，一个点是一份讲义、作业或测验。完成 {doneAll} / {total} 个必做点
            {!me.role && "（登录后记录进度）"}。
          </p>
        </div>
        <div className="sea-stats">
          <div className="sea-xp">
            <strong>{map.xp}</strong>
            <span>经验值</span>
          </div>
          {map.next && (
            <Link to={map.next.href} className="sea-next">
              下一站：{map.next.title}
            </Link>
          )}
        </div>
      </header>

      <ul className="sea-badges" aria-label="徽章">
        {map.badges.map((b) => (
          <li key={b.id} className={b.earned ? "is-on" : ""} title={b.detail}>
            <span className="sea-badge-icon" aria-hidden="true">
              {b.earned ? "◆" : "◇"}
            </span>
            {b.title}
          </li>
        ))}
      </ul>

      <ol className="sea-dive">
        {map.weeks.map((w) => (
          <li key={w.id} className="sea-week">
            <div className="sea-depth">
              <span>{w.depth} 米</span>
              <small>
                {w.done}/{w.total}
              </small>
            </div>
            <div className="sea-leg">
              <h2>{w.title}</h2>
              <div className="sea-nodes">
                {w.nodes.map((n) => (
                  <Link key={n.id} to={n.href} className={`sea-node is-${n.status}${n.optional ? " is-optional" : ""}`} title={`${n.title} · ${STATUS_LABEL[n.status]}${n.optional ? " · 选学" : ""}`}>
                    <span className="sea-dot" aria-hidden="true">
                      {KIND_SHORT[n.kind] ?? "·"}
                    </span>
                    <span className="sea-name">
                      {n.title}
                      <small>
                        {ITEM_KIND_LABEL[n.kind as keyof typeof ITEM_KIND_LABEL] ?? n.kind}
                        {n.progress && ` · ${n.progress.solved}/${n.progress.total} 题`}
                        {n.status === "done" && n.xp > 0 && ` · +${n.xp}`}
                      </small>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
      <p className="sea-foot">海底到了。完成结课测验，就能浮出水面。</p>
    </div>
  );
}
