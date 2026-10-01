import { motion, useReducedMotion, type Variants } from "motion/react";
import { Check, FileText } from "lucide-react";
import { reportingContent } from "@/content/reporting";
import { formatKpiValue } from "./format";
import { pop, rise, showOnView } from "./motion";
import { chartColors } from "./palette";

const { board, kpi } = reportingContent;

/** Fan positions for the four page thumbnails (left → right). */
const FAN = [
  { x: "-62%", y: 14, rotate: -13 },
  { x: "-21%", y: 2, rotate: -4.5 },
  { x: "21%", y: 2, rotate: 4.5 },
  { x: "62%", y: 14, rotate: 13 },
];

const page: Variants = {
  hidden: { x: "0%", y: 24, rotate: 0, opacity: 0 },
  show: (i: number) => ({
    ...FAN[i],
    opacity: 1,
    transition: { type: "spring", stiffness: 160, damping: 18, delay: 0.15 + (FAN.length - i) * 0.09 },
  }),
};

/** Board pack: page thumbnails fanning out + a table of contents ticking in. */
export function BoardPack() {
  const reduced = useReducedMotion();
  return (
    <motion.div {...showOnView(reduced)} className="grid items-center gap-6 @lg:grid-cols-[1.05fr_1fr] @lg:gap-6 @2xl:gap-10">
      <div aria-hidden className="relative mx-auto h-[13.5rem] w-full max-w-[22rem] @lg:h-[18rem]">
        {board.pages.map((name, i) => (
          <motion.div
            key={name}
            variants={page}
            custom={i}
            whileHover={{ y: -10, transition: { type: "spring", stiffness: 300, damping: 22 } }}
            className="absolute top-1/2 left-1/2 -mt-[4.75rem] -ml-[3.5rem] h-[9.5rem] w-[7rem] origin-bottom @2xl:-mt-[5.75rem] @2xl:-ml-[4.25rem] @2xl:h-[11.5rem] @2xl:w-[8.5rem]"
            style={{ zIndex: FAN.length - i }}
          >
            <Thumbnail index={i} />
          </motion.div>
        ))}
      </div>

      <div>
        <p className="eyebrow text-fg-muted">{board.contentsLabel}</p>
        <ol className="mt-3 divide-y divide-white/[0.05]">
          {board.contents.map((item, i) => (
            <motion.li
              key={item.title}
              variants={rise}
              custom={2 + i}
              className="flex items-center gap-3 py-2"
            >
              <motion.span
                variants={pop}
                custom={2 + i}
                className="grid size-[18px] shrink-0 place-items-center rounded-full bg-brand-gradient text-white"
              >
                <Check aria-hidden className="size-3" strokeWidth={3.25} />
              </motion.span>
              <span className="min-w-0 flex-1 truncate text-[13px] text-fg">{item.title}</span>
              <span className="font-mono text-[11px] text-fg-muted tabular">p.{item.page}</span>
            </motion.li>
          ))}
        </ol>
        <motion.div
          variants={rise}
          custom={9}
          className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-line bg-white/[0.025] px-3 py-2.5"
        >
          <FileText aria-hidden className="size-4 text-fg-muted" />
          <span className="min-w-0 flex-1 text-xs text-fg-muted">{board.status}</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
            <Check aria-hidden className="size-3" strokeWidth={3} />
            {board.ready}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Thumbnail({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="relative flex size-full flex-col justify-between overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(160deg,#1a2140,#0a0d1c)] p-3 shadow-[0_24px_40px_-16px_rgb(0_0_0/0.8)]">
        <span className="absolute inset-x-0 top-0 h-1 bg-brand-gradient" />
        <span className="absolute -right-8 -bottom-10 size-28 rounded-full bg-brand-violet/30 blur-2xl" />
        <span className="font-mono text-[6.5px] tracking-[0.14em] text-fg-muted uppercase">{board.cover.kicker}</span>
        <span className="relative font-display text-[15px] leading-[1.02] font-semibold tracking-[-0.03em] text-fg @2xl:text-[17px]">
          {board.cover.title}
        </span>
        <span className="relative text-[6px] text-fg-muted">{board.cover.footer}</span>
      </div>
    );
  }
  return (
    <div className="flex size-full flex-col overflow-hidden rounded-lg border border-black/5 bg-paper p-2.5 shadow-[0_24px_40px_-16px_rgb(0_0_0/0.8)]">
      <span className="text-[7px] font-semibold text-ink-on-paper">{board.pages[index]}</span>
      <span className="mt-1 h-px bg-paper-line" />
      <div className="mt-2 flex-1">
        {index === 1 && <MiniLines />}
        {index === 2 && <MiniBars />}
        {index === 3 && <MiniTiles />}
      </div>
      <span className="mt-2 block h-1 w-4/5 rounded-full bg-ink-on-paper/10" />
      <span className="mt-1 block h-1 w-3/5 rounded-full bg-ink-on-paper/10" />
    </div>
  );
}

function MiniLines() {
  return (
    <svg viewBox="0 0 60 36" className="size-full" preserveAspectRatio="none">
      <path d="M0 26 C10 24 14 20 22 21 S36 14 44 12 S54 8 60 6" fill="none" stroke={chartColors.teal} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      <path d="M0 30 C10 29 14 27 22 28 S36 24 44 23 S54 21 60 20" fill="none" stroke={chartColors.violet} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function MiniBars() {
  const bars = [
    { y: 14, h: 22, c: chartColors.blue },
    { y: 4, h: 10, c: chartColors.teal },
    { y: 4, h: 5, c: chartColors.coral },
    { y: 9, h: 3, c: chartColors.coral },
    { y: 12, h: 24, c: chartColors.blue },
  ];
  return (
    <svg viewBox="0 0 60 36" className="size-full" preserveAspectRatio="none">
      {bars.map((b, i) => (
        <rect key={i} x={3 + i * 12} y={b.y} width="7" height={b.h} rx="1" fill={b.c} />
      ))}
    </svg>
  );
}

function MiniTiles() {
  return (
    <div className="grid size-full grid-cols-2 gap-1">
      {kpi.tiles.slice(0, 4).map((tile) => (
        <span key={tile.label} className="flex flex-col justify-end rounded-[3px] bg-ink-on-paper/[0.05] p-1">
          <span className="font-mono text-[6.5px] font-semibold text-ink-on-paper">
            {formatKpiValue(tile.value, tile.format)}
          </span>
        </span>
      ))}
    </div>
  );
}
