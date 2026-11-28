import { useEffect, useMemo, useRef, useState } from "react";
import { api, ApiError, relativeTime } from "../api";
import { type Monaco, loadMonaco } from "../ide/monaco";
import { monacoLanguage } from "../ide/types";
import { navigate } from "../router";
import { useTitle } from "../ui";
import "../ide/ide.css";

/**
 * 平台内的仓库页（故事 2.2），和做题界面一样是全屏的 IDE 风格（ide.css）。
 *   /repos         我的仓库、本地 clone 和推送、镜像到 GitHub 的说明
 *   /repos/:name   文件树 + 文件内容（只读的 Monaco）+ 提交历史 + 每次提交的改动对比
 * 数据都从 /api/git/* 读，平台不另存。
 */

type Theme = "dark" | "light";
const THEME_KEY = "hiana.ide.theme";
const LEFT_KEY = "hiana.repo.left";
const MIN_LEFT = 0.14;
const MAX_LEFT = 0.5;

interface RepoBrief {
  name: string;
  description: string;
  private: boolean;
  empty: boolean;
  sizeKb: number;
  updatedAt: number;
  cloneUrl: string;
}
interface RepoList {
  enabled: boolean;
  owner: string | null;
  repos: RepoBrief[];
}
interface TreeEntry {
  path: string;
  type: "file" | "dir";
  size: number;
}
interface RepoDetail {
  name: string;
  description: string;
  private: boolean;
  empty: boolean;
  branch: string;
  owner: string;
  cloneUrl: string;
  tree: TreeEntry[];
  truncated: boolean;
}
interface FileBody {
  size: number;
  content?: string;
  binary?: boolean;
  tooLarge?: boolean;
}
interface CommitBrief {
  sha: string;
  title: string;
  author: string;
  at: number;
  additions: number;
  deletions: number;
}
interface CommitDetail extends CommitBrief {
  message: string;
  parents: string[];
  files: { path: string; status: string }[];
  diff: string;
  diffTruncated: boolean;
}

function readTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}
function readLeft(): number {
  try {
    const v = Number(localStorage.getItem(LEFT_KEY));
    return v >= MIN_LEFT && v <= MAX_LEFT ? v : 0.22;
  } catch {
    return 0.22;
  }
}
function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 隐私模式下存不了，不影响使用
  }
}

function useIdeShell(theme: Theme) {
  useEffect(() => {
    document.documentElement.classList.add("ide-open");
    return () => document.documentElement.classList.remove("ide-open");
  }, []);
  useEffect(() => save(THEME_KEY, theme), [theme]);
}

