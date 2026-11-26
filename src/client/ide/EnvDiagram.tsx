import type { CaseResult } from "../../shared/judge";

/**
 * 环境图题的作答区（故事 3.4）。左边是程序，右边按帧填：全局帧只有绑定；每个函数帧填被调用的函数、
 * 父帧、绑定和返回值。answers 里每一项是一帧的 JSON（第 0 项是全局帧），判题服务实际运行程序后逐帧比对。
 */

interface FrameDraft {
  name: string;
  parent: string;
  bindings: [string, string][];
  ret: string;
}

const EMPTY_GLOBAL: FrameDraft = { name: "Global", parent: "", bindings: [["", ""]], ret: "" };

function decode(answers: string[]): FrameDraft[] {
  if (!answers.length) return [EMPTY_GLOBAL];
  return answers.map((raw, i) => {
    try {
      const o = JSON.parse(raw) as Partial<FrameDraft>;
      return { name: o.name ?? (i === 0 ? "Global" : ""), parent: o.parent ?? "", bindings: o.bindings?.length ? o.bindings : [["", ""]], ret: o.ret ?? "" };
    } catch {
      return i === 0 ? EMPTY_GLOBAL : { name: "", parent: "Global", bindings: [["", ""]], ret: "" };
    }
  });
}

function encode(frames: FrameDraft[]): string[] {
  return frames.map((f, i) => JSON.stringify(i === 0 ? { bindings: f.bindings } : { ...f, parent: f.parent || "Global" }));
}

export function EnvDiagramPanel({ code, answers, onChange, cases }: { code: string; answers: string[]; onChange: (a: string[]) => void; cases: CaseResult[] | null }) {
  const frames = decode(answers);
  const set = (next: FrameDraft[]) => onChange(encode(next));
  const update = (i: number, patch: Partial<FrameDraft>) => set(frames.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  const setBinding = (i: number, k: number, col: 0 | 1, v: string) =>
    update(
      i,
      { bindings: frames[i]!.bindings.map((b, j) => (j === k ? ((col === 0 ? [v, b[1]] : [b[0], v]) as [string, string]) : b)) },
    );
  const parents = ["Global", ...frames.slice(1).map((_, i) => `f${i + 1}`)];
  return (
    <div className="ide-env">
      <p className="ide-wwpd-tip">
        先在纸上画，再填到这里：程序运行结束时一共有哪些帧，每一帧里各有哪些名字、绑定什么值。函数值写成 <code>func 名字</code>（lambda 写 <code>func λ</code>），字符串可以不加引号。提交后每一帧单独判对错，只提示哪里不对，不显示答案。
      </p>
      <pre className="ide-pre ide-env-code">{code.trimEnd()}</pre>
      {frames.map((f, i) => {
        const c = cases?.[i];
        return (
          <section key={i} className={`ide-env-frame${c ? (c.verdict === "AC" ? " is-ok" : " is-bad") : ""}`}>
            <div className="ide-env-head">
              {i === 0 ? (
                <strong>全局帧 Global</strong>
              ) : (
                <>
                  <strong>f{i}:</strong>
                  <input className="ide-wwpd-input ide-env-name" value={f.name} placeholder="被调用的函数，如 square 或 λ" onChange={(e) => update(i, { name: e.target.value })} aria-label={`f${i} 的函数名`} />
                  <label className="ide-env-parent">
                    父帧
                    <select className="ide-select" value={f.parent || "Global"} onChange={(e) => update(i, { parent: e.target.value })}>
                      {parents.slice(0, i).map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </label>
                  {i === frames.length - 1 && (
                    <button className="ide-icon" onClick={() => set(frames.slice(0, -1))} title="删掉这一帧" aria-label="删掉这一帧">
                      ×
                    </button>
                  )}
                </>
              )}
              {c && <span className={`ide-wwpd-mark ${c.verdict === "AC" ? "ok" : "bad"}`}>{c.verdict === "AC" ? "✓" : `✗ ${c.actual}`}</span>}
            </div>
            <table className="ide-env-table">
              <tbody>
                {f.bindings.map((b, k) => (
                  <tr key={k}>
                    <td>
                      <input className="ide-wwpd-input" value={b[0]} placeholder="名字" onChange={(e) => setBinding(i, k, 0, e.target.value)} aria-label="名字" />
                    </td>
                    <td>
                      <input className="ide-wwpd-input" value={b[1]} placeholder="值" onChange={(e) => setBinding(i, k, 1, e.target.value)} aria-label="值" />
                    </td>
                    <td>
                      {f.bindings.length > 1 && (
                        <button className="ide-icon" onClick={() => update(i, { bindings: f.bindings.filter((_, j) => j !== k) })} title="删掉这一行" aria-label="删掉这一行">
                          ×
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {i > 0 && (
                  <tr className="ide-env-ret">
                    <td>返回值</td>
                    <td>
                      <input className="ide-wwpd-input" value={f.ret} placeholder="这一帧返回的值" onChange={(e) => update(i, { ret: e.target.value })} aria-label="返回值" />
                    </td>
                    <td />
                  </tr>
                )}
              </tbody>
            </table>
            <button className="ide-btn ide-btn-ghost" onClick={() => update(i, { bindings: [...f.bindings, ["", ""]] })}>
              ＋ 名字
            </button>
          </section>
        );
      })}
      <button className="ide-btn" onClick={() => set([...frames, { name: "", parent: "Global", bindings: [["", ""]], ret: "" }])}>
        ＋ 新的函数帧 f{frames.length}
      </button>
    </div>
  );
}
