import { ASSOCIATION, DEPARTMENTS, DIRECTIONS, HONORS, JOIN_STEPS, YEAR, honorStats, SCHOOL_AWARDS, schoolAwardsText } from "../../shared/association";
import { cnDate } from "../../shared/heatmap";
import { getSetting } from "../db";
import { HttpError, type Router, json } from "../http";
import { DAY_RE } from "./common";

/* 公共信息（协会介绍、教学周）和 App 更新、安装包下载。游客也能用。 */

/** 给 1.x 旧版 App 看的“最新版本”：比任何 1.x 都大，旧版就会提示下载新的 0.x 安装包。 */
const LEGACY_LATEST = "1.99.0";

const VERSION_RE = /^\d+\.\d+\.\d+$/;

/** /api/app/apk 能转发的安装包：通用包和三个按芯片分的包（名字是 flutter build apk 产出的文件名） */
const APK_FILES: Record<string, string> = {
  universal: "app-release.apk",
  "arm64-v8a": "app-arm64-v8a-release.apk",
  "armeabi-v7a": "app-armeabi-v7a-release.apk",
  x86_64: "app-x86_64-release.apk",
};

/** 教学周：会长在后台设置开学日（第 1 周的周一），没设时不显示周次。 */
export function teachingWeek(semesterStart: string | null, today: string): number | null {
  if (!semesterStart || !DAY_RE.test(semesterStart)) return null;
  const diff = Math.floor((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${semesterStart}T00:00:00Z`)) / 86_400_000);
  if (diff < 0) return null;
  const week = Math.floor(diff / 7) + 1;
  return week <= 30 ? week : null;
}

export function siteRoutes(api: Router) {
  /** 教学周和日期。游客也能看。 */
  /** 协会介绍和学生成就（App 用；网页直接打包了同一份数据） */
  api.get("/api/association", () =>
    json({ association: ASSOCIATION, directions: DIRECTIONS, departments: DEPARTMENTS, year: YEAR, joinSteps: JOIN_STEPS, honors: HONORS, stats: honorStats(), schoolAwards: { ...SCHOOL_AWARDS, text: schoolAwardsText() } }),
  );

  api.get("/api/calendar", async (c) => {
    const today = cnDate(Date.now());
    const start = await getSetting(c.env.DB, "semester_start");
    return json({ today, semesterStart: start, week: teachingWeek(start, today) });
  });

  /**
   * App 启动时检查更新。会长在 settings 表里改这三项即可，不用重新部署：
   *  app_latest_version（如 0.4.1）、app_min_version（低于它就强制更新）、app_apk_url（APK 下载地址）。
   *
   * 内测期间版本号改成了 0.x.x。0.4.0 起的 App 请求时带 ?scheme=0；
   * 不带的是以前的 1.x，它拿 1.3.1 和 0.x 比会以为自己更新，所以给它一个 1.x 的“最新版本”，让它照样提示下载。
   */
  api.get("/api/app/version", async (c) => {
    const [latest, min, apk] = await Promise.all([
      getSetting(c.env.DB, "app_latest_version"),
      getSetting(c.env.DB, "app_min_version"),
      getSetting(c.env.DB, "app_apk_url"),
    ]);
    // 没单独填下载地址时，用本站转发的通用安装包（国内打不开 GitHub 也能下）
    const apkUrl = apk || (latest ? `${c.url.origin}/api/app/apk?v=${latest}` : null);
    const v = { latest: latest ?? "0.0.0", min: min ?? "0.0.0", apkUrl };
    if (latest && c.url.searchParams.get("scheme") !== "0" && latest.startsWith("0.")) {
      return json({ ...v, latest: LEGACY_LATEST, min: v.min.startsWith("0.") ? "1.0.0" : v.min });
    }
    return json(v);
  });

  /**
   * 下载 App 安装包：从 GitHub Releases 取，经 Cloudflare 转发给用户。
   * GitHub 在国内经常下不动，本站域名能打开，所以安装包从这里走。同一版本的包会缓存在 Cloudflare 上。
   *  ?v=0.4.0  版本（默认后台填的最新版本）
   *  ?abi=universal | arm64-v8a | armeabi-v7a | x86_64（默认 universal，所有手机都能装）
   * 只转发白名单里的文件名，不能拿来下别的东西。
   */
  api.get("/api/app/apk", async (c) => {
    const v = c.url.searchParams.get("v") || (await getSetting(c.env.DB, "app_latest_version"));
    if (!v || !VERSION_RE.test(v)) throw new HttpError(404, "还没有发布安装包");
    const abi = c.url.searchParams.get("abi") || "universal";
    let file = APK_FILES[abi];
    if (!file) throw new HttpError(400, "没有这种安装包");
    const repo = c.env.APP_RELEASE_REPO || "SSSSSmilewei/HIANA-Association";
    const get = (name: string) =>
      fetch(`https://github.com/${repo}/releases/download/app-v${v}/${name}`, {
        cf: { cacheEverything: true, cacheTtl: 30 * 86_400 },
      } as RequestInit);
    let upstream = await get(file);
    // 0.4.0 及更早的版本没有通用包，退回 arm64-v8a（大多数手机能装）
    if (upstream.status === 404 && abi === "universal") {
      file = APK_FILES["arm64-v8a"];
      upstream = await get(file);
    }
    if (!upstream.ok || !upstream.body) {
      throw new HttpError(upstream.status === 404 ? 404 : 502, upstream.status === 404 ? `${v} 版还没有这个安装包` : "取安装包失败，稍后再试");
    }
    const headers = new Headers({
      "content-type": "application/vnd.android.package-archive",
      "content-disposition": `attachment; filename="hiana-${v}${file === APK_FILES.universal ? "" : "-" + file.replace(/^app-|-release\.apk$/g, "")}.apk"`,
      "cache-control": "public, max-age=86400",
    });
    const len = upstream.headers.get("content-length");
    if (len) headers.set("content-length", len);
    return new Response(upstream.body, { headers });
  });
}
