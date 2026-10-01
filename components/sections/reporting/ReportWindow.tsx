"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { reportingContent } from "@/content/reporting";
import { useInViewport } from "@/lib/hooks/useInView";
import { ReportPanel } from "./ReportPanel";
import { ReportTabs, panelId, tabId } from "./ReportTabs";

const { reports, window: win } = reportingContent;
/** Seconds each report stays on screen while auto-cycling. */
const CYCLE = 5;

/**
 * Mock reporting app. Auto-cycles through the reports (paused on hover,
 * keyboard focus, offscreen and with reduced motion); tabs are clickable.
 */
export function ReportWindow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const progress = useMotionValue(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const autoplay = !reduced;
  const playing = autoplay && inView && !hovered && !focused;

  // Fill the active tab's progress bar, then advance. Pausing keeps the value,
  // so playback resumes where it stopped.
  useEffect(() => {
    if (!playing) return;
    let cancelled = false;
    controls.current = animate(progress, 1, {
      duration: CYCLE * (1 - progress.get()),
      ease: "linear",
      onComplete: () => {
        if (cancelled) return;
        progress.set(0);
        setActive((i) => (i + 1) % reports.length);
      },
    });
    return () => {
      cancelled = true;
      controls.current?.stop();
    };
  }, [playing, active, progress]);

  function select(index: number) {
    if (index === active) return;
    controls.current?.stop();
    progress.set(0);
    setActive(index);
  }

  function onFocus(e: FocusEvent<HTMLDivElement>) {
    if (e.target.matches(":focus-visible")) setFocused(true);
  }

  function onBlur(e: FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
  }

  const report = reports[active];

  return (
    <div
      ref={ref}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={onFocus}
      onBlur={onBlur}
      className="glass-strong relative overflow-hidden rounded-[1.75rem]"
    >
      <TitleBar />
      <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[14.25rem_minmax(0,1fr)]">
        <ReportTabs active={active} onSelect={select} progress={progress} showProgress={autoplay} />
        <div className="@container relative grid min-h-[34rem] p-4 sm:p-6 md:min-h-[33rem]">
          <AnimatePresence initial={false}>
            <motion.div
              key={report.id}
              id={panelId(report.id)}
              role="tabpanel"
              aria-labelledby={tabId(report.id)}
              tabIndex={0}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)", transition: { duration: 0.25 } }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="min-w-0 rounded-xl [grid-area:1/1]"
            >
              <ReportPanel report={report} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function TitleBar() {
  return (
    <div className="relative flex h-11 items-center gap-3 border-b border-line bg-white/[0.02] px-4">
      <span aria-hidden className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </span>
      <p className="min-w-0 flex-1 truncate text-center font-mono text-[11px] text-fg-muted sm:absolute sm:inset-x-40 sm:flex-none">
        {win.title}
      </p>
      <span className="ml-auto hidden rounded-full border border-line bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-fg-muted sm:inline-flex">
        {win.sampleLabel}
      </span>
    </div>
  );
}
