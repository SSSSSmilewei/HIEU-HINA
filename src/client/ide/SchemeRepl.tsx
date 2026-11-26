import { useEffect, useRef, useState } from "react";
import { schemeLine, schemeReset } from "./schemeRunner";

/** Scheme 项目的交互式解释器面板（故事 3.3）：用编辑器里现在的代码当解释器，scm> 一行一行求值 */

interface Entry {
  input: string;
  output: string;
  error?: string;
}

export function SchemeRepl({ files }: { files: Record<string, string> }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [line, setLine] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState<string | null>(null);
  const history = useRef<string[]>([]);
  const at = useRef(0);
  const end = useRef<HTMLDivElement>(null);
  const signature = JSON.stringify(files);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [entries]);

  const ensure = async (force = false) => {
    if (!force && loaded === signature) return true;
    const r = await schemeReset(files);
    if (r.error) {
      setEntries((e) => [...e, { input: "（加载你的解释器）", output: r.output, error: r.error }]);
      return false;
    }
    setLoaded(signature);
    if (loaded !== null) setEntries((e) => [...e, { input: "（代码改过了，已重新加载解释器）", output: "" }]);
    return true;
  };

  const submit = async () => {
    const text = line.trim();
    if (!text || busy) return;
    setBusy(true);
    history.current.push(text);
    at.current = history.current.length;
    setLine("");
    try {
      if (!(await ensure())) return;
      const r = await schemeLine(text);
      setEntries((e) => [...e, { input: text, output: r.output + (r.result !== null ? `${r.result}\n` : ""), error: r.error }]);
    } catch (e) {
      setLoaded(null);
      setEntries((x) => [...x, { input: text, output: "", error: e instanceof Error ? e.message : String(e) }]);
    } finally {
      setBusy(false);
    }
  };

  const restart = async () => {
    setBusy(true);
    setEntries([]);
    try {
      await ensure(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ide-repl">
      <div className="ide-hog-bar">
        <span className="ide-muted">用编辑器里现在的解释器代码运行，一行一个 Scheme 表达式；↑↓ 翻历史。只展示，不判题。</span>
        <button className="ide-btn ide-btn-ghost" onClick={() => void restart()} disabled={busy}>
          重新开始
        </button>
      </div>
      <div className="ide-repl-log">
        {entries.map((e, i) => (
          <div key={i}>
            <div className="ide-repl-in">scm&gt; {e.input}</div>
            {e.output && <pre className="ide-repl-out">{e.output.trimEnd()}</pre>}
            {e.error && <pre className="ide-repl-err">Error: {e.error}</pre>}
          </div>
        ))}
        <div ref={end} />
      </div>
      <form
        className="ide-repl-form"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <span>scm&gt;</span>
        <input
          className="ide-wwpd-input"
          value={line}
          onChange={(e) => setLine(e.target.value)}
          onKeyDown={(e) => {
            const h = history.current;
            if (e.key === "ArrowUp" && at.current > 0) setLine(h[--at.current]!);
            else if (e.key === "ArrowDown") setLine(at.current < h.length - 1 ? h[++at.current]! : ((at.current = h.length), ""));
          }}
          placeholder={busy ? "运行中…（第一次要下载 Python 运行环境）" : "(define (square x) (* x x))"}
          spellCheck={false}
          aria-label="Scheme 表达式"
        />
      </form>
    </div>
  );
}
