import { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "../router";
import { type OjAssignmentBrief, useAssignments, versionLabel } from "../ojIndex";
import { useMe } from "../session";

/**
 * 课程条目页上的「作业台」入口（故事 3.1）：这个条目有对应的 OJ 作业时，显示题数、通过数和进入按钮。
 * 同一个条目可以有几个版本（例如 2020 秋季中文版、2026 春季英文原版），像视频换源一样选一个做。
 */
export function AssignmentEntry({ course, item }: { course: string; item: string }) {
  const list = useAssignments(course, item);
  if (!list?.length) return null;
  return (
    <section className="card assignment-entry" aria-label="作业台">
      <div className="stack" style={{ gap: 4 }}>
        <strong>这份作业在作业台完成</strong>
        <span className="small sub">左边看题目，右边写代码，提交后由判题服务用官方测试判对错，结果和力扣一样逐个用例显示。{list.length > 1 && "有几个版本，题目不完全一样，任选一个做即可。"}</span>
      </div>
      <div className="assignment-versions">
        {list.map((a, i) => (
          <Version key={a.id} a={a} course={course} primary={i === 0} many={list.length > 1} />
        ))}
      </div>
    </section>
  );
}

function Version({ a, course, primary, many }: { a: OjAssignmentBrief; course: string; primary: boolean; many: boolean }) {
  const { me } = useMe();
  const [solved, setSolved] = useState<number | null>(null);
  useEffect(() => {
    if (!me.role) return;
    api<{ solved: unknown[] }>(`/api/oj/solved?prefix=${encodeURIComponent(`${course}/${a.id}/`)}`).then((r) => setSolved(r.solved.length), () => undefined);
  }, [a.id, me.role, course]);
  return (
    <div className="assignment-version">
      <span className="small sub">
        {many && <strong>{versionLabel(a)}</strong>}
        {many && "：" }共 {a.problems.length} 道题{solved !== null && `，已通过 ${solved} 道`}
      </span>
      <Link to={`/courses/${course}/hw/${a.id}`} className={`btn ${primary ? "btn-primary" : "btn-quiet"}`}>
        {many ? (primary ? "打开作业台" : "做这个版本") : "打开作业台"}
      </Link>
    </div>
  );
}

/** 这个课程条目有没有 OJ 作业（任何版本）：undefined 表示还在读 */
export function useHasAssignment(course: string, item: string): boolean | undefined {
  const list = useAssignments(course, item);
  return list === undefined ? undefined : list.length > 0;
}
