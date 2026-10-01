import { motion } from "motion/react";
import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/cn";
import { formatUsd } from "@/lib/format";
import { reportingContent } from "@/content/reporting";
import { usdShort } from "./format";
import { bandPath, monotonePath, scaleLinear, type Point } from "./geometry";
import { draw, fade, pop, useShowOnView } from "./motion";
import { chartColors } from "./palette";
import { SrTable } from "./SrTable";
import { useElementWidth } from "./useElementWidth";

const { pnl } = reportingContent;
const COUNT = pnl.months.length;
const DOMAIN: [number, number] = [300_000, 500_000];
const TICKS = [300_000, 350_000, 400_000, 450_000, 500_000];

const series = [
  { key: "revenue", label: pnl.series.revenue, values: pnl.revenue, color: chartColors.teal },
  { key: "expenses", label: pnl.series.expenses, values: pnl.expenses, color: chartColors.violet },
] as const;

/**
 * Revenue vs expenses over 12 months; the band between them is net income.
 * Crosshair + tooltip on hover, and on focus with the arrow keys.
 */
export function PnlChart() {
  const view = useShowOnView();
  const [ref, width] = useElementWidth<HTMLDivElement>(560);
  const [active, setActive] = useState<number | null>(null);
  const summaryId = useId();

  const narrow = width < 440;
  const height = narrow ? 190 : 248;
  const m = { top: 12, right: narrow ? 50 : 58, bottom: 24, left: 42 };
  const plotW = width - m.left - m.right;
  const plotH = height - m.top - m.bottom;
  const x = (i: number) => m.left + (i / (COUNT - 1)) * plotW;
  const y = scaleLinear(DOMAIN, [m.top + plotH, m.top]);
  const points = series.map((s) => s.values.map((v, i): Point => [x(i), y(v)]));

  function onPointerMove(e: PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    const i = Math.round(((e.clientX - rect.left - m.left) / plotW) * (COUNT - 1));
    setActive(Math.min(COUNT - 1, Math.max(0, i)));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, (i: number) => number> = {
      ArrowRight: (i) => Math.min(COUNT - 1, i + 1),
      ArrowLeft: (i) => Math.max(0, i - 1),
      Home: () => 0,
      End: () => COUNT - 1,
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    setActive((i) => move(i ?? COUNT - 1));
  }

  return (
    <div>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-muted">
        {series.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span aria-hidden className="h-0.5 w-3.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="h-2.5 w-3.5 rounded-[3px]"
            style={{ backgroundColor: `color-mix(in oklab, ${chartColors.teal} 28%, transparent)` }}
          />
          {pnl.series.net}
        </li>
      </ul>

      <div
        ref={ref}
        role="group"
        tabIndex={0}
        aria-label={`${pnl.chartLabel}. ${pnl.keyboardHint}`}
        aria-describedby={summaryId}
        onKeyDown={onKeyDown}
        onFocus={() => setActive((i) => i ?? COUNT - 1)}
        onBlur={() => setActive(null)}
        className="relative mt-3 rounded-xl"
      >
        <motion.svg
          aria-hidden
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
              <text
                x={m.left - 8}
                y={y(t) + 3.5}
                textAnchor="end"
                className="fill-fg-muted font-mono text-[10px]"
              >
                {usdShort(t)}
              </text>
            </g>
          ))}
          {pnl.months.map((label, i) =>
            narrow && i % 2 === 0 ? null : (
              <text
                key={label + i}
                x={x(i)}
                y={height - 6}
                textAnchor="middle"
                className={cn(
                  "font-mono text-[10px]",
                  i === active ? "fill-fg" : "fill-fg-muted",
                )}
              >
                {label}
              </text>
            ),
          )}

          <motion.path
            d={bandPath(points[0], points[1])}
            fill={chartColors.teal}
            fillOpacity={0.13}
            variants={fade}
            custom={8}
          />
          {series.map((s, si) => (
            <motion.path
              key={s.key}
              d={monotonePath(points[si])}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={draw}
              custom={si}
            />
          ))}

          {/* End markers + direct labels */}
          {series.map((s, si) => {
            const [ex, ey] = points[si][COUNT - 1];
            return (
              <g key={s.key}>
                <motion.circle
                  cx={ex}
                  cy={ey}
                  r={4}
                  fill={s.color}
                  stroke={chartColors.surface}
                  strokeWidth={2}
                  variants={pop}
                  custom={6 + si}
                />
                <motion.text
                  x={ex + 9}
                  y={ey + 3.5}
                  className="fill-fg font-mono text-[10.5px] font-medium"
                  variants={fade}
                  custom={10 + si}
                >
                  {usdShort(s.values[COUNT - 1])}
                </motion.text>
              </g>
            );
          })}

          {active !== null && (
            <g>
              <line
                x1={x(active)}
                x2={x(active)}
                y1={m.top}
                y2={m.top + plotH}
                stroke="rgb(245 247 255 / 0.35)"
              />
              {series.map((s, si) => (
                <circle
                  key={s.key}
                  cx={points[si][active][0]}
                  cy={points[si][active][1]}
                  r={4.5}
                  fill={s.color}
                  stroke={chartColors.surface}
                  strokeWidth={2}
                />
              ))}
            </g>
          )}

          <rect
            x={m.left - 12}
            y={0}
            width={plotW + 24}
            height={height}
            fill="transparent"
            onPointerMove={onPointerMove}
            onPointerLeave={() => setActive(null)}
          />
        </motion.svg>

        {active !== null && <Tooltip index={active} x={x(active)} top={m.top} flip={x(active) > width * 0.58} />}
      </div>

      <SrTable
        caption={pnl.chartLabel}
        columns={["Month", pnl.series.revenue, pnl.series.expenses, pnl.series.net]}
        rows={pnl.monthsLong.map((month, i) => [
          month,
          formatUsd(pnl.revenue[i]),
          formatUsd(pnl.expenses[i]),
          formatUsd(pnl.netIncome[i]),
        ])}
      />
      <span id={summaryId} className="sr-only">
        {pnl.series.revenue} {formatUsd(pnl.revenue[COUNT - 1])}, {pnl.series.expenses}{" "}
        {formatUsd(pnl.expenses[COUNT - 1])} in {pnl.monthsLong[COUNT - 1]}.
      </span>
    </div>
  );
}

