import { useState } from "react";
import { api, invalidate, useApi } from "../../api";
import type { AdminToday } from "../../types";
import { Seg, Skeleton, Spinner, useTitle, useToast } from "../../ui";
import { Head } from "./Head";

const WD = ["一", "二", "三", "四", "五", "六", "日"];

/* ---------- 设置 ---------- */

export function AdminSettingsPage() {
  useTitle("设置");
  const toast = useToast();
  const today = useApi<AdminToday>("/api/admin/attendance/today");
  const settings = useApi<Record<string, string | null>>("/api/admin/settings");
  return (
    <div className="page">
      <Head eyebrow="晚自习 · 学期 · App" title="设置" />
      {today.data ? <EveningForm rule={today.data.rule} onSaved={() => (void today.reload(), invalidate("/api/attendance"), toast("晚自习设置已保存"))} /> : <Skeleton h={260} r={22} />}
      {settings.data ? <OtherSettings s={settings.data} onSaved={() => (void settings.reload(), invalidate("/api/calendar"), toast("已保存"))} /> : <Skeleton h={260} r={22} />}
    </div>
  );
}

function EveningForm({ rule, onSaved }: { rule: AdminToday["rule"]; onSaved: () => void }) {
  const [days, setDays] = useState<number[]>(rule.days);
  const [start, setStart] = useState(rule.window[0]);
  const [end, setEnd] = useState(rule.window[1]);
  const [code, setCode] = useState(rule.requireCode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toastErr = useToast();
  return (
    <form
      className="card form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
          await api("/api/admin/attendance/settings", { method: "PUT", body: { days: [...days].sort().join(","), window: `${start}-${end}`, requireCode: code } });
          onSaved();
        } catch (err) {
          setError((err as Error).message);
          toastErr((err as Error).message, "error");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="h3">晚自习</h2>
      <div className="stack" style={{ gap: 8 }}>
        <span className="small" style={{ fontWeight: 600 }}>
          每周哪几天
        </span>
        <div className="row wrap" role="group" aria-label="每周哪几天" style={{ gap: 6 }}>
          {WD.map((w, i) => (
            <button
              key={w}
              type="button"
              className="chip"
              aria-pressed={days.includes(i + 1)}
              style={{ "--c": "var(--accent)", minWidth: 52, justifyContent: "center" } as React.CSSProperties}
              onClick={() => setDays(days.includes(i + 1) ? days.filter((d) => d !== i + 1) : [...days, i + 1])}
            >
              周{w}
            </button>
          ))}
        </div>
      </div>
      <div className="row wrap">
        <label className="field grow">
          开始
          <input className="input" type="time" value={start} onChange={(e) => setStart(e.target.value)} required />
        </label>
        <label className="field grow">
          结束（自动结束签到）
          <input className="input" type="time" value={end} onChange={(e) => setEnd(e.target.value)} required />
        </label>
      </div>
      <label className="row" style={{ gap: 12, fontSize: "var(--fs-sm)", cursor: "pointer" }}>
        <button type="button" role="switch" className="switch" aria-checked={code} onClick={() => setCode(!code)} aria-label="晚自习签到要输现场口令" />
        <span className="stack" style={{ gap: 0 }}>
          <span>晚自习签到要输现场口令</span>
        </span>
      </label>
      {error && <span className="error-text">{error}</span>}
      <div className="row">
        <button type="submit" className="btn btn-primary" disabled={busy || days.length === 0}>
          {busy ? <Spinner /> : "保存"}
        </button>
      </div>
    </form>
  );
}

function OtherSettings({ s, onSaved }: { s: Record<string, string | null>; onSaved: () => void }) {
  const [semester, setSemester] = useState(s.semester_start ?? "");
  const [latest, setLatest] = useState(s.app_latest_version ?? "");
  const [min, setMin] = useState(s.app_min_version ?? "");
  const [apk, setApk] = useState(s.app_apk_url ?? "");
  const [regOpen, setRegOpen] = useState<"1" | "0">(s.registration_open === "0" ? "0" : "1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className="card form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const body: Record<string, string> = { registration_open: regOpen };
        if (semester) body.semester_start = semester;
        if (latest) body.app_latest_version = latest;
        if (min) body.app_min_version = min;
        // 清空也要发：空字符串表示改用本站转发
        body.app_apk_url = apk.trim();
        try {
          await api("/api/admin/settings", { method: "PUT", body });
          onSaved();
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="h3">学期、注册与 App</h2>
      <label className="field">
        开学日期<span className="hint">第 1 周的周一</span>
        <input className="input" type="date" value={semester} onChange={(e) => setSemester(e.target.value)} style={{ maxWidth: 240 }} />
      </label>
      <div className="field">
        注册
        <Seg
          label="注册"
          value={regOpen}
          onChange={setRegOpen}
          options={[
            { value: "1" as const, label: "开放（需要邀请码）" },
            { value: "0" as const, label: "关闭" },
          ]}
        />
      </div>
      <div className="row wrap">
        <label className="field grow">
          App 最新版本
          <input className="input mono" value={latest} onChange={(e) => setLatest(e.target.value)} placeholder="0.4.1" />
        </label>
        <label className="field grow">
          最低可用版本<span className="hint">低于它会要求更新</span>
          <input className="input mono" value={min} onChange={(e) => setMin(e.target.value)} placeholder="0.4.0" />
        </label>
      </div>
      <label className="field">
        APK 下载地址<span className="hint">留空就用本站转发的通用安装包（从 GitHub 发行版取，国内也能下）</span>
        <input className="input" type="url" value={apk} onChange={(e) => setApk(e.target.value)} placeholder="留空即可" />
      </label>
      {error && <span className="error-text">{error}</span>}
      <div>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? <Spinner /> : "保存"}
        </button>
      </div>
    </form>
  );
}
