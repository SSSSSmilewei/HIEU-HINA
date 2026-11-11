import { useState } from "react";
import { Dialog } from "../ui";

/** 一步的小示意图：几条灰线代表讲义，右边是钉子或按钮 */
function Pic({ kind }: { kind: "find" | "kinds" | "share" | "read" }) {
  return (
    <span className="pin-guide-pic" aria-hidden="true">
      <i className="pg-line" style={{ top: 18 }} />
      <i className="pg-line short" style={{ top: 34 }} />
      <i className="pg-line" style={{ top: 50 }} />
      {kind === "find" && (
        <>
          <i className="pg-btn">提问或标记</i>
          <i className="pg-plus" style={{ top: 34 }}>
            ＋
          </i>
        </>
      )}
      {kind === "kinds" && (
        <>
          <i className="pg-dot" style={{ top: 18 }} />
          <i className="pg-dot note" style={{ top: 50 }} />
        </>
      )}
      {kind === "share" && <i className="pg-seg">只给自己 | 公开</i>}
      {kind === "read" && (
        <>
          <i className="pg-dot" style={{ top: 34 }} />
          <i className="pg-bubble" />
        </>
      )}
    </span>
  );
}

const STEPS: { title: string; body: string; pic: "find" | "kinds" | "share" | "read" }[] = [
  {
    title: "找到要钉的那一段",
    body: "点击讲义上方的「提问或标记」，再点击那一段。在电脑上也可以把鼠标移到那一段，点击右侧出现的「＋」。练手题也可以钉。",
    pic: "find",
  },
  {
    title: "选择「提问」或「标记」",
    body: "提问（蓝色）所有人都能看到，同学、管理员和 AI 助手都可以回答，管理员会收到通知。标记（琥珀色）用来划重点或记录心得，备注可以不写。",
    pic: "kinds",
  },
  {
    title: "决定标记给谁看",
    body: "选「只给自己」时只有你能看到；选「公开」时其他同学也能看到，并可以在下面回复。点开标记后可以随时更改。",
    pic: "share",
  },
  {
    title: "查看和回复",
    body: "讲义右侧的钉子都可以点开；讲义末尾列出本页所有的问题和标记。看到别人的问题时，可以直接回答，也可以点「我也想问」。提问的人弄明白后可以标成「已解决」。所有问题汇总在「学习 → 问题」。",
    pic: "read",
  },
];

/** 蓝色钉子使用说明（弹窗） */
export function PinGuide({ onClose }: { onClose: () => void }) {
  return (
    <Dialog title="蓝色钉子使用说明" sub="在讲义上提问，或者给自己做标记" onClose={onClose}>
      <div className="stack" style={{ gap: 20 }}>
        <ol className="pin-guide">
          {STEPS.map((s) => (
            <li key={s.title}>
              <span className="pin-guide-text">
                <b>{s.title}</b>
                <span className="small sub">{s.body}</span>
              </span>
              <Pic kind={s.pic} />
            </li>
          ))}
        </ol>
        <p className="small sub">快捷键：在讲义页按 Q 开始钉，按 Esc 取消。游客可以查看所有问题和公开的标记，登录后才能提问、标记和回复。</p>
        <div className="dialog-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            开始使用
          </button>
        </div>
      </div>
    </Dialog>
  );
}

/** 「使用说明」按钮，点开弹窗 */
export function PinGuideButton({ className = "btn btn-quiet btn-sm", label = "使用说明" }: { className?: string; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {label}
      </button>
      {open && <PinGuide onClose={() => setOpen(false)} />}
    </>
  );
}
