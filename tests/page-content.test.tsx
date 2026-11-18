import { expect, test } from "bun:test";
import { JSDOM } from "jsdom";
import { act, lazy } from "react";
import { createRoot } from "react-dom/client";
import { PageContent } from "../src/client/components/PageContent";

test("页面分块等待、成功、失败和切换时均保留边界外的导航", async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost/" });
  const globals = { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true };
  const previous = Object.fromEntries(Object.keys(globals).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  const root = createRoot(dom.window.document.getElementById("root")!, { onCaughtError: () => {} });
  try {
    let resolve!: (module: { default: () => React.JSX.Element }) => void;
    const Page = lazy(() => new Promise<{ default: () => React.JSX.Element }>((done) => { resolve = done; }));
    await act(async () => {
      root.render(<><nav>导航</nav><PageContent><Page /></PageContent></>);
    });
    expect(dom.window.document.querySelector("nav")?.textContent).toBe("导航");
    expect(dom.window.document.querySelector('[aria-label="正在加载"]')).not.toBeNull();
    await act(async () => { resolve({ default: () => <main>课程内容</main> }); });
    expect(dom.window.document.querySelector("main")?.textContent).toBe("课程内容");
    expect(dom.window.document.querySelector('[aria-label="正在加载"]')).toBeNull();

    const BrokenPage = lazy(() => Promise.reject(new Error("分块下载失败")));
    await act(async () => {
      root.render(<><nav>导航</nav><PageContent key="broken"><BrokenPage /></PageContent></>);
    });
    expect(dom.window.document.querySelector("nav")?.textContent).toBe("导航");
    expect(dom.window.document.querySelector('[role="alert"]')?.textContent).toContain("页面加载失败");
    expect(dom.window.document.querySelector("button")?.textContent).toContain("再试一次");
    await act(async () => {
      root.render(<><nav>导航</nav><PageContent key="next"><main>其他页面</main></PageContent></>);
    });
    expect(dom.window.document.querySelector("main")?.textContent).toBe("其他页面");
    expect(dom.window.document.querySelector('[role="alert"]')).toBeNull();
  } finally {
    await act(async () => root.unmount());
    for (const key of Object.keys(globals)) {
      if (previous[key]) Object.defineProperty(globalThis, key, previous[key]!);
      else Reflect.deleteProperty(globalThis, key);
    }
    dom.window.close();
  }
});
