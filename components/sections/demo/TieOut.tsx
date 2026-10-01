import { Check, CheckCircle2, Sparkles, X } from "lucide-react";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { agentsById } from "@/content/agents";
import { demoSection } from "@/content/demo";
import { cn } from "@/lib/cn";
import { formatUsd } from "@/lib/format";
import type { MonthStatements } from "@/lib/three-statement";
import { controllerNote } from "./model";

const copy = demoSection.tieOut;

/** Tie-out card: the "Balanced" badge, cross-statement checks and a note. */
export function TieOut({ month, className }: { month: MonthStatements; className?: string }) {
  const { balanceSheet: bs, cashFlow: cfs, incomeStatement: is, opening } = month;
  const balanced = bs.totalAssets === bs.totalLiabilitiesAndEquity;
  const reChange = bs.retainedEarnings - opening.retainedEarnings;
  const controller = agentsById.controller;

  const checks = [
    { title: copy.cash, terms: copy.cashTerms, values: [cfs.endingCash, bs.cash] },
    { title: copy.earnings, terms: copy.earningsTerms, values: [reChange, is.netIncome] },
  ].map((check) => ({ ...check, ok: check.values[0] === check.values[1] }));

  return (
    <div
      data-tieout
      className={cn("glass-strong rounded-3xl p-3.5 sm:p-4 xl:p-5", className)}
    >
      <header className="mb-3 flex items-center gap-3 px-1">
        <div className="min-w-0">
          <h3
            className="text-[0.95rem] leading-tight font-semibold tracking-[-0.02em] text-fg"
          >
            {copy.title}
          </h3>
          <p className="text-[0.6875rem] leading-snug text-fg-muted">
            {controller.name} · {copy.agentCaption}
          </p>
        </div>
        <AgentAvatar agent={controller} size="sm" online={false} className="ml-auto" />
      </header>

      <div className="relative">
        <p
          data-balanced-pending
          aria-hidden
          className="absolute inset-0 flex items-center justify-center rounded-2xl border border-dashed border-line-strong font-mono text-[0.6875rem] text-fg-muted opacity-0"
        >
          <span className="animate-pulse">{copy.pending}</span>
        </p>
        <div
          data-balanced
          className="relative overflow-hidden rounded-2xl bg-success/[0.08] px-4 py-2.5 shadow-[inset_0_0_0_1px_rgb(46_230_166/0.3),0_12px_40px_-16px_rgb(46_230_166/0.45)]"
        >
          <span
            data-balanced-shine
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          />
          <p className="flex items-center gap-2 font-display text-lg leading-tight font-semibold tracking-[-0.02em] text-success">
            {balanced ? (
              <CheckCircle2 aria-hidden className="size-5" />
            ) : (
              <X aria-hidden className="size-5" />
            )}
            {copy.balanced} {balanced ? "✓" : "✗"}
          </p>
          <p className="mt-0.5 text-[0.8125rem] text-fg">{copy.balancedDetail}</p>
          <p className="mt-1 font-mono text-[0.6875rem] text-fg-muted tabular">
            {formatUsd(bs.totalAssets)} = {formatUsd(bs.totalLiabilities)} +{" "}
            {formatUsd(bs.totalEquity)}
          </p>
        </div>
      </div>

      <ul className="mt-1.5 flex flex-col">
        {checks.map((check) => (
          <li key={check.title} data-check className="flex items-start gap-3 px-1 py-1">
            <span
              data-check-icon
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                check.ok ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
              )}
            >
              {check.ok ? (
                <Check aria-hidden className="size-3" />
              ) : (
                <X aria-hidden className="size-3" />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-[0.8125rem] leading-5 text-fg">
                {check.title}
                <span className="sr-only">: {check.ok ? "passed" : "failed"}</span>
              </p>
              <p className="font-mono text-[0.6875rem] leading-4 text-fg-muted tabular">
                {check.terms[0]} <span className="text-fg">{formatUsd(check.values[0])}</span>
                {" = "}
                {check.terms[1]} <span className="text-fg">{formatUsd(check.values[1])}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div
        data-tieout-note
        className="mt-2 rounded-2xl border border-line bg-white/[0.025] px-3.5 py-3 max-xl:lg:hidden"
      >
        <p className="flex items-center gap-1.5 font-mono text-[0.625rem] tracking-[0.12em] text-fg-muted uppercase">
          <Sparkles aria-hidden className="size-3" style={{ color: controller.accent }} />
          {copy.noteTitle}
        </p>
        <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-fg">{controllerNote(month)}</p>
      </div>
    </div>
  );
}
