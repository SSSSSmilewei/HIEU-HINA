import { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "../router";

/** 课程条目页上的「限时测验」入口（故事 3.5）：这个条目有对应的测验时显示 */
interface ExamBrief {
  id: string;
  item?: string;
  title: string;
  minutes: number;
  total: number;
  questions: number;
  pass: number;
  mine: { score: number; max: number; passed: boolean; attempts: number } | null;
}

let cache: Promise<ExamBrief[]> | null = null;
const loadExams = () => (cache ??= api<{ exams: ExamBrief[] }>("/api/exams").then((r) => r.exams, () => []));

export function ExamEntry({ course, item }: { course: string; item: string }) {
  const [list, setList] = useState<ExamBrief[]>([]);
  useEffect(() => {
    let alive = true;
    void loadExams().then((all) => alive && setList(all.filter((e) => e.item === item)));
    return () => {
      alive = false;
    };
  }, [item]);
  if (!list.length) return null;
  return (
    <>
      {list.map((e) => (
        <section key={e.id} className="card assignment-entry" aria-label="限时测验">
          <div className="stack" style={{ gap: 4 }}>
            <strong>{e.title}</strong>
            <span className="small sub">
              限时 {e.minutes} 分钟，{e.questions} 道题，共 {e.total} 分，及格线 {Math.round(e.pass * 100)}%。开始后计时，到时自动交卷；测验期间不能使用 AI 助教。
              {e.mine && `你的最好成绩：${e.mine.score} / ${e.mine.max}（${e.mine.passed ? "及格" : "未及格"}，考过 ${e.mine.attempts} 次）。`}
            </span>
          </div>
          <Link to={`/courses/${course}/exam/${e.id}`} className="btn btn-primary">
            {e.mine ? "查看或重考" : "进入测验"}
          </Link>
        </section>
      ))}
    </>
  );
}
