import { motion } from "motion/react";
import { formatUsd } from "@/lib/format";
import { reportingContent, type CashStep } from "@/content/reporting";
import { usdShort, usdSigned } from "./format";
import { barPath, scaleLinear } from "./geometry";
import { fade, growY, useShowOnView } from "./motion";
import { chartColors } from "./palette";
import { SrTable } from "./SrTable";
import { useElementWidth } from "./useElementWidth";

const { cash } = reportingContent;
const DOMAIN: [number, number] = [1_000_000, 1_500_000];
const TICKS = [1_000_000, 1_100_000, 1_200_000, 1_300_000, 1_400_000, 1_500_000];

type Bar = CashStep & { from: number; to: number };

/** Running levels: totals start at the axis floor, changes start where the last bar ended. */
function toBars(steps: CashStep[]): Bar[] {
  let level = 0;
  return steps.map((step) => {
    if (step.kind === "total") {
      level = step.value;
      return { ...step, from: DOMAIN[0], to: step.value };
    }
    const from = level;
    level += step.value;
    return { ...step, from, to: level };
  });
}

const bars = toBars(cash.steps);

function colorFor(bar: Bar) {
  if (bar.kind === "total") return chartColors.blue;
  return bar.value >= 0 ? chartColors.teal : chartColors.coral;
}

/** Cash bridge: opening → operating → investing → financing → ending. */
export function CashWaterfall() {
  const view = useShowOnView();
  const [ref, width] = useElementWidth<HTMLDivElement>(560);
  const height = width < 440 ? 236 : 272;
  const m = { top: 22, right: 6, bottom: 40, left: 46 };
  const plotW = width - m.left - m.right;
  const plotH = height - m.top - m.bottom;
  const y = scaleLinear(DOMAIN, [m.top + plotH, m.top]);
  const slot = plotW / bars.length;
  const barW = Math.min(44, slot * 0.5);
  const barX = (i: number) => m.left + slot * i + (slot - barW) / 2;
  const base = y(DOMAIN[0]);

  return (
    <div ref={ref}>
      <motion.svg
        role="img"
        aria-label={cash.caption}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block max-w-full overflow-visible"
        key={view.key}
        {...view.props}
      >
        {TICKS.map((t) => (
          <g key={t}>
            <line x1={m.left} x2={m.left + plotW} y1={y(t)} y2={y(t)} stroke={chartColors.grid} />
            <text x={m.left - 8} y={y(t) + 3.5} textAnchor="end" className="fill-fg-muted font-mono text-[10px]">
              {`$${(t / 1_000_000).toFixed(1)}M`}
            </text>
          </g>
        ))}
        <line x1={m.left} x2={m.left + plotW} y1={base} y2={base} stroke={chartColors.axis} />

        {bars.map((bar, i) => {
          const top = y(Math.max(bar.from, bar.to));
          const bottom = y(Math.min(bar.from, bar.to));
          const falling = bar.to < bar.from;
          const x = barX(i);
          const next = bars[i + 1];
          return (
            <g key={bar.label}>
              {next && (
                <motion.line
                  x1={x + barW}
                  x2={barX(i + 1)}
                  y1={y(bar.to)}
                  y2={y(bar.to)}
                  stroke="rgb(245 247 255 / 0.28)"
                  variants={fade}
                  custom={6 + i}
                />
              )}
              <motion.path
                d={barPath(x, top, barW, bottom - top, 4, falling ? "bottom" : "top")}
                fill={colorFor(bar)}
                variants={growY}
                custom={i}
                style={{ originY: falling ? 0 : 1 }}
              />
              {bar.kind === "total" && (
                <path
                  d={`M${x - 1},${base - 9} l${barW / 4},-4 l${barW / 4},4 l${barW / 4},-4 l${barW / 4 + 1},4`}
                  fill="none"
                  stroke={chartColors.surface}
                  strokeWidth={2.5}
                />
              )}
              <motion.text
                x={x + barW / 2}
                y={falling ? bottom + 14 : top - 7}
                textAnchor="middle"
                className="fill-fg font-mono text-[11px] font-medium"
                variants={fade}
                custom={4 + i}
              >
                {bar.kind === "total" ? usdShort(bar.value) : usdSigned(bar.value)}
              </motion.text>
              <text x={x + barW / 2} y={height - 20} textAnchor="middle" className="fill-fg text-[11px]">
                {bar.label}
              </text>
              <text
                x={x + barW / 2}
                y={height - 6}
                textAnchor="middle"
                className="fill-fg-muted text-[10px]"
              >
                {bar.sub}
              </text>
            </g>
          );
        })}
      </motion.svg>
      <p className="mt-1 text-[11px] text-fg-muted">{cash.axisNote}</p>
      <SrTable
        caption={cash.caption}
        columns={["Step", "Amount", "Cash after step"]}
        rows={bars.map((bar) => [
          `${bar.label} ${bar.sub}`,
          formatUsd(bar.value),
          formatUsd(bar.to),
        ])}
      />
    </div>
  );
}
