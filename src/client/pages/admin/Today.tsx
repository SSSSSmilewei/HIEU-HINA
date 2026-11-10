import { useState } from "react";
import { addDays } from "../../../shared/heatmap";
import { api, clock, cnToday, invalidate, longDay, useApi } from "../../api";
import { Icon } from "../../icons";
import { Link } from "../../router";
import type { AdminMember, AdminToday } from "../../types";
import { Dialog, Empty, ErrorBox, Skeleton, useTitle, useToast } from "../../ui";
import { Head } from "./Head";

/* ---------- 今日签到 ---------- */

export function AdminTodayPage() {
  useTitle("今日签到");
  const toast = useToast();
  const { data, error, reload } = useApi<AdminToday>("/api/admin/attendance/today", { refreshMs: 30_000 });
  const idle = useApi<AdminMember[]>("/api/admin/idle?days=14");
  const [photo, setPhoto] = useState<{ key: string; label: string } | null>(null);
  const [exporting, setExporting] = useState(false);

  const evening = data?.records.filter((r) => r.kind === "evening") ?? [];

  const flipCode = async () => {
    if (!data) return;
    const next = !data.rule.requireCode;
    try {
      await api("/api/admin/attendance/settings", { method: "PUT", body: { days: data.rule.days.join(","), window: data.rule.window.join("-"), requireCode: next } });
      toast(next ? "现场口令已开启" : "现场口令已关闭，学员拍照就能签到");
      void reload();
      invalidate("/api/attendance");
    } catch (e) {
      toast((e as Error).message, "error");
    }
  };

  return (
    <div className="page">
      <Head eyebrow={data ? `${longDay(data.today)} · ${data.isEveningDay ? `晚自习 ${data.rule.window[0]} – ${data.rule.window[1]}` : "今天没有晚自习"}` : " "} title="今日签到">
        <button type="button" className="btn btn-ghost" onClick={() => setExporting(true)}>
          <Icon name="download" size={18} />
          导出给学校
        </button>
      </Head>

      {error && !data ? (
        <ErrorBox error={error} onRetry={reload} />
      ) : !data ? (
        <Skeleton h={140} r={22} />
      ) : (
        <div className="grid-cards" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 14 }}>
          <div className="card stack" style={{ gap: 10 }}>
            <span className="small sub">晚自习已签到</span>
            <span className="row" style={{ alignItems: "baseline", gap: 6 }}>
              <span className="big-num">{evening.length}</span>
              <span className="sub">/ {data.members} 人</span>
            </span>
            <div className="bar" aria-hidden="true">
              <i style={{ width: `${data.members ? Math.min(100, (evening.length / data.members) * 100) : 0}%` }} />
            </div>
          </div>
          <div className="night-card" style={{ gap: 10 }}>
            <span className="row" style={{ justifyContent: "space-between" }}>
              <span id="code-l" className="small night-sub">
                现场口令
              </span>
              <button type="button" role="switch" className="switch" aria-checked={data.rule.requireCode} aria-labelledby="code-l" onClick={flipCode} />
            </span>
            {data.rule.requireCode ? (
              <span className="row" aria-label={`今天的口令 ${data.code}`} style={{ gap: 8 }}>
                {data.code.split("").map((d, i) => (
                  <span
                    key={i}
                    className="mono rise"
                    style={{ "--i": i, width: 40, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 600, color: "var(--night-accent)" } as React.CSSProperties}
                  >
                    {d}
                  </span>
                ))}
              </span>
            ) : null}
            <span className="xsmall night-sub" style={{ lineHeight: "18px" }}>
              {data.rule.requireCode ? "每天自动换" : "已关闭"}
            </span>
          </div>
        </div>
      )}

      <div className="stack" style={{ gap: 20 }}>
        <section className="card card-flush" aria-labelledby="rec-h" style={{ padding: "8px 8px 4px" }}>
          <div className="section-head" style={{ padding: "12px 12px 8px" }}>
            <h2 id="rec-h" className="h3">
              签到记录
            </h2>
          </div>
          {!data ? (
            <Skeleton h={240} />
          ) : data.records.length === 0 ? (
            <Empty title="今天还没有人签到" />
          ) : (
            <div className="table-box">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">姓名 · 学号</th>
                    <th scope="col">签到</th>
                    <th scope="col">签退</th>
                    <th scope="col">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {data.records.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <span className="stack" style={{ gap: 0 }}>
                          <span style={{ fontWeight: 500 }}>{r.name}</span>
                          <span className="mono xsmall sub">{r.studentNo}</span>
                        </span>
                      </td>
                      <td>
                        <span className="row">
                          {r.inPhoto && <Thumb k={r.inPhoto} label={`${r.name} 的签到照片`} onOpen={setPhoto} />}
                          <span className="num">{clock(r.inAt)}</span>
                        </span>
                      </td>
                      <td>
                        <span className="row">
                          {r.outPhoto && <Thumb k={r.outPhoto} label={`${r.name} 的签退照片`} onOpen={setPhoto} />}
                          <span className="num sub">{r.outAt ? clock(r.outAt) : "—"}</span>
                        </span>
                      </td>
                      <td>
                        <span className={`tag ${r.status === "open" ? "tag-accent" : r.status === "closed" ? "tag-muted" : "tag-bad"}`}>
                          {r.status === "open" ? "学习中" : r.status === "closed" ? "已签退" : "未签退"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card stack" aria-labelledby="idle-h" style={{ gap: 6, maxWidth: 560 }}>
          <h2 id="idle-h" className="h3">
            两周没动静
          </h2>
          {!idle.data ? (
            <Skeleton h={120} />
          ) : idle.data.length === 0 ? (
            <span className="small sub">大家都有在学。</span>
          ) : (
            idle.data.map((m) => (
              <div key={m.id} className="list-row">
                <span className="avatar" aria-hidden="true" style={{ width: 32, height: 32, fontSize: "var(--fs-xs)", background: "var(--well)", color: "var(--sub)" }}>
                  {m.name.slice(0, 1)}
                </span>
                <span className="grow stack" style={{ gap: 0 }}>
                  <span style={{ fontSize: "var(--fs-sm)", lineHeight: "22px", fontWeight: 500 }}>{m.name}</span>
                  <span className="xsmall sub">{m.lastActiveDay ? `最后一次：${longDay(m.lastActiveDay, false)}` : m.hasPassword ? "还没有记录" : "还没激活账号"}</span>
                </span>
              </div>
            ))
          )}
        </section>
      </div>

      {photo && (
        <Dialog title={photo.label} onClose={() => setPhoto(null)} wide>
          <img src={`/api/files/${photo.key}`} alt={photo.label} style={{ width: "100%", borderRadius: 16, background: "var(--well)" }} />
        </Dialog>
      )}
      {exporting && <ExportDialog onClose={() => setExporting(false)} />}
    </div>
  );
}

function Thumb({ k, label, onOpen }: { k: string; label: string; onOpen: (p: { key: string; label: string }) => void }) {
  return (
    <button type="button" className="photo-thumb" aria-label={label} onClick={() => onOpen({ key: k, label })}>
      <img src={`/api/files/${k}`} alt="" loading="lazy" />
    </button>
  );
}

function ExportDialog({ onClose }: { onClose: () => void }) {
  const today = cnToday();
  const [from, setFrom] = useState(addDays(today, -30));
  const [to, setTo] = useState(today);
  const qs = `from=${from}&to=${to}`;
  const href = `/api/admin/attendance.csv?${qs}`;
  return (
    <Dialog title="导出签到记录" onClose={onClose}>
      <div className="form">
        <div className="row wrap">
          <label className="field grow">
            从
            <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="field grow">
            到
            <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
        </div>
        <p className="small sub pretty">签到表带照片和手写签名，可以直接打印或存成 PDF 交给学校（最多两个月）；CSV 只有文字，适合用 Excel 再加工。</p>
        <div className="dialog-actions">
          <a className="btn btn-ghost" href={href} download>
            <Icon name="download" size={18} />
            下载 CSV
          </a>
          <Link className="btn btn-primary" to={`/admin/report?${qs}`}>
            打开签到表
          </Link>
        </div>
      </div>
    </Dialog>
  );
}
