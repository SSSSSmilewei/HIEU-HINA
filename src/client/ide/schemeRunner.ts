/**
 * Scheme 项目的交互式解释器（故事 3.3）：在 Web Worker 里用 Pyodide 运行学员自己写的解释器（scheme.py 等），
 * 和本地 python3 scheme.py -i 一样一行一行求值。只展示，不判题。
 * 环境（全局帧）在两次输入之间保留；代码改了或点「重新开始」就重新加载。
 */

const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/";
const TIMEOUT_MS = 8_000;
const FIRST_TIMEOUT_MS = 60_000;

const GLUE = `
import os, sys
_frame = None

def scheme_reset(files):
    global _frame
    os.makedirs("/home/pyodide/scheme", exist_ok=True)
    os.chdir("/home/pyodide/scheme")
    for path, content in files.items():
        full = "/home/pyodide/scheme/" + path
        os.makedirs(os.path.dirname(full), exist_ok=True)
        with open(full, "w") as f:
            f.write(content)
    if "/home/pyodide/scheme" not in sys.path:
        sys.path.insert(0, "/home/pyodide/scheme")
    for name in list(sys.modules):
        if name.startswith("scheme") or name in ("buffer", "ucb", "link"):
            sys.modules.pop(name, None)
    import scheme
    make = getattr(scheme, "create_global_frame_with_eval_apply", None) or scheme.create_global_frame
    _frame = make()

def scheme_line(line):
    import scheme
    exp = scheme.read_line(line)
    value = scheme.scheme_eval(exp, _frame)
    return None if value is None else scheme.repl_str(value)
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
    if (m.type === "reset") { py.runPython("scheme_reset(_m['files'])"); postMessage({ result: null, output: out }); return; }
    const value = py.runPython("scheme_line(_m['line'])");
    postMessage({ result: value === undefined ? null : value, output: out });
  } catch (err) {
    const msg = String(err && err.message || err).trim().split("\\n");
    postMessage({ error: msg[msg.length - 1].replace(/^[\\w.]*SchemeError: /, ""), output: out });
  }
};`;

let worker: Worker | null = null;
let started = false;

function call(msg: object): Promise<{ result: string | null; output: string; error?: string }> {
  if (!worker) worker = new Worker(URL.createObjectURL(new Blob([WORKER], { type: "text/javascript" })));
  const w = worker;
  const limit = started ? TIMEOUT_MS : FIRST_TIMEOUT_MS;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      w.terminate();
      worker = null;
      started = false;
      reject(new Error(`运行超过 ${limit / 1000} 秒还没结束，可能是死循环；解释器已重新开始`));
    }, limit);
    w.onmessage = (e: MessageEvent<{ result: string | null; output?: string; error?: string }>) => {
      clearTimeout(timer);
      started = true;
      resolve({ result: e.data.result ?? null, output: e.data.output ?? "", error: e.data.error });
    };
    w.postMessage(msg);
  });
}

export const schemeReset = (files: Record<string, string>) => call({ type: "reset", files });
export const schemeLine = (line: string) => call({ type: "line", line });
