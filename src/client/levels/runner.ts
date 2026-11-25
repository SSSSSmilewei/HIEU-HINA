/**
 * 闯关判题：在 Web Worker 里用 Pyodide 跑官方 ok 测试（判题器 /levels/ok_runner.py）。
 * 每次运行把学生的文件、只读文件和测试写进 /home/pyodide/work/<章目录>/，在那里运行。
 * 超时就结束 Worker（死循环也停得下来），下次再新建。Pyodide 和练手题用同一个版本，浏览器缓存可以共用。
 */

const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/";

export interface CaseFail {
  suite: number;
  case: number;
  /** 出错的那条语句 */
  code: string;
  /** 实际输出 */
  got: string;
  /** 期望输出（加密的行显示为说明文字） */
  want: string;
  /** 报错信息（没报错是 null） */
  error: string | null;
  /** 整个用例的原文，加密的行显示为 ？ */
  show: string;
}

export interface TestRun {
  name: string;
  ok: boolean;
  passed: number;
  total: number | null;
  fail: CaseFail | null;
}

export type UnlockItem =
  | { type: "choice"; question: string; choices: string[]; answer: string }
  | { type: "session"; steps: { code: string; want: { text: string | null; hash: string | null }[] }[] };

const WORKER = `
importScripts(${JSON.stringify(`${PYODIDE}pyodide.js`)});
let py = null;
const ready = (async () => {
  py = await loadPyodide({ indexURL: ${JSON.stringify(PYODIDE)} });
  const src = await (await fetch(self.RUNNER_URL)).text();
  py.FS.mkdirTree("/home/pyodide/runner");
  py.FS.writeFile("/home/pyodide/runner/ok_runner.py", src);
  py.runPython("import sys; sys.path.insert(0, '/home/pyodide/runner'); import ok_runner, json, os");
})();
function writeFiles(dir, files) {
  const base = "/home/pyodide/work/" + dir;
  try { py.FS.mkdirTree(base); } catch (e) {}
  for (const [path, content] of Object.entries(files)) {
    const full = "/home/pyodide/work/" + path;
    py.FS.mkdirTree(full.slice(0, full.lastIndexOf("/")));
    py.FS.writeFile(full, content);
  }
  return base;
}
onmessage = async (e) => {
  const m = e.data;
  try { await ready; } catch (err) { postMessage({ fatal: "Python 运行环境加载失败：" + (err && err.message || err) }); return; }
  postMessage({ loaded: true });
  try {
    let out = "", res;
    py.setStdout({ batched: (s) => { out += s + "\\n"; } });
    py.setStderr({ batched: (s) => { out += s + "\\n"; } });
    if (m.type === "run") {
      const base = writeFiles(m.dir, m.files);
      py.globals.set("_args", py.toPy({ base, test: "tests/" + m.test + ".py", key: m.key }));
      res = py.runPython("os.chdir(_args['base']); sys.path[:] = [p for p in sys.path if not p.startswith('/home/pyodide/work')]; sys.path.insert(0, _args['base']); json.dumps(ok_runner.run_test(_args['test'], _args['key']))");
    } else if (m.type === "items") {
      const base = writeFiles(m.dir, m.files);
      py.globals.set("_args", py.toPy({ test: base + "/tests/" + m.test + ".py" }));
      res = py.runPython("json.dumps(ok_runner.unlock_items(_args['test']))");
    } else if (m.type === "check") {
      py.globals.set("_args", py.toPy({ key: m.key, guesses: m.guesses }));
      res = py.runPython("json.dumps([ok_runner.check_guess(_args['key'], g['hash'], g['text'])['ok'] for g in _args['guesses']])");
    }
    postMessage({ result: JSON.parse(res), output: out });
  } catch (err) {
    postMessage({ error: String(err && err.message || err).split("\\n").slice(-8).join("\\n") });
  }
};`;

let worker: Worker | null = null;
let loaded = false;

function getWorker(): Worker {
  if (!worker) {
    const runner = new URL("/levels/ok_runner.py", location.href).href;
    const src = `self.RUNNER_URL = ${JSON.stringify(runner)};\n${WORKER}`;
    worker = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
  }
  return worker;
}

function kill() {
  worker?.terminate();
  worker = null;
  loaded = false;
}

const LOAD_MS = 120_000;
const RUN_MS = 20_000;

// biome-ignore lint/suspicious/noExplicitAny: Worker 消息
function call<T>(msg: unknown, onLoaded?: () => void): Promise<T> {
  const w = getWorker();
  return new Promise((resolve, reject) => {
    const fail = (m: string) => {
      clearTimeout(timer);
      w.onmessage = null;
      kill();
      reject(new Error(m));
    };
    let timer = setTimeout(() => fail("Python 运行环境加载太久了，请检查网络后再试"), loaded ? RUN_MS : LOAD_MS);
    // biome-ignore lint/suspicious/noExplicitAny: Worker 消息
    w.onmessage = (e: MessageEvent<any>) => {
      const d = e.data;
      if (d.loaded) {
        if (!loaded) {
          loaded = true;
          onLoaded?.();
        }
        clearTimeout(timer);
        timer = setTimeout(() => fail(`运行超过 ${RUN_MS / 1000} 秒，已经停止。代码里可能有死循环（例如循环条件一直成立）。`), RUN_MS);
        return;
      }
      clearTimeout(timer);
      w.onmessage = null;
      if (d.fatal) {
        kill();
        reject(new Error(d.fatal));
      } else if (d.error) reject(new Error(d.error));
      else resolve(d.result as T);
    };
    w.postMessage(msg);
  });
}

/** files 的键是相对课程仓库根目录的路径，如 hog/hog.py */
export function runTest(dir: string, test: string, key: string, files: Record<string, string>, onLoaded?: () => void) {
  return call<TestRun>({ type: "run", dir, test, key, files }, onLoaded);
}

export function unlockItems(dir: string, test: string, files: Record<string, string>) {
  return call<UnlockItem[]>({ type: "items", dir, test, files });
}

export function checkGuesses(key: string, guesses: { hash: string; text: string }[]) {
  return call<boolean[]>({ type: "check", key, guesses });
}

export function runtimeLoaded() {
  return loaded;
}
