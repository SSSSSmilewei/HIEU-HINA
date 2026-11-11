import { relativeTime } from "../api";
import { Link } from "../router";
import type { Pin } from "./Pins";

export type TitledPin = Pin & { courseTitle: string; itemTitle: string };

/** 钉子列表（后台「蓝色钉子」和「学习 → 问题」共用）：点一条跳到讲义上那颗钉子 */
export function PinRows({ pins }: { pins: TitledPin[] }) {
  return (
    <ul className="card card-flush pin-list">
      {pins.map((p) => (
        <li key={p.id}>
          <Link to={`/courses/${p.course}/learn/${p.page}?pin=${p.id}`} className="pin-row">
            <span className={`pin-badge ${p.status === "resolved" ? "resolved" : p.answered ? "answered" : "open"}`}>{p.messages.length}</span>
            <span className="pin-row-main">
              <span className="small sub">
                {p.courseTitle} · {p.itemTitle}
                {p.anchorLabel ? ` · ${p.anchorLabel}` : ""}
              </span>
              <span className="clamp-2">{p.messages[0]?.body}</span>
              <span className="small sub">
                {p.author} · {relativeTime(p.createdAt)}
              </span>
            </span>
            <span className="pin-row-meta small sub num">
              {p.status === "resolved" ? "已解决" : p.answered ? "有人回了" : "等回复"}
              {p.votes > 0 && ` · ${p.votes} 人也想问`}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
