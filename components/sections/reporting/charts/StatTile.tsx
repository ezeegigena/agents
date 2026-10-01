import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Kpi } from "@/content/reporting";
import { CountUp } from "@/components/ui/CountUp";
import { formatKpiDelta, formatKpiValue } from "./format";
import { rise } from "./motion";
import { Sparkline } from "./Sparkline";

/** Stable formatters so CountUp doesn't restart when the parent re-renders. */
const valueFormatters: Record<Kpi["format"], (v: number) => string> = {
  usd: (v) => formatKpiValue(v, "usd"),
  percent: (v) => formatKpiValue(v, "percent"),
  days: (v) => formatKpiValue(v, "days"),
  months: (v) => formatKpiValue(v, "months"),
};

/** Label · value (count-up) · delta vs a named period · optional sparkline. */
export function StatTile({
  kpi,
  comparison,
  index = 0,
  trend = false,
}: {
  kpi: Kpi;
  comparison: string;
  index?: number;
  trend?: boolean;
}) {
  const good = (kpi.delta >= 0) === kpi.upIsGood;
  const Arrow = kpi.delta >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      variants={rise}
      custom={index}
      className="min-w-0 rounded-2xl border border-line bg-white/[0.025] p-3 @md:p-3.5"
    >
      <p className="truncate text-[11px] text-fg-muted @md:text-xs">{kpi.label}</p>
      <p className="mt-1 font-mono text-lg font-medium tracking-[-0.03em] whitespace-nowrap text-fg @md:text-[1.35rem]">
        <CountUp value={kpi.value} format={valueFormatters[kpi.format]} duration={1.4} />
      </p>
      <p
        className={cn(
          "mt-0.5 flex flex-wrap items-center gap-x-1 font-mono text-[10.5px] @md:text-[11px]",
          good ? "text-success" : "text-warning",
        )}
      >
        <Arrow aria-hidden className="size-3.5 shrink-0" />
        <span className="whitespace-nowrap">{formatKpiDelta(kpi.delta, kpi.deltaFormat)}</span>
        <span className="hidden whitespace-nowrap text-fg-muted @lg:inline">{comparison}</span>
      </p>
      {trend && <Sparkline values={kpi.trend} className="mt-3" />}
    </motion.div>
  );
}
