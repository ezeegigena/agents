import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { closeContent, type CloseTask, type CloseTrack as Track } from "@/content/close";
import { laneLeft, lanePct, laneSpan, taskSpan } from "./geometry";
import { trackFill, trackSwatch } from "./trackStyles";

const { timeline, aiCallout } = closeContent;

/** Bar fill clip-paths tweened by GSAP: hidden → revealed left to right. */
export const FILL_EMPTY = "inset(0% 100% 0% 0% round 5px)";
export const FILL_FULL = "inset(0% 0% 0% 0% round 5px)";

/** One track of the timeline: header, task rows, finish line (+ AI callout). */
export function CloseTrack({ track, day }: { track: Track; day: number }) {
  const closed = day >= track.closesOn;
  return (
    <div className="mt-4 lg:mt-3 xl:mt-4">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 md:grid md:grid-cols-[var(--label)_minmax(0,1fr)]">
        <p className="flex items-center gap-2 text-sm font-semibold text-fg">
          <span aria-hidden className={cn("h-2 w-4 rounded-full", trackSwatch[track.id])} />
          {track.label}
        </p>
        <p className="text-xs text-fg-muted">{track.caption}</p>
      </div>
      <div className="relative">
        <ol className="space-y-1.5 md:space-y-1">
          {track.tasks.map((task) => (
            <TaskRow key={task.label} task={task} track={track} done={day >= task.end} />
          ))}
        </ol>
        <FinishLine track={track} closed={closed} />
        {track.id === "ai" && <ClosedCallout closed={closed} closesOn={track.closesOn} />}
      </div>
    </div>
  );
}

function TaskRow({ task, track, done }: { task: CloseTask; track: Track; done: boolean }) {
  const bar: CSSProperties = { left: lanePct(task.start), width: laneSpan(task.start, task.end) };
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
          className={cn("absolute inset-y-0 rounded-[5px]", trackFill[track.id])}
          style={bar}
        />
        {track.id === "ai" && (
          <AnimatePresence>
            {done && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 520, damping: 26 }}
                className="absolute top-1/2 -mt-2 ml-1.5 grid size-4 place-items-center rounded-full bg-success text-ink-950 shadow-[0_0_12px_rgb(46_230_166/0.6)]"
                style={{ left: lanePct(task.end) }}
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
      style={{ left: lanePct(-1), width: laneSpan(-1, -0.06) }}
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

function FinishLine({ track, closed }: { track: Track; closed: boolean }) {
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
              track.id === "ai"
                ? "bg-success shadow-[0_0_14px_rgb(46_230_166/0.7)]"
                : "bg-[rgb(255_92_122/0.6)]",
            )}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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
              <span className="mt-0.5 block text-xs whitespace-nowrap text-fg-muted">
                {aiCallout.body}
              </span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
