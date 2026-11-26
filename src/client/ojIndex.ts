import { useEffect, useState } from "react";

/** /oj/index.json 里的作业目录（scripts/oj.mjs 生成） */
export interface OjAssignmentBrief {
  course: string;
  id: string;
  title: string;
  item?: string;
  semester: string;
  language?: "zh" | "en";
  problems: { id: string; title: string; kind: string }[];
}
interface OjIndex {
  assignments: OjAssignmentBrief[];
}

let index: Promise<OjIndex> | null = null;
export function loadOjIndex(): Promise<OjIndex> {
  index ??= fetch("/oj/index.json").then((r) => (r.ok ? (r.json() as Promise<OjIndex>) : { assignments: [] }), () => ({ assignments: [] }));
  return index;
}

const TERM: Record<string, string> = { sp: "春季", su: "夏季", fa: "秋季" };

/** 版本名，如「2020 秋季 · 中文」「2026 春季 · 英文原文」 */
export function versionLabel(a: Pick<OjAssignmentBrief, "semester" | "language">): string {
  const m = /^(sp|su|fa)(\d{2})$/.exec(a.semester);
  const term = m ? `20${m[2]} ${TERM[m[1]!]}` : a.semester;
  return `${term} · ${a.language === "zh" ? "中文" : "英文原文"}`;
}

/** 同一个课程条目的几个版本：中文版在前，其次是新学期 */
function versionOrder(a: OjAssignmentBrief, b: OjAssignmentBrief): number {
  const zh = Number(b.language === "zh") - Number(a.language === "zh");
  if (zh) return zh;
  const year = (s: string) => Number(s.slice(2)) * 10 + ({ sp: 1, su: 2, fa: 3 }[s.slice(0, 2)] ?? 0);
  return year(b.semester) - year(a.semester);
}

/** 这个课程条目对应的 OJ 作业（几个版本，像视频换源）；undefined 表示还在读 */
export function useAssignments(course: string, item: string): OjAssignmentBrief[] | undefined {
  const [list, setList] = useState<OjAssignmentBrief[] | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    setList(undefined);
    loadOjIndex().then((ix) => alive && setList(ix.assignments.filter((x) => x.course === course && (x.item ?? x.id) === item).sort(versionOrder)));
    return () => {
      alive = false;
    };
  }, [course, item]);
  return list;
}
