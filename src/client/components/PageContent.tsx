import { Component, Suspense, type ReactNode } from "react";
import { ErrorBox, SkeletonCards } from "../ui";

/** 路由分块失败时保留导航，让用户手动刷新获取新版本。 */
export class PageContent extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return <ErrorBox error={new Error("页面加载失败，请检查网络后刷新页面。")} onRetry={() => window.location.reload()} />;
    }
    return <Suspense fallback={this.props.fallback ?? <div className="page"><SkeletonCards /></div>}>{this.props.children}</Suspense>;
  }
}
