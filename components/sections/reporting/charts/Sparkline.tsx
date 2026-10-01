import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { monotonePath, type Point } from "./geometry";
import { pop, reveal, useShowOnView } from "./motion";
import { chartColors } from "./palette";

const W = 100;
const H = 32;

/**
 * 12-point trend: history in the de-emphasis hue, the latest period in the
 * accent. Decorative (the tile's delta carries the meaning).
 */
export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const view = useShowOnView();
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.15 || 1;
  const points: Point[] = values.map((v, i) => [
    (i / (values.length - 1)) * W,
    H - ((v - min + pad) / (max - min + pad * 2)) * H,
  ]);
  const [endX, endY] = points[points.length - 1];

  return (
    <motion.div aria-hidden className={cn("relative h-8", className)} key={view.key} {...view.props}>
      <motion.svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full overflow-visible"
        variants={reveal}
      >
        <path
          d={monotonePath(points)}
          fill="none"
          stroke={chartColors.muted}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={monotonePath(points.slice(-2))}
          fill="none"
          stroke={chartColors.teal}
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </motion.svg>
      <motion.span
        variants={pop}
        custom={4}
        className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-ink-800"
        style={{ left: `${endX}%`, top: `${(endY / H) * 100}%`, backgroundColor: chartColors.teal }}
      />
    </motion.div>
  );
}
