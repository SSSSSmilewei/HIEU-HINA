import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Chapter, Level } from "../../shared/levels";
import { api, invalidate } from "../api";
import { Prose } from "../components/Prose";
import { type RepoStore, localRepo, markLocalPassed, officialFile, serverRepo, supportFiles } from "../levels/data";
import { type TestRun, type UnlockItem, checkGuesses, runTest, unlockItems } from "../levels/runner";
import { Link } from "../router";
import { useMe } from "../session";
import { Empty, ErrorBox, Skeleton, useConfirm, useTitle, useToast } from "../ui";
import { useLevelIndex, usePassed } from "./LevelMap";

/**
 * 一关的工作台：左边是题目（说明、先检验理解、提示、相关讲义），右边是我的仓库（文件、编辑器、运行测试）。
 * 判题在浏览器里：把仓库里的文件和官方测试一起交给 Pyodide，跑官方 ok 测试。
 */

export function LevelPage({ slug, chapter, level }: { slug: string; chapter: string; level: string }) {
  const { index, error, retry } = useLevelIndex(slug);
  const ch = index?.chapters.find((c) => c.id === chapter && !c.soon);
  const lv = ch?.levels.find((l) => l.id === level);
  useTitle(lv ? `${lv.title} · ${ch?.title}` : "闯关");
  if (error) return <div className="page"><ErrorBox error={error} onRetry={retry} /></div>;
  if (!index)
    return (
      <div className="page" aria-busy="true">
        <Skeleton h={36} w="40%" />
        <Skeleton h={400} />
      </div>
    );
  if (!ch || !lv) return <div className="page"><Empty title="没有这一关" action={<Link to={`/courses/${slug}/map`} className="btn">回到地图</Link>} /></div>;
  return <Workspace key={`${ch.id}/${lv.id}`} slug={slug} ch={ch} lv={lv} />;
}

