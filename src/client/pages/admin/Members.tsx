import { useMemo, useState } from "react";
import { api, cnToday, longDay, relativeTime, useApi } from "../../api";
import { Icon } from "../../icons";
import type { AdminMember, Invite } from "../../types";
import { Dialog, Empty, ErrorBox, Seg, Skeleton, Spinner, useConfirm, useDialogClose, useTitle, useToast } from "../../ui";
import { Head } from "./Head";

/* ---------- 成员 ---------- */

export function AdminMembersPage({ selfId }: { selfId: string | null }) {
  useTitle("成员");
  const toast = useToast();
  const confirm = useConfirm();
  const { data, error, reload } = useApi<AdminMember[]>("/api/admin/members");
  const [q, setQ] = useState("");
  const [show, setShow] = useState<"active" | "archived">("active");
  const [inviting, setInviting] = useState(false);
  const [code, setCode] = useState<{ name: string; account: string; code: string } | null>(null);
  const [editing, setEditing] = useState<AdminMember | null>(null);

  const list = useMemo(
    () => (data ?? []).filter((m) => m.status === show && (!q.trim() || `${m.name}${m.studentNo}${m.username ?? ""}${m.email ?? ""}${m.org ?? ""}${m.className ?? ""}`.toLowerCase().includes(q.trim().toLowerCase()))),
    [data, q, show],
  );

  const act = async (m: AdminMember, what: "reset" | "admin" | "member" | "archive" | "restore") => {
    const texts = {
      reset: { title: `重置 ${m.name} 的密码？`, body: "旧密码失效，已登录的设备会退出。生成的重置码在登录页“忘记密码”里用。", ok: "重置" },
      admin: { title: `把 ${m.name} 设为管理员？`, body: "可以看所有签到照片、管理成员、发公告。", ok: "设为管理员" },
      member: { title: `取消 ${m.name} 的管理员？`, body: undefined, ok: "取消管理员" },
      archive: { title: `停用 ${m.name} 的账号？`, body: "不能登录，不计入统计，记录保留。", ok: "停用", danger: true },
      restore: { title: `恢复 ${m.name} 的账号？`, body: undefined, ok: "恢复" },
    }[what];
    if (!(await confirm(texts))) return;
    try {
      if (what === "reset") {
        const r = await api<{ code: string }>(`/api/admin/members/${m.id}/reset`, { method: "POST" });
        setCode({ name: m.name, account: m.kind === "external" ? (m.username ?? "") : m.studentNo, code: r.code });
      } else if (what === "admin" || what === "member") {
        await api(`/api/admin/members/${m.id}/role`, { body: { role: what } });
        toast(what === "admin" ? `${m.name} 现在是管理员` : `已取消 ${m.name} 的管理员`);
      } else {
        await api(`/api/admin/members/${m.id}/status`, { body: { status: what === "archive" ? "archived" : "active" } });
        toast(what === "archive" ? `已停用 ${m.name}` : `已恢复 ${m.name}`);
      }
      void reload();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  };

  const counts = { active: data?.filter((m) => m.status === "active").length ?? 0, archived: data?.filter((m) => m.status === "archived").length ?? 0 };

  return (
    <div className="page">
      <Head eyebrow={data ? `${counts.active} 人在用 · ${data.filter((m) => m.status === "active" && !m.hasPassword).length} 人待设密码` : " "} title="成员">
        <button type="button" className="btn btn-primary" onClick={() => setInviting(true)}>
          <Icon name="plus" size={18} stroke={2} />
          邀请码
        </button>
      </Head>
      <div className="row wrap" style={{ justifyContent: "space-between" }}>
        <label className="row" style={{ position: "relative", flex: "1 1 260px", maxWidth: 360 }}>
          <span className="sr-only">搜索成员</span>
          <Icon name="search" size={18} style={{ position: "absolute", left: 14, color: "var(--sub)" }} />
          <input className="input" style={{ paddingLeft: 40 }} placeholder="姓名、学号或班级" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <Seg
          label="状态"
          value={show}
          onChange={setShow}
          options={[
            { value: "active" as const, label: `在用 ${counts.active}` },
            { value: "archived" as const, label: `已停用 ${counts.archived}` },
          ]}
        />
      </div>
      <section className="card card-flush" aria-label="成员列表" style={{ padding: "4px 8px" }}>
        {error && !data ? (
          <ErrorBox error={error} onRetry={reload} />
        ) : !data ? (
          <Skeleton h={300} />
        ) : list.length === 0 ? (
          <Empty title={q ? "没有找到" : show === "active" ? "还没有成员" : "没有停用的账号"}>{undefined}</Empty>
        ) : (
          <div className="table-box">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">姓名 / 昵称</th>
                  <th scope="col">账号</th>
                  <th scope="col">班级 / 单位</th>
                  <th scope="col">状态</th>
                  <th scope="col">最近</th>
                  <th scope="col">
                    <span className="sr-only">操作</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 500 }}>
                      {m.name}
                      {m.role === "admin" && (
                        <span className="tag tag-accent" style={{ marginLeft: 8 }}>
                          管理员
                        </span>
                      )}
                    </td>
                    <td className="small">
                      {m.kind === "external" ? (
                        <span className="stack" style={{ gap: 0 }}>
                          <span>
                            <span className="tag tag-muted" style={{ marginRight: 6 }}>
                              校外
                            </span>
                            <span className="mono">{m.username}</span>
                          </span>
                          {m.email && <span className="sub mono">{m.email}</span>}
                        </span>
                      ) : (
                        <span className="mono">{m.studentNo}</span>
                      )}
                    </td>
                    <td className="sub">{(m.kind === "external" ? m.org : m.className) ?? "—"}</td>
                    <td>{m.hasPassword ? <span className="tag tag-ok">正常</span> : <span className="tag tag-muted">待设密码</span>}</td>
                    <td className="small sub">{m.lastActiveDay ? longDay(m.lastActiveDay, false) : "—"}</td>
                    <td>
                      <span className="row" style={{ gap: 6, justifyContent: "flex-end" }}>
                        {m.status === "active" ? (
                          <>
                            <button type="button" className="btn btn-quiet btn-sm" onClick={() => setEditing(m)}>
                              编辑
                            </button>
                            <button type="button" className="btn btn-quiet btn-sm" onClick={() => act(m, "reset")}>
                              重置密码
                            </button>
                            {m.id !== selfId && (
                              <button type="button" className="btn btn-quiet btn-sm" onClick={() => act(m, m.role === "admin" ? "member" : "admin")}>
                                {m.role === "admin" ? "取消管理员" : "设为管理员"}
                              </button>
                            )}
                            {m.id !== selfId && (
                              <button type="button" className="btn btn-quiet btn-sm" onClick={() => act(m, "archive")}>
                                停用
                              </button>
                            )}
                          </>
                        ) : (
                          <button type="button" className="btn btn-soft btn-sm" onClick={() => act(m, "restore")}>
                            恢复
                          </button>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {inviting && <InviteDialog onClose={() => setInviting(false)} />}
      {editing && (
        <Dialog title={`修改 ${editing.name} 的信息`} sub={editing.kind === "external" ? "校外账号：改用户名或邮箱后，要用新的登录" : "校内账号：改学号后，要用新学号登录"} onClose={() => setEditing(null)}>
          <EditMemberForm m={editing} onSaved={() => void reload()} />
        </Dialog>
      )}
      {code && (
        <Dialog title={`${code.name} 的重置码`} sub={`只显示这一次。发给 TA，在登录页“忘记密码”里填账号 ${code.account} 和这个重置码，设一个新密码。`} onClose={() => setCode(null)}>
          <PasscodeBox code={code.code} />
        </Dialog>
      )}
    </div>
  );
}

/** 修改一个成员的信息。只把改过的字段发给服务器。 */
function EditMemberForm({ m, onSaved }: { m: AdminMember; onSaved: () => void }) {
  const close = useDialogClose();
  const toast = useToast();
  const external = m.kind === "external";
  const initial: Record<string, string> = external
    ? { name: m.name, username: m.username ?? "", email: m.email ?? "", org: m.org ?? "" }
    : { name: m.name, studentNo: m.studentNo, className: m.className ?? "" };
  const [v, setV] = useState<Record<string, string>>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const changed = Object.fromEntries(Object.entries(v).filter(([k, x]) => x.trim() !== initial[k]).map(([k, x]) => [k, x.trim()]));
  const field = (key: string, label: string, opts: { hint?: string; mono?: boolean; max: number; inputMode?: "numeric" | "email" } = { max: 30 }) => (
    <label className="field" key={key}>
      {label}
      <input
        className={opts.mono ? "input mono" : "input"}
        value={v[key] ?? ""}
        onChange={(e) => setV({ ...v, [key]: e.target.value })}
        maxLength={opts.max}
        inputMode={opts.inputMode}
        autoComplete="off"
        spellCheck={false}
      />
      {opts.hint && <span className="hint xsmall">{opts.hint}</span>}
    </label>
  );

  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
          await api(`/api/admin/members/${m.id}`, { method: "PUT", body: changed });
          toast("已保存");
          onSaved();
          close();
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      {external ? (
        <>
          {field("name", "昵称", { max: 20 })}
          {field("username", "用户名", { mono: true, max: 20, hint: "3–20 位，小写字母开头" })}
          {field("email", "邮箱（选填）", { mono: true, max: 100, inputMode: "email" })}
          {field("org", "学校 / 单位（选填）", { max: 40 })}
        </>
      ) : (
        <>
          {field("name", "姓名", { max: 20 })}
          {field("studentNo", "学号", { mono: true, max: 9, inputMode: "numeric", hint: "9 位数字，也是登录账号" })}
          {field("className", "班级", { max: 30, hint: "例如 计科2501" })}
        </>
      )}
      {error && (
        <span className="error-text" role="alert">
          {error}
        </span>
      )}
      <button type="submit" className="btn btn-primary btn-block" disabled={busy || Object.keys(changed).length === 0 || !v.name?.trim()}>
        {busy ? <Spinner /> : "保存"}
      </button>
    </form>
  );
}

function PasscodeBox({ code }: { code: string }) {
  const toast = useToast();
  return (
    <div className="row" style={{ padding: 16, borderRadius: 16, background: "var(--well)", justifyContent: "space-between" }}>
      <span className="mono" style={{ fontSize: 22, fontWeight: 600, letterSpacing: 1 }}>
        {code}
      </span>
      <button
        type="button"
        className="btn btn-soft btn-sm"
        onClick={() => {
          void navigator.clipboard?.writeText(code).then(() => toast("复制好了"));
        }}
      >
        复制
      </button>
    </div>
  );
}

const INVITE_STATE: Record<Invite["state"], { label: string; cls: string }> = {
  unused: { label: "未使用", cls: "tag-accent" },
  used: { label: "已使用", cls: "tag-ok" },
  expired: { label: "已过期", cls: "tag-muted" },
  revoked: { label: "已作废", cls: "tag-muted" },
};

function InviteDialog({ onClose }: { onClose: () => void }) {
  return (
    <Dialog title="邀请码" sub="一码一号，只在生成时显示一次" onClose={onClose} wide>
      <InvitePanel />
    </Dialog>
  );
}

function InvitePanel() {
  const toast = useToast();
  const list = useApi<Invite[]>("/api/admin/invites");
  const [count, setCount] = useState(5);
  const [days, setDays] = useState<number | "none">(14);
  const [note, setNote] = useState("");
  const [kind, setKind] = useState<Invite["kind"]>("campus");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fresh, setFresh] = useState<{ codes: string[]; kind: Invite["kind"] } | null>(null);
  const link = (code: string, k: Invite["kind"]) => `${location.origin}/login?invite=${encodeURIComponent(code)}${k === "external" ? "&kind=external" : ""}`;
  const copy = (text: string, msg: string) => void navigator.clipboard?.writeText(text).then(() => toast(msg));

  const revoke = async (inv: Invite) => {
    try {
      await api(`/api/admin/invites/${inv.id}`, { method: "DELETE" });
      toast(`已作废 …${inv.hint}`);
      void list.reload();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  };

  return (
    <div className="form">
      <form
        className="stack"
        style={{ gap: 12 }}
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          try {
            const r = await api<{ codes: string[] }>("/api/admin/invites", { body: { count, days: days === "none" ? null : days, note: note.trim() || undefined, kind } });
            setFresh({ codes: r.codes, kind });
            void list.reload();
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="row wrap" style={{ alignItems: "flex-end" }}>
          <div className="field">
            账号类型
            <Seg
              label="账号类型"
              value={kind}
              onChange={setKind}
              options={[
                { value: "campus" as const, label: "校内" },
                { value: "external" as const, label: "校外" },
              ]}
            />
          </div>
          <label className="field" style={{ width: 120 }}>
            生成几个
            <input className="input num" type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))} />
          </label>
          <div className="field">
            有效期
            <Seg
              label="有效期"
              value={days}
              onChange={setDays}
              options={[
                { value: 7, label: "7 天" },
                { value: 14, label: "14 天" },
                { value: 30, label: "30 天" },
                { value: "none" as const, label: "不过期" },
              ]}
            />
          </div>
          <label className="field grow" style={{ minWidth: 160 }}>
            备注（可以不填）
            <input className="input" value={note} onChange={(e) => setNote(e.target.value)} maxLength={40} placeholder="例如 2026 秋招新" />
          </label>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? <Spinner /> : "生成"}
          </button>
        </div>
        {error && (
          <span className="error-text" role="alert">
            {error}
          </span>
        )}
      </form>

      {fresh && (
        <div className="stack" style={{ gap: 8 }}>
          <p className="small sub">
            新生成的 {fresh.codes.length} 个{fresh.kind === "external" ? "校外" : "校内"}邀请码，关掉后就看不到了。可以直接发码，也可以发注册链接（打开就是注册页，码已经填好）。
          </p>
          <textarea className="input mono" readOnly rows={Math.min(8, fresh.codes.length + 1)} value={fresh.codes.join("\n")} />
          <div className="row wrap">
            <button type="button" className="btn btn-soft btn-sm" onClick={() => copy(fresh.codes.join("\n"), "邀请码复制好了")}>
              复制邀请码
            </button>
            <button type="button" className="btn btn-soft btn-sm" onClick={() => copy(fresh.codes.map((c) => link(c, fresh.kind)).join("\n"), "注册链接复制好了")}>
              复制注册链接
            </button>
          </div>
        </div>
      )}

      <div className="stack" style={{ gap: 4 }}>
        <span className="small sub">最近生成的</span>
        {list.error && !list.data ? (
          <ErrorBox error={list.error} onRetry={list.reload} />
        ) : !list.data ? (
          <Skeleton h={120} />
        ) : list.data.length === 0 ? (
          <span className="small sub">还没有生成过。</span>
        ) : (
          <div className="table-box">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">码</th>
                  <th scope="col">状态</th>
                  <th scope="col">备注</th>
                  <th scope="col">生成</th>
                  <th scope="col">
                    <span className="sr-only">操作</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.data.map((inv) => (
                  <tr key={inv.id}>
                    <td className="small">
                      <span className="mono">…{inv.hint}</span>
                      {inv.kind === "external" && (
                        <span className="tag tag-muted" style={{ marginLeft: 6 }}>
                          校外
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`tag ${INVITE_STATE[inv.state].cls}`}>{INVITE_STATE[inv.state].label}</span>
                      {inv.usedBy && (
                        <span className="small sub" style={{ marginLeft: 8 }}>
                          {inv.usedBy.name} {inv.usedBy.studentNo}
                        </span>
                      )}
                    </td>
                    <td className="small sub">{inv.note ?? "—"}</td>
                    <td className="small sub">
                      {relativeTime(inv.createdAt)}
                      {inv.state === "unused" && inv.expiresAt ? ` · ${longDay(cnToday(inv.expiresAt), false)} 到期` : ""}
                    </td>
                    <td>
                      {inv.state === "unused" && (
                        <button type="button" className="btn btn-quiet btn-sm" onClick={() => revoke(inv)}>
                          作废
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
