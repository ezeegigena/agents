import { AnimatePresence, motion } from "motion/react";
import { Check, Info, RefreshCw } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { closeContent, type CloseTask, type CloseTrack } from "@/content/close";
import {
  AI_CLOSE_END,
  TIMELINE_END,
  dayAt,
  laneColumns,
  laneFraction,
  taskSpan,
} from "./geometry";

const { timeline, tracks, disclaimer, aiCallout } = closeContent;
const DAYS = timeline.days;
const COLUMNS = laneColumns(DAYS);
const pct = (t: number) => `${laneFraction(t, DAYS) * 100}%`;
const width = (task: CloseTask) => `${((task.end - task.start) / COLUMNS) * 100}%`;

/** Fill clip-paths tweened by GSAP: hidden → revealed left to right. */
export const FILL_EMPTY = "inset(0% 100% 0% 0% round 5px)";
export const FILL_FULL = "inset(0% 0% 0% 0% round 5px)";

const fills = {
  traditional:
    "bg-[linear-gradient(90deg,rgb(255_92_122/0.78),rgb(255_92_122/0.5))] shadow-[0_0_18px_-6px_rgb(255_92_122/0.7)]",
  ai: "bg-brand-gradient shadow-[0_0_20px_-4px_rgb(157_107_255/0.75)]",
} as const;

const swatches = {
  traditional: "bg-[rgb(255_92_122/0.7)]",
  ai: "bg-brand-gradient",
} as const;

/**
 * Two-track Gantt of the close. Bar fills and the day cursor are driven by
 * GSAP (data attributes); check marks and finish lines follow `day`.
 */
export function CloseTimeline({ day }: { day: number }) {
  return (
    <div className="glass-strong relative h-full rounded-3xl p-4 sm:p-5 xl:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
        <h3 className="font-sans text-base font-semibold tracking-[-0.01em] text-fg">
          {timeline.title}
        </h3>
        <p className="flex items-center gap-1.5 text-xs text-fg-muted">
          <Info aria-hidden className="size-3.5 shrink-0 self-center" />
          {disclaimer}
        </p>
      </div>

      <div className="relative mt-4 [--label:0px] md:[--label:10.5rem] xl:[--label:11.5rem]">
        <LaneOverlay day={day} />
        <DayHeader />
        {tracks.map((track) => (
          <Track key={track.id} track={track} day={day} />
        ))}
      </div>
    </div>
  );
}

function LaneOverlay({ day }: { day: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 left-[var(--label)]">
      <div
        className="absolute inset-0 grid"
        style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: COLUMNS }, (_, i) => (
          <span
            key={i}
            className={cn(
              "border-l border-white/[0.045]",
              i === COLUMNS - 1 && "border-r",
              i === 0 && "bg-[repeating-linear-gradient(135deg,rgb(255_255_255/0.025)_0_4px,transparent_4px_9px)]",
            )}
          />
        ))}
      </div>
      {/* The AI close window */}
      <span
        className="absolute inset-y-0 border-x border-brand-violet/20 bg-brand-violet/[0.06]"
        style={{ left: pct(0), width: `${(AI_CLOSE_END / COLUMNS) * 100}%` }}
      />
      {/* Day cursor — GSAP moves it with xPercent */}
      <div data-close-cursor className="invisible absolute inset-y-0 left-0 w-full opacity-0">
        <span className="absolute -top-1 bottom-0 left-0 w-px -translate-x-1/2 bg-gradient-to-b from-white via-brand-violet to-brand-violet/0 shadow-[0_0_14px_2px_rgb(157_107_255/0.55)]" />
        <span className="absolute -top-2.5 left-0 -translate-x-1/2 rounded-full bg-fg px-2 py-0.5 font-mono text-[10px] leading-4 font-medium whitespace-nowrap text-ink-950 tabular shadow-[0_6px_20px_-6px_rgb(157_107_255/0.9)]">
          {timeline.cursorLabel} {dayAt(day, TIMELINE_END)}
        </span>
      </div>
    </div>
  );
}

