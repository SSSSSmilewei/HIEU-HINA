import { useState } from "react";
import { hogStrategy, hogTurn, type TurnState } from "./hogRunner";

/**
 * Hog 试玩面板（故事 3.3）：用编辑器里现在的代码玩一局，只展示，不判题。
 * 规则全部来自学员自己的 hog.py：写错了，游戏就会按写错的规则走，或者直接报错。
 */

const DICE = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const GOAL = 100;
const OPPONENTS = [
  { value: "human", label: "两个人轮流" },
  { value: "final_strategy", label: "电脑：你的 final_strategy" },
  { value: "sus_strategy", label: "电脑：你的 sus_strategy" },
  { value: "boar_strategy", label: "电脑：你的 boar_strategy" },
] as const;
type Opponent = (typeof OPPONENTS)[number]["value"];

interface LogLine {
  who: 0 | 1;
  num: number;
  dice: number[];
  before: [number, number];
  after: [number, number];
}

const NAMES = ["玩家 0（你）", "玩家 1"];

export function HogPlay({ files }: { files: Record<string, string> }) {
  const [opponent, setOpponent] = useState<Opponent>("final_strategy");
  const [sus, setSus] = useState(true);
  const [moves, setMoves] = useState<number[]>([]);
  const [state, setState] = useState<TurnState>({ rolls: [], scores: [0, 0], who: 0, over: false });
  const [log, setLog] = useState<LogLine[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setMoves([]);
    setState({ rolls: [], scores: [0, 0], who: 0, over: false });
    setLog([]);
    setError(null);
  };

  /** 当前玩家选择掷 num 个骰子；对手是电脑时，电脑接着走，直到又轮到人或游戏结束 */
  const roll = async (num: number) => {
    if (busy || state.over) return;
    setBusy(true);
    setError(null);
    let ms = moves;
    let st = state;
    const lines: LogLine[] = [];
    try {
      let next: number | null = num;
      while (next !== null) {
        ms = [...ms, next];
        const { result } = await hogTurn(files, st.rolls, ms, GOAL, sus);
        lines.push({ who: st.who, num: next, dice: result.rolls.slice(st.rolls.length), before: st.scores, after: result.scores });
        st = result;
        next = null;
        if (!st.over && st.who === 1 && opponent !== "human") {
          const { result: n } = await hogStrategy(files, opponent, [st.scores[1], st.scores[0]]);
          if (!Number.isInteger(n) || n < 0 || n > 10) throw new Error(`${opponent} 返回了 ${n}，应该是 0 到 10 的整数`);
          next = n;
        }
      }
      setMoves(ms);
      setState(st);
      setLog((l) => [...lines.reverse(), ...l]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const winner = state.over ? (state.scores[0] >= GOAL ? 0 : 1) : null;
  return (
    <div className="ide-hog">
      <div className="ide-hog-bar">
        <label>
          对手
          <select className="ide-select" value={opponent} onChange={(e) => (setOpponent(e.target.value as Opponent), reset())} disabled={busy}>
            {OPPONENTS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="ide-hog-check">
          <input type="checkbox" checked={sus} onChange={(e) => (setSus(e.target.checked), reset())} disabled={busy} />
          Sus Fuss 规则（用 sus_update）
        </label>
        <button className="ide-btn ide-btn-ghost" onClick={reset} disabled={busy}>
          新一局
        </button>
        <span className="ide-muted">用的是编辑器里现在的 hog.py；只展示，不判题</span>
      </div>

      <div className="ide-hog-scores">
        {[0, 1].map((p) => (
          <div key={p} className={`ide-hog-player${state.who === p && !state.over ? " is-turn" : ""}${winner === p ? " is-win" : ""}`}>
            <span>{p === 1 && opponent !== "human" ? "玩家 1（电脑）" : NAMES[p]}</span>
            <strong>{state.scores[p]}</strong>
          </div>
        ))}
      </div>

      {state.over ? (
        <p className="ide-hog-status">游戏结束：{winner === 0 ? NAMES[0] : "玩家 1"} 先到 {GOAL} 分。</p>
      ) : (
        <div className="ide-hog-roll">
          <span>
            轮到{state.who === 0 ? NAMES[0] : "玩家 1"}，掷几个骰子？（0 个 = Boar Brawl）
          </span>
          <div className="ide-hog-buttons">
            {Array.from({ length: 11 }, (_, n) => (
              <button key={n} className="ide-btn" onClick={() => void roll(n)} disabled={busy || (state.who === 1 && opponent !== "human")}>
                {n}
              </button>
            ))}
          </div>
          {busy && <span className="ide-muted">运行中…（第一次要下载 Python 运行环境，稍等）</span>}
        </div>
      )}

      {error && <pre className="ide-error ide-pre">{error}</pre>}

      <ol className="ide-hog-log">
        {log.map((l, i) => (
          <li key={i}>
            <span className="ide-hog-who">{l.who === 0 ? "玩家 0" : "玩家 1"}</span>
            {l.num === 0 ? "Boar Brawl" : `掷 ${l.num} 个`}
            <span className="ide-hog-dice">{l.dice.map((d) => DICE[d] ?? d).join(" ")}</span>
            <span className="ide-muted">
              {l.before[0]} : {l.before[1]} → {l.after[0]} : {l.after[1]}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
