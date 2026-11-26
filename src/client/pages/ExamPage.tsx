import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api, ApiError } from "../api";
import { navigate } from "../router";
import { loginHref, useMe } from "../session";
import type { Exam, ExamAnswer, ExamAnswers, ExamQuestion, PublicExam } from "../../shared/exam";
import "../ide/ide.css";

/**
 * 限时测验（故事 3.5）：/courses/:slug/exam/:id。和作业台同一套深色外观。
 * 开考前只有说明；开考后按服务器给的截止时间倒计时，作答停手两秒自动保存，到时自动交卷；
 * 交卷后显示每题得分、标准答案和讲解。考试进行中，作业台的 AI 助教会停用（服务器端拦）。
 */

interface Meta {
  id: string;
  title: string;
  source: string;
  license: string;
  minutes: number;
  pass: number;
  certificate: boolean;
  intro: string;
  total: number;
  questions: number;
}
interface Attempt {
  id: string;
  startedAt: number;
  deadline: number;
  now: number;
  answers: ExamAnswers;
  submittedAt: number | null;
  score: number | null;
  maxScore: number | null;
  passed: boolean | null;
  detail: { id: string; points: number; got: number; note?: string }[] | null;
}
type Paper = PublicExam | Exam;
type AnyQuestion = Paper["sections"][number]["questions"][number];

const SAVE_DELAY_MS = 2000;

