import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatUsd } from "@/lib/format";
import { reportingContent, type BudgetLine } from "@/content/reporting";
import { usdShort } from "./format";
import { fade, growX, pop, showOnView } from "./motion";
import { chartColors } from "./palette";
import { SrTable } from "./SrTable";

const { budget } = reportingContent;
const SCALE_MAX = 50_000;
const GRID = [0, 25_000, 50_000];
const pct = (v: number) => `${(v / SCALE_MAX) * 100}%`;
const variance = (line: Pick<BudgetLine, "budget" | "actual">) =>
  Math.round(((line.actual - line.budget) / line.budget) * 1000) / 10;

/** Bullet bars by department: actual bar vs budget marker + variance chip. */
export function BudgetBars() {
  const reduced = useReducedMotion();
  const totals = budget.departments.reduce(
    (acc, d) => ({ budget: acc.budget + d.budget, actual: acc.actual + d.actual }),
    { budget: 0, actual: 0 },
  );

  return (
    <motion.div {...showOnView(reduced)}>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-muted">
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="h-2.5 w-3.5 rounded-[3px]" style={{ backgroundColor: chartColors.teal }} />
          {budget.legend.actual}
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="h-3 w-0.5 rounded-full bg-fg" />
          {budget.legend.budget}
        </li>
      </ul>

      <div aria-hidden className="relative mt-4">
        <ol className="space-y-3.5 @lg:space-y-3">
          {budget.departments.map((line, i) => (
            <Row key={line.name} line={line} index={i} />
          ))}
        </ol>
        <div className="mt-2 hidden h-4 @lg:grid @lg:grid-cols-[9.5rem_minmax(0,1fr)_6.75rem] @lg:gap-x-4">
          <span />
          <div className="relative font-mono text-[10px] text-fg-muted">
            {GRID.map((g, i) => (
              <span
                key={g}
                className={cn(
                  "absolute",
                  i === GRID.length - 1 ? "-translate-x-full" : i > 0 && "-translate-x-1/2",
                )}
                style={{ left: pct(g) }}
              >
                {usdShort(g)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        variants={fade}
        custom={8}
        className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-3.5"
      >
        <p className="text-sm text-fg-muted">
          {budget.totalLabel}{" "}
          <span className="font-mono font-medium text-fg tabular">{usdShort(totals.actual)}</span>{" "}
          <span className="font-mono text-xs tabular">
            / {usdShort(totals.budget)} {budget.ofBudget}
          </span>
        </p>
        <VarianceChip value={variance(totals)} />
      </motion.div>

      <SrTable
        caption={budget.caption}
        columns={["Department", budget.legend.budget, budget.legend.actual, "Variance"]}
        rows={budget.departments.map((d) => [
          d.name,
          formatUsd(d.budget),
          formatUsd(d.actual),
          `${Math.abs(variance(d))}% ${variance(d) > 0 ? budget.over : budget.under}`,
        ])}
      />
    </motion.div>
  );
}

function Row({ line, index }: { line: BudgetLine; index: number }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 @lg:grid-cols-[9.5rem_minmax(0,1fr)_6.75rem] @lg:gap-x-4">
      <div className="min-w-0">
        <p className="truncate text-[13px] text-fg">{line.name}</p>
        <p className="font-mono text-[10.5px] text-fg-muted tabular">
          {usdShort(line.actual)} / {usdShort(line.budget)}
        </p>
      </div>
      <div className="relative col-span-2 row-start-2 h-4 @lg:col-span-1 @lg:row-start-auto">
        {/* Grid */}
        {GRID.map((g) => (
          <span key={g} className="absolute inset-y-[-6px] w-px bg-white/[0.05]" style={{ left: pct(g) }} />
        ))}
        {/* Budget range (ghost) */}
        <span className="absolute inset-y-0.5 left-0 rounded-r-[4px] bg-white/[0.06]" style={{ width: pct(line.budget) }} />
        {/* Actual */}
        <motion.span
          variants={growX}
          custom={index}
          className="absolute inset-y-[3px] left-0 origin-left rounded-r-[4px]"
          style={{ width: pct(line.actual), backgroundColor: chartColors.teal }}
        />
        {/* Budget marker */}
        <motion.span
          variants={fade}
          custom={3 + index}
          className="absolute -inset-y-0.5 w-0.5 -translate-x-1/2 rounded-full bg-fg"
          style={{ left: pct(line.budget) }}
        />
      </div>
      <motion.div variants={pop} custom={index} className="justify-self-end">
        <VarianceChip value={variance(line)} />
      </motion.div>
    </li>
  );
}

function VarianceChip({ value }: { value: number }) {
  const over = value > 0;
  const Icon = over ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[11px] whitespace-nowrap tabular",
        over
          ? "border-warning/30 bg-warning/10 text-warning"
          : "border-success/30 bg-success/10 text-success",
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      {Math.abs(value).toFixed(1)}% {over ? budget.over : budget.under}
    </span>
  );
}
