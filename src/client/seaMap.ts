/**
 * 深海地图（故事 3.7）：一门课是一次下潜，每周（课程包的一个模块）是一段深度，每个条目是一个点。
 * 只用已有的数据算：讲义的「已完成」标记、OJ 通过的题、限时测验的成绩。纯函数，方便测试。
 *
 * 点的状态：
 * - done   完成：讲义标了完成；作业的某个版本全部题目通过；测验及格
 * - doing  进行中：作业通过了一部分
 * - open   可以做
 * - ahead  前面一周还不到一半，建议先做前面的（仍然能点进去，不锁内容）
 */

export type NodeStatus = "done" | "doing" | "open" | "ahead";

export interface SeaItem {
  id: string;
  kind: string;
  title: string;
  optional?: boolean;
  pages: { id: string }[];
}
export interface SeaModule {
  id: string;
  title: string;
  items: SeaItem[];
}
export interface SeaAssignment {
  id: string;
  item?: string;
  problems: { id: string }[];
}
export interface SeaExam {
  id: string;
  item?: string;
  passed: boolean;
}

export interface SeaNode {
  id: string;
  title: string;
  kind: string;
  optional: boolean;
  href: string;
  status: NodeStatus;
  /** 有作业台时：通过的题数 / 总题数（取完成得最多的版本） */
  progress: { solved: number; total: number } | null;
  xp: number;
}
export interface SeaWeek {
  id: string;
  title: string;
  /** 这一周下潜到的深度（米），纯装饰：每周 200 米 */
  depth: number;
  nodes: SeaNode[];
  done: number;
  total: number;
}
export interface Badge {
  id: string;
  title: string;
  detail: string;
  earned: boolean;
}
export interface SeaMap {
  weeks: SeaWeek[];
  xp: number;
  badges: Badge[];
  /** 建议的下一个点（第一个没完成的必做点） */
  next: SeaNode | null;
}

export const XP = { lesson: 10, problem: 5, projectProblem: 10, assignment: 20, exam: 100 } as const;
const DEPTH_PER_WEEK = 200;
const AHEAD_BELOW = 0.5;
const PROJECTS: [string, string][] = [
  ["hog", "Hog"],
  ["cats", "Cats"],
  ["ants", "Ants"],
  ["scheme", "Scheme 解释器"],
];

/** 一份作业通过了几道（附加题 ec 不算总数，算进通过数也不超过总数） */
function count(course: string, a: SeaAssignment, solved: Set<string>): { solved: number; total: number } {
  const required = a.problems.filter((p) => !/^ec\d*$/.test(p.id));
  const n = required.filter((p) => solved.has(`${course}/${a.id}/${p.id}`)).length;
  return { solved: n, total: required.length };
}

export function buildSeaMap(input: { course: string; modules: SeaModule[]; done: Record<string, number>; solved: Set<string>; assignments: SeaAssignment[]; exams: SeaExam[] }): SeaMap {
  const { course, modules, done, solved, assignments, exams } = input;
  let xp = 0;
  const weeks: SeaWeek[] = [];
  let prevRatio = 1;
  modules.forEach((m, wi) => {
    const nodes: SeaNode[] = m.items.map((it) => {
      const versions = assignments.filter((a) => (a.item ?? a.id) === it.id);
      const itemExams = exams.filter((e) => e.item === it.id);
      let status: NodeStatus = "open";
      let progress: SeaNode["progress"] = null;
      let nodeXp = 0;
      let href = `/courses/${course}/learn/${it.pages[0]?.id ?? it.id}`;
      if (versions.length) {
        const counts = versions.map((v) => ({ v, c: count(course, v, solved) }));
        counts.sort((a, b) => b.c.solved / Math.max(1, b.c.total) - a.c.solved / Math.max(1, a.c.total));
        const best = counts[0]!;
        progress = best.c;
        href = `/courses/${course}/hw/${best.v.id}`;
        const per = it.kind === "project" ? XP.projectProblem : XP.problem;
        nodeXp = best.c.solved * per;
        if (best.c.total > 0 && best.c.solved >= best.c.total) {
          status = "done";
          nodeXp += XP.assignment;
        } else if (best.c.solved > 0 || done[it.id]) status = "doing";
      } else if (itemExams.length) {
        href = `/courses/${course}/exam/${itemExams[0]!.id}`;
        if (itemExams.some((e) => e.passed)) {
          status = "done";
          nodeXp = XP.exam;
        }
      } else if (done[it.id]) {
        status = "done";
        nodeXp = XP.lesson;
      }
      xp += nodeXp;
      return { id: it.id, title: it.title, kind: it.kind, optional: !!it.optional, href, status, progress, xp: nodeXp };
    });
    const required = nodes.filter((n) => !n.optional);
    const doneCount = required.filter((n) => n.status === "done").length;
    if (wi > 0 && prevRatio < AHEAD_BELOW) for (const n of nodes) if (n.status === "open") n.status = "ahead";
    prevRatio = required.length ? doneCount / required.length : 1;
    weeks.push({ id: m.id, title: m.title, depth: wi * DEPTH_PER_WEEK, nodes, done: doneCount, total: required.length });
  });

  const all = weeks.flatMap((w) => w.nodes);
  const byItem = (id: string) => all.find((n) => n.id === id);
  const examPassed = (item: string) => exams.some((e) => e.item === item && e.passed);
  const badges: Badge[] = [
    { id: "first-ac", title: "第一次通过", detail: "在作业台通过第一道题", earned: [...solved].some((s) => s.startsWith(`${course}/`)) },
    ...PROJECTS.map(([id, name]) => {
      const n = byItem(`proj-${id}`);
      return { id: `proj-${id}`, title: `完成 ${name}`, detail: `通过 ${name} 项目的全部必做题`, earned: n?.status === "done" };
    }),
    { id: "midterm", title: "期中通过", detail: "期中测验达到及格线", earned: examPassed("exam-midterm") },
    { id: "final", title: "浮出水面", detail: "结课测验及格，完成整门课", earned: examPassed("exam-final") },
    { id: "half", title: "半程", detail: "完成一半的必做点", earned: all.filter((n) => !n.optional && n.status === "done").length * 2 >= Math.max(1, all.filter((n) => !n.optional).length) },
  ];
  const next = all.find((n) => !n.optional && n.status !== "done") ?? null;
  return { weeks, xp, badges, next };
}