function DayHeader() {
  return (
    <div aria-hidden className="grid h-6 items-center md:grid-cols-[var(--label)_minmax(0,1fr)]">
      <span className="eyebrow hidden text-[10px] text-fg-muted md:block">{timeline.dayLabel}</span>
      <div
        className="grid items-center text-center font-mono text-[10px] text-fg-muted tabular sm:text-[11px]"
        style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
      >
        <RefreshCw className="mx-auto size-3 text-brand-teal/80" />
        {Array.from({ length: DAYS }, (_, i) => (
          <span key={i} className={cn(i < AI_CLOSE_END && "text-fg")}>
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}

function Track({ track, day }: { track: CloseTrack; day: number }) {
  const closed = day >= track.closesOn;
  return (
    <div className="mt-4 lg:mt-3 xl:mt-4">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 md:grid md:grid-cols-[var(--label)_minmax(0,1fr)]">
        <p className="flex items-center gap-2 text-sm font-semibold text-fg">
          <span aria-hidden className={cn("h-2 w-4 rounded-full", swatches[track.id])} />
          {track.label}
        </p>
        <p className="text-xs text-fg-muted">{track.caption}</p>
      </div>
      <div className="relative">
        <ol className="space-y-1.5 md:space-y-1">
          {track.tasks.map((task) => (
            <TaskRow key={task.label} task={task} trackId={track.id} done={day >= task.end} />
          ))}
        </ol>
        <FinishLine track={track} closed={closed} />
        {track.id === "ai" && <ClosedCallout closed={closed} closesOn={track.closesOn} />}
      </div>
    </div>
  );
}

/** Lane position as a CSS length within a track (label column + lane). */
const laneLeft = (t: number) =>
  `calc(var(--label) + (100% - var(--label)) * ${laneFraction(t, DAYS)})`;

function ClosedCallout({ closed, closesOn }: { closed: boolean; closesOn: number }) {
  return (
    <AnimatePresence>
      {closed && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0, x: -16, scale: 0.94, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="pointer-events-none absolute top-1/2 hidden -translate-y-1/2 md:block"
          style={{ left: laneLeft(closesOn + 0.9) }}
        >
          <div className="flex items-center gap-3 rounded-2xl border border-success/30 bg-ink-900/85 py-2.5 pr-4 pl-2.5 shadow-[0_0_48px_-12px_rgb(46_230_166/0.55)] backdrop-blur-md">
            <span className="grid size-9 place-items-center rounded-xl bg-success/15 text-success">
              <Check className="size-5" strokeWidth={3} />
            </span>
            <span>
              <span className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap text-fg">
                {aiCallout.title}
                <span className="rounded-md bg-success/15 px-1.5 py-px font-mono text-[10.5px] font-medium text-success tabular">
                  {timeline.dayLabel} {closesOn}
                </span>
              </span>
              <span className="mt-0.5 block text-xs whitespace-nowrap text-fg-muted">{aiCallout.body}</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TaskRow({
  task,
  trackId,
  done,
}: {
  task: CloseTask;
  trackId: CloseTrack["id"];
  done: boolean;
}) {
  const isAi = trackId === "ai";
  const bar: CSSProperties = { left: pct(task.start), width: width(task) };
  return (
    <li className="grid items-center gap-y-1 md:min-h-8 md:grid-cols-[var(--label)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs leading-tight text-fg-muted md:pr-3 md:text-[13px]">
        <span>{task.label}</span>
        {task.tag && (
          <span className="rounded-full border border-brand-teal/25 bg-brand-teal/10 px-1.5 py-px font-mono text-[9.5px] tracking-wide text-brand-teal uppercase">
            {task.tag}
          </span>
        )}
        <span className="sr-only">— {taskSpan(task, timeline.dayLabel)}</span>
      </div>
      <div aria-hidden className="relative h-3 md:h-4">
        {task.continuous && <ContinuousSegment />}
        <span
          className="absolute inset-y-0 rounded-[5px] bg-white/[0.035] ring-1 ring-white/[0.07] ring-inset"
          style={bar}
        />
        <span
          data-close-fill
          data-start={task.start}
          data-end={task.end}
          className={cn("absolute inset-y-0 rounded-[5px]", fills[trackId])}
          style={bar}
        />
        {isAi && (
          <AnimatePresence>
            {done && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 520, damping: 26 }}
                className="absolute top-1/2 -mt-2 ml-1.5 grid size-4 place-items-center rounded-full bg-success text-ink-950 shadow-[0_0_12px_rgb(46_230_166/0.6)]"
                style={{ left: pct(task.end) }}
              >
                <Check className="size-2.5" strokeWidth={3.5} />
              </motion.span>
            )}
          </AnimatePresence>
        )}
      </div>
    </li>
  );
}

/** Flowing dashes in the "ongoing" column: reconciliations run all month. */
function ContinuousSegment() {
  return (
    <svg
      className="absolute inset-y-0 h-full overflow-visible"
      style={{ left: pct(-1), width: pct(-0.06) }}
      preserveAspectRatio="none"
      viewBox="0 0 10 10"
    >
      <line
        x1="0"
        y1="5"
        x2="10"
        y2="5"
        stroke="#1fe0b5"
        strokeOpacity="0.85"
        strokeWidth="2"
        strokeDasharray="3 3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="animate-dash-flow"
      />
    </svg>
  );
}

function FinishLine({ track, closed }: { track: CloseTrack; closed: boolean }) {
  const isAi = track.id === "ai";
  return (
    <AnimatePresence>
      {closed && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scaleY: 0.4 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute -top-1 -bottom-1 hidden origin-top md:block"
          style={{ left: laneLeft(track.closesOn) }}
        >
          <span
            className={cn(
              "absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 rounded-full",
              isAi
                ? "bg-success shadow-[0_0_14px_rgb(46_230_166/0.7)]"
                : "bg-[rgb(255_92_122/0.6)]",
            )}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
