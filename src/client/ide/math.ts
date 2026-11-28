import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * 题面里的数学公式：$行内$ 和 $$独立成行$$，用 KaTeX 渲染。
 * 先把公式换成占位符再交给 Markdown（免得 _ 和 * 被当成强调），渲染完再换回来。
 * 代码块和行内代码里的 $ 不当公式。
 */
const PLACEHOLDER = (i: number) => `HIANAMATH${i}X`;

export function renderWithMath(md: string, render: (md: string) => string): string {
  const formulas: { tex: string; display: boolean }[] = [];
  const parts = md.split(/(```[\s\S]*?```|`[^`\n]*`)/g);
  const protectedMd = parts
    .map((part, i) => {
      if (i % 2 === 1) return part; // 代码
      return part
        .replace(/\$\$([\s\S]+?)\$\$/g, (_m, tex: string) => {
          formulas.push({ tex, display: true });
          return `\n\n${PLACEHOLDER(formulas.length - 1)}\n\n`;
        })
        .replace(/(?<![\\$])\$([^$\n]+?)\$/g, (_m, tex: string) => {
          formulas.push({ tex, display: false });
          return PLACEHOLDER(formulas.length - 1);
        });
    })
    .join("");
  let html = render(protectedMd);
  formulas.forEach((f, i) => {
    const out = katex.renderToString(f.tex, { displayMode: f.display, throwOnError: false, output: "html" });
    html = html.replace(f.display ? new RegExp(`<p>${PLACEHOLDER(i)}</p>|${PLACEHOLDER(i)}`) : PLACEHOLDER(i), () => out);
  });
  return html;
}
