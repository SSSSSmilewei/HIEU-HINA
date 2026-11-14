import { useState } from "react";
import type { Progress } from "../../shared/courses";
import { api, invalidate, useApi } from "../api";
import { LearnTabs } from "../components/LearnTabs";
import { Icon } from "../icons";
import { itemHref } from "../library";
import { Link } from "../router";
import { loginHref, useMe } from "../session";
import { Bar, ErrorBox, Skeleton, Spinner, useTitle, useToast } from "../ui";

/**
 * 新生任务：协会每位新成员都要完成的三项任务。
 *  1. 阅读前言：CSDIY 前言 +《我的一些小想法》（写给同学的一段话，Across the Deep Sea 的第一篇）
 *  2. CS50x：学完后本人点「我已完成」（原来的证书提交和确认 2026-11 取消）
 *  3. Across the Deep Sea：协会自己编写的课程，正在筹备，没有“完成”状态
 * 进度只请求 /api/start 一个接口（见 worker/api/start.ts）。知识块列表的第一张卡片是 StartBlockCard，/start 是完整的页面。
 */

const DEEP_SEA = "across-the-deep-sea";
const PREFACES = [
  { course: "csdiy", item: "preface", title: "CSDIY 前言" },
  { course: DEEP_SEA, item: "preface", title: "我的一些小想法" },
] as const;

interface StartData {
  prefaces: boolean[];
  cs50x: {
    done: boolean;
    self: boolean;
    progress: Progress;
    next: { id: string; title: string; pages: { id: string }[] } | null;
  };
}

interface StartState {
  loading: boolean;
  error: Error | null;
  reload: () => void;
  guest: boolean;
  data: StartData | undefined;
  /** 当前进行到第几项（0–2）；前两项都完成后停在第 3 项 */
  current: number;
}

function useStart(): StartState {
  const { me } = useMe();
  const guest = !me.role;
  const { data, error, reload } = useApi<StartData>(guest ? null : "/api/start");
  const step1 = !!data?.prefaces.every(Boolean);
  const step2 = !!data?.cs50x.done;
  return {
    loading: !guest && !data && !error,
    error: error ?? null,
    reload: () => void reload(),
    guest,
    data,
    current: !step1 ? 0 : !step2 ? 1 : 2,
  };
}

const STEP_TITLES = ["阅读前言", "CS50x：哈佛大学计算机科学导论", "Across the Deep Sea"];

/** 知识块列表里的第一张卡片（首页和「学习 → 知识块」）：点进 /start */
export function StartBlockCard() {
  const s = useStart();
  if (s.error) return null;
  const status = s.loading || s.guest ? null : s.current === 2 ? "前两项已完成" : `第 ${s.current + 1} 项，共 3 项`;
  return (
    <Link to="/start" className="card course-card block-card">
      <span className="course-code">
        <span className="ellipsis">协会新成员</span>
        {status && <span className="tag tag-accent">{status}</span>}
      </span>
      <span className="course-title">新生任务</span>
      <p className="small sub pretty clamp-2">阅读前言，完成 CS50x，学习 Across the Deep Sea。</p>
      <span className="course-foot small sub">
        <span className="num">3 项任务</span>
      </span>
    </Link>
  );
}

