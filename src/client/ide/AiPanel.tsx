import { useEffect, useState } from "react";
import { api, ApiError } from "../api";
import type { JudgeResult } from "../../shared/judge";

/**
 * 做题界面里的「AI 助教」（故事 4.1）。测试判对错，AI 只帮忙理解和改进，不给完整答案。
 *   要一条提示：带上题目、当前代码、最近一次的运行或提交结果
 *   提问：随时问
 *   评阅：对最近一次提交评思路、边界和代码质量
 */

interface Review {
  summary: string;
  approach: string;
  edgeCases: string;
  quality: string;
  suggestions: string[];
  score: number;
}

type Entry = { kind: "hint" | "ask"; question?: string; html: string } | { kind: "review"; review: Review };

async function toHtml(text: string): Promise<string> {
  const [{ renderMarkdown }, { renderWithMath }] = await Promise.all([import("../markdown"), import("./math")]);
  return renderWithMath(text, renderMarkdown);
}

export function AiPanel({ problem, files, result, submission, loggedIn }: { problem: string; files: Record<string, string>; result: JudgeResult | null; submission: string | null; loggedIn: boolean }) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState<Entry["kind"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ enabled: boolean }>("/api/ai/status").then(
      (r) => setEnabled(r.enabled),
      () => setEnabled(false),
    );
  }, []);
  // 换题后清空对话
  useEffect(() => {
    setEntries([]);
    setError(null);
  }, [problem]);

  if (!loggedIn) return <div className="ide-muted ide-pad">登录后可以请 AI 助教给提示、回答问题、评阅提交。</div>;
  if (enabled === null) return <div className="ide-muted ide-pad">加载中…</div>;
  if (!enabled) return <div className="ide-muted ide-pad">平台还没有接入 AI。管理员在 Worker 设置里填写 AI_API_KEY 后即可使用。</div>;

  const run = async (kind: Entry["kind"]) => {
    if (busy) return;
    setBusy(kind);
    setError(null);
    try {
      if (kind === "review") {
        const r = await api<{ review: Review }>("/api/oj/ai/review", { body: { submission } });
        setEntries((e) => [...e, { kind, review: r.review }]);
      } else {
        const q = question.trim();
        const r = await api<{ answer: string }>(`/api/oj/ai/${kind}`, { body: { problem, files, ...(result ? { result } : {}), ...(kind === "ask" ? { question: q } : {}) } });
        const html = await toHtml(r.answer);
        setEntries((e) => [...e, { kind, ...(kind === "ask" ? { question: q } : {}), html }]);
        if (kind === "ask") setQuestion("");
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "出错了，请稍后再试");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="ide-ai">
      <p className="ide-ai-rule">AI 助教不会直接给出答案。对错以测试结果为准，AI 的说法可能有误，请结合讲义判断。</p>
      <div className="ide-ai-actions">
        <button className="ide-btn" onClick={() => void run("hint")} disabled={!!busy}>
          {busy === "hint" ? "思考中…" : "要一条提示"}
        </button>
        <button className="ide-btn" onClick={() => void run("review")} disabled={!!busy || !submission} title={submission ? "评阅最近一次提交" : "先提交一次，才能评阅"}>
          {busy === "review" ? "评阅中…" : "评阅最近一次提交"}
        </button>
      </div>
      {entries.map((e, i) => (
        <section key={i} className="ide-ai-entry">
          <div className="ide-ai-label">{e.kind === "hint" ? "提示" : e.kind === "ask" ? `问：${e.question}` : "评阅"}</div>
          {e.kind === "review" ? <ReviewView r={e.review} /> : <div className="ide-md" dangerouslySetInnerHTML={{ __html: e.html }} />}
        </section>
      ))}
      {error && <div className="ide-error">{error}</div>}
      <form
        className="ide-ai-ask"
        onSubmit={(ev) => {
          ev.preventDefault();
          if (question.trim()) void run("ask");
        }}
      >
        <textarea className="ide-textarea" value={question} maxLength={2000} rows={3} placeholder="写下你的问题，例如：为什么这里要用 // 而不是 /？" onChange={(ev) => setQuestion(ev.target.value)} />
        <button className="ide-btn ide-btn-primary" type="submit" disabled={!!busy || !question.trim()}>
          {busy === "ask" ? "回答中…" : "提问"}
        </button>
      </form>
    </div>
  );
}

function ReviewView({ r }: { r: Review }) {
  const rows: [string, string][] = [
    ["思路", r.approach],
    ["边界情况", r.edgeCases],
    ["代码质量", r.quality],
  ];
  return (
    <div className="ide-ai-review">
      <div className="ide-ai-score">
        <span className="ide-ai-score-n">{r.score}</span>
        <span className="ide-muted">/ 100　质量分只评思路和代码质量，不评对错</span>
      </div>
      {r.summary && <p>{r.summary}</p>}
      <dl>
        {rows
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>
      {r.suggestions.length > 0 && (
        <>
          <div className="ide-ai-label">改进建议</div>
          <ol>
            {r.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