function useMarkdown(texts: string[]): string[] | null {
  const [html, setHtml] = useState<string[] | null>(null);
  const key = texts.join("\u0000");
  useEffect(() => {
    let alive = true;
    Promise.all([import("../markdown"), import("../ide/math")]).then(([{ renderMarkdown }, { renderWithMath }]) => {
      if (alive) setHtml(texts.map((t) => (t ? renderWithMath(t, renderMarkdown) : "")));
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return html;
}

function Md({ text }: { text: string }) {
  const html = useMarkdown([text]);
  return html ? <div className="ide-md" dangerouslySetInnerHTML={{ __html: html[0]! }} /> : null;
}

const fmt = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export function ExamPage({ course, id }: { course: string; id: string }) {
  const { me } = useMe();
  const [meta, setMeta] = useState<Meta | null>(null);
  const [paper, setPaper] = useState<Paper | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<ExamAnswers>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<"saved" | "saving" | "dirty" | "error">("saved");
  const [left, setLeft] = useState(0);
  /** 服务器时间 - 本机时间，倒计时以服务器为准 */
  const skew = useRef(0);
  const answersRef = useRef(answers);
  const scroller = useRef<HTMLDivElement>(null);
  answersRef.current = answers;

  const load = useCallback(async () => {
    try {
      const r = await api<{ exam: Meta; paper: Paper | null; attempt: Attempt | null }>(`/api/exams/${id}`);
      setMeta(r.exam);
      setPaper(r.paper);
      setAttempt(r.attempt);
      if (r.attempt) {
        skew.current = r.attempt.now - Date.now();
        setAnswers(r.attempt.answers);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "加载失败");
    }
  }, [id]);
  useEffect(() => {
    void load();
  }, [load]);

  const active = !!attempt && attempt.submittedAt === null;

  const submit = useCallback(
    async (auto = false) => {
      if (!attempt || busy) return;
      if (!auto && !confirm("确定交卷？交卷后不能再改。")) return;
      setBusy(true);
      try {
        const r = await api<{ attempt: Attempt; paper: Exam }>(`/api/exams/${id}/submit`, { body: { attempt: attempt.id, answers: answersRef.current } });
        setAttempt(r.attempt);
        setPaper(r.paper);
        scroller.current?.scrollTo(0, 0);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "交卷失败，请重试");
        if (e instanceof ApiError && e.status === 409) void load();
      } finally {
        setBusy(false);
      }
    },
    [attempt, busy, id, load],
  );

  // 倒计时；到点自动交卷
  useEffect(() => {
    if (!active || !attempt) return;
    const tick = () => {
      const ms = attempt.deadline - (Date.now() + skew.current);
      setLeft(ms);
      if (ms <= 0) void submit(true);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [active, attempt, submit]);

  // 停手两秒自动保存
  useEffect(() => {
    if (!active || saved !== "dirty" || !attempt) return;
    const t = setTimeout(async () => {
      setSaved("saving");
      try {
        await api(`/api/exams/${id}/answers`, { method: "PUT", body: { attempt: attempt.id, answers: answersRef.current } });
        setSaved("saved");
      } catch {
        setSaved("error");
      }
    }, SAVE_DELAY_MS);
    return () => clearTimeout(t);
  }, [answers, active, saved, attempt, id]);

  const set = (qid: string, v: ExamAnswer) => {
    setAnswers((a) => ({ ...a, [qid]: v }));
    setSaved("dirty");
  };

  const start = async () => {
    if (!me.role) {
      navigate(loginHref(location.pathname));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ attempt: Attempt; paper: PublicExam }>(`/api/exams/${id}/start`, { method: "POST" });
      skew.current = r.attempt.now - Date.now();
      setAttempt(r.attempt);
      setPaper(r.paper);
      setAnswers(r.attempt.answers);
      setSaved("saved");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "开始失败");
    } finally {
      setBusy(false);
    }
  };

  const results = useMemo(() => new Map((attempt?.detail ?? []).map((d) => [d.id, d])), [attempt]);
  const back = `/courses/${course}`;

  if (!meta)
    return (
      <div className="ide" data-ide-theme="dark">
        <div className="ide-pad ide-muted">{error ?? "加载中…"}</div>
      </div>
    );

  return (
    <div className="ide" data-ide-theme="dark">
      <header className="ide-top">
        <a className="ide-brand" href={back} onClick={(e) => (e.preventDefault(), (!active || confirm("测验还在计时，离开页面不会暂停。确定离开？")) && navigate(back))} title="返回课程">
          <span className="ide-brand-mark">HI·NA</span>
          <span className="ide-brand-sub">测验</span>
        </a>
        <nav className="ide-crumbs">
          <span>{meta.title}</span>
        </nav>
        <div className="ide-actions">
          {active && (
            <>
              <span className="ide-muted">{{ saved: "已保存", saving: "保存中…", dirty: "未保存", error: "保存失败，会自动重试" }[saved]}</span>
              <span className={`ide-exam-timer${left < 5 * 60_000 ? " is-low" : ""}`} title="剩余时间">
                {fmt(left)}
              </span>
              <button className="ide-btn ide-btn-primary" onClick={() => void submit(false)} disabled={busy}>
                {busy ? "交卷中…" : "交卷"}
              </button>
            </>
          )}
        </div>
      </header>

      <div className="ide-exam-scroll" ref={scroller}>
      <main className="ide-exam">
        {error && <div className="ide-error">{error}</div>}

        {attempt?.submittedAt != null && attempt.score !== null && (
          <section className={`ide-exam-score ${attempt.passed ? "is-ok" : "is-bad"}`}>
            <strong>
              {attempt.score} / {attempt.maxScore}
            </strong>
            <span>
              {attempt.passed ? "及格" : "未及格"}（及格线 {Math.round(meta.pass * 100)}%）{meta.certificate && attempt.passed && "，已记入协会完成凭证"}
            </span>
            <button className="ide-btn" onClick={() => void start()} disabled={busy}>
              再考一次
            </button>
          </section>
        )}

        {meta.certificate && attempt?.submittedAt != null && attempt.passed && (
          <section className="ide-exam-cert">
            <div className="ide-exam-cert-title">海纳协会 · 课程完成凭证</div>
            <p>
              <strong>{me.member?.name ?? ""}</strong>
              {me.member?.studentNo ? `（${me.member.studentNo}）` : ""} 完成了 <strong>CS 61A：计算机程序的构造和解释</strong> 的全部学习，并通过结课测验
            </p>
            <p className="ide-muted">
              {meta.title} · 成绩 {attempt.score} / {attempt.maxScore} · {new Date(attempt.submittedAt).toLocaleDateString("zh-CN")}
            </p>
            <button className="ide-btn ide-btn-ghost" onClick={() => window.print()}>
              打印或存成 PDF
            </button>
          </section>
        )}

        {!active && !paper && (
          <section className="ide-exam-intro">
            <h1 className="ide-h1">{meta.title}</h1>
            <div className="ide-meta">
              <span>限时 {meta.minutes} 分钟</span>
              <span>
                {meta.questions} 道题，共 {meta.total} 分
              </span>
              <span>及格线 {Math.round(meta.pass * 100)}%</span>
              <span>{meta.source}</span>
            </div>
            <Md text={meta.intro} />
            <button className="ide-btn ide-btn-primary ide-exam-start" onClick={() => void start()} disabled={busy}>
              {me.role ? (busy ? "正在开始…" : "开始测验（开始后计时）") : "登录后开始"}
            </button>
            <p className="ide-muted">{meta.license}</p>
          </section>
        )}

        {paper &&
          paper.sections.map((s, si) => (
            <section key={si} className="ide-exam-section">
              <h2 className="ide-h2">{s.title}</h2>
              {s.intro && <Md text={s.intro} />}
              {s.questions.map((q) => (
                <Question key={q.id} q={q} value={answers[q.id]} onChange={(v) => set(q.id, v)} readOnly={!active} result={results.get(q.id)} />
              ))}
            </section>
          ))}

        {active && (
          <div className="ide-exam-end">
            <button className="ide-btn ide-btn-primary" onClick={() => void submit(false)} disabled={busy}>
              交卷
            </button>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}

function Question({ q, value, onChange, readOnly, result }: { q: AnyQuestion; value: ExamAnswer | undefined; onChange: (v: ExamAnswer) => void; readOnly: boolean; result?: { got: number; points: number; note?: string } }) {
  const full = q as ExamQuestion; // 交卷后试卷带答案
  const mark = result ? (result.got >= result.points ? "is-ok" : result.got > 0 ? "is-part" : "is-bad") : "";
  return (
    <div className={`ide-exam-q ${mark}`}>
      <div className="ide-exam-q-head">
        <span className="ide-muted">
          {q.id} · {q.points} 分
        </span>
        {result && (
          <span className={`ide-exam-got ${mark}`}>
            得 {result.got} 分{result.note ? `（${result.note}）` : ""}
          </span>
        )}
      </div>
      <Md text={q.prompt} />
      {(q.type === "choice" || q.type === "multi") && (
        <div className="ide-wwpd-choices">
          {q.choices.map((c, i) => {
            const on = q.type === "choice" ? value === i : Array.isArray(value) && value.includes(i);
            const correct = full.type === "choice" ? full.answer === i : full.type === "multi" && full.answers?.includes(i);
            return (
              <label key={i} className={`ide-wwpd-choice${on ? " is-on" : ""}${readOnly && correct ? " is-correct" : ""}`}>
                <input
                  type={q.type === "choice" ? "radio" : "checkbox"}
                  checked={on}
                  disabled={readOnly}
                  onChange={() => {
                    if (q.type === "choice") onChange(i);
                    else {
                      const cur = Array.isArray(value) ? value : [];
                      onChange(cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]);
                    }
                  }}
                />
                <code>{c}</code>
              </label>
            );
          })}
        </div>
      )}
      {q.type === "text" &&
        (q.multiline ? (
          <textarea className="ide-textarea ide-exam-text" rows={4} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} readOnly={readOnly} spellCheck={false} placeholder="每行写一行显示的内容" />
        ) : (
          <input className="ide-wwpd-input ide-exam-line" value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} readOnly={readOnly} spellCheck={false} />
        ))}
      {q.type === "code" && (
        <textarea
          className="ide-textarea ide-exam-code"
          rows={14}
          value={typeof value === "string" ? value : q.starter}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Tab" && !readOnly) {
              e.preventDefault();
              const t = e.currentTarget;
              const at = t.selectionStart;
              const v = t.value;
              onChange(v.slice(0, at) + "    " + v.slice(t.selectionEnd));
              requestAnimationFrame(() => t.setSelectionRange(at + 4, at + 4));
            }
          }}
          readOnly={readOnly}
          spellCheck={false}
        />
      )}
      {readOnly && full.type === "text" && full.accept && (
        <div className="ide-exam-answer">
          <span className="ide-muted">标准答案：</span>
          <pre className="ide-pre">{full.accept[0]}</pre>
        </div>
      )}
      {readOnly && full.explain && (
        <div className="ide-exam-explain">
          <Md text={full.explain} />
        </div>
      )}
    </div>
  );
}