export function StartPage() {
  useTitle("新生任务");
  const s = useStart();
  return (
    <div className="page start-page">
      <header className="page-head">
        <div className="stack" style={{ gap: 6 }}>
          <span className="eyebrow">智慧算法网络协会</span>
          <h1 className="h1">新生任务</h1>
          <p className="sub pretty">协会每位新成员都需要按顺序完成以下三项任务。</p>
        </div>
      </header>
      <LearnTabs current="blocks" />
      {s.error ? (
        <ErrorBox error={s.error} onRetry={s.reload} />
      ) : s.loading ? (
        <Skeleton h={420} r={24} />
      ) : (
        <ol className="start-steps">
          <Step n={0} s={s}>
            <p className="small sub pretty">阅读《CS 自学指南》（csdiy.wiki）的前言，了解计算机科学的自学方法；再阅读写给协会同学的一段话《我的一些小想法》。</p>
            <ul className="start-reads">
              {PREFACES.map((p, i) => {
                const read = !!s.data?.prefaces[i];
                return (
                  <li key={p.item + p.course}>
                    <Link to={`/courses/${p.course}/learn/${p.item}`} className="start-read">
                      <span className={`start-check${read ? " is-done" : ""}`} aria-label={read ? "已读" : "未读"}>
                        {read && <Icon name="check" size={14} stroke={2.4} />}
                      </span>
                      <span>{p.title}</span>
                      <Icon name="arrowRight" size={16} stroke={2} />
                    </Link>
                  </li>
                );
              })}
            </ul>
            {!s.guest && <p className="xsmall sub">阅读完成后，请在讲义页底部点击“标记完成”。</p>}
          </Step>

          <Step n={1} s={s}>
            <p className="small sub pretty">
              CS50x（CS50's Introduction to Computer Science，哈佛大学计算机科学导论）是协会全体成员的第一门课程。请完成全部讲座和习题集；完成后点击「我已完成」，本项任务即告完成。如果希望取得哈佛大学颁发的课程证书，可以按照{" "}
              <a href="https://cs50.harvard.edu/x/" target="_blank" rel="noreferrer">
                CS50x 官方网站
              </a>{" "}
              的要求提交作业，这一步不作强制要求。
            </p>
            {s.guest ? (
              <div className="row wrap">
                <Link to="/courses/cs50x" className="more-link">
                  打开课程
                  <Icon name="arrowRight" size={16} stroke={2} />
                </Link>
                <Link to={loginHref("/start")} className="btn btn-soft btn-sm">
                  登录后记录进度
                </Link>
              </div>
            ) : (
              s.data && <Cs50Box cs={s.data.cs50x} />
            )}
          </Step>

          <Step n={2} s={s} preparing>
            <p className="small sub pretty">Across the Deep Sea 是协会自行编写的课程，内容包括计算机领域的专题文章和竞赛相关资料。课程正在编写中，内容将陆续发布。</p>
            <Link to={`/courses/${DEEP_SEA}`} className="btn btn-soft btn-sm">
              查看课程
              <Icon name="arrowRight" size={16} stroke={2} />
            </Link>
          </Step>
        </ol>
      )}
    </div>
  );
}

function Step({ n, s, preparing, children }: { n: number; s: StartState; preparing?: boolean; children: React.ReactNode }) {
  const done = !s.guest && n < s.current;
  const now = !s.guest && n === s.current;
  return (
    <li className={`card start-step${done ? " is-done" : ""}${now ? " is-now" : ""}`} aria-current={now ? "step" : undefined}>
      <div className="start-step-head">
        <span className="start-num">{done ? <Icon name="check" size={16} stroke={2.4} /> : n + 1}</span>
        <h2 className="h3">{STEP_TITLES[n]}</h2>
        {done ? <span className="tag tag-ok">已完成</span> : preparing ? <span className="tag tag-muted">筹备中</span> : now ? <span className="tag tag-accent">进行中</span> : null}
      </div>
      <div className="stack start-step-body">{children}</div>
    </li>
  );
}

function Cs50Box({ cs }: { cs: StartData["cs50x"] }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const set = async (done: boolean) => {
    setBusy(true);
    try {
      await api("/api/start/done/cs50x", { method: done ? "PUT" : "DELETE" });
      invalidate("/api/start");
      toast(done ? "已记录：CS50x 已完成" : "已撤销完成记录");
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="stack" style={{ gap: 10 }}>
      <Bar ratio={cs.progress.ratio} label={`站内进度 ${cs.progress.doneItems} / ${cs.progress.items}`} />
      <Link to={cs.next ? itemHref("cs50x", cs.next) : "/courses/cs50x"} className="more-link">
        {cs.next ? `继续学习：${cs.next.title}` : "打开课程"}
        <Icon name="arrowRight" size={16} stroke={2} />
      </Link>
      {cs.done ? (
        <p className="small row wrap" style={{ gap: 8 }}>
          <span className="tag tag-ok">已完成</span>
          {cs.self && (
            <button type="button" className="btn btn-quiet btn-sm" disabled={busy} onClick={() => void set(false)}>
              {busy ? <Spinner /> : "撤销"}
            </button>
          )}
        </p>
      ) : (
        <div className="row">
          <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={() => void set(true)}>
            {busy ? <Spinner /> : "我已完成"}
          </button>
        </div>
      )}
    </div>
  );
}
