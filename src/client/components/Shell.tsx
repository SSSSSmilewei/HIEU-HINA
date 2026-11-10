import { useEffect, useState } from "react";
import { useApi } from "../api";
import { Icon, type IconName } from "../icons";
import { Link, useLocation } from "../router";
import { loginHref } from "../session";
import type { AttendanceState, Me } from "../types";

interface NavItem {
  to: string;
  label: string;
  short?: string;
  icon: IconName;
  match: (p: string) => boolean;
  dot?: boolean;
  /** 右边的数字（比如新报名有几条），0 不显示 */
  count?: number;
}

const MEMBER_NAV: NavItem[] = [
  { to: "/", label: "首页", icon: "home", match: (p) => p === "/" },
  { to: "/courses", label: "学习", icon: "book", match: (p) => p.startsWith("/courses") || p.startsWith("/blocks") || p === "/start" },
  { to: "/checkin", label: "签到", icon: "camera", match: (p) => p.startsWith("/checkin") },
  { to: "/notices", label: "公告与活动", icon: "megaphone", match: (p) => p.startsWith("/notices") },
  { to: "/me", label: "我的", icon: "user", match: (p) => p.startsWith("/me") || p === "/password" },
];

/** 协会介绍（含学生成就）：侧边栏单独一组 */
const ASSOC_NAV: NavItem[] = [{ to: "/about", label: "协会介绍", icon: "flag", match: (p) => p === "/about" }];

/** 游客：只有能看的几页，最后一项是登录 */
const GUEST_NAV: NavItem[] = [
  MEMBER_NAV[0],
  { to: "/about", label: "协会", icon: "flag", match: (p) => p === "/about" },
  MEMBER_NAV[1],
  MEMBER_NAV[3],
  { to: "/login", label: "登录", icon: "user", match: (p) => p === "/login" },
];

/** 后台按四块功能分组（排行榜暂缓，所以没有排行一组） */
const ADMIN_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "管理 · 签到",
    items: [
      { to: "/admin", label: "今日签到", icon: "clipboard", match: (p) => p === "/admin" },
      { to: "/admin/report", label: "签到表", icon: "calendar", match: (p) => p === "/admin/report" },
    ],
  },
  { label: "管理 · 学习", items: [{ to: "/admin/pins", label: "蓝色钉子", icon: "pin", match: (p) => p.startsWith("/admin/pins") }] },
  {
    label: "管理 · 通知与活动",
    items: [
      { to: "/admin/notices", label: "发公告", icon: "edit", match: (p) => p.startsWith("/admin/notices") },
      { to: "/admin/applications", label: "新生报名", icon: "inbox", match: (p) => p.startsWith("/admin/applications") },
    ],
  },
  {
    label: "管理 · 成员与设置",
    items: [
      { to: "/admin/members", label: "成员", icon: "users", match: (p) => p.startsWith("/admin/members") },
      { to: "/admin/settings", label: "设置", icon: "sliders", match: (p) => p.startsWith("/admin/settings") },
    ],
  },
];

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <i style={{ background: "var(--l2)" }} />
      <i style={{ background: "var(--l4)" }} />
      <i style={{ background: "var(--l3)" }} />
      <i style={{ background: "var(--l1)" }} />
    </span>
  );
}

