/**
 * 视频换源（故事 3.6）：把视频网站的普通链接换成能嵌进页面的播放器地址。
 * 认得出的：B 站（BV 号，可带分 P）、YouTube（watch、youtu.be、embed、shorts）。认不出的只给链接，在新标签页打开。
 */

export type VideoProvider = "bilibili" | "youtube" | "other";

export interface VideoEmbed {
  provider: VideoProvider;
  /** 嵌入播放器的地址；认不出的是 null */
  embed: string | null;
}

export function videoEmbed(raw: string): VideoEmbed {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return { provider: "other", embed: null };
  }
  const host = u.hostname.replace(/^www\.|^m\./, "");
  if (host === "bilibili.com" || host === "player.bilibili.com") {
    const bv = /\/video\/(BV[0-9A-Za-z]{10})/.exec(u.pathname)?.[1] ?? u.searchParams.get("bvid");
    if (!bv || !/^BV[0-9A-Za-z]{10}$/.test(bv)) return { provider: "bilibili", embed: null };
    const p = Number(u.searchParams.get("p") ?? "1");
    const page = Number.isInteger(p) && p > 0 ? p : 1;
    return { provider: "bilibili", embed: `https://player.bilibili.com/player.html?bvid=${bv}&p=${page}&autoplay=0&high_quality=1&danmaku=0` };
  }
  if (host === "youtube.com" || host === "youtu.be" || host === "youtube-nocookie.com") {
    const id = host === "youtu.be" ? u.pathname.slice(1) : u.searchParams.get("v") ?? /^\/(?:embed|shorts)\/([\w-]{11})/.exec(u.pathname)?.[1] ?? "";
    if (!/^[\w-]{11}$/.test(id)) return { provider: "youtube", embed: null };
    const t = Number.parseInt(u.searchParams.get("t") ?? "", 10);
    return { provider: "youtube", embed: `https://www.youtube-nocookie.com/embed/${id}${Number.isFinite(t) && t > 0 ? `?start=${t}` : ""}` };
  }
  return { provider: "other", embed: null };
}

export const PROVIDER_LABEL: Record<VideoProvider, string> = { bilibili: "哔哩哔哩", youtube: "YouTube", other: "其他" };
