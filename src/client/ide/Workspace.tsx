import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api, ApiError, relativeTime } from "../api";
import { useAssignments, versionLabel } from "../ojIndex";
import { navigate } from "../router";
import { loginHref, useMe } from "../session";
import { type JudgeResult, VERDICT_TEXT, type Verdict } from "../../shared/judge";
import { LANGUAGE_LABEL, type Language } from "../../shared/problem";
import { type Monaco, loadMonaco } from "./monaco";
import { AiPanel } from "./AiPanel";
import { EnvDiagramPanel } from "./EnvDiagram";
import { HogPlay } from "./HogPlay";
import { SchemeRepl } from "./SchemeRepl";
import { WwpdPanel } from "./Wwpd";
import { fileForLanguage, monacoLanguage, type PublicProblem, type SubmissionBrief, type WorkspaceSource } from "./types";
import "./ide.css";

/**
 * 做题界面（故事 1.4）：左边题目，右上编辑器，右下终端。课程作业和刷题区共用。
 * 外观是独立的深色 IDE 风格（ide.css），不用平台的圆角玻璃组件。
 */

type Mode = "run" | "submit";
type LeftTab = "statement" | "submissions" | "ai";
type BottomTab = "result" | "output" | "input" | "play";
type Theme = "dark" | "light";

interface Layout {
  left: number;
  editor: number;
}

const LAYOUT_KEY = "hiana.ide.layout";
const THEME_KEY = "hiana.ide.theme";
const FONT_KEY = "hiana.ide.font";
const DRAFT_PREFIX = "hiana.ide.draft:";
const LANG_PREFIX = "hiana.ide.lang:";
const SAVE_DELAY_MS = 500;
const MIN_PANE = 0.2;
const MAX_PANE = 0.8;
const DEFAULT_LAYOUT: Layout = { left: 0.4, editor: 0.62 };
const FONT_SIZES = [12, 13, 14, 15, 16, 18];
const DEFAULT_FONT = 14;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}
function readString(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeString(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* 隐私模式等存不了，不影响做题 */
  }
}
const clamp = (x: number) => Math.min(MAX_PANE, Math.max(MIN_PANE, x));

/** 这份作业 / 这道题在草稿和判题里用的编号 */
function scopeOf(src: WorkspaceSource): string {
  return src.kind === "assignment" ? `${src.course}/${src.assignment.id}` : src.problem.id;
}
function judgeId(src: WorkspaceSource, p: PublicProblem): string {
  return src.kind === "assignment" ? `${src.course}/${src.assignment.id}/${p.id}` : p.id;
}

const VERDICT_CLASS: Record<Verdict, string> = { AC: "ok", WA: "bad", TLE: "warn", MLE: "warn", OLE: "warn", RE: "bad", CE: "info", SE: "info" };