function NavList({ items, path, label, small }: { items: NavItem[]; path: string; label: string; small?: boolean }) {
  const i = items.findIndex((n) => n.match(path));
  return (
    <nav className="nav" aria-label={label}>
      {small && <span className="nav-label">{label}</span>}
      <div className="nav-items">
        <span className="nav-pill" aria-hidden="true" hidden={i < 0} style={{ "--i": i } as React.CSSProperties} />
        {items.map((n) => (
          <Link key={n.to} to={n.to} className="nav-item" aria-current={n.match(path) ? "page" : undefined}>
            <Icon name={n.icon} />
            {n.label}
            {n.dot && <span className="nav-dot" aria-label="晚自习进行中" />}
            {!!n.count && (
              <span className="nav-count num" aria-label={`${n.count} 条新报名`}>
                {n.count}
              </span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function Shell({ me, children }: { me: Me; children: React.ReactNode }) {
  const { path, search } = useLocation();
  const isMember = me.role === "member";
  const isAdmin = !!me.isAdmin;
  const inAdmin = path.startsWith("/admin");
  // 手机上侧栏收起来，点左上角 ☰ 从左边滑出；换页、点遮罩、按 Esc 都会收起
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path, search]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  // 签到只给校内账号
  const campus = isMember && me.member?.kind !== "external";
  const att = useApi<AttendanceState>(campus ? "/api/attendance" : null, { refreshMs: 120_000 });
  const live = !!att.data && att.data.evening.open && !att.data.evening.record && !att.data.current;
  // 管理员导航上“新生报名”旁边的数字
  const apps = useApi<{ new: number }>(isAdmin ? "/api/admin/applications/count" : null, { refreshMs: 300_000 });
  const fresh = apps.data?.new ?? 0;
  const adminGroups = ADMIN_GROUPS.map((g) => ({ ...g, items: g.items.map((n) => (n.to === "/admin/applications" ? { ...n, count: fresh } : n)) }));

  const member = MEMBER_NAV.filter((n) => campus || n.to !== "/checkin").map((n) => (n.to === "/checkin" ? { ...n, dot: live } : n));
  const guest = GUEST_NAV.filter((n) => n.to !== "/about" && n.to !== "/login");
  const all = [...(isMember ? member : guest), ...ASSOC_NAV, ...(isAdmin ? adminGroups.flatMap((g) => g.items) : [])];
  const title = all.find((n) => n.match(path))?.label ?? "海纳协会";
  const name = me.member?.name ?? "";

  return (
    <div className="shell">
      <header className="topbar">
        <button type="button" className="icon-btn" aria-label="打开导航" aria-expanded={open} aria-controls="sidebar" onClick={() => setOpen(true)}>
          <Icon name="menu" size={20} />
        </button>
        <span className="topbar-title ellipsis">{title}</span>
        {isAdmin && !inAdmin && !!fresh && (
          <span className="nav-count num" aria-label={`${fresh} 条新报名`}>
            {fresh > 99 ? "99+" : fresh}
          </span>
        )}
      </header>
      {open && <div className="drawer-scrim" aria-hidden="true" onClick={() => setOpen(false)} />}
      <aside className="sidebar" id="sidebar" data-open={open || undefined}>
        <div className="sidebar-inner">
          <Link to="/" className="brand">
            <BrandMark />
            <span className="stack" style={{ gap: 1 }}>
              <span className="brand-name">海纳协会</span>
              <span className="brand-sub">智慧算法网络协会</span>
            </span>
          </Link>
          <NavList items={isMember ? member : guest} path={path} label="主导航" />
          <NavList items={ASSOC_NAV} path={path} label="协会" small />
          {isAdmin && !inAdmin && (
            // 手机上不在后台时，管理只占一项，侧栏不至于太长
            <div className="only-narrow">
              <NavList items={[{ to: "/admin", label: "进入后台", icon: "sliders", match: () => false, count: fresh }]} path={path} label="管理" small />
            </div>
          )}
          {isAdmin && (
            <div className={inAdmin ? "nav-groups" : "nav-groups only-wide"}>
              {adminGroups.map((g) => (
                <NavList key={g.label} items={g.items} path={path} label={g.label} small />
              ))}
            </div>
          )}
          {isMember ? (
            <div className="me-card">
              <span className="avatar" aria-hidden="true">
                {name.slice(0, 1)}
              </span>
              <span className="grow stack" style={{ gap: 0 }}>
                <span style={{ fontSize: "var(--fs-sm)", lineHeight: "22px", fontWeight: 600 }} className="ellipsis">
                  {name}
                </span>
                <span className="xsmall sub ellipsis">
                  {[me.member?.className, isAdmin ? "管理员" : null].filter(Boolean).join(" · ") || me.member?.studentNo}
                </span>
              </span>
              <Link to="/me#settings" className="icon-btn" aria-label="外观与设置" style={{ border: 0, background: "transparent" }}>
                <Icon name="sun" size={18} />
              </Link>
            </div>
          ) : (
            <div className="me-card guest-card">
              <span className="grow" style={{ fontSize: "var(--fs-sm)", lineHeight: "22px", fontWeight: 600 }}>
                游客
              </span>
              <span className="row" style={{ gap: 6 }}>
                <Link to={loginHref(path + search)} className="btn btn-primary btn-sm">
                  登录
                </Link>
                <Link to={loginHref(path + search, "register")} className="btn btn-ghost btn-sm">
                  注册
                </Link>
              </span>
            </div>
          )}
        </div>
      </aside>
      <main className="main" id="main">
        {children}
      </main>
    </div>
  );
}
