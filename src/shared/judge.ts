import { z } from "zod/v4";
import { LANGUAGES } from "./problem";

/** 判题请求与结果（平台 ↔ 判题服务 judge/ 共用，故事 1.2、1.3） */

/** 判题结果，和力扣、Codeforces 的叫法一致 */
export const VERDICTS = ["AC", "WA", "TLE", "MLE", "OLE", "RE", "CE", "SE"] as const;
export type Verdict = (typeof VERDICTS)[number];

export const VERDICT_TEXT: Record<Verdict, string> = {
  AC: "通过",
  WA: "答案错误",
  TLE: "超出时间限制",
  MLE: "超出内存限制",
  OLE: "输出超出限制",
  RE: "运行错误",
  CE: "编译错误",
  SE: "判题系统错误",
};

/** 一次提交最多这么多文件、这么大 */
export const MAX_SUBMIT_FILES = 20;
export const MAX_SUBMIT_BYTES = 256 * 1024;

export const JudgeRequest = z.object({
  /** 课程作业里的题：<course>/<assignment>/<problem>；刷题区的题：<problem> */
  problem: z.string().regex(/^[a-z0-9_-]+(\/[a-z0-9_-]+\/[a-z0-9_-]+)?$/),
  language: z.enum(LANGUAGES),
  /** 学员改过的文件，只认题目里标了可改的那些 */
  files: z.record(z.string().max(200), z.string()).refine((f) => Object.keys(f).length <= MAX_SUBMIT_FILES, "文件太多"),
  /** 预测输出题：按顺序填的每个空（每个加密行一个，每道选择题一个，选择题填选项原文） */
  answers: z.array(z.string().max(4000)).max(400).optional(),
  /** 「运行」时可以自带输入（只对输入输出题有效） */
  stdin: z.string().max(64 * 1024).optional(),
});
export type JudgeRequest = z.infer<typeof JudgeRequest>;

export interface CaseResult {
  /** 第几个用例，从 1 开始 */
  index: number;
  verdict: Verdict;
  timeMs: number;
  memoryKb: number;
  /** 隐藏用例不给下面这些 */
  hidden: boolean;
  /** 输入：输入输出题是 stdin，ok 题是那一条语句 */
  input?: string;
  expected?: string;
  actual?: string;
  /** 报错信息（traceback、编译输出） */
  message?: string;
}

export interface JudgeResult {
  verdict: Verdict;
  /** 通过的用例数 / 总用例数 */
  passed: number;
  total: number;
  /** 最慢一个用例的用时、最大内存 */
  timeMs: number;
  memoryKb: number;
  cases: CaseResult[];
  /** 编译错误、判题系统错误时的说明 */
  message?: string;
  /** 「运行」自带输入时的输出 */
  stdout?: string;
  stderr?: string;
}
