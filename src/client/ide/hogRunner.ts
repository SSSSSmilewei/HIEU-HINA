/**
 * Hog 试玩（故事 3.3）：在 Web Worker 里用 Pyodide 运行学员自己的 hog.py，只展示、不判题。
 * 做法和官方 hog_gui.py 一样：每走一步，都把「到目前为止的每一步选择和掷出的点数」重放一遍，
 * 用学员的 play() 算出现在的分数；所以学员写的规则（Boar Brawl、Sus Fuss）就是游戏的规则。
 * 死循环或太慢就结束 Worker，下次再新建。Pyodide 和练手题同一个版本，浏览器缓存共用。
 */

const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/";
const TIMEOUT_MS = 8_000;
/** 第一次要下载 Pyodide，多给一些时间 */
const FIRST_TIMEOUT_MS = 60_000;

const GLUE = `
import importlib, json, os, sys

class _Stop(Exception):
    pass

def _load(files):
    os.makedirs("/home/pyodide/hog", exist_ok=True)
    for path, content in files.items():
        with open("/home/pyodide/hog/" + path, "w") as f:
            f.write(content)
    if "/home/pyodide/hog" not in sys.path:
        sys.path.insert(0, "/home/pyodide/hog")
    for name in ("hog", "dice", "ucb"):
        sys.modules.pop(name, None)
    import hog, dice
    return hog, dice

def take_turn(files, prev_rolls, moves, goal, sus):
    hog, dice = _load(files)
    fair = dice.make_fair_dice(6)
    rolls = []
    def logged():
        out = prev_rolls[len(rolls)] if len(rolls) < len(prev_rolls) else fair()
        rolls.append(out)
        return out
    st = {"scores": [0, 0], "who": 0, "n": 0}
    def strategy_for(player):
        def strategy(*scores):
            st["scores"] = list(scores[::-1]) if player else list(scores)
            st["who"] = player
            if st["n"] == len(moves):
                raise _Stop()
            m = moves[st["n"]]
            st["n"] += 1
            return m
        return strategy
    over = False
    try:
        final = hog.play(strategy_for(0), strategy_for(1), hog.sus_update if sus else hog.simple_update, 0, 0, dice=logged, goal=goal)
        st["scores"] = list(final[:2])
        over = True
    except _Stop:
        pass
    return json.dumps({"rolls": rolls, "scores": st["scores"], "who": st["who"], "over": over})

def strategy(files, name, my_score, opponent_score):
    hog, _ = _load(files)
    return int(getattr(hog, name)(my_score, opponent_score))
`;

const WORKER = `
importScripts(${JSON.stringify(`${PYODIDE}pyodide.js`)});
let py = null;
const ready = (async () => {
  py = await loadPyodide({ indexURL: ${JSON.stringify(PYODIDE)} });
  py.runPython(${JSON.stringify(GLUE)});
})();
onmessage = async (e) => {
  const m = e.data;
  try { await ready; } catch (err) { postMessage({ error: "Python 运行环境加载失败：" + (err && err.message || err) }); return; }
  let out = "";
  py.setStdout({ batched: (s) => { out += s + "\\n"; } });
  py.setStderr({ batched: (s) => { out += s + "\\n"; } });
  try {
    py.globals.set("_m", py.toPy(m));
    const res = m.type === "turn"
      ? py.runPython("take_turn(_m['files'], list(_m['prevRolls']), list(_m['moves']), _m['goal'], _m['sus'])")
      : py.runPython("strategy(_m['files'], _m['name'], _m['scores'][0], _m['scores'][1])");
    postMessage({ result: m.type === "turn" ? JSON.parse(res) : res, output: out });
  } catch (err) {
    postMessage({ error: String(err && err.message || err).split("\\n").slice(-8).join("\\n"), output: out });
  }
};`;

export interface TurnState {
  /** 到目前为止掷出的全部点数（按顺序） */
  rolls: number[];
  /** [玩家 0 的分数, 玩家 1 的分数] */
  scores: [number, number];
  /** 现在轮到谁 */
  who: 0 | 1;
  over: boolean;
}

let worker: Worker | null = null;
let started = false;

function call<T>(msg: object): Promise<{ result: T; output: string }> {
  if (!worker) worker = new Worker(URL.createObjectURL(new Blob([WORKER], { type: "text/javascript" })));
  const w = worker;
  const limit = started ? TIMEOUT_MS : FIRST_TIMEOUT_MS;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      w.terminate();
      worker = null;
      started = false;
      reject(new Error(`运行超过 ${limit / 1000} 秒还没结束，可能是代码里有死循环`));
    }, limit);
    w.onmessage = (e: MessageEvent<{ result?: T; output?: string; error?: string }>) => {
      clearTimeout(timer);
      started = true;
      if (e.data.error) reject(new Error(e.data.error + (e.data.output ? `\n${e.data.output}` : "")));
      else resolve({ result: e.data.result as T, output: e.data.output ?? "" });
    };
    w.postMessage(msg);
  });
}

export function hogTurn(files: Record<string, string>, prevRolls: number[], moves: number[], goal: number, sus: boolean) {
  return call<TurnState>({ type: "turn", files, prevRolls, moves, goal, sus });
}

export function hogStrategy(files: Record<string, string>, name: string, scores: [number, number]) {
  return call<number>({ type: "strategy", files, name, scores });
}
