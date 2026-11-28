/**
 * Monaco 编辑器（VSCode 的编辑器核心）单独打包成一个入口，只在打开做题界面时加载（见 ./monaco.ts）。
 * 只带做题要用的几种语言的高亮，不带 TypeScript / CSS / HTML 的语言服务，体积小很多。
 */
import "monaco-editor/esm/vs/editor/edcore.main.js";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/python/python.contribution.js";
import "monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution.js";
import "monaco-editor/esm/vs/basic-languages/java/java.contribution.js";
import "monaco-editor/esm/vs/basic-languages/sql/sql.contribution.js";
import "monaco-editor/esm/vs/basic-languages/scheme/scheme.contribution.js";
import "monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution.js";

export { monaco };
