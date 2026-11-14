import { Link } from "../router";

export type LearnTab = "mine" | "all" | "blocks" | "questions";

/** 「学习」的页内标签：我的学习、课程目录、知识块、问题。新生任务是知识块里的第一张卡片（/start 归在「知识块」下）。 */
const TABS: { key: LearnTab; to: string; label: string }[] = [
  { key: "mine", to: "/courses?tab=mine", label: "我的学习" },
  { key: "all", to: "/courses?tab=all", label: "课程目录" },
  { key: "blocks", to: "/courses?tab=blocks", label: "知识块" },
  { key: "questions", to: "/courses?tab=questions", label: "问题" },
];

export function LearnTabs({ current }: { current: LearnTab }) {
  return (
    <nav className="page-tabs" aria-label="学习">
      {TABS.map((t) => (
        <Link key={t.key} to={t.to} aria-current={t.key === current ? "page" : undefined}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
