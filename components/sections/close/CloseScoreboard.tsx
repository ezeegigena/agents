import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { closeContent, type CloseTrack } from "@/content/close";
import { dayAt } from "./geometry";

const { tracks, scoreboard, timeline, disclaimer } = closeContent;

/** "Day N" counter pair, one row per track, updated as the sequence plays. */
export function CloseScoreboard({ day }: { day: number }) {
  return (
    <div className="glass rounded-3xl p-4 sm:p-5">
      <h3 className="eyebrow font-mono text-fg-muted">{scoreboard.title}</h3>
      <p className="sr-only">{scoreboard.summary}</p>
      <div aria-hidden className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
        {tracks.map((track) => (
          <CounterRow key={track.id} track={track} day={day} />
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-snug text-fg-muted">{disclaimer}</p>
    </div>
  );
}

function CounterRow({ track, day }: { track: CloseTrack; day: number }) {
  const isAi = track.id === "ai";
  const closed = day >= track.closesOn;
  const progress = Math.min(1, day / track.closesOn);
  const shown = dayAt(day, track.closesOn);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-3.5 transition-colors duration-500",
        isAi && closed
          ? "border-success/30 bg-success/[0.06]"
          : "border-line bg-ink-900/60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium text-fg">
            <span
              className={cn(
                "h-2 w-4 shrink-0 rounded-full",
                isAi ? "bg-brand-gradient" : "bg-[rgb(255_92_122/0.7)]",
              )}
            />
            {track.label}
          </p>
          <Status closed={closed} isAi={isAi} label={closed ? track.status.closed : track.status.running} />
        </div>
        <div className="flex shrink-0 items-baseline gap-1.5">
          <span className="text-xs text-fg-muted">{timeline.dayLabel}</span>
          <span className="relative inline-flex h-[2.6rem] min-w-[2.2ch] items-center justify-end overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={shown}
                initial={{ y: "70%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-70%", opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "block text-[2.6rem] leading-none font-semibold tracking-[-0.04em] tabular",
                  isAi ? "text-gradient" : "text-fg",
                )}
              >
                {shown}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
      </div>
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/[0.04]">
        <span
          className={cn(
            "block h-full origin-left transition-transform duration-300 ease-out",
            isAi ? "bg-brand-gradient" : "bg-[rgb(255_92_122/0.6)]",
          )}
          style={{ transform: `scaleX(${progress})` }}
        />
      </span>
    </div>
  );
}

function Status({ closed, isAi, label }: { closed: boolean; isAi: boolean; label: string }) {
  return (
    <p
      className={cn(
        "mt-1.5 flex items-center gap-1.5 text-xs leading-tight",
        closed && isAi ? "text-success" : "text-fg-muted",
      )}
    >
      {closed ? (
        <span
          className={cn(
            "grid size-3.5 shrink-0 place-items-center rounded-full",
            isAi ? "bg-success text-ink-950" : "bg-white/15 text-fg",
          )}
        >
          <Check className="size-2.5" strokeWidth={3.5} />
        </span>
      ) : (
        <span className="relative flex size-1.5 shrink-0">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-violet/70" />
          <span className="relative size-full rounded-full bg-brand-violet" />
        </span>
      )}
      {label}
    </p>
  );
}
