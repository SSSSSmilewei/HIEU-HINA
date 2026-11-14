import { useApi } from "../api";
import { PinRows, type TitledPin } from "../components/PinRows";
import { Empty, ErrorBox, SkeletonCards, useTitle } from "../ui";

/** 管理后台：蓝色钉子收件箱。没解决的在前，点进去跳到讲义上的那颗钉子。 */
export function AdminPinsPage() {
  useTitle("蓝色钉子");
  const { data, error, reload } = useApi<TitledPin[]>("/api/admin/pins");
  return (
    <div className="page">
      <header className="page-head">
        <div className="stack" style={{ gap: 6 }}>
          <h1 className="h1">蓝色钉子</h1>
          <p className="sub">成员钉在讲义上的问题。没解决的排在前面，点进去在原处回复。</p>
        </div>
      </header>
      {error && !data ? (
        <ErrorBox error={error} onRetry={reload} />
      ) : !data ? (
        <SkeletonCards n={3} h={90} />
      ) : !data.length ? (
        <div className="card">
          <Empty title="还没有人钉问题" />
        </div>
      ) : (
        <PinRows pins={data} />
      )}
    </div>
  );
}
