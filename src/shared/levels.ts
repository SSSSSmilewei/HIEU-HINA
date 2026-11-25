/**
 * 闯关（hiana-levels@1）：content/levels/<课>/index.json 的格式，构建时原样放到 /levels/<课>/index.json。
 *
 * 一门课 → 若干章（一章是一个官方项目，比如 Hog）→ 若干关（一关是官方的一个问题）。
 * 每章有一个目录（dir），里面是官方起始代码和 ok 测试。学生能改的文件（editable）存在自己的仓库里，
 * 其余文件只读，判题时和测试一起从静态文件读。判题器是 /levels/ok_runner.py（在 Pyodide 里运行）。
 */

export interface LevelRef {
  label: string;
  href: string;
}

export interface Level {
  /** 章内唯一，如 q01；过关记录里写成 <章>/<关> */
  id: string;
  /** 官方测试文件名（不带 .py），如 01 */
  test: string;
  title: string;
  points: number;
  /** 关卡说明（Markdown） */
  task: string;
  /** 分级提示，从轻到重，不给答案 */
  hints: string[];
  /** 这一关要写的函数（在编辑器里提示位置） */
  functions: string[];
  /** 讲义里相关的小节 */
  refs: LevelRef[];
  /** 选做 */
  optional?: boolean;
  /** 不用写代码：「先检验理解」全部答对就算通过（如 Hog 第 0 关） */
  unlockOnly?: boolean;
}

export interface LevelFile {
  path: string;
  editable: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  /** 对应的课程条目 id（课程页、讲义页用） */
  item: string;
  /** 筹备中：只在地图上占位 */
  soon?: boolean;
  /** ok 测试加密用的密钥（官方作业名，如 Hog Project） */
  key?: string;
  /** 起始代码和测试所在的目录，也是学生仓库里的目录 */
  dir?: string;
  intro?: string;
  files?: LevelFile[];
  /** 判题需要、但不显示给学生的文件（测试、测试辅助模块） */
  support?: string[];
  levels: Level[];
}

export interface LevelIndex {
  format: "hiana-levels@1";
  course: string;
  title: string;
  license: string;
  source: string;
  chapters: Chapter[];
}

/** 有闯关的课（构建时也会检查 content/levels/<课>/index.json 是否存在） */
export const LEVEL_COURSES = ["cs61a"] as const;

export function hasLevels(slug: string): boolean {
  return (LEVEL_COURSES as readonly string[]).includes(slug);
}

/** 一章里，某一关之前的关（不含选做）是否都通过了：用来在地图上标「推荐下一关」 */
export function nextLevel(ch: Chapter, passed: Record<string, number>): Level | null {
  return ch.levels.find((l) => !passed[`${ch.id}/${l.id}`]) ?? null;
}
