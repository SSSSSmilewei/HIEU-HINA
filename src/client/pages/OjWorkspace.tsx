import { useEffect, useState } from "react";
import { Workspace } from "../ide/Workspace";
import type { PublicAssignment, PublicStandalone, WorkspaceSource } from "../ide/types";

/**
 * 做题界面的两个入口（故事 1.4）：
 *   /oj/p/:id                              刷题区的一道题
 *   /courses/:slug/hw/:assignment[/:problem] 课程作业
 * 题目是构建时生成的静态文件（scripts/oj.mjs），不经过 Worker。
 */
export function OjWorkspacePage(props: { problem: string } | { course: string; assignment: string; problemId?: string }) {
  const url = "problem" in props ? `/oj/problems/${props.problem}.json` : `/oj/assignments/${props.course}/${props.assignment}.json`;
  const [source, setSource] = useState<WorkspaceSource | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    let alive = true;
    setSource(null);
    setMissing(false);
    fetch(url)
      .then((r) => (r.ok && r.headers.get("content-type")?.includes("json") ? r.json() : Promise.reject(new Error("404"))))
      .then((data: unknown) => {
        if (!alive) return;
        setSource("problem" in props ? { kind: "problem", problem: data as PublicStandalone } : { kind: "assignment", course: props.course, assignment: data as PublicAssignment });
      })
      .catch(() => alive && setMissing(true));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  if (missing)
    return (
      <div className="ide" data-ide-theme="dark">
        <div className="ide-pad">没有这道题。<a href="/courses">返回学习</a></div>
      </div>
    );
  if (!source)
    return (
      <div className="ide" data-ide-theme="dark">
        <div className="ide-pad ide-muted">加载中…</div>
      </div>
    );
  return <Workspace source={source} problemId={"problemId" in props ? props.problemId : undefined} />;
}
