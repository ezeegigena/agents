import { motion, useReducedMotion } from "motion/react";
import { reportingContent } from "@/content/reporting";
import { showOnView } from "./motion";
import { StatTile } from "./StatTile";

const { kpi } = reportingContent;

/** Six stat tiles with count-ups and sparklines. */
export function KpiGrid() {
  const reduced = useReducedMotion();
  return (
    <motion.div {...showOnView(reduced)} className="grid grid-cols-2 gap-2.5 @lg:grid-cols-3">
      {kpi.tiles.map((tile, i) => (
        <StatTile key={tile.label} kpi={tile} comparison={kpi.comparison} index={i} trend />
      ))}
    </motion.div>
  );
}
