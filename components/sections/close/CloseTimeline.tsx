import { Info, RefreshCw } from "lucide-react";
import { cn } from "@/lib/cn";
import { closeContent } from "@/content/close";
import { CloseTrack } from "./CloseTrack";
import { AI_CLOSE_END, LANE_COLUMNS, TIMELINE_END, dayAt, lanePct, laneSpan } from "./geometry";

const { timeline, tracks, disclaimer } = closeContent;
const columns = { gridTemplateColumns: `repeat(${LANE_COLUMNS}, minmax(0, 1fr))` };

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
          <CloseTrack key={track.id} track={track} day={day} />
        ))}
      </div>
    </div>
  );
}

function LaneOverlay({ day }: { day: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 left-[var(--label)]">
      <div className="absolute inset-0 grid" style={columns}>
        {Array.from({ length: LANE_COLUMNS }, (_, i) => (
          <span
            key={i}
            className={cn(
              "border-l border-white/[0.045]",
              i === LANE_COLUMNS - 1 && "border-r",
              i === 0 &&
                "bg-[repeating-linear-gradient(135deg,rgb(255_255_255/0.025)_0_4px,transparent_4px_9px)]",
            )}
          />
        ))}
      </div>
      {/* The AI close window */}
      <span
        className="absolute inset-y-0 border-x border-brand-violet/20 bg-brand-violet/[0.06]"
        style={{ left: lanePct(0), width: laneSpan(0, AI_CLOSE_END) }}
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
        style={columns}
      >
        <RefreshCw className="mx-auto size-3 text-brand-teal/80" />
        {Array.from({ length: timeline.days }, (_, i) => (
          <span key={i} className={cn(i < AI_CLOSE_END && "text-fg")}>
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}
