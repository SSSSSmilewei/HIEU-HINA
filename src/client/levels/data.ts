import { api } from "../api";
import type { Chapter, LevelIndex } from "../../shared/levels";

/**
 * 闯关的数据：关卡目录和官方文件（静态，/levels/<课>/），以及「我的仓库」（只存我能改的文件）。
 * 登录后仓库存在服务器上（/api/repos/<课>），游客存在这台浏览器里（localStorage），刷新不丢，换设备就没有了。
 */

const textCache = new Map<string, Promise<string>>();

function fetchText(url: string): Promise<string> {
  let p = textCache.get(url);
  if (!p) {
    p = fetch(url).then((r) => {
      if (!r.ok) throw new Error(`读取 ${url} 失败（${r.status}）`);
      return r.text();
    });
    p.catch(() => textCache.delete(url));
    textCache.set(url, p);
  }
  return p;
}

export async function loadIndex(slug: string): Promise<LevelIndex> {
  return JSON.parse(await fetchText(`/levels/${slug}/index.json`)) as LevelIndex;
}

/** 某个官方文件的原始内容（起始代码、只读文件、测试） */
export function officialFile(slug: string, path: string): Promise<string> {
  return fetchText(`/levels/${slug}/${path}`);
}

/** 判题要用的全部只读文件：不可编辑的源文件 + 测试 */
export async function supportFiles(slug: string, ch: Chapter): Promise<Record<string, string>> {
  const paths = [...(ch.files ?? []).filter((f) => !f.editable).map((f) => f.path), ...(ch.support ?? [])];
  const out: Record<string, string> = {};
  await Promise.all(
    paths.map(async (p) => {
      out[p] = await officialFile(slug, p);
    }),
  );
  return out;
}

// ---------------------------------------------------------------- 仓库

export interface RepoStore {
  /** 已经保存过的文件；没保存过的文件用起始代码 */
  load(): Promise<Record<string, string>>;
  save(path: string, content: string): Promise<void>;
  remove(path: string): Promise<void>;
  /** 存在哪里，显示给学生看 */
  where: string;
}

function localKey(slug: string) {
  return `hiana.repo.${slug}`;
}

function readLocal(slug: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(localKey(slug));
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeLocal(slug: string, files: Record<string, string>) {
  try {
    localStorage.setItem(localKey(slug), JSON.stringify(files));
  } catch {
    throw new Error("这台浏览器不能保存（可能是隐私模式或存储已满），登录后代码会保存在你的账号里");
  }
}

export function localRepo(slug: string): RepoStore {
  return {
    where: "这台浏览器（登录后保存到你的账号）",
    async load() {
      return readLocal(slug);
    },
    async save(path, content) {
      writeLocal(slug, { ...readLocal(slug), [path]: content });
    },
    async remove(path) {
      const files = readLocal(slug);
      delete files[path];
      writeLocal(slug, files);
    },
  };
}

export function serverRepo(slug: string): RepoStore {
  return {
    where: "你的账号",
    async load() {
      const r = await api<{ files: { path: string; content: string }[] }>(`/api/repos/${slug}`);
      return Object.fromEntries(r.files.map((f) => [f.path, f.content]));
    },
    async save(path, content) {
      await api(`/api/repos/${slug}/files`, { method: "PUT", body: { path, content } });
    },
    async remove(path) {
      await api(`/api/repos/${slug}/files?path=${encodeURIComponent(path)}`, { method: "DELETE" });
    },
  };
}

/** 游客在本机通过的关 */
const PASS_KEY = "hiana.levels.passed";

export function localPassed(slug: string): Record<string, number> {
  try {
    const all = JSON.parse(localStorage.getItem(PASS_KEY) ?? "{}") as Record<string, Record<string, number>>;
    return all[slug] ?? {};
  } catch {
    return {};
  }
}

export function markLocalPassed(slug: string, id: string) {
  try {
    const all = JSON.parse(localStorage.getItem(PASS_KEY) ?? "{}") as Record<string, Record<string, number>>;
    all[slug] = { ...(all[slug] ?? {}), [id]: all[slug]?.[id] ?? Date.now() };
    localStorage.setItem(PASS_KEY, JSON.stringify(all));
  } catch {
    /* 存不了就算了，下次再判一次 */
  }
}
