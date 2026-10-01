import { motion, useReducedMotion } from "motion/react";
import { reportingContent, type CashStat } from "@/content/reporting";
import { CountUp } from "@/components/ui/CountUp";
import { usdShort, usdSigned } from "./format";
import { rise, showOnView } from "./motion";

const { cash } = reportingContent;

const formatters = {
  signed: (v: number) => usdSigned(v),
  usd: (v: number) => usdShort(v),
  number: (v: number) => v.toFixed(1),
};

function formatterFor(stat: CashStat) {
  if (stat.unit) return formatters.number;
  return stat.signed ? formatters.signed : formatters.usd;
}

/** Summary figures under the cash waterfall. */
export function CashStats() {
  const reduced = useReducedMotion();
  return (
    <motion.dl
      {...showOnView(reduced)}
      className="grid grid-cols-3 gap-2 @md:gap-2.5"
    >
      {cash.stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          variants={rise}
          custom={5 + i}
          className="min-w-0 rounded-xl border border-line bg-white/[0.025] px-3 py-2.5"
        >
          <dt className="truncate text-[11px] text-fg-muted">{stat.label}</dt>
          <dd className="mt-0.5 font-mono text-[15px] font-medium whitespace-nowrap text-fg @md:text-base">
            <CountUp value={stat.value} format={formatterFor(stat)} duration={1.3} />
            {stat.unit && <span className="ml-1 text-xs text-fg-muted">{stat.unit}</span>}
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}
