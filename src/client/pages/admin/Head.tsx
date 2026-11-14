/** 后台各页的页头：小标题 + 大标题，右边可以放按钮。 */
export function Head({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="page-head">
      <div className="stack" style={{ gap: 6 }}>
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="h1">{title}</h1>
      </div>
      {children}
    </header>
  );
}