function sizeText(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function TopBar({ crumbs, theme, setTheme, children }: { crumbs: React.ReactNode; theme: Theme; setTheme: (t: Theme) => void; children?: React.ReactNode }) {
  return (
    <header className="ide-top">
      <a className="ide-brand" href="/me" onClick={(e) => (e.preventDefault(), navigate("/me"))} title="回到平台">
        <span className="ide-brand-mark">HI·NA</span>
        <span className="ide-brand-sub">仓库</span>
      </a>
      <nav className="ide-crumbs" aria-label="位置">
        {crumbs}
      </nav>
      <div className="ide-tools">
        {children}
        <button className="ide-icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title={theme === "dark" ? "切换为浅色" : "切换为深色"} aria-label="切换深浅色">
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="repo-field">
      <div className="ide-field-label">{label}</div>
      <div className="repo-copy">
        <code className="repo-copy-text">{value}</code>
        <button
          className="ide-btn"
          onClick={() =>
            void copy(value).then((ok) => {
              setDone(ok);
              if (ok) setTimeout(() => setDone(false), 1500);
            })
          }
        >
          {done ? "已复制" : "复制"}
        </button>
      </div>
    </div>
  );
}

/* ───────────── /repos：我的仓库 ───────────── */

export function ReposPage() {
  useTitle("我的仓库");
  const [theme, setTheme] = useState<Theme>(readTheme);
  useIdeShell(theme);
  const [data, setData] = useState<RepoList | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    api<RepoList>("/api/git/repos").then(setData, (e: ApiError) => setError(e.message));
  }, []);
  const sample = data?.repos[0];

  return (
    <div className="ide" data-ide-theme={theme}>
      <TopBar crumbs={<span>我的仓库</span>} theme={theme} setTheme={setTheme} />
      <div className="ide-scroll repo-page">
        <div className="repo-wrap">
          {error && <div className="ide-error">{error}</div>}
          {!data && !error && <div className="ide-pad ide-muted">加载中…</div>}
          {data && !data.enabled && <div className="ide-error">仓库服务（Forgejo）还没有配置，暂时看不到仓库。请联系管理员。</div>}
          {data?.enabled && (
            <>
              <section className="repo-section">
                <h1 className="ide-h1">我的仓库</h1>
                <p className="ide-muted">
                  你在平台上做的作业和刷题都保存在这里，每个仓库都是真正的 Git 仓库，可以在网页里查看文件、提交历史和每一次的改动，也可以克隆到自己的电脑上。仓库默认是私有的，只有你本人和管理员能看到。
                </p>
                {data.repos.length === 0 ? (
                  <div className="repo-empty">
                    还没有仓库。第一次在作业台提交一份作业，或者刷题通过一道题以后，平台会自动建好对应的仓库。
                    <div style={{ marginTop: 10 }}>
                      <a className="ide-link" style={{ padding: 0 }} href="/courses/cs61a/sea" onClick={(e) => (e.preventDefault(), navigate("/courses/cs61a/sea"))}>
                        去 CS61A 深海地图做第一份作业
                      </a>
                    </div>
                  </div>
                ) : (
                  <table className="repo-table">
                    <thead>
                      <tr>
                        <th>仓库</th>
                        <th>说明</th>
                        <th>可见范围</th>
                        <th>最近更新</th>
                        <th className="num">大小</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.repos.map((r) => (
                        <tr key={r.name} className="repo-row" onClick={() => navigate(`/repos/${r.name}`)}>
                          <td>
                            <a className="repo-name" href={`/repos/${r.name}`} onClick={(e) => (e.preventDefault(), navigate(`/repos/${r.name}`))}>
                              {data.owner}/{r.name}
                            </a>
                          </td>
                          <td className="ide-muted">{r.description || "—"}</td>
                          <td>
                            <span className={`ide-chip ${r.private ? "" : "repo-public"}`}>{r.private ? "私有" : "公开"}</span>
                          </td>
                          <td className="ide-muted">{r.empty ? "还没有提交" : relativeTime(r.updatedAt)}</td>
                          <td className="ide-muted num">{r.sizeKb ? `${r.sizeKb} KB` : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
              <LocalGuide owner={data.owner} sampleUrl={sample?.cloneUrl ?? null} sampleName={sample?.name ?? "cs61a"} onOwner={(owner) => setData({ ...data, owner })} />
              <VscodeSection />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** 在自己电脑上用：Git 用户名、设置 Git 密码、clone、镜像到 GitHub */
function LocalGuide({ owner, sampleUrl, sampleName, onOwner }: { owner: string | null; sampleUrl: string | null; sampleName: string; onOwner: (owner: string) => void }) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== pw2) return setMsg({ ok: false, text: "两次输入的密码不一致。" });
    setBusy(true);
    setMsg(null);
    try {
      const r = await api<{ owner: string }>("/api/git/password", { body: { password: pw } });
      onOwner(r.owner);
      setPw("");
      setPw2("");
      setMsg({ ok: true, text: "Git 密码已设置。以后在本地克隆或推送时，用户名填上面的 Git 用户名，密码填刚才设置的这个。" });
    } catch (err) {
      setMsg({ ok: false, text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };
  const url = sampleUrl ?? `<仓库地址>`;
  return (
    <section className="repo-section">
      <h2 className="ide-h2">在自己的电脑上使用</h2>
      <p className="ide-muted">
        网页里的作业台和本地是同一个仓库：在本地改完推送上来，网页里能看到；在作业台里提交的代码，本地拉取一下也能拿到。克隆私有仓库需要用户名和 Git 密码。Git 密码只用于克隆和推送，和登录平台的密码互不影响。
      </p>
      {owner && <CopyField label="Git 用户名" value={owner} />}
      <form className="repo-form" onSubmit={(e) => void submit(e)}>
        <div className="ide-field-label">设置 Git 密码（8 到 72 个字符，不能有空格；重新设置会替换旧密码）</div>
        <div className="repo-form-row">
          <input className="repo-input" type="password" autoComplete="new-password" placeholder="新的 Git 密码" value={pw} onChange={(e) => setPw(e.target.value)} aria-label="新的 Git 密码" />
          <input className="repo-input" type="password" autoComplete="new-password" placeholder="再输入一次" value={pw2} onChange={(e) => setPw2(e.target.value)} aria-label="再输入一次 Git 密码" />
          <button className="ide-btn ide-btn-primary" disabled={busy || pw.length < 8}>
            {busy ? "正在设置…" : "设置"}
          </button>
        </div>
        {msg && <div className={msg.ok ? "repo-ok" : "ide-error"} style={msg.ok ? undefined : { margin: "8px 0 0" }}>{msg.text}</div>}
      </form>

      <h3 className="repo-h3">克隆到本地</h3>
      <pre className="ide-pre">{`git clone ${url}
cd ${sampleName}
# 改完以后
git add .
git commit -m "说明这次改了什么"
git push`}</pre>

      <h3 className="repo-h3">镜像到 GitHub</h3>
      <ol className="repo-steps">
        <li>
          在 GitHub 上新建一个<strong>空</strong>仓库（不要勾选添加 README、.gitignore 或许可证），记下它的地址，例如 <code>https://github.com/你的用户名/{sampleName}.git</code>。
        </li>
        <li>在本地克隆好的仓库里，加一个名为 github 的远程地址，然后推送：</li>
      </ol>
      <pre className="ide-pre">{`git remote add github https://github.com/你的用户名/${sampleName}.git
git push github main`}</pre>
      <p className="ide-muted">
        以后每次在作业台提交以后，先 <code>git pull</code> 拉取平台上的新提交，再 <code>git push github main</code>，GitHub 上的副本就和平台保持一致。课程作业受学术诚信规定约束，镜像到 GitHub 时请把 GitHub 仓库设为私有。
      </p>
    </section>
  );
}

interface TokenRow {
  id: string;
  name: string;
  hint: string;
  createdAt: number;
  lastUsedAt: number | null;
}

/** VSCode 插件：下载、安装说明、签发和撤销个人令牌（故事 2.3） */
function VscodeSection() {
  const [tokens, setTokens] = useState<TokenRow[] | null>(null);
  const [name, setName] = useState("");
  const [fresh, setFresh] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const load = () => api<{ tokens: TokenRow[] }>("/api/tokens").then((r) => setTokens(r.tokens), (e: ApiError) => setError(e.message));
  useEffect(() => {
    void load();
  }, []);
  const issue = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ token: string }>("/api/tokens", { body: { name: name.trim() } });
      setFresh(r.token);
      setName("");
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const revoke = async (t: TokenRow) => {
    if (!window.confirm(`撤销令牌「${t.name}」以后，用它登录的 VSCode 会立即失效。确定撤销吗？`)) return;
    try {
      await api(`/api/tokens/${t.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  };
  return (
    <section className="repo-section">
      <h2 className="ide-h2">VSCode 插件</h2>
      <p className="ide-muted">
        装上插件以后，可以在 VSCode 里克隆自己的课程仓库、运行公开测试、提交到 OJ，判题结果显示在 VSCode 的输出面板里。提交时插件会先把改动推送到你的仓库，再交给平台判题，网页上的提交记录和仓库里都能看到。
      </p>
      <ol className="repo-steps">
        <li>
          <a className="ide-link" style={{ padding: 0 }} href="/downloads/hiana-oj.vsix" download>
            下载插件（hiana-oj.vsix）
          </a>
          。在 VSCode 的「扩展」视图右上角点「…」，选「从 VSIX 安装…」，选中下载的文件；也可以在终端运行 <code>code --install-extension hiana-oj.vsix</code>。
        </li>
        <li>在下面签发一个令牌并复制下来。令牌只显示这一次。</li>
        <li>
          在 VSCode 里按 <code>Ctrl+Shift+P</code>，运行「HIANA：登录」，粘贴令牌。然后运行「HIANA：克隆我的课程仓库」，询问账号密码时填上面的 Git 用户名和 Git 密码。
        </li>
      </ol>
      <form className="repo-form" onSubmit={(e) => void issue(e)}>
        <div className="ide-field-label">签发令牌（起个名字，方便以后认出是哪台电脑在用）</div>
        <div className="repo-form-row">
          <input className="repo-input" placeholder="例如：宿舍的笔记本" maxLength={40} value={name} onChange={(e) => setName(e.target.value)} aria-label="令牌名称" />
          <button className="ide-btn ide-btn-primary" disabled={busy || !name.trim()}>
            {busy ? "正在签发…" : "签发"}
          </button>
        </div>
      </form>
      {fresh && (
        <div className="repo-ok" style={{ color: "inherit" }}>
          <CopyField label="新令牌（离开这个页面以后就看不到了，请现在复制）" value={fresh} />
        </div>
      )}
      {error && <div className="ide-error" style={{ margin: "8px 0 0" }}>{error}</div>}
      {tokens && tokens.length > 0 && (
        <table className="repo-table" style={{ marginTop: 14 }}>
          <thead>
            <tr>
              <th>名称</th>
              <th>令牌末四位</th>
              <th>签发时间</th>
              <th>最近使用</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {tokens.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td className="ide-muted">
                  <code>…{t.hint}</code>
                </td>
                <td className="ide-muted">{relativeTime(t.createdAt)}</td>
                <td className="ide-muted">{t.lastUsedAt ? relativeTime(t.lastUsedAt) : "还没用过"}</td>
                <td style={{ textAlign: "right" }}>
                  <button className="ide-btn" onClick={() => void revoke(t)}>
                    撤销
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="ide-muted" style={{ marginTop: 12 }}>
        令牌只能用来运行、提交、查看提交记录和查看仓库，不能修改密码或做其他操作。改过平台密码以后，以前签发的令牌会自动失效。
      </p>
    </section>
  );
}

/* ───────────── /repos/:name：一个仓库 ───────────── */

type View = { kind: "code" } | { kind: "history" } | { kind: "commit"; sha: string };

export function RepoPage({ name }: { name: string }) {
  useTitle(`仓库 ${name}`);
  const [theme, setTheme] = useState<Theme>(readTheme);
  useIdeShell(theme);
  const [repo, setRepo] = useState<RepoDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [left, setLeft] = useState(readLeft);
  const [view, setView] = useState<View>({ kind: "code" });
  const [file, setFile] = useState<string | null>(null);
  const [showClone, setShowClone] = useState(false);

  useEffect(() => {
    api<RepoDetail>(`/api/git/repos/${encodeURIComponent(name)}`).then(
      (r) => {
        setRepo(r);
        const readme = r.tree.find((e) => e.type === "file" && /^readme\.md$/i.test(e.path));
        setFile(readme?.path ?? r.tree.find((e) => e.type === "file")?.path ?? null);
      },
      (e: ApiError) => setError(e.message),
    );
  }, [name]);
  useEffect(() => save(LEFT_KEY, String(left)), [left]);

  const toggleVisibility = async () => {
    if (!repo) return;
    const next = !repo.private;
    const ok = window.confirm(
      next ? "改为私有以后，只有你本人和管理员能看到这个仓库。确定改为私有吗？" : "改为公开以后，任何能访问仓库服务的人都能看到这个仓库里的代码。课程作业受学术诚信规定约束，请确认后再公开。确定改为公开吗？",
    );
    if (!ok) return;
    try {
      const r = await api<{ private: boolean }>(`/api/git/repos/${encodeURIComponent(name)}/visibility`, { body: { private: next } });
      setRepo({ ...repo, private: r.private });
    } catch (e) {
      window.alert((e as Error).message);
    }
  };

  const crumbs = (
    <>
      <a className="repo-crumb" href="/repos" onClick={(e) => (e.preventDefault(), navigate("/repos"))}>
        {repo?.owner ?? "我的仓库"}
      </a>
      <span className="ide-sep">/</span>
      <span>{name}</span>
      {repo && <span className={`ide-chip ${repo.private ? "" : "repo-public"}`}>{repo.private ? "私有" : "公开"}</span>}
      {repo && !repo.empty && <span className="ide-chip">⎇ {repo.branch}</span>}
    </>
  );

  return (
    <div className="ide" data-ide-theme={theme}>
      <TopBar crumbs={crumbs} theme={theme} setTheme={setTheme}>
        {repo && (
          <>
            <button className="ide-btn" onClick={() => void toggleVisibility()} title="切换仓库的可见范围">
              {repo.private ? "改为公开" : "改为私有"}
            </button>
            <button className="ide-btn ide-btn-primary" onClick={() => setShowClone((v) => !v)} aria-expanded={showClone}>
              克隆
            </button>
          </>
        )}
      </TopBar>
      {showClone && repo && <ClonePanel repo={repo} onClose={() => setShowClone(false)} />}
      {error && (
        <div className="ide-pad">
          <div className="ide-error" style={{ margin: 0 }}>
            {error}
          </div>
          <a className="ide-link" style={{ padding: 0, marginTop: 10, display: "inline-block" }} href="/repos" onClick={(e) => (e.preventDefault(), navigate("/repos"))}>
            返回我的仓库
          </a>
        </div>
      )}
      {!repo && !error && <div className="ide-pad ide-muted">加载中…</div>}
      {repo && (
        <div className="ide-main" style={{ ["--ide-left" as string]: `${left * 100}%` }}>
          <section className="ide-pane" aria-label="文件">
            <div className="ide-tabs">
              <span className="ide-tab is-on">文件</span>
              <span className="ide-tabs-fill" />
              <span className="ide-muted">{repo.tree.filter((e) => e.type === "file").length} 个文件</span>
            </div>
            <div className="ide-scroll">
              {repo.empty ? (
                <div className="ide-pad ide-muted">仓库还是空的。</div>
              ) : (
                <RepoTree
                  tree={repo.tree}
                  active={view.kind === "code" ? file : null}
                  onOpen={(p) => {
                    setFile(p);
                    setView({ kind: "code" });
                  }}
                />
              )}
              {repo.truncated && <div className="ide-pad ide-muted">文件太多，只列出了一部分。</div>}
            </div>
          </section>
          <Splitter onDrag={(r) => setLeft(Math.min(MAX_LEFT, Math.max(MIN_LEFT, r)))} />
          <section className="ide-pane ide-editor-pane" aria-label="内容">
            <div className="ide-tabs" role="tablist">
              <button role="tab" aria-selected={view.kind === "code"} className={`ide-tab ${view.kind === "code" ? "is-on" : ""}`} onClick={() => setView({ kind: "code" })}>
                代码
              </button>
              <button role="tab" aria-selected={view.kind !== "code"} className={`ide-tab ${view.kind !== "code" ? "is-on" : ""}`} onClick={() => setView({ kind: "history" })}>
                提交历史
              </button>
              <span className="ide-tabs-fill" />
              {view.kind === "code" && file && <span className="ide-muted repo-path">{file}</span>}
            </div>
            {view.kind === "code" &&
              (file ? (
                <FileView key={file} repo={name} path={file} theme={theme} onOpenPath={(p) => setFile(p)} tree={repo.tree} />
              ) : (
                <div className="ide-pad ide-muted">{repo.empty ? "还没有提交。" : "在左边选一个文件。"}</div>
              ))}
            {view.kind === "history" && <History repo={name} empty={repo.empty} onOpen={(sha) => setView({ kind: "commit", sha })} />}
            {view.kind === "commit" && <CommitView repo={name} sha={view.sha} onBack={() => setView({ kind: "history" })} onOpenFile={(p) => (setFile(p), setView({ kind: "code" }))} />}
          </section>
        </div>
      )}
    </div>
  );
}

function ClonePanel({ repo, onClose }: { repo: RepoDetail; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="repo-clone" role="dialog" aria-label="克隆这个仓库">
      <CopyField label="HTTPS 地址" value={repo.cloneUrl} />
      <CopyField label="克隆命令" value={`git clone ${repo.cloneUrl}`} />
      <div className="ide-muted" style={{ fontSize: 12 }}>
        用户名是 <code>{repo.owner}</code>，密码是你设置的 Git 密码。还没设置过、或者想了解如何镜像到 GitHub，请看
        <a className="ide-link" href="/repos" onClick={(e) => (e.preventDefault(), navigate("/repos"))}>
          我的仓库页面的说明
        </a>
        。
      </div>
      <button className="ide-icon repo-clone-x" onClick={onClose} aria-label="关闭">
        ×
      </button>
    </div>
  );
}

function Splitter({ onDrag }: { onDrag: (ratio: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const down = (e: React.PointerEvent) => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    e.preventDefault();
    const box = parent.getBoundingClientRect();
    const move = (ev: PointerEvent) => onDrag((ev.clientX - box.left) / box.width);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      document.documentElement.classList.remove("ide-dragging");
    };
    document.documentElement.classList.add("ide-dragging");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return <div ref={ref} className="ide-split ide-split-x" onPointerDown={down} role="separator" aria-orientation="vertical" />;
}

/** 文件树：目录可以折叠，默认展开第一层以外的都收起，正在看的文件所在目录展开 */
function RepoTree({ tree, active, onOpen }: { tree: TreeEntry[]; active: string | null; onOpen: (path: string) => void }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    if (!active) return;
    const parts = active.split("/");
    setOpen((prev) => {
      const next = new Set(prev);
      for (let i = 1; i < parts.length; i++) next.add(parts.slice(0, i).join("/"));
      return next;
    });
  }, [active]);
  const children = useMemo(() => {
    const m = new Map<string, TreeEntry[]>();
    for (const e of tree) {
      const parent = e.path.includes("/") ? e.path.slice(0, e.path.lastIndexOf("/")) : "";
      if (!m.has(parent)) m.set(parent, []);
      m.get(parent)!.push(e);
    }
    for (const list of m.values()) list.sort((a, b) => (a.type === b.type ? a.path.localeCompare(b.path) : a.type === "dir" ? -1 : 1));
    return m;
  }, [tree]);
  const render = (dir: string, depth: number): React.ReactNode =>
    (children.get(dir) ?? []).map((e) => {
      const label = e.path.slice(e.path.lastIndexOf("/") + 1);
      const pad = { paddingLeft: 12 + depth * 14 };
      if (e.type === "dir") {
        const isOpen = open.has(e.path);
        return (
          <div key={e.path}>
            <button
              className="ide-tree-item repo-dir"
              style={pad}
              aria-expanded={isOpen}
              onClick={() =>
                setOpen((prev) => {
                  const next = new Set(prev);
                  if (next.has(e.path)) next.delete(e.path);
                  else next.add(e.path);
                  return next;
                })
              }
            >
              <span className="repo-caret">{isOpen ? "▾" : "▸"}</span>
              {label}
            </button>
            {isOpen && render(e.path, depth + 1)}
          </div>
        );
      }
      return (
        <button key={e.path} className={`ide-tree-item ${active === e.path ? "is-on" : ""}`} style={pad} onClick={() => onOpen(e.path)} title={`${e.path}（${sizeText(e.size)}）`}>
          <span className="repo-caret" />
          {label}
        </button>
      );
    });
  return <nav className="repo-tree">{render("", 0)}</nav>;
}

/** 一个文件：Markdown 默认显示排好版的，其他用只读的 Monaco 高亮 */
function FileView({ repo, path, theme, tree, onOpenPath }: { repo: string; path: string; theme: Theme; tree: TreeEntry[]; onOpenPath: (p: string) => void }) {
  const [body, setBody] = useState<FileBody | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMd = /\.md$/i.test(path);
  const [source, setSource] = useState(false);
  useEffect(() => {
    let alive = true;
    api<FileBody>(`/api/git/repos/${encodeURIComponent(repo)}/file?path=${encodeURIComponent(path)}`).then(
      (b) => alive && setBody(b),
      (e: ApiError) => alive && setError(e.message),
    );
    return () => {
      alive = false;
    };
  }, [repo, path]);
  if (error) return <div className="ide-error">{error}</div>;
  if (!body) return <div className="ide-pad ide-muted">加载中…</div>;
  if (body.binary) return <div className="ide-pad ide-muted">这是二进制文件（{sizeText(body.size)}），不能在网页里显示。克隆到本地后可以打开。</div>;
  if (body.tooLarge || body.content === undefined) return <div className="ide-pad ide-muted">文件太大（{sizeText(body.size)}），不在网页里显示。克隆到本地后可以打开。</div>;
  return (
    <>
      {isMd && (
        <div className="repo-subbar">
          <button className={`ide-link ${!source ? "repo-on" : ""}`} onClick={() => setSource(false)}>
            预览
          </button>
          <button className={`ide-link ${source ? "repo-on" : ""}`} onClick={() => setSource(true)}>
            源码
          </button>
        </div>
      )}
      {isMd && !source ? <MarkdownView text={body.content} base={path} tree={tree} onOpenPath={onOpenPath} /> : <CodeView path={path} value={body.content} theme={theme} />}
    </>
  );
}

/** README 里的相对链接（比如 lab/lab01/）在文件树里打开 */
function MarkdownView({ text, base, tree, onOpenPath }: { text: string; base: string; tree: TreeEntry[]; onOpenPath: (p: string) => void }) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    void import("../markdown").then(({ renderMarkdown }) => alive && setHtml(renderMarkdown(text)));
    return () => {
      alive = false;
    };
  }, [text]);
  const onClick = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a");
    const href = a?.getAttribute("href");
    if (!href || /^[a-z]+:|^\/\/|^#/i.test(href)) return;
    e.preventDefault();
    const dir = base.includes("/") ? base.slice(0, base.lastIndexOf("/") + 1) : "";
    const parts: string[] = [];
    for (const s of (dir + href).split("/")) {
      if (!s || s === ".") continue;
      if (s === "..") parts.pop();
      else parts.push(decodeURIComponent(s));
    }
    const target = parts.join("/");
    if (tree.some((t) => t.type === "file" && t.path === target)) return onOpenPath(target);
    // 指向目录：先找目录里的 README，再找第一个代码文件，最后才是任意文件
    const inside = tree.filter((t) => t.type === "file" && t.path.startsWith(`${target}/`)).map((t) => t.path);
    const pick = inside.find((p) => /\/readme\.md$/i.test(p)) ?? inside.find((p) => /\.(py|scm|sql|c|cpp|java)$/.test(p)) ?? inside[0];
    if (pick) onOpenPath(pick);
  };
  return (
    <div className="ide-scroll">
      {html === null ? <div className="ide-pad ide-muted">加载中…</div> : <div className="ide-md repo-md" onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />}
    </div>
  );
}

function CodeView({ path, value, theme }: { path: string; value: string; theme: Theme }) {
  const host = useRef<HTMLDivElement>(null);
  const [monaco, setMonaco] = useState<Monaco | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    loadMonaco().then(
      (m) => alive && setMonaco(m),
      () => alive && setFailed(true),
    );
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (!monaco || !host.current) return;
    const model = monaco.editor.createModel(value, monacoLanguage(path));
    const ed = monaco.editor.create(host.current, {
      model,
      readOnly: true,
      readOnlyMessage: { value: "这里只能查看。要修改，请在作业台里做，或者克隆到本地。" },
      automaticLayout: true,
      minimap: { enabled: false },
      fontFamily: getComputedStyle(document.documentElement).getPropertyValue("--font-mono") || "monospace",
      fontLigatures: false,
      scrollBeyondLastLine: false,
      renderWhitespace: "selection",
      padding: { top: 8 },
      stickyScroll: { enabled: false },
      theme: theme === "dark" ? "vs-dark" : "vs",
    });
    return () => {
      ed.dispose();
      model.dispose();
    };
    // 主题在下一个 effect 里换，不重建编辑器
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monaco, path, value]);
  useEffect(() => {
    monaco?.editor.setTheme(theme === "dark" ? "vs-dark" : "vs");
  }, [monaco, theme]);
  if (failed) return <pre className="ide-pre repo-plain">{value}</pre>;
  return (
    <div className="ide-editor-body">
      <div className="ide-editor" ref={host}>
        {!monaco && <div className="ide-muted ide-pad">正在加载编辑器…</div>}
      </div>
    </div>
  );
}

function History({ repo, empty, onOpen }: { repo: string; empty: boolean; onOpen: (sha: string) => void }) {
  const [list, setList] = useState<CommitBrief[]>([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(!empty);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (empty) return;
    let alive = true;
    setLoading(true);
    api<{ commits: CommitBrief[]; total: number; hasMore: boolean }>(`/api/git/repos/${encodeURIComponent(repo)}/commits?page=${page}`).then(
      (r) => {
        if (!alive) return;
        setList((prev) => (page === 1 ? r.commits : [...prev, ...r.commits]));
        setMore(r.hasMore);
        setTotal(r.total);
        setLoading(false);
      },
      (e: ApiError) => alive && (setError(e.message), setLoading(false)),
    );
    return () => {
      alive = false;
    };
  }, [repo, page, empty]);
  if (empty) return <div className="ide-pad ide-muted">还没有提交。</div>;
  return (
    <div className="ide-scroll">
      {error && <div className="ide-error">{error}</div>}
      {total > 0 && <div className="repo-count ide-muted">共 {total} 次提交，最新的在最上面。点一次提交查看改了什么。</div>}
      <ul className="repo-commits">
        {list.map((c) => (
          <li key={c.sha}>
            <button className="repo-commit" onClick={() => onOpen(c.sha)}>
              <span className="repo-commit-title">{c.title}</span>
              <span className="repo-commit-meta">
                <span>{c.author}</span>
                <span>{relativeTime(c.at)}</span>
                <span className="repo-add">+{c.additions}</span>
                <span className="repo-del">−{c.deletions}</span>
                <code className="repo-sha">{c.sha.slice(0, 7)}</code>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {loading && <div className="ide-pad ide-muted">加载中…</div>}
      {more && !loading && (
        <div className="ide-pad">
          <button className="ide-btn" onClick={() => setPage((p) => p + 1)}>
            加载更早的提交
          </button>
        </div>
      )}
    </div>
  );
}

interface DiffLine {
  kind: "add" | "del" | "ctx" | "hunk" | "note";
  text: string;
  old?: number;
  new?: number;
}
interface DiffFile {
  path: string;
  lines: DiffLine[];
  binary: boolean;
}

/** 把 unified diff（git 的 .diff 输出）切成每个文件一段，算出新旧行号 */
export function parseDiff(diff: string): DiffFile[] {
  const files: DiffFile[] = [];
  let cur: DiffFile | null = null;
  let o = 0;
  let n = 0;
  for (const line of diff.split("\n")) {
    if (line.startsWith("diff --git ")) {
      const m = line.match(/^diff --git a\/(.+) b\/(.+)$/);
      cur = { path: m?.[2] ?? line.slice(11), lines: [], binary: false };
      files.push(cur);
      continue;
    }
    if (!cur) continue;
    if (line.startsWith("@@")) {
      const m = line.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      o = Number(m?.[1] ?? 0);
      n = Number(m?.[2] ?? 0);
      cur.lines.push({ kind: "hunk", text: line });
    } else if (line.startsWith("Binary files")) cur.binary = true;
    else if (/^(index |--- |\+\+\+ |new file mode|deleted file mode|old mode|new mode|similarity index|rename from|rename to)/.test(line) && !cur.lines.some((l) => l.kind === "hunk")) continue;
    else if (line.startsWith("+")) cur.lines.push({ kind: "add", text: line.slice(1), new: n++ });
    else if (line.startsWith("-")) cur.lines.push({ kind: "del", text: line.slice(1), old: o++ });
    else if (line.startsWith("\\")) cur.lines.push({ kind: "note", text: line.slice(2) });
    // 上下文行以空格开头；diff 末尾的空行不算
    else if (line.startsWith(" ") && cur.lines.length) cur.lines.push({ kind: "ctx", text: line.slice(1), old: o++, new: n++ });
  }
  return files;
}

const STATUS_TEXT: Record<string, string> = { added: "新增", modified: "修改", removed: "删除", deleted: "删除", renamed: "重命名", copied: "复制", changed: "修改" };

function CommitView({ repo, sha, onBack, onOpenFile }: { repo: string; sha: string; onBack: () => void; onOpenFile: (p: string) => void }) {
  const [c, setC] = useState<CommitDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    setC(null);
    api<CommitDetail>(`/api/git/repos/${encodeURIComponent(repo)}/commits/${sha}`).then(
      (r) => alive && setC(r),
      (e: ApiError) => alive && setError(e.message),
    );
    return () => {
      alive = false;
    };
  }, [repo, sha]);
  const files = useMemo(() => (c ? parseDiff(c.diff) : []), [c]);
  const statusOf = (p: string) => c?.files.find((f) => f.path === p)?.status;
  return (
    <div className="ide-scroll">
      <div className="repo-subbar">
        <button className="ide-link" onClick={onBack}>
          ← 返回提交历史
        </button>
      </div>
      {error && <div className="ide-error">{error}</div>}
      {!c && !error && <div className="ide-pad ide-muted">加载中…</div>}
      {c && (
        <div className="repo-commit-detail">
          <h2 className="repo-commit-head">{c.message.split("\n")[0]}</h2>
          {c.message.includes("\n") && <pre className="repo-commit-body">{c.message.slice(c.message.indexOf("\n") + 1).trim()}</pre>}
          <div className="repo-commit-meta" style={{ marginBottom: 12 }}>
            <span>{c.author}</span>
            <span>{new Date(c.at).toLocaleString("zh-CN", { hour12: false })}</span>
            <span>改了 {c.files.length} 个文件</span>
            <span className="repo-add">+{c.additions}</span>
            <span className="repo-del">−{c.deletions}</span>
            <code className="repo-sha" title={c.sha}>
              {c.sha.slice(0, 10)}
            </code>
          </div>
          {files.map((f) => (
            <section key={f.path} className="repo-diff">
              <header className="repo-diff-head">
                <span className="ide-chip">{STATUS_TEXT[statusOf(f.path) ?? ""] ?? "修改"}</span>
                <button className="ide-link repo-diff-path" onClick={() => onOpenFile(f.path)} title="打开这个文件的当前版本">
                  {f.path}
                </button>
              </header>
              {f.binary ? (
                <div className="ide-pad ide-muted">二进制文件，不显示改动。</div>
              ) : (
                <table className="repo-diff-table">
                  <tbody>
                    {f.lines.map((l, i) =>
                      l.kind === "hunk" ? (
                        <tr key={i} className="repo-hunk">
                          <td colSpan={3}>{l.text}</td>
                        </tr>
                      ) : l.kind === "note" ? (
                        <tr key={i} className="repo-note">
                          <td colSpan={3}>{l.text === "No newline at end of file" ? "文件末尾没有换行" : l.text}</td>
                        </tr>
                      ) : (
                        <tr key={i} className={`repo-l-${l.kind}`}>
                          <td className="repo-ln">{l.old ?? ""}</td>
                          <td className="repo-ln">{l.new ?? ""}</td>
                          <td className="repo-code">
                            <span className="repo-sign">{l.kind === "add" ? "+" : l.kind === "del" ? "−" : " "}</span>
                            {l.text}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              )}
            </section>
          ))}
          {c.diffTruncated && <div className="ide-pad ide-muted">改动太多，只显示了前面一部分。克隆到本地后可以用 git show 查看全部。</div>}
          {!files.length && <div className="ide-pad ide-muted">这次提交没有文件内容的改动。</div>}
        </div>
      )}
    </div>
  );
}
