"use client";

import { useRef, useState } from "react";
import {
  demoMonths,
  demoSection,
  statementLayouts,
  transactionCategories,
  type CategoryId,
  type StatementId,
} from "@/content/demo";
import { cn } from "@/lib/cn";
import { formatUsd } from "@/lib/format";
import { useInViewport } from "@/lib/hooks/useInView";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { DemoControls } from "./DemoControls";
import { FeedTicker } from "./FeedTicker";
import { LinkArrows } from "./LinkArrows";
import { demoModel, statementValues } from "./model";
import { StatementCard } from "./StatementCard";
import { StatementTabs } from "./StatementTabs";
import { TieOut } from "./TieOut";
import type { Phase } from "./timeline";
import { TransactionFeed } from "./TransactionFeed";
import { useDemoTimeline } from "./useDemoTimeline";

const NO_ROWS: ReadonlySet<string> = new Set();

/**
 * Interactive stage: controls, the transaction feed, the three statements,
 * the link arrows and the tie-out. Desktop shows everything at once; below
 * 1024px the feed becomes a ticker and the statements become tabs.
 */
export function DemoStage({ className }: { className?: string }) {
  const [monthIndex, setMonthIndex] = useState(0);
  const [runId, setRunId] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [tab, setTab] = useState<StatementId>("is");
  const [hovered, setHovered] = useState<CategoryId | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduced = usePrefersReducedMotion();
  const inView = useInViewport(stageRef, "0px 0px -30% 0px");

  const month = demoMonths[monthIndex];
  const statements = demoModel[monthIndex];

  useDemoTimeline({
    scopeRef: stageRef,
    buildKey: `${month.id}:${runId}`,
    isDesktop,
    reduced,
    inView,
    activeTab: tab,
    onPhase: setPhase,
  });

  const shownPhase: Phase = reduced ? "done" : phase;
  const highlight = hovered ? transactionCategories[hovered] : null;
  const highlighted = highlight ? new Set<string>(highlight.rows) : NO_ROWS;

  function selectMonth(index: number) {
    setMonthIndex(index);
    setPhase("idle");
    setHovered(null);
  }

  function replay() {
    setRunId((id) => id + 1);
    setPhase("idle");
  }

  const card = (id: StatementId, placement?: string) => (
    <StatementCard
      layout={statementLayouts[id]}
      values={statementValues(statements, id)}
      month={month}
      active={tab === id}
      asTabPanel={!isDesktop}
      highlighted={highlighted}
      highlightColor={highlight?.color}
      className={placement}
    />
  );

  return (
    <div ref={stageRef} className={cn("relative", className)}>
      <DemoControls
        months={demoMonths}
        activeIndex={monthIndex}
        phase={shownPhase}
        onSelect={selectMonth}
        onReplay={replay}
      />

      <div
        ref={gridRef}
        className="relative mt-4 grid grid-cols-1 gap-4 lg:mt-5 lg:grid-cols-[minmax(0,16.5rem)_2rem_minmax(0,1fr)_4rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-0 lg:gap-y-5 xl:grid-cols-[minmax(0,20rem)_2.5rem_minmax(0,1fr)_4.5rem_minmax(0,1fr)]"
      >
        <TransactionFeed
          month={month}
          onHover={setHovered}
          className="hidden lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:flex"
        />
        <FeedTicker month={month} className="lg:hidden" />
        <StatementTabs active={tab} onChange={setTab} className="lg:hidden" />
        {card("is", "lg:col-start-3 lg:row-start-1")}
        {card("cfs", "lg:col-start-3 lg:row-start-2")}
        <div className="flex flex-col gap-4 lg:col-start-5 lg:row-span-2 lg:row-start-1 lg:gap-5">
          {card("bs")}
          <TieOut month={statements} className="lg:mt-auto" />
        </div>
        <LinkArrows containerRef={gridRef} version={month.id} />
      </div>

      <p className="sr-only" aria-live="polite">
        {shownPhase === "done"
          ? demoSection.announce({
              period: month.period,
              assets: formatUsd(statements.balanceSheet.totalAssets),
              cash: formatUsd(statements.balanceSheet.cash),
            })
          : ""}
      </p>
    </div>
  );
}