function Workspace({ slug, ch, lv }: { slug: string; ch: Chapter; lv: Level }) {
  const { me } = useMe();
  const toast = useToast();
  const { passed, reload: reloadPassed } = usePassed(slug);
  const id = `${ch.id}/${lv.id}`;
  const done = !!passed[id];
  // 每次渲染都新建会让编辑器的保存函数跟着变，卸载时的保存会在每次渲染时触发
  const repo = useMemo(() => (me.role ? serverRepo(slug) : localRepo(slug)), [me.role, slug]);
  const idx = ch.levels.indexOf(lv);
  const prev = ch.levels[idx - 1];
  const next = ch.levels[idx + 1];

  const markPassed = useCallback(async () => {
    if (passed[id]) return;
    try {
      if (me.role) {
        await api(`/api/levels/${slug}/${ch.id}/${lv.id}`, { method: "PUT" });
        invalidate(`/api/levels/${slug}`, "/api/heatmap");
      } else markLocalPassed(slug, id);
      reloadPassed();
      toast(`第 ${idx} 关通过`);
    } catch (e) {
      toast(`过关记录没有保存：${(e as Error).message}`, "error");
    }
  }, [passed, id, me.role, slug, ch.id, lv.id, reloadPassed, toast, idx]);

  return (
    <div className="page level-page">
      <div className="row wrap" style={{ gap: 12, justifyContent: "space-between" }}>
        <Link to={`/courses/${slug}/map`} className="back-link">
          {ch.title}
        </Link>
        <span className="row" style={{ gap: 8 }}>
          {prev && (
            <Link to={`/courses/${slug}/levels/${ch.id}/${prev.id}`} className="btn btn-quiet">
              上一关
            </Link>
          )}
          {next && (
            <Link to={`/courses/${slug}/levels/${ch.id}/${next.id}`} className="btn btn-quiet">
              下一关
            </Link>
          )}
        </span>
      </div>
      <header className="stack" style={{ gap: 4 }}>
        <h1 className="h1">
          第 {idx} 关：{lv.title}
        </h1>
        <p className="small sub">
          {done ? "已通过" : "未通过"}
          {lv.optional ? " · 选做" : ""}
          {lv.points ? ` · 官方分值 ${lv.points} 分` : ""}
          {lv.functions.length > 0 && ` · 要写的函数：${lv.functions.join("、")}`}
        </p>
      </header>
      <div className="level-grid">
        <section className="level-task stack" aria-label="题目" style={{ gap: 20 }}>
          <Prose source={lv.task} />
          <Unlock slug={slug} ch={ch} lv={lv} onAllCorrect={lv.unlockOnly ? markPassed : undefined} />
          <Hints hints={lv.hints} />
          {lv.refs.length > 0 && (
            <div className="stack" style={{ gap: 6 }}>
              <h2 className="h3">相关讲义</h2>
              <ul className="level-refs">
                {lv.refs.map((r) => (
                  <li key={r.href}>
                    <Link to={r.href}>{r.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
        {lv.unlockOnly ? (
          <section className="card level-editor stack" style={{ gap: 12 }}>
            <p>这一关不用写代码。在左侧「先检验理解」里写出每一行的输出，全部答对就算通过。</p>
            {done && next && (
              <Link to={`/courses/${slug}/levels/${ch.id}/${next.id}`} className="btn btn-primary">
                进入下一关
              </Link>
            )}
          </section>
        ) : (
          <Editor slug={slug} ch={ch} lv={lv} repo={repo} repoKey={me.role ? "server" : "local"} onPass={markPassed} next={next} done={done} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- 提示

function Hints({ hints }: { hints: string[] }) {
  const [shown, setShown] = useState(0);
  if (hints.length === 0) return null;
  return (
    <div className="stack" style={{ gap: 8 }}>
      <h2 className="h3">提示</h2>
      <p className="small sub">提示从轻到重，不给答案。先自己想一想，卡住了再一条一条看。</p>
      <ol className="level-hints">
        {hints.slice(0, shown).map((h) => (
          <li key={h}>
            <Prose source={h} />
          </li>
        ))}
      </ol>
      {shown < hints.length && (
        <button type="button" className="btn btn-quiet" style={{ alignSelf: "flex-start" }} onClick={() => setShown(shown + 1)}>
          看第 {shown + 1} 条提示（共 {hints.length} 条）
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- 先检验理解（官方的「解锁」）

function Unlock({ slug, ch, lv, onAllCorrect }: { slug: string; ch: Chapter; lv: Level; onAllCorrect?: () => void }) {
  const [items, setItems] = useState<UnlockItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [verdict, setVerdict] = useState<Record<string, boolean>>({});
  const [checking, setChecking] = useState(false);

  const start = async () => {
    setLoading(true);
    setError(null);
    try {
      const files = await supportFiles(slug, ch);
      setItems(await unlockItems(ch.dir as string, lv.test, files));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 每个要填的空：key → 加密后的期望
  const blanks = useMemo(() => {
    const out: { key: string; hash: string }[] = [];
    items?.forEach((it, i) => {
      if (it.type === "choice") out.push({ key: `${i}`, hash: it.answer });
      else it.steps.forEach((s, j) => s.want.forEach((w, k) => w.hash && out.push({ key: `${i}.${j}.${k}`, hash: w.hash })));
    });
    return out;
  }, [items]);

  const check = async () => {
    setChecking(true);
    try {
      const res = await checkGuesses(ch.key as string, blanks.map((b) => ({ hash: b.hash, text: answers[b.key] ?? "" })));
      const v = Object.fromEntries(blanks.map((b, i) => [b.key, res[i]]));
      setVerdict(v);
      if (blanks.length > 0 && res.every(Boolean)) onAllCorrect?.();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setChecking(false);
    }
  };

  const correct = blanks.filter((b) => verdict[b.key]).length;
  return (
    <div className="card stack level-unlock" style={{ gap: 12 }}>
      <h2 className="h3">先检验理解</h2>
      <p className="small sub">官方要求动手之前先「解锁」测试：看着测试代码，写出每一行应该输出什么。答案只和加密后的结果比对，站内看不到官方答案。</p>
      {error && <p className="error-text">{error}</p>}
      {!items ? (
        <button type="button" className="btn" style={{ alignSelf: "flex-start" }} onClick={start} disabled={loading}>
          {loading ? "正在准备 Python 运行环境（第一次约需半分钟）" : "开始"}
        </button>
      ) : items.length === 0 ? (
        <p className="small">这一关的测试没有需要解锁的内容，直接写代码吧。</p>
      ) : (
        <>
          {items.map((it, i) =>
            it.type === "choice" ? (
              <fieldset key={`c${i}`} className="stack level-choice" style={{ gap: 6 }}>
                <legend>{it.question}</legend>
                {it.choices.map((c) => (
                  <label key={c} className="row" style={{ gap: 8 }}>
                    <input type="radio" name={`u${i}`} checked={answers[`${i}`] === c} onChange={() => setAnswers({ ...answers, [`${i}`]: c })} />
                    <code>{c}</code>
                  </label>
                ))}
                {verdict[`${i}`] !== undefined && <Verdict ok={verdict[`${i}`]} />}
              </fieldset>
            ) : (
              <pre key={`s${i}`} className="level-session">
                {it.steps.map((s, j) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: 会话里的步骤没有 id
                  <span key={j} className="level-step">
                    {s.code.split("\n").map((line, n) => `${n === 0 ? ">>> " : "... "}${line}\n`)}
                    {s.want.map((w, k) => {
                      const key = `${i}.${j}.${k}`;
                      return w.hash ? (
                        <span key={key} className="level-blank">
                          <input
                            className="input level-guess"
                            aria-label={`第 ${j + 1} 条语句的输出`}
                            value={answers[key] ?? ""}
                            onChange={(e) => setAnswers({ ...answers, [key]: e.target.value })}
                            spellCheck={false}
                            autoComplete="off"
                          />
                          {verdict[key] !== undefined && <Verdict ok={verdict[key]} />}
                          {"\n"}
                        </span>
                      ) : (
                        <span key={key}>{`${w.text}\n`}</span>
                      );
                    })}
                  </span>
                ))}
              </pre>
            ),
          )}
          <div className="row wrap" style={{ gap: 12 }}>
            <button type="button" className="btn btn-primary" onClick={check} disabled={checking}>
              {checking ? "正在检查" : "检查"}
            </button>
            {Object.keys(verdict).length > 0 && (
              <span className="small num">
                答对 {correct} / {blanks.length}
              </span>
            )}
          </div>
          <p className="small sub">按 Python 交互式解释器的显示方式填写：字符串要带引号；如果这一行会报错，就填 Error。</p>
        </>
      )}
    </div>
  );
}

function Verdict({ ok }: { ok: boolean }) {
  return <span className={ok ? "tag tag-ok" : "tag tag-bad"}>{ok ? "对" : "不对"}</span>;
}

// ---------------------------------------------------------------- 编辑器和运行

type SaveState = "saved" | "saving" | "dirty" | "error";

function Editor({
  slug,
  ch,
  lv,
  repo,
  repoKey,
  onPass,
  next,
  done,
}: { slug: string; ch: Chapter; lv: Level; repo: RepoStore; repoKey: string; onPass: () => void; next?: Level; done: boolean }) {
  const confirm = useConfirm();
  const files = ch.files ?? [];
  const [active, setActive] = useState(files.find((f) => f.editable)?.path ?? files[0]?.path ?? "");
  const [contents, setContents] = useState<Record<string, string> | null>(null);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [save, setSave] = useState<SaveState>("saved");
  const [run, setRun] = useState<{ state: "idle" | "loading" | "running" } | null>(null);
  const [result, setResult] = useState<TestRun | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pending = useRef<Record<string, string>>({});

  // 打开时：仓库里有的用仓库的，没有的用官方起始代码
  // biome-ignore lint/correctness/useExhaustiveDependencies: repoKey 代表 repo
  useEffect(() => {
    let live = true;
    (async () => {
      const saved = await repo.load();
      const out: Record<string, string> = {};
      for (const f of files) out[f.path] = f.editable && saved[f.path] !== undefined ? saved[f.path] : await officialFile(slug, f.path);
      if (live) setContents(out);
    })().catch((e) => live && setLoadError(e as Error));
    return () => {
      live = false;
    };
  }, [slug, repoKey]);

  const flush = useCallback(async () => {
    clearTimeout(timer.current);
    const todo = pending.current;
    pending.current = {};
    const paths = Object.keys(todo);
    if (paths.length === 0) return;
    setSave("saving");
    try {
      for (const p of paths) await repo.save(p, todo[p]);
      setSave(Object.keys(pending.current).length ? "dirty" : "saved");
    } catch {
      pending.current = { ...todo, ...pending.current };
      setSave("error");
    }
  }, [repo]);

  // 离开页面前把没保存的写进去
  useEffect(() => {
    const onHide = () => void flush();
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      void flush();
    };
  }, [flush]);

  const edit = (value: string) => {
    if (!contents) return;
    setContents({ ...contents, [active]: value });
    pending.current[active] = value;
    setSave("dirty");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush(), 800);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const { selectionStart: a, selectionEnd: b, value } = el;
      const v = `${value.slice(0, a)}    ${value.slice(b)}`;
      edit(v);
      requestAnimationFrame(() => el.setSelectionRange(a + 4, a + 4));
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      void runTests();
    } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      void flush();
    }
  };

  /** 跳到某个函数的定义 */
  const jump = (name: string) => {
    const main = files.find((f) => f.editable)?.path;
    if (!main || !contents) return;
    setActive(main);
    requestAnimationFrame(() => {
      const el = area.current;
      if (!el) return;
      const text = contents[main];
      const at = text.indexOf(`def ${name}(`);
      if (at < 0) return;
      el.focus();
      el.setSelectionRange(at, at);
      const line = text.slice(0, at).split("\n").length - 1;
      const lh = Number.parseFloat(getComputedStyle(el).lineHeight) || 20;
      el.scrollTop = Math.max(0, line * lh - el.clientHeight / 3);
    });
  };

  const runTests = async () => {
    if (!contents || run) return;
    setRunError(null);
    setRun({ state: "loading" });
    try {
      await flush();
      const support = await supportFiles(slug, ch);
      const mine = Object.fromEntries(files.filter((f) => f.editable).map((f) => [f.path, contents[f.path]]));
      const r = await runTest(ch.dir as string, lv.test, ch.key as string, { ...support, ...mine }, () => setRun({ state: "running" }));
      setResult(r);
      if (r.ok) onPass();
    } catch (e) {
      setResult(null);
      setRunError((e as Error).message);
    } finally {
      setRun(null);
    }
  };

  const reset = async () => {
    const main = files.find((f) => f.editable);
    if (!main) return;
    const ok = await confirm({ title: "恢复初始代码", body: `${main.path} 会换回官方起始代码，你写的内容会删掉，而且不能撤销。之前各关写的函数也在这个文件里，会一起删掉。`, ok: "恢复", danger: true });
    if (!ok) return;
    try {
      await repo.remove(main.path);
      const fresh = await officialFile(slug, main.path);
      delete pending.current[main.path];
      setContents((c) => (c ? { ...c, [main.path]: fresh } : c));
      setSave("saved");
      setResult(null);
    } catch (e) {
      setRunError((e as Error).message);
    }
  };

  if (loadError) return <ErrorBox error={loadError} />;
  if (!contents) return <Skeleton h={480} />;
  const file = files.find((f) => f.path === active);
  const saveText = { saved: `已保存到${repo.where}`, saving: "正在保存", dirty: "有改动，稍后自动保存", error: "保存失败，会在下次改动时重试" }[save];

  return (
    <section className="card level-editor stack" aria-label="我的仓库" style={{ gap: 12 }}>
      <div className="row wrap" style={{ gap: 8, justifyContent: "space-between" }}>
        <h2 className="h3">我的仓库 · {ch.dir}/</h2>
        <span className={`small ${save === "error" ? "error-text" : "sub"}`}>{saveText}</span>
      </div>
      <div className="level-files" role="tablist" aria-label="文件">
        {files.map((f) => (
          <button key={f.path} type="button" role="tab" aria-selected={f.path === active} className={`level-file${f.path === active ? " is-active" : ""}`} onClick={() => setActive(f.path)}>
            {f.path.split("/").pop()}
            {!f.editable && <span className="sub">（只读）</span>}
          </button>
        ))}
      </div>
      {lv.functions.length > 0 && (
        <div className="row wrap small" style={{ gap: 8 }}>
          <span className="sub">跳到：</span>
          {lv.functions.map((fn) => (
            <button key={fn} type="button" className="btn btn-quiet btn-sm" onClick={() => jump(fn)}>
              <code>{fn}</code>
            </button>
          ))}
        </div>
      )}
      <textarea
        ref={area}
        className="level-code"
        value={contents[active] ?? ""}
        readOnly={!file?.editable}
        onChange={(e) => edit(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        aria-label={`${active}${file?.editable ? "" : "（只读）"}`}
        wrap="off"
      />
      <div className="row wrap" style={{ gap: 8 }}>
        <button type="button" className="btn btn-primary" onClick={runTests} disabled={!!run}>
          {run?.state === "loading" ? "正在准备 Python 运行环境" : run?.state === "running" ? "正在运行测试" : "运行本关测试"}
        </button>
        <span className="small sub">Ctrl + Enter 运行，Ctrl + S 立即保存</span>
        <span style={{ flex: 1 }} />
        <button type="button" className="btn btn-quiet" onClick={reset}>
          恢复初始代码
        </button>
      </div>
      {runError && <pre className="level-output level-output-bad">{runError}</pre>}
      {result && <Result r={result} done={done} next={next} slug={slug} ch={ch} />}
    </section>
  );
}

function Result({ r, done, next, slug, ch }: { r: TestRun; done: boolean; next?: Level; slug: string; ch: Chapter }) {
  if (r.ok)
    return (
      <div className="level-result level-result-ok stack" style={{ gap: 8 }} role="status">
        <strong>全部 {r.total} 个测试用例通过{done ? "" : "，本关完成"}。</strong>
        {next && (
          <Link to={`/courses/${slug}/levels/${ch.id}/${next.id}`} className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
            进入下一关
          </Link>
        )}
      </div>
    );
  const f = r.fail;
  return (
    <div className="level-result level-result-bad stack" style={{ gap: 8 }} role="status">
      <strong>
        通过 {r.passed} 个用例后，第 {f?.suite} 组第 {f?.case} 个用例没有通过。
      </strong>
      {f && (
        <>
          <div className="small sub">用例原文（？表示期望输出已加密）：</div>
          <pre className="level-output">{f.show}</pre>
          <div className="small sub">出错的语句：</div>
          <pre className="level-output">{`>>> ${f.code.split("\n").join("\n... ")}`}</pre>
          {f.error ? (
            <>
              <div className="small sub">运行时报错：</div>
              <pre className="level-output level-output-bad">{f.error}</pre>
            </>
          ) : (
            <div className="level-diff">
              <div>
                <div className="small sub">你的输出</div>
                <pre className="level-output">{f.got || "（没有输出）"}</pre>
              </div>
              <div>
                <div className="small sub">期望输出</div>
                <pre className="level-output">{f.want || "（没有输出）"}</pre>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
