"use client";

import { useEffect, useState } from "react";
import { agentsSection, type Agent } from "@/content/agents";
import { cn } from "@/lib/cn";

const CHAR_MS = 22;
/** Pause between lines, in "characters". */
const LINE_PAUSE = 14;

/** Terminal-style sample log that types itself out line by line. */
export function ActivityLog({ agent, reduced }: { agent: Agent; reduced: boolean }) {
  const { dialog } = agentsSection;
  const lines = agent.activity;
  const starts = lines.map((_, i) =>
    lines.slice(0, i).reduce((n, line) => n + line.text.length + LINE_PAUSE, LINE_PAUSE),
  );
  const total = starts[starts.length - 1] + lines[lines.length - 1].text.length;
  const [step, setStep] = useState(0);
  const shown = reduced ? total : step;
  const done = shown >= total;

  useEffect(() => {
    if (reduced) return;
    let typed = 0;
    const timer = setInterval(() => {
      typed += 1;
      setStep(typed);
      if (typed >= total) clearInterval(timer);
    }, CHAR_MS);
    return () => clearInterval(timer);
  }, [reduced, total]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-950/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-2.5">
        <p className="eyebrow flex items-center gap-2 text-[0.6875rem] text-fg-muted">
          <span aria-hidden className="relative flex size-1.5">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success/70" />
            <span className="relative size-full rounded-full bg-success" />
          </span>
          {dialog.activityTitle}
        </p>
        <span className="eyebrow rounded-full border border-white/10 px-2 py-0.5 text-[0.625rem] text-fg-subtle">
          {dialog.activityNote}
        </span>
      </div>

      <ol className="space-y-2 px-4 py-4 font-mono text-[0.75rem] leading-relaxed">
        {lines.map((line, i) => {
          const typed = Math.max(0, Math.min(line.text.length, shown - starts[i]));
          const started = shown >= starts[i];
          const typing = started && typed < line.text.length;
          return (
            <li key={line.time + line.text} className="flex gap-3">
              <span className="sr-only">
                {line.time} {line.text}
              </span>
              <time
                aria-hidden
                className="tabular shrink-0 text-fg-subtle"
                style={{ opacity: started ? 1 : 0 }}
              >
                {line.time}
              </time>
              <span aria-hidden className="text-fg/90">
                {line.text.slice(0, typed)}
                {typing && <Caret color={agent.accent} />}
              </span>
            </li>
          );
        })}
        <li
          aria-hidden
          className="flex gap-3 text-fg-subtle transition-opacity duration-300"
          style={{ opacity: done ? 1 : 0 }}
        >
          <span className="w-[5ch] shrink-0 text-right">›</span>
          <span>
            {dialog.activityIdle}
            {done && <Caret color={agent.accent} blink />}
          </span>
        </li>
      </ol>
    </div>
  );
}

function Caret({ color, blink = false }: { color: string; blink?: boolean }) {
  return (
    <span
      className={cn(
        "ml-0.5 inline-block h-[1.1em] w-[0.5em] translate-y-[0.2em]",
        blink && "animate-pulse",
      )}
      style={{ background: color }}
    />
  );
}
