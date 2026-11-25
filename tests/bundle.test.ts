import { expect, test } from "bun:test";
import { build } from "esbuild";

test("首屏不静态加载后台、讲义和协会页面，页面样式仍随入口提供", async () => {
  const result = await build({
    entryPoints: ["src/client/main.tsx"],
    bundle: true,
    format: "esm",
    splitting: true,
    minify: true,
    jsx: "automatic",
    target: ["es2022", "safari16"],
    outdir: "dist/bundle-test",
    external: ["/fonts/*"],
    loader: { ".woff2": "file", ".woff": "file", ".ttf": "file" },
    define: { "process.env.NODE_ENV": '"production"' },
    metafile: true,
    write: false,
  });
  const outputs = result.metafile.outputs;
  const entry = Object.keys(outputs).find((p) => outputs[p].entryPoint === "src/client/main.tsx" && p.endsWith(".js"))!;
  expect(entry).toBeDefined();
  const initial = new Set<string>();
  function visit(path: string) {
    if (initial.has(path)) return;
    initial.add(path);
    for (const item of outputs[path].imports) {
      if (!item.external && item.kind === "import-statement") visit(item.path);
    }
  }
  visit(entry);
  const modules = new Set([...initial].flatMap((p) => Object.keys(outputs[p].inputs)));
  expect(modules.has("src/client/pages/Home.tsx")).toBe(true);
  expect(modules.has("src/client/pages/Login.tsx")).toBe(true);
  for (const page of ["About", "AdminApplications", "AdminPins", "Report", "Format", "Lesson", "Course", "Courses", "Attendance", "Notices", "Profile", "admin/Members", "admin/Today", "admin/Notices", "admin/Settings"]) {
    const input = `src/client/pages/${page}.tsx`;
    expect(modules.has(input)).toBe(false);
    expect(Object.values(outputs).some((o) => o.entryPoint === input)).toBe(true);
  }
  expect([...modules].some((p) => p.startsWith("node_modules/zod/"))).toBe(false);
  expect(modules.has("src/client/markdown.ts")).toBe(false);
  const cssBundle = outputs[entry].cssBundle!;
  expect(outputs[cssBundle].inputs["src/client/styles/about.css"]).toBeDefined();
});
