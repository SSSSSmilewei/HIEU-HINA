import { useRef, useState } from "react";
import { api, invalidate, useApi } from "../../api";
import { compressImage } from "../../components/NoticeBody";
import { Icon } from "../../icons";
import type { Notice } from "../../types";
import { Dialog, Empty, ErrorBox, Seg, Skeleton, Spinner, useConfirm, useDialogClose, useTitle, useToast } from "../../ui";
import { Head } from "./Head";

/* ---------- 公告 ---------- */

export function AdminNoticesPage() {
  useTitle("发公告");
  const toast = useToast();
  const confirm = useConfirm();
  const { data, error, reload } = useApi<Notice[]>("/api/notices");
  const [editing, setEditing] = useState<Notice | "new" | null>(null);
  const remove = async (n: Notice) => {
    if (!(await confirm({ title: `删除「${n.title}」？`, body: n.kind === "competition" ? "登记名单也会一起不显示。" : undefined, ok: "删除", danger: true }))) return;
    try {
      await api(`/api/admin/notices/${n.id}`, { method: "DELETE" });
      toast("已删除");
      invalidate("/api/notices");
    } catch (e) {
      toast((e as Error).message, "error");
    }
  };
  return (
    <div className="page">
      <Head eyebrow="公告 · 比赛卡" title="发公告">
        <button type="button" className="btn btn-primary" onClick={() => setEditing("new")}>
          <Icon name="plus" size={18} stroke={2} />
          新建
        </button>
      </Head>
      <section className="card card-flush" style={{ padding: "4px 16px" }}>
        {error && !data ? (
          <ErrorBox error={error} onRetry={reload} />
        ) : !data ? (
          <Skeleton h={240} />
        ) : data.length === 0 ? (
          <Empty title="还没有公告" action={<button type="button" className="btn btn-primary" onClick={() => setEditing("new")}>写第一条</button>} />
        ) : (
          data.map((n) => (
            <div key={n.id} className="list-row" style={{ flexWrap: "wrap" }}>
              <span className={`tag ${n.kind === "competition" ? "tag-accent" : ""}`}>{n.kind === "competition" ? "比赛" : "公告"}</span>
              <span className="grow stack" style={{ gap: 0 }}>
                <span style={{ fontWeight: 500 }}>
                  {n.pinned && "【置顶】"}
                  {n.title}
                </span>
                <span className="xsmall sub">
                  {[n.author, n.deadline ? `截止 ${n.deadline}` : null, n.kind === "competition" ? `${n.entries.length} 人登记` : null].filter(Boolean).join(" · ")}
                </span>
              </span>
              <button type="button" className="btn btn-quiet btn-sm" onClick={() => setEditing(n)}>
                编辑
              </button>
              <button type="button" className="btn btn-quiet btn-sm" onClick={() => remove(n)}>
                删除
              </button>
            </div>
          ))
        )}
      </section>
      {editing && (
        <Dialog title={editing === "new" ? "新建公告" : "编辑公告"} onClose={() => setEditing(null)} wide>
          <NoticeForm initial={editing === "new" ? null : editing} />
        </Dialog>
      )}
    </div>
  );
}

function NoticeForm({ initial }: { initial: Notice | null }) {
  const close = useDialogClose();
  const toast = useToast();
  const [kind, setKind] = useState<"notice" | "competition">(initial?.kind ?? "notice");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [docUrl, setDocUrl] = useState(initial?.docUrl ?? "");
  const [groupInfo, setGroupInfo] = useState(initial?.groupInfo ?? "");
  const [deadline, setDeadline] = useState(initial?.deadline ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join("，"));
  const [pinned, setPinned] = useState(initial?.pinned ?? false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await api<{ url: string }>("/api/admin/notices/image", { body: { data: await compressImage(file) } });
      const at = bodyRef.current?.selectionStart ?? body.length;
      const before = body.slice(0, at);
      const after = body.slice(at);
      const md = `${before && !before.endsWith("\n") ? "\n" : ""}![](${url})\n`;
      setBody(before + md + after);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };
  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const payload = {
          kind,
          title,
          body,
          docUrl: docUrl.trim(),
          groupInfo: groupInfo.trim() || undefined,
          deadline,
          tags: tags
            .split(/[,，、\s]+/)
            .map((t) => t.trim())
            .filter(Boolean),
          pinned,
        };
        try {
          if (initial) await api(`/api/admin/notices/${initial.id}`, { method: "PUT", body: payload });
          else await api("/api/admin/notices", { body: payload });
          toast(initial ? "已保存" : kind === "competition" ? "比赛已发布，会推送到群里" : "已发布");
          invalidate("/api/notices");
          close();
        } catch (err) {
          setError((err as Error).message);
          setBusy(false);
        }
      }}
    >
      <Seg
        label="类型"
        flat
        value={kind}
        onChange={setKind}
        options={[
          { value: "notice" as const, label: "公告" },
          { value: "competition" as const, label: "比赛卡" },
        ]}
      />
      <label className="field">
        标题
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} required />
      </label>
      <label className="field">
        正文
        <textarea ref={bodyRef} className="input" rows={6} value={body} onChange={(e) => setBody(e.target.value)} maxLength={4000} />
        <span className="row wrap" style={{ gap: 10 }}>
          <button type="button" className="btn btn-ghost btn-sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? <Spinner /> : <Icon name="plus" size={14} stroke={2} />}
            插入图片
          </button>
          <span className="hint xsmall">图片以 ![](地址) 单独成行的形式写入正文。</span>
        </span>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onPickImage} />
      </label>
      {kind === "competition" && (
        <>
          <div className="row wrap">
            <label className="field grow">
              截止日期
              <input className="input" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </label>
            <label className="field grow">
              群号或联系方式
              <input className="input" value={groupInfo} onChange={(e) => setGroupInfo(e.target.value)} maxLength={200} placeholder="QQ 群 123456" />
            </label>
          </div>
          <label className="field">
            标签<span className="hint">用逗号隔开，例如：AI，视觉，团队赛</span>
            <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} />
          </label>
        </>
      )}
      <label className="field">
        {kind === "competition" ? "官方文档链接" : "相关链接（可以不填）"}
        <input className="input" type="url" value={docUrl} onChange={(e) => setDocUrl(e.target.value)} placeholder="https://" />
      </label>
      <label className="row" style={{ gap: 12, fontSize: "var(--fs-sm)", cursor: "pointer" }}>
        <button type="button" role="switch" className="switch" aria-checked={pinned} onClick={() => setPinned(!pinned)} aria-label="置顶" />
        置顶
      </label>
      {error && (
        <span className="error-text" role="alert">
          {error}
        </span>
      )}
      <div className="dialog-actions">
        <button type="button" className="btn btn-ghost" onClick={close}>
          取消
        </button>
        <button type="submit" className="btn btn-primary" disabled={busy || !title.trim()}>
          {busy ? <Spinner /> : initial ? "保存" : "发布"}
        </button>
      </div>
    </form>
  );
}
