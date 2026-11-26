import { z } from "zod/v4";

/**
 * 限时测验格式 hiana-exam@1（故事 3.5）。源文件 content/exams/<id>.json。
 *
 * 题型：
 * - choice：单选（answer 是选项序号，从 0 开始）
 * - multi：多选（answers 是全部正确选项的序号）
 * - text：填空，例如「Python 会显示什么」（accept 里任意一个都算对；比较时去掉首尾空白、合并多余空白，多行逐行比）
 * - code：写代码，交给判题服务用官方 doctest 判（problem 是 OJ 题号），按通过的用例比例给分
 *
 * 标准答案只打进 Worker，网页拿到的公开版本（publicExam）不带答案、不带讲解。
 */

export const EXAM_FORMAT = "hiana-exam@1";

const base = {
  id: z.string().regex(/^[a-z0-9][a-z0-9-]{0,39}$/),
  /** 题干（Markdown），可以带代码块 */
  prompt: z.string().min(1).max(20_000),
  points: z.number().positive().max(100),
  /** 交卷后显示的讲解（Markdown） */
  explain: z.string().max(20_000).optional(),
};

export const ExamQuestion = z.discriminatedUnion("type", [
  z.object({ ...base, type: z.literal("choice"), choices: z.array(z.string().min(1).max(2000)).min(2).max(20), answer: z.number().int().min(0) }),
  z.object({ ...base, type: z.literal("multi"), choices: z.array(z.string().min(1).max(2000)).min(2).max(20), answers: z.array(z.number().int().min(0)).min(1) }),
  z.object({ ...base, type: z.literal("text"), multiline: z.boolean().default(false), accept: z.array(z.string().max(4000)).min(1).max(20) }),
  z.object({ ...base, type: z.literal("code"), problem: z.string().regex(/^[a-z0-9_-]+(\/[a-z0-9_-]+\/[a-z0-9_-]+)?$/), file: z.string().min(1).max(100), starter: z.string().max(40_000) }),
]);
export type ExamQuestion = z.infer<typeof ExamQuestion>;

export const ExamSection = z.object({
  title: z.string().min(1).max(200),
  /** 这一大题共用的说明和代码（Markdown） */
  intro: z.string().max(20_000).default(""),
  questions: z.array(ExamQuestion).min(1).max(40),
});

export const Exam = z
  .object({
    format: z.literal(EXAM_FORMAT).default(EXAM_FORMAT),
    id: z.string().regex(/^[a-z0-9][a-z0-9-]{0,47}$/),
    course: z.string().regex(/^[a-z0-9-]+$/),
    /** 对应的课程条目 id，课程页上显示入口 */
    item: z.string().max(80).optional(),
    title: z.string().min(1).max(100),
    /** 原卷，如「CS 61A 2025 秋季 期中考试 1」 */
    source: z.string().max(200),
    license: z.string().max(400),
    /** 限时（分钟） */
    minutes: z.number().int().min(5).max(300),
    /** 及格线（0–1），默认 0.7 */
    pass: z.number().min(0).max(1).default(0.7),
    /** 达到及格线时发协会的完成凭证（结课测验） */
    certificate: z.boolean().default(false),
    /** 开考前的说明（Markdown） */
    intro: z.string().max(20_000).default(""),
    sections: z.array(ExamSection).min(1).max(20),
  })
  .superRefine((e, ctx) => {
    const seen = new Set<string>();
    e.sections.forEach((s, i) =>
      s.questions.forEach((q, j) => {
        if (seen.has(q.id)) ctx.addIssue({ code: "custom", path: ["sections", i, "questions", j, "id"], message: `题号重复：${q.id}` });
        seen.add(q.id);
        if (q.type === "choice" && q.answer >= q.choices.length) ctx.addIssue({ code: "custom", path: ["sections", i, "questions", j, "answer"], message: "答案超出选项范围" });
        if (q.type === "multi" && q.answers.some((a) => a >= q.choices.length)) ctx.addIssue({ code: "custom", path: ["sections", i, "questions", j, "answers"], message: "答案超出选项范围" });
      }),
    );
  });
export type Exam = z.infer<typeof Exam>;
export type ExamInput = z.input<typeof Exam>;

/** 学员的作答：题号 → 选项序号 / 选项序号数组 / 文本 / 代码 */
export type ExamAnswer = number | number[] | string;
export type ExamAnswers = Record<string, ExamAnswer>;

/** 网页用的公开版本：不带答案和讲解 */
export function publicExam(e: Exam) {
  return {
    ...e,
    sections: e.sections.map((s) => ({
      ...s,
      questions: s.questions.map((q) => {
        const { explain: _explain, ...rest } = q;
        if (rest.type === "choice") {
          const { answer: _a, ...r } = rest;
          return r;
        }
        if (rest.type === "multi") {
          const { answers: _a, ...r } = rest;
          return { ...r, pick: rest.answers.length };
        }
        if (rest.type === "text") {
          const { accept: _a, ...r } = rest;
          return r;
        }
        return rest;
      }),
    })),
  };
}
export type PublicExam = ReturnType<typeof publicExam>;

export const examTotal = (e: Pick<Exam, "sections">) => e.sections.reduce((n, s) => n + s.questions.reduce((m, q) => m + q.points, 0), 0);

/** 填空的比较口径：去掉首尾空白，每行合并多余空白，去掉空行 */
export function normalizeText(s: string): string {
  return s
    .split("\n")
    .map((l) => l.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .join("\n");
}

/** 不需要判题服务的题当场判分；code 题返回 null，由 Worker 调判题服务 */
export function gradeLocal(q: ExamQuestion, a: ExamAnswer | undefined): number | null {
  switch (q.type) {
    case "choice":
      return a === q.answer ? q.points : 0;
    case "multi": {
      const got = Array.isArray(a) ? [...new Set(a)].sort() : [];
      const want = [...new Set(q.answers)].sort();
      return got.length === want.length && got.every((x, i) => x === want[i]) ? q.points : 0;
    }
    case "text":
      return typeof a === "string" && q.accept.some((x) => normalizeText(x) === normalizeText(a)) ? q.points : 0;
    case "code":
      return null;
  }
}
