import { useEffect, useState } from "react";
import { api, ApiError } from "../api";
import { useMe } from "../session";
import { PROVIDER_LABEL, videoEmbed, type VideoProvider } from "../../shared/video";

/**
 * 讲义页的视频（故事 3.6）：一讲可以有几个视频源（B 站中文字幕、其他翻译、YouTube 原片……），一键切换。
 * 选过的网站记在浏览器里，下一讲自动选同一个网站的源。宽屏可以「并排看」：视频固定在右边，讲义在左边。
 * 视频源 = 课程包里的 videos + 管理员后来加的（/api/videos）。认不出的网站只给链接。
 */

export interface VideoSource {
  label: string;
  url: string;
  /** 管理员加的才有，用来删除 */
  id?: string;
}

const PROVIDER_KEY = "hiana.video.provider";
const SIDE_KEY = "hiana.video.side";

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* 隐私模式存不了，不影响看视频 */
  }
}

export function useVideoSide(): [boolean, (v: boolean) => void] {
  const [side, setSide] = useState(() => read(SIDE_KEY) === "1");
  return [side, (v) => (setSide(v), write(SIDE_KEY, v ? "1" : "0"))];
}

/** 课程包里的视频源加上管理员加的 */
export function useVideoSources(course: string, item: string, builtIn: VideoSource[]): [VideoSource[], () => void] {
  const [extra, setExtra] = useState<VideoSource[]>([]);
  const [n, setN] = useState(0);
  useEffect(() => {
    let alive = true;
    if (!course || !item) return;
    api<{ videos: VideoSource[] }>(`/api/videos?course=${encodeURIComponent(course)}&item=${encodeURIComponent(item)}`).then(
      (r) => alive && setExtra(r.videos),
      () => alive && setExtra([]),
    );
    return () => {
      alive = false;
    };
  }, [course, item, n]);
  return [[...builtIn, ...extra.filter((e) => !builtIn.some((b) => b.url === e.url))], () => setN((x) => x + 1)];
}

/** 选哪个源：上次选的网站优先，其次第一个能嵌入的 */
function pick(sources: VideoSource[]): number {
  const want = read(PROVIDER_KEY) as VideoProvider | null;
  const i = want ? sources.findIndex((s) => videoEmbed(s.url).provider === want && videoEmbed(s.url).embed) : -1;
  if (i >= 0) return i;
  const j = sources.findIndex((s) => videoEmbed(s.url).embed);
  return j >= 0 ? j : 0;
}

export function VideoPlayer({ course, item, sources, side, onSide, onChanged }: { course: string; item: string; sources: VideoSource[]; side: boolean; onSide: (v: boolean) => void; onChanged: () => void }) {
  const { me } = useMe();
  const [at, setAt] = useState(() => pick(sources));
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const key = sources.map((s) => s.url).join("\n");
  useEffect(() => setAt(pick(sources)), [key]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!sources.length && !me.isAdmin) return null;
  const cur = sources[Math.min(at, sources.length - 1)];
  const emb = cur ? videoEmbed(cur.url) : null;

  const choose = (i: number) => {
    setAt(i);
    write(PROVIDER_KEY, videoEmbed(sources[i]!.url).provider);
  };

  const add = async () => {
    setError(null);
    try {
      await api("/api/admin/videos", { body: { course, item, label, url } });
      setLabel("");
      setUrl("");
      setAdding(false);
      onChanged();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "添加失败");
    }
  };
  const remove = async (id: string) => {
    if (!confirm("删掉这个视频源？")) return;
    await api(`/api/admin/videos/${id}`, { method: "DELETE" }).catch(() => undefined);
    onChanged();
  };

  return (
    <section className={`video-box${side ? " is-side" : ""}`} aria-label="视频">
      {sources.length > 0 && (
        <div className="video-tabs" role="tablist" aria-label="视频源">
          {sources.map((s, i) => (
            <button key={s.url} role="tab" aria-selected={i === at} className={`video-tab${i === at ? " is-on" : ""}`} onClick={() => choose(i)} title={s.url}>
              {s.label}
            </button>
          ))}
        </div>
      )}
      {cur && emb?.embed ? (
        <div className="video-frame">
          <iframe key={emb.embed} src={emb.embed} title={cur.label} allow="fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" loading="lazy" />
        </div>
      ) : (
        cur && (
          <p className="small sub">
            这个视频源不能嵌在页面里，
            <a href={cur.url} target="_blank" rel="noreferrer">
              在新标签页打开
            </a>
            。
          </p>
        )
      )}
      <div className="video-bar small sub">
        {cur && (
          <a href={cur.url} target="_blank" rel="noreferrer">
            在{PROVIDER_LABEL[emb?.provider ?? "other"]}打开（{emb?.provider === "bilibili" ? "AI 字幕、倍速等在原网站更全" : "原网站功能更全"}）
          </a>
        )}
        <span className="video-fill" />
        {cur && (
          <button className="btn btn-quiet btn-sm video-side-btn" onClick={() => onSide(!side)}>
            {side ? "放回讲义上方" : "和讲义并排看"}
          </button>
        )}
        {me.isAdmin && (
          <button className="btn btn-quiet btn-sm" onClick={() => setAdding(!adding)}>
            {adding ? "取消" : "添加视频源"}
          </button>
        )}
      </div>
      {me.isAdmin && adding && (
        <div className="video-add">
          <input className="input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="名称，例如：哔哩哔哩：中文配音版" maxLength={80} />
          <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="视频地址（B 站、YouTube 能嵌入播放，其他网站给链接）" />
          <button className="btn btn-primary btn-sm" onClick={() => void add()} disabled={!label.trim() || !url.trim()}>
            添加
          </button>
          {error && <span className="small" style={{ color: "var(--danger, #c00)" }}>{error}</span>}
          {sources.some((s) => s.id) && (
            <ul className="small sub">
              {sources
                .filter((s) => s.id)
                .map((s) => (
                  <li key={s.id}>
                    {s.label}{" "}
                    <button className="btn btn-quiet btn-sm" onClick={() => void remove(s.id!)}>
                      删除
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
