import type { ComponentType } from "react";
import { motion } from "motion/react";
import { CalendarClock, Sparkles } from "lucide-react";
import { reportingContent, type Report, type ReportId } from "@/content/reporting";
import { BoardPack } from "./charts/BoardPack";
import { BudgetBars } from "./charts/BudgetBars";
import { CashWaterfall } from "./charts/CashWaterfall";
import { CashStats } from "./charts/CashStats";
import { KpiGrid } from "./charts/KpiGrid";
import { PnlChart } from "./charts/PnlChart";
import { StatTile } from "./charts/StatTile";
import { useShowOnView } from "./charts/motion";

const { window: win, pnl } = reportingContent;

function PnlReport() {
  const view = useShowOnView();
  return (
    <div className="space-y-5">
      <motion.div key={view.key} {...view.props} className="grid grid-cols-3 gap-2 @md:gap-2.5">
        {pnl.tiles.map((tile, i) => (
          <StatTile key={tile.label} kpi={tile} comparison={pnl.comparison} index={i} />
        ))}
      </motion.div>
      <PnlChart />
    </div>
  );
}

function CashReport() {
  return (
    <div className="space-y-4">
      <CashWaterfall />
      <CashStats />
    </div>
  );
}

const bodies: Record<ReportId, ComponentType> = {
  pnl: PnlReport,
  cash: CashReport,
  budget: BudgetBars,
  kpi: KpiGrid,
  board: BoardPack,
};

/** One report: header (name, period, schedule) + its chart. */
export function ReportPanel({ report }: { report: Report }) {
  const Body = bodies[report.id];
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 border-b border-line pb-4">
        <div className="min-w-0">
          <h3 className="font-sans text-lg font-semibold tracking-[-0.02em] text-fg">{report.name}</h3>
          <p className="mt-0.5 font-mono text-[11px] text-fg-muted">{report.period}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="hidden items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-2.5 py-1 text-[11px] text-fg-muted sm:inline-flex">
            <Sparkles aria-hidden className="size-3.5 text-brand-teal" />
            {win.generatedLabel} · {win.generatedAt}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-2.5 py-1 text-[11px] text-fg-muted">
            <CalendarClock aria-hidden className="size-3.5 text-brand-violet" />
            {report.cadence} · {report.destination}
          </span>
        </div>
      </div>
      <div className="pt-5">
        <Body />
      </div>
    </div>
  );
}
