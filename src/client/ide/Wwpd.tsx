import type { CaseResult } from "../../shared/judge";
import type { UnlockItem } from "../../shared/problem";

/**
 * 预测输出题（故事 3.1 / 3.4）：代替编辑器，逐条语句填「解释器会显示什么」，选择题点选项。
 * 每个空对应判题结果里的一个用例（按顺序），提交后在空的旁边标出对错。
 */
export function WwpdPanel({ items, answers, onChange, cases }: { items: UnlockItem[]; answers: string[]; onChange: (a: string[]) => void; cases: CaseResult[] | null }) {
  let blank = 0;
  const set = (i: number, v: string) => {
    const next = answers.slice();
    next[i] = v;
    onChange(next);
  };
  const mark = (i: number) => {
    const c = cases?.[i];
    if (!c) return null;
    return <span className={`ide-wwpd-mark ide-v-${c.verdict === "AC" ? "ok" : "bad"}`}>{c.verdict === "AC" ? "✓" : "✗"}</span>;
  };
  return (
    <div className="ide-wwpd">
      <p className="ide-muted ide-wwpd-tip">逐条读代码，在每个空里写出解释器会显示的那一行（字符串按解释器显示的样子带上引号；报错写 Error）。写完点「提交」核对。</p>
      {items.map((it, k) => {
        if (it.type === "choice") {
          const i = blank++;
          return (
            <section key={k} className="ide-wwpd-item">
              <div className="ide-wwpd-head">
                选择题 {mark(i)}
              </div>
              <pre className="ide-pre">{it.question}</pre>
              <div className="ide-wwpd-choices" role="radiogroup">
                {it.choices.map((c) => (
                  <label key={c} className={`ide-wwpd-choice${answers[i] === c ? " is-on" : ""}`}>
                    <input type="radio" name={`c${k}`} checked={answers[i] === c} onChange={() => set(i, c)} />
                    <pre>{c}</pre>
                  </label>
                ))}
              </div>
            </section>
          );
        }
        return (
          <section key={k} className="ide-wwpd-item">
            <div className="ide-wwpd-head">会话 {k + 1}</div>
            <div className="ide-wwpd-session">
              {it.steps.map((s, j) => (
                <div key={j} className="ide-wwpd-step">
                  <pre className="ide-wwpd-code">
                    {s.code
                      .split("\n")
                      .map((line, n) => (n === 0 ? ">>> " : "... ") + line)
                      .join("\n")}
                  </pre>
                  {s.want.map((w, n) => {
                    if (!w.hash) return <pre key={n} className="ide-wwpd-given">{w.text}</pre>;
                    const i = blank++;
                    return (
                      <div key={n} className="ide-wwpd-blank">
                        <input
                          className="ide-wwpd-input"
                          value={answers[i] ?? ""}
                          onChange={(e) => set(i, e.target.value)}
                          spellCheck={false}
                          autoCapitalize="off"
                          autoComplete="off"
                          aria-label={`第 ${i + 1} 个空`}
                          placeholder="解释器显示的这一行"
                        />
                        {mark(i)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