function Tooltip({ index, x, top, flip }: { index: number; x: number; top: number; flip: boolean }) {
  const rows = [
    { label: pnl.series.revenue, value: pnl.revenue[index], color: chartColors.teal },
    { label: pnl.series.expenses, value: pnl.expenses[index], color: chartColors.violet },
    { label: pnl.series.net, value: pnl.netIncome[index], color: null },
  ];
  return (
    <div
      aria-live="polite"
      className={cn(
        "pointer-events-none absolute z-10 min-w-40 rounded-xl border border-line-strong bg-ink-900/95 px-3 py-2.5 shadow-[0_18px_40px_-12px_rgb(0_0_0/0.7)] backdrop-blur-md",
        flip ? "-translate-x-[calc(100%+12px)]" : "translate-x-3",
      )}
      style={{ left: x, top }}
    >
      <p className="font-mono text-[10.5px] tracking-wide text-fg-muted uppercase">
        {pnl.monthsLong[index]}
      </p>
      <dl className="mt-1.5 space-y-1">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-1.5 text-[11px] text-fg-muted">
              {row.color ? (
                <span aria-hidden className="h-0.5 w-3 rounded-full" style={{ backgroundColor: row.color }} />
              ) : (
                <span aria-hidden className="h-2 w-3 rounded-[2px] bg-[#12ae8b]/30" />
              )}
              {row.label}
            </dt>
            <dd className="font-mono text-[12px] font-medium text-fg tabular">{formatUsd(row.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
