/** 按需加载 Monaco。打包时 scripts/build.mjs 把文件名写进 index.html 的 window.__HIANA_MONACO__。 */
export type Monaco = typeof import("monaco-editor/esm/vs/editor/editor.api.js");

interface Manifest {
  js: string;
  css: string;
  worker: string;
}

declare global {
  interface Window {
    __HIANA_MONACO__?: Manifest;
  }
}

let loading: Promise<Monaco> | null = null;

export function loadMonaco(): Promise<Monaco> {
  if (loading) return loading;
  const m = window.__HIANA_MONACO__;
  if (!m) return Promise.reject(new Error("编辑器没有打包进来"));
  // worker 是 ESM 打包的，要用模块 worker
  window.MonacoEnvironment = { getWorker: () => new Worker(m.worker, { type: "module" }) };
  if (!document.querySelector(`link[href="${m.css}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = m.css;
    document.head.appendChild(link);
  }
  loading = (import(/* @vite-ignore */ m.js) as Promise<{ monaco: Monaco }>).then((mod) => mod.monaco);
  loading.catch(() => {
    loading = null;
  });
  return loading;
}