export function Workspace({ source, problemId }: { source: WorkspaceSource; problemId?: string }) {
  const { me } = useMe();
  const problems = source.kind === "assignment" ? source.assignment.problems : [source.problem];
  const problem = problems.find((p) => p.id === problemId) ?? problems[0]!;
  const index = problems.indexOf(problem);
  const scope = scopeOf(source);
  const initialFiles = useMemo(() => Object.fromEntries((source.kind === "assignment" ? source.assignment.files : source.problem.files).map((f) => [f.path, f.content])), [source]);
  const editableAll = useMemo(() => new Set(problems.flatMap((p) => p.editable)), [problems]);

  const [files, setFiles] = useState<Record<string, string>>(() => ({ ...initialFiles, ...readJson<Record<string, string>>(DRAFT_PREFIX + scope, {}) }));
  const [language, setLanguage] = useState<Language>(() => {
    const saved = readString(LANG_PREFIX + scope) as Language | null;
    return saved && problem.languages.includes(saved) ? saved : problem.languages[0]!;
  });
  const lang = problem.languages.includes(language) ? language : problem.languages[0]!;
  const isIo = problem.tests.kind === "io";
  /** 编辑器里显示哪些文件：输入输出题只显示当前语言的那个；作业显示全部（只读的也能看） */
  const visible = useMemo(() => (source.kind === "problem" ? [fileForLanguage(problem, lang)] : Object.keys(files).sort(sortFiles)), [source.kind, problem, lang, files]);
  const focusFile = problem.focus?.file ?? (isIo ? fileForLanguage(problem, lang) : problem.editable[0] ?? "");
  const [active, setActive] = useState(focusFile);
  const [openTabs, setOpenTabs] = useState<string[]>(() => [focusFile]);

  const [layout, setLayout] = useState<Layout>(() => readJson(LAYOUT_KEY, DEFAULT_LAYOUT));
  const [theme, setTheme] = useState<Theme>(() => (readString(THEME_KEY) === "light" ? "light" : "dark"));
  const [fontSize, setFontSize] = useState(() => Number(readString(FONT_KEY)) || DEFAULT_FONT);
  const [leftTab, setLeftTab] = useState<LeftTab>("statement");
  const [bottomTab, setBottomTab] = useState<BottomTab>("result");
  const [busy, setBusy] = useState<Mode | null>(null);
  const [result, setResult] = useState<{ mode: Mode; result: JudgeResult; at: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** 最近一次提交（AI 评阅用），按题记 */
  const [lastSubmission, setLastSubmission] = useState<Record<string, string>>({});
  const [stdin, setStdin] = useState("");
  const [useStdin, setUseStdin] = useState(false);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  /** 预测输出题填的答案：题目编号 → 按顺序的每个空 */
  const [answers, setAnswers] = useState<Record<string, string[]>>(() => readJson(`${DRAFT_PREFIX}${scope}:wwpd`, {}));
  const isWwpd = problem.kind === "wwpd";
  /** 能在浏览器里试玩的项目（故事 3.3）：Hog 玩一局，Scheme 项目开交互式解释器 */
  const playKind = source.kind === "assignment" && source.course === "cs61a" && (source.assignment.id === "hog" || source.assignment.id === "scheme") ? source.assignment.id : null;
  const canPlay = playKind !== null;
  /** 试玩用的文件：编辑器里现在的代码（含没提交的草稿），不要测试和网页编辑器的文件 */
  const playFiles = () =>
    Object.fromEntries(Object.keys(initialFiles).filter((p) => /\.(py|scm)$/.test(p) && !p.startsWith("tests/") && !p.startsWith("editor/")).map((p) => [p, files[p] ?? initialFiles[p] ?? ""]));
  /** 环境图题：和预测输出题一样不写代码，作答存在 answers 里 */
  const isEnv = problem.kind === "envdiagram";
  useEffect(() => {
    const t = setTimeout(() => writeString(`${DRAFT_PREFIX}${scope}:wwpd`, JSON.stringify(answers)), SAVE_DELAY_MS);
    return () => clearTimeout(t);
  }, [answers, scope]);

  // 换题：编辑器跳到这道题要改的文件和函数
  useEffect(() => {
    setActive(focusFile);
    setOpenTabs((t) => (t.includes(focusFile) ? t : [...t, focusFile]));
    setResult(null);
    setError(null);
  }, [problem.id, focusFile]);

  // 草稿：停手半秒后存进浏览器，只存可改的文件
  useEffect(() => {
    const t = setTimeout(() => {
      const draft = Object.fromEntries(Object.entries(files).filter(([p, c]) => editableAll.has(p) && c !== initialFiles[p]));
      writeString(DRAFT_PREFIX + scope, JSON.stringify(draft));
    }, SAVE_DELAY_MS);
    return () => clearTimeout(t);
  }, [files, scope, editableAll, initialFiles]);

  useEffect(() => writeString(LAYOUT_KEY, JSON.stringify(layout)), [layout]);
  useEffect(() => writeString(THEME_KEY, theme), [theme]);
  useEffect(() => writeString(FONT_KEY, String(fontSize)), [fontSize]);
  useEffect(() => writeString(LANG_PREFIX + scope, lang), [lang, scope]);

  // 通过了哪些题（左上角题目列表打勾）
  const refreshSolved = useCallback(() => {
    if (!me.role) return;
    const prefix = source.kind === "assignment" ? `${scope}/` : scope;
    api<{ solved: { problem: string }[] }>(`/api/oj/solved?prefix=${encodeURIComponent(prefix)}`)
      .then((r) => setSolved(new Set(r.solved.map((s) => s.problem))))
      .catch(() => undefined);
  }, [me.role, scope, source.kind]);
  useEffect(refreshSolved, [refreshSolved]);

  const judge = useCallback(
    async (mode: Mode) => {
      if (busy) return;
      if (mode === "submit" && !me.role) {
        navigate(loginHref(location.pathname));
        return;
      }
      setBusy(mode);
      setError(null);
      setBottomTab(mode === "run" && isIo && useStdin ? "output" : "result");
      const submitted = Object.fromEntries(problem.editable.map((p) => [p, files[p] ?? initialFiles[p] ?? ""]));
      const body = {
        problem: judgeId(source, problem),
        language: lang,
        files: submitted,
        ...(mode === "run" && isIo && useStdin ? { stdin } : {}),
        ...(isWwpd || isEnv ? { answers: answers[problem.id] ?? [] } : {}),
      };
      try {
        const r = await api<{ result: JudgeResult; id?: string }>(`/api/oj/${mode}`, { body });
        setResult({ mode, result: r.result, at: Date.now() });
        if (mode === "submit") {
          setSubmissionsKey((k) => k + 1);
          if (r.id) setLastSubmission((m) => ({ ...m, [body.problem]: r.id! }));
          if (r.result.verdict === "AC") refreshSolved();
        }
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "出错了，请稍后再试");
      } finally {
        setBusy(null);
      }
    },
    [busy, me.role, isIo, useStdin, problem, files, initialFiles, source, lang, stdin, refreshSolved, isWwpd, isEnv, answers],
  );
  const [submissionsKey, setSubmissionsKey] = useState(0);

  // 快捷键：Ctrl+Enter 运行，Ctrl+Shift+Enter 提交（编辑器里也注册了同样的快捷键）
  const judgeRef = useRef(judge);
  judgeRef.current = judge;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        void judgeRef.current(e.shiftKey ? "submit" : "run");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 整页固定在视口里，离开时恢复页面滚动
  useEffect(() => {
    document.documentElement.classList.add("ide-open");
    return () => document.documentElement.classList.remove("ide-open");
  }, []);

  const go = (p: PublicProblem) => {
    if (source.kind === "assignment") navigate(`/courses/${source.course}/hw/${source.assignment.id}/${p.id}`);
  };
  const resetFile = () => {
    if (!editableAll.has(active)) return;
    if (!confirm(`把 ${active} 恢复成起始代码？你写的内容会被覆盖。`)) return;
    setFiles((f) => ({ ...f, [active]: initialFiles[active] ?? "" }));
  };

  const title = source.kind === "assignment" ? source.assignment.title : problem.title;
  const back = source.kind === "assignment" ? `/courses/${source.course}` : "/oj";

  return (
    <div className="ide" data-ide-theme={theme} style={{ ["--ide-font-size" as string]: `${fontSize}px` }}>
      <header className="ide-top">
        <a className="ide-brand" href={back} onClick={(e) => (e.preventDefault(), navigate(back))} title="返回">
          <span className="ide-brand-mark">HI·NA</span>
          <span className="ide-brand-sub">{source.kind === "assignment" ? source.course.toUpperCase() : "OJ"}</span>
        </a>
        <nav className="ide-crumbs" aria-label="位置">
          <span>{title}</span>
          {source.kind === "assignment" && (
            <>
              <VersionSelect course={source.course} id={source.assignment.id} item={source.assignment.item ?? source.assignment.id} />
              <span className="ide-sep">/</span>
              <select className="ide-select" value={problem.id} onChange={(e) => go(problems.find((p) => p.id === e.target.value)!)} aria-label="切换题目">
                {problems.map((p, i) => (
                  <option key={p.id} value={p.id}>
                    {solved.has(judgeId(source, p)) ? "✓ " : ""}
                    {i + 1}. {p.title}
                  </option>
                ))}
              </select>
              <button className="ide-icon" disabled={index <= 0} onClick={() => go(problems[index - 1]!)} title="上一题" aria-label="上一题">
                ‹
              </button>
              <button className="ide-icon" disabled={index >= problems.length - 1} onClick={() => go(problems[index + 1]!)} title="下一题" aria-label="下一题">
                ›
              </button>
            </>
          )}
        </nav>
        <div className="ide-actions">
          <button className="ide-btn" onClick={() => void judge("run")} disabled={!!busy} title="运行（Ctrl+Enter）">
            {busy === "run" ? "运行中…" : "▶ 运行"}
          </button>
          <button className="ide-btn ide-btn-primary" onClick={() => void judge("submit")} disabled={!!busy} title="提交（Ctrl+Shift+Enter）">
            {busy === "submit" ? "判题中…" : me.role ? "提交" : "登录后提交"}
          </button>
        </div>
        <div className="ide-tools">
          {problem.languages.length > 1 && (
            <select className="ide-select" value={lang} onChange={(e) => setLanguage(e.target.value as Language)} aria-label="语言">
              {problem.languages.map((l) => (
                <option key={l} value={l}>
                  {LANGUAGE_LABEL[l]}
                </option>
              ))}
            </select>
          )}
          {problem.languages.length === 1 && <span className="ide-chip">{LANGUAGE_LABEL[lang]}</span>}
          <select className="ide-select" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} aria-label="字号">
            {FONT_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}px
              </option>
            ))}
          </select>
          <button className="ide-icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title={theme === "dark" ? "浅色" : "深色"} aria-label="切换深浅色">
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
      </header>

      <div className="ide-main" style={{ ["--ide-left" as string]: `${layout.left * 100}%`, ["--ide-editor" as string]: `${layout.editor * 100}%` }}>
        <section className="ide-pane ide-left" aria-label="题目">
          <div className="ide-tabs" role="tablist">
            <Tab on={leftTab === "statement"} onClick={() => setLeftTab("statement")}>
              题目描述
            </Tab>
            <Tab on={leftTab === "submissions"} onClick={() => setLeftTab("submissions")}>
              提交记录
            </Tab>
            <Tab on={leftTab === "ai"} onClick={() => setLeftTab("ai")}>
              AI 助教
            </Tab>
          </div>
          <div className="ide-scroll">
            {leftTab === "statement" ? (
              <Statement problem={problem} index={source.kind === "assignment" ? index + 1 : null} solved={solved.has(judgeId(source, problem))} intro={source.kind === "assignment" && index === 0 ? source.assignment.intro : ""} />
            ) : leftTab === "ai" ? (
              <AiPanel
                problem={judgeId(source, problem)}
                files={Object.fromEntries(problem.editable.map((p) => [p, files[p] ?? initialFiles[p] ?? ""]))}
                result={result?.result ?? null}
                submission={lastSubmission[judgeId(source, problem)] ?? null}
                loggedIn={!!me.role}
              />
            ) : (
              <Submissions key={submissionsKey} problem={judgeId(source, problem)} loggedIn={!!me.role} onLoad={(f) => setFiles((old) => ({ ...old, ...f }))} />
            )}
          </div>
        </section>

        <Splitter dir="x" onDrag={(r) => setLayout((l) => ({ ...l, left: clamp(r) }))} />

        <section className="ide-right">
          <div className="ide-pane ide-editor-pane">
            {isWwpd || isEnv ? (
              <>
                <div className="ide-tabs" role="tablist">
                  <Tab on onClick={() => undefined}>
                    {isEnv ? "环境图" : "预测输出"}
                  </Tab>
                </div>
                <div className="ide-scroll">
                  {isEnv && problem.tests.kind === "envdiagram" ? (
                    <EnvDiagramPanel
                      code={problem.tests.code}
                      answers={answers[problem.id] ?? []}
                      onChange={(a) => setAnswers((all) => ({ ...all, [problem.id]: a }))}
                      cases={result && result.result.cases.length ? result.result.cases : null}
                    />
                  ) : (
                    <WwpdPanel
                      items={problem.unlock ?? []}
                      answers={answers[problem.id] ?? []}
                      onChange={(a) => setAnswers((all) => ({ ...all, [problem.id]: a }))}
                      cases={result && result.result.cases.length ? result.result.cases : null}
                    />
                  )}
                </div>
              </>
            ) : (
              <>
            <div className="ide-tabs ide-file-tabs" role="tablist">
              {openTabs.filter((t) => visible.includes(t)).map((t) => (
                <Tab key={t} on={t === active} onClick={() => setActive(t)}>
                  <span className={editableAll.has(t) ? "" : "ide-readonly"}>{t}</span>
                  {t !== focusFile && (
                    <span
                      className="ide-tab-close"
                      role="button"
                      aria-label={`关闭 ${t}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenTabs((o) => o.filter((x) => x !== t));
                        if (active === t) setActive(focusFile);
                      }}
                    >
                      ×
                    </span>
                  )}
                </Tab>
              ))}
              <span className="ide-tabs-fill" />
              {editableAll.has(active) && (
                <button className="ide-link" onClick={resetFile} title="恢复成起始代码">
                  恢复初始代码
                </button>
              )}
            </div>
            <div className="ide-editor-body">
              {visible.length > 1 && (
                <FileTree
                  files={visible}
                  active={active}
                  editable={editableAll}
                  onOpen={(f) => {
                    setActive(f);
                    setOpenTabs((o) => (o.includes(f) ? o : [...o, f]));
                  }}
                />
              )}
              <Editor
                path={active}
                value={files[active] ?? ""}
                readOnly={!editableAll.has(active)}
                theme={theme}
                fontSize={fontSize}
                focusSymbol={active === focusFile ? problem.focus?.symbol : undefined}
                onChange={(v) => setFiles((f) => ({ ...f, [active]: v }))}
                onRun={() => void judgeRef.current("run")}
                onSubmit={() => void judgeRef.current("submit")}
              />
            </div>
              </>
            )}
          </div>

          <Splitter dir="y" onDrag={(r) => setLayout((l) => ({ ...l, editor: clamp(r) }))} />

          <div className="ide-pane ide-console">
            <div className="ide-tabs" role="tablist">
              <Tab on={bottomTab === "result"} onClick={() => setBottomTab("result")}>
                测试结果
              </Tab>
              <Tab on={bottomTab === "output"} onClick={() => setBottomTab("output")}>
                输出
              </Tab>
              {isIo && (
                <Tab on={bottomTab === "input"} onClick={() => setBottomTab("input")}>
                  自定义输入
                </Tab>
              )}
              {canPlay && (
                <Tab on={bottomTab === "play"} onClick={() => setBottomTab("play")}>
                  试玩
                </Tab>
              )}
              <span className="ide-tabs-fill" />
              {result && <span className="ide-muted">{result.mode === "run" ? "运行" : "提交"} · {relativeTime(result.at)}</span>}
            </div>
            <div className="ide-scroll ide-console-body">
              {bottomTab === "play" && canPlay ? (
                playKind === "hog" ? <HogPlay files={playFiles()} /> : <SchemeRepl files={playFiles()} />
              ) : bottomTab === "input" ? (
                <div className="ide-stdin">
                  <label className="ide-check">
                    <input type="checkbox" checked={useStdin} onChange={(e) => setUseStdin(e.target.checked)} />
                    「运行」时用下面的输入（只运行，不判对错）
                  </label>
                  <textarea className="ide-textarea" value={stdin} onChange={(e) => setStdin(e.target.value)} spellCheck={false} placeholder="在这里写输入" />
                </div>
              ) : error ? (
                <div className="ide-error">{error}</div>
              ) : busy ? (
                <div className="ide-muted ide-pad">{busy === "run" ? "正在运行…" : "正在判题…"}</div>
              ) : !result ? (
                <div className="ide-muted ide-pad">点「运行」用公开用例试一试；点「提交」跑全部用例（包括隐藏用例）。快捷键 Ctrl+Enter / Ctrl+Shift+Enter。</div>
              ) : bottomTab === "output" ? (
                <Output result={result.result} />
              ) : (
                <ResultView result={result.result} mode={result.mode} />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/** 文件排序：可改的源文件在前，tests/ 和配置在后 */
function sortFiles(a: string, b: string): number {
  const rank = (p: string) => (p.includes("/") ? 2 : p.endsWith(".py") || p.endsWith(".scm") || p.endsWith(".sql") ? 0 : 1);
  return rank(a) - rank(b) || a.localeCompare(b);
}

function Tab({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button role="tab" aria-selected={on} className={`ide-tab${on ? " is-on" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

function Splitter({ dir, onDrag }: { dir: "x" | "y"; onDrag: (ratio: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    e.preventDefault();
    const box = parent.getBoundingClientRect();
    const move = (ev: PointerEvent) => onDrag(dir === "x" ? (ev.clientX - box.left) / box.width : (ev.clientY - box.top) / box.height);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      document.documentElement.classList.remove("ide-dragging");
    };
    document.documentElement.classList.add("ide-dragging");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return <div ref={ref} className={`ide-split ide-split-${dir}`} onPointerDown={onPointerDown} role="separator" aria-orientation={dir === "x" ? "vertical" : "horizontal"} />;
}

function FileTree({ files, active, editable, onOpen }: { files: string[]; active: string; editable: Set<string>; onOpen: (f: string) => void }) {
  // 按目录分组：根目录的文件在前，子目录（如 tests/）各一组，目录名单独一行
  const rows: { dir?: string; file?: string; depth: number }[] = [];
  let lastDir = "";
  for (const f of files) {
    const dir = f.includes("/") ? f.slice(0, f.lastIndexOf("/")) : "";
    if (dir && dir !== lastDir) rows.push({ dir, depth: dir.split("/").length - 1 });
    lastDir = dir;
    rows.push({ file: f, depth: dir ? dir.split("/").length : 0 });
  }
  return (
    <nav className="ide-tree" aria-label="文件">
      <div className="ide-tree-head">文件</div>
      {rows.map((r) =>
        r.dir ? (
          <div key={`d:${r.dir}`} className="ide-tree-dir" style={{ paddingLeft: `${12 + r.depth * 12}px` }}>
            ▾ {r.dir.split("/").pop()}/
          </div>
        ) : (
          <button
            key={r.file}
            className={`ide-tree-item${r.file === active ? " is-on" : ""}${editable.has(r.file!) ? "" : " ide-readonly"}`}
            style={{ paddingLeft: `${12 + r.depth * 12}px` }}
            onClick={() => onOpen(r.file!)}
            title={editable.has(r.file!) ? r.file : `${r.file}（只读）`}
          >
            {r.file!.split("/").pop()}
            {!editable.has(r.file!) && <span className="ide-tree-lock">只读</span>}
          </button>
        ),
      )}
    </nav>
  );
}

/** Monaco 编辑器：每个文件一个 model，切换文件时换 model，撤销记录各自保留 */
function Editor(props: {
  path: string;
  value: string;
  readOnly: boolean;
  theme: Theme;
  fontSize: number;
  focusSymbol?: string;
  onChange: (v: string) => void;
  onRun: () => void;
  onSubmit: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [monaco, setMonaco] = useState<Monaco | null>(null);
  const [failed, setFailed] = useState(false);
  const editor = useRef<import("monaco-editor/esm/vs/editor/editor.api.js").editor.IStandaloneCodeEditor | null>(null);
  const cb = useRef(props);
  cb.current = props;

  useEffect(() => {
    let alive = true;
    loadMonaco().then((m) => alive && setMonaco(m), () => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!monaco || !host.current) return;
    const ed = monaco.editor.create(host.current, {
      automaticLayout: true,
      minimap: { enabled: false },
      fontFamily: getComputedStyle(document.documentElement).getPropertyValue("--font-mono") || "monospace",
      fontLigatures: false,
      tabSize: 4,
      insertSpaces: true,
      scrollBeyondLastLine: false,
      renderWhitespace: "selection",
      smoothScrolling: true,
      padding: { top: 8 },
      bracketPairColorization: { enabled: true },
      stickyScroll: { enabled: false },
    });
    ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => cb.current.onRun());
    ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => cb.current.onSubmit());
    const sub = ed.onDidChangeModelContent(() => {
      const v = ed.getValue();
      if (v !== cb.current.value) cb.current.onChange(v);
    });
    editor.current = ed;
    return () => {
      sub.dispose();
      ed.dispose();
      editor.current = null;
    };
  }, [monaco]);

  // 切换文件：找到或建这个文件的 model
  useEffect(() => {
    const ed = editor.current;
    if (!monaco || !ed) return;
    const uri = monaco.Uri.parse(`file:///${props.path}`);
    let model = monaco.editor.getModel(uri);
    if (!model) model = monaco.editor.createModel(props.value, monacoLanguage(props.path), uri);
    if (ed.getModel() !== model) ed.setModel(model);
    ed.updateOptions({ readOnly: props.readOnly, readOnlyMessage: { value: "这个文件是只读的（官方的测试或配置）" } });
    if (props.focusSymbol) {
      const m = model.findMatches(`def ${props.focusSymbol}(`, false, false, true, null, false)[0] ?? model.findMatches(props.focusSymbol, false, false, true, null, false)[0];
      if (m) {
        ed.revealLineInCenter(m.range.startLineNumber);
        ed.setPosition({ lineNumber: m.range.startLineNumber + 1, column: 1 });
      }
    }
    ed.focus();
    // eslint 不在这里；value 的同步在下一个 effect
  }, [monaco, props.path, props.readOnly, props.focusSymbol]); // eslint-disable-line react-hooks/exhaustive-deps

  // 外面改了内容（恢复初始代码、载入历史提交）：同步进 model
  useEffect(() => {
    const ed = editor.current;
    const model = ed?.getModel();
    if (model && model.getValue() !== props.value) model.pushEditOperations([], [{ range: model.getFullModelRange(), text: props.value }], () => null);
  }, [props.value]);

  useEffect(() => {
    monaco?.editor.setTheme(props.theme === "dark" ? "vs-dark" : "vs");
  }, [monaco, props.theme]);
  useEffect(() => {
    editor.current?.updateOptions({ fontSize: props.fontSize });
  }, [monaco, props.fontSize]);

  return (
    <div className="ide-editor" ref={host}>
      {!monaco && <div className="ide-muted ide-pad">{failed ? "编辑器加载失败，请刷新页面。" : "正在加载编辑器…"}</div>}
    </div>
  );
}

function Statement({ problem, index, solved, intro }: { problem: PublicProblem; index: number | null; solved: boolean; intro: string }) {
  const [html, setHtml] = useState<{ body: string; intro: string; explain: string } | null>(null);
  const [hint, setHint] = useState(0);
  useEffect(() => {
    let alive = true;
    setHint(0);
    Promise.all([import("../markdown"), import("./math")]).then(([{ renderMarkdown }, { renderWithMath }]) => {
      const md = (text: string) => renderWithMath(text, renderMarkdown);
      if (alive) setHtml({ body: md(problem.statement), intro: intro ? md(intro) : "", explain: problem.explain ? md(problem.explain) : "" });
    });
    return () => {
      alive = false;
    };
  }, [problem, intro]);
  const t = problem.tests;
  const cases = t.kind === "io" ? t.cases.length + (t.hiddenCount ?? 0) : null;
  return (
    <article className="ide-statement">
      <h1 className="ide-h1">
        {index !== null && <span className="ide-num">{index}.</span>}
        {problem.title}
        {solved && <span className="ide-solved">已通过</span>}
      </h1>
      <div className="ide-meta">
        {problem.difficulty && <span className={`ide-diff ide-diff-${problem.difficulty}`}>{{ easy: "简单", medium: "中等", hard: "困难" }[problem.difficulty]}</span>}
        <span>时间限制 {problem.timeMs / 1000} 秒</span>
        <span>内存限制 {problem.memoryMb} MB</span>
        {cases !== null && <span>{cases} 个用例</span>}
        {problem.titleEn && <span className="ide-en">{problem.titleEn}</span>}
      </div>
      {html?.intro && <div className="ide-md ide-intro" dangerouslySetInnerHTML={{ __html: html.intro }} />}
      {html ? <div className="ide-md" dangerouslySetInnerHTML={{ __html: html.body }} /> : <div className="ide-muted">加载中…</div>}
      {problem.knowledge.length > 0 && (
        <section className="ide-block">
          <h2 className="ide-h2">需要的知识</h2>
          <ul className="ide-know">
            {problem.knowledge.map((k) => (
              <li key={k.label}>{k.href ? <a href={k.href}>{k.label}</a> : k.label}</li>
            ))}
          </ul>
        </section>
      )}
      {problem.hints.length > 0 && (
        <section className="ide-block">
          <h2 className="ide-h2">
            提示 <span className="ide-muted">（{hint}/{problem.hints.length}）</span>
          </h2>
          {problem.hints.slice(0, hint).map((h, i) => (
            <p key={i} className="ide-hint">
              <span className="ide-hint-n">{i + 1}</span>
              {h}
            </p>
          ))}
          {hint < problem.hints.length && (
            <button className="ide-btn ide-btn-ghost" onClick={() => setHint(hint + 1)}>
              {hint === 0 ? "看第一条提示" : "再看一条"}
            </button>
          )}
        </section>
      )}
      {solved && html?.explain && (
        <section className="ide-block">
          <h2 className="ide-h2">讲解</h2>
          <div className="ide-md" dangerouslySetInnerHTML={{ __html: html.explain }} />
        </section>
      )}
    </article>
  );
}

function ResultView({ result, mode }: { result: JudgeResult; mode: Mode }) {
  const [pick, setPick] = useState(() => Math.max(0, result.cases.findIndex((c) => c.verdict !== "AC")));
  useEffect(() => setPick(Math.max(0, result.cases.findIndex((c) => c.verdict !== "AC"))), [result]);
  const c = result.cases[pick];
  return (
    <div className="ide-result">
      <div className={`ide-verdict ide-v-${VERDICT_CLASS[result.verdict]}`}>
        <span className="ide-verdict-name">{VERDICT_TEXT[result.verdict]}</span>
        <span className="ide-verdict-code">{result.verdict}</span>
        {result.total > 0 && (
          <span className="ide-muted">
            {mode === "run" ? "公开用例" : "全部用例"} 通过 {result.passed} / {result.total}
          </span>
        )}
        <span className="ide-muted">用时 {result.timeMs} ms</span>
        <span className="ide-muted">内存 {(result.memoryKb / 1024).toFixed(1)} MB</span>
      </div>
      {result.message && <pre className="ide-pre ide-pre-bad">{result.message}</pre>}
      {result.cases.length > 0 && (
        <>
          <div className="ide-cases">
            {result.cases.map((x, i) => (
              <button key={x.index} className={`ide-case ide-v-${VERDICT_CLASS[x.verdict]}${i === pick ? " is-on" : ""}`} onClick={() => setPick(i)}>
                {x.verdict === "AC" ? "✓" : "✗"} 用例 {x.index}
                {x.hidden && <span className="ide-muted">（隐藏）</span>}
              </button>
            ))}
            {result.cases.length < result.total && <span className="ide-muted">后面 {result.total - result.cases.length} 个用例没有运行（遇到第一个错误就停）</span>}
          </div>
          {c &&
            (c.hidden ? (
              <div className="ide-muted ide-pad">隐藏用例：{VERDICT_TEXT[c.verdict]}，看不到具体数据。</div>
            ) : (
              <div className="ide-case-detail">
                {c.input !== undefined && <Field label={result.cases[0]?.input?.includes("\n") || c.input.length > 60 ? "输入" : "输入 / 语句"} value={c.input} />}
                {c.expected !== undefined && <Field label="期望输出" value={c.expected} />}
                {c.actual !== undefined && <Field label="你的输出" value={c.actual} bad={c.verdict !== "AC"} />}
                {c.message && <Field label="报错" value={c.message} bad />}
              </div>
            ))}
        </>
      )}
    </div>
  );
}

function Field({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div className="ide-field">
      <div className="ide-field-label">{label}</div>
      <pre className={`ide-pre${bad ? " ide-pre-bad" : ""}`}>{value === "" ? "（空）" : value}</pre>
    </div>
  );
}

function Output({ result }: { result: JudgeResult }) {
  if (result.stdout === undefined && result.stderr === undefined) return <div className="ide-muted ide-pad">这次没有额外的输出。</div>;
  return (
    <div className="ide-case-detail">
      {result.stdout !== undefined && <Field label="标准输出" value={result.stdout} />}
      {result.stderr ? <Field label="标准错误" value={result.stderr} bad /> : null}
    </div>
  );
}

function Submissions({ problem, loggedIn, onLoad }: { problem: string; loggedIn: boolean; onLoad: (files: Record<string, string>) => void }) {
  const [list, setList] = useState<SubmissionBrief[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    if (!loggedIn) return;
    api<{ submissions: SubmissionBrief[] }>(`/api/oj/submissions?problem=${encodeURIComponent(problem)}`).then(
      (r) => setList(r.submissions),
      (e) => setErr(e instanceof ApiError ? e.message : "读不到提交记录"),
    );
  }, [problem, loggedIn]);
  if (!loggedIn) return <div className="ide-muted ide-pad">登录后能看到自己的提交记录。</div>;
  if (err) return <div className="ide-error">{err}</div>;
  if (!list) return <div className="ide-muted ide-pad">加载中…</div>;
  if (!list.length) return <div className="ide-muted ide-pad">还没有提交过。</div>;
  const load = async (id: string) => {
    if (!confirm("把这次提交的代码载入编辑器？当前的代码会被覆盖。")) return;
    const r = await api<{ submission: { files: Record<string, string> } }>(`/api/oj/submissions/${id}`);
    onLoad(r.submission.files);
  };
  return (
    <table className="ide-table">
      <thead>
        <tr>
          <th>结果</th>
          <th>语言</th>
          <th>用时</th>
          <th>内存</th>
          <th>时间</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {list.map((s) => (
          <tr key={s.id}>
            <td className={`ide-v-${VERDICT_CLASS[s.verdict as Verdict] ?? "info"}`}>
              {VERDICT_TEXT[s.verdict as Verdict] ?? s.verdict}
              {s.total > 0 && s.verdict !== "AC" && (
                <span className="ide-muted">
                  {" "}
                  {s.passed}/{s.total}
                </span>
              )}
            </td>
            <td>{LANGUAGE_LABEL[s.language]}</td>
            <td>{s.timeMs} ms</td>
            <td>{(s.memoryKb / 1024).toFixed(1)} MB</td>
            <td>{relativeTime(s.createdAt)}</td>
            <td>
              <button className="ide-link" onClick={() => void load(s.id)}>
                载入代码
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** 同一个课程条目有几个版本时（例如 2020 秋季中文版、2026 春季英文原版），在顶栏切换，像视频换源 */
function VersionSelect({ course, id, item }: { course: string; id: string; item: string }) {
  const list = useAssignments(course, item);
  if (!list || list.length < 2) return null;
  return (
    <>
      <span className="ide-sep">/</span>
      <select className="ide-select" value={id} onChange={(e) => navigate(`/courses/${course}/hw/${e.target.value}`)} aria-label="切换版本" title="切换版本：题目不完全一样，任选一个做即可">
        {list.map((a) => (
          <option key={a.id} value={a.id}>
            {versionLabel(a)}
          </option>
        ))}
      </select>
    </>
  );
}
