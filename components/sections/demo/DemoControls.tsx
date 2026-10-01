"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { agentsById } from "@/content/agents";
import { demoSection, type DemoMonth } from "@/content/demo";
import { cn } from "@/lib/cn";
import type { Phase } from "./timeline";

const { company, controls, status } = demoSection;

/** Company identity, month switcher, replay, build status and progress. */
export function DemoControls({
  months,
  activeIndex,
  phase,
  onSelect,
  onReplay,
}: {
  months: DemoMonth[];
  activeIndex: number;
  phase: Phase;
  onSelect: (index: number) => void;
  onReplay: () => void;
}) {
  const building = phase === "feed" || phase === "statements";

  return (
    <div className="glass-strong relative overflow-hidden rounded-3xl">
      <div className="flex flex-col gap-4 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4 xl:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#1b2a52,#10152b)] font-display text-[0.8125rem] font-semibold tracking-[-0.02em] text-fg shadow-[inset_0_0_0_1px_rgb(160_170_255/0.22)]"
          >
            {company.monogram}
          </span>
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-display text-base font-semibold tracking-[-0.02em] text-fg">
                {company.name}
              </span>
              <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-px font-mono text-[0.625rem] tracking-[0.08em] text-warning uppercase">
                {company.sampleLabel}
              </span>
            </p>
            <p className="font-mono text-[0.6875rem] text-fg-muted">{company.descriptor}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label={controls.monthGroupLabel}
            className="flex flex-1 rounded-full border border-line bg-ink-900/70 p-1 sm:flex-none"
          >
            {months.map((month, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={month.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(index)}
                  className={cn(
                    "relative h-10 flex-1 rounded-full px-4 font-mono text-[0.8125rem] transition-colors duration-200 sm:flex-none",
                    selected ? "text-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="demo-month-pill"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-white/[0.09] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.14)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span aria-hidden className="relative">
                    {month.label}
                  </span>
                  <span className="sr-only">{month.period}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={onReplay}
            aria-label={controls.replayAria}
            className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-full border border-line-strong bg-white/[0.04] px-4 text-[0.875rem] font-medium text-fg transition-colors duration-200 hover:bg-white/[0.08]"
          >
            <RotateCcw
              aria-hidden
              className="size-4 transition-transform duration-500 ease-out-expo group-hover:-rotate-180"
            />
            {controls.replay}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-line px-3.5 py-2.5 sm:px-4 xl:px-5">
        <span className="flex shrink-0 -space-x-1.5">
          {status.agents.map((id) => (
            <AgentAvatar key={id} agent={agentsById[id]} size="sm" online={false} />
          ))}
        </span>
        <p className="min-w-0 flex-1 text-[0.75rem] leading-snug text-fg-muted">
          {building && (
            <span
              aria-hidden
              className="mr-2 inline-block size-1.5 animate-pulse rounded-full bg-brand-blue align-middle"
            />
          )}
          {status[phase]}
          {phase === "done" && (
            <>
              {" "}
              <span className="ml-1 inline-block rounded-full border border-line px-2 font-mono text-[0.625rem] leading-4 tracking-[0.08em] uppercase">
                {status.illustrative}
              </span>
            </>
          )}
        </p>
      </div>

      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px">
        <span data-progress className="block h-full bg-brand-gradient" />
      </span>
    </div>
  );
}
