"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import {
  AlertTriangle,
  Check,
  ChevronsLeftRight,
  FileSpreadsheet,
  Mail,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { agentsById } from "@/content/agents";
import { problem } from "@/content/problem";
import { AgentAvatar } from "@/components/ui/AgentAvatar";

const { before, after, hint, label } = problem.comparison;

const clamp = (v: number) => Math.min(100, Math.max(0, v));

// Deterministic "messy spreadsheet" cells.
const SHEET = Array.from({ length: 8 }, (_, r) =>
  Array.from({ length: 4 }, (_, c) => {
    if ((r === 2 && c === 2) || (r === 6 && c === 1)) return "#REF!";
    if (r === 4 && c === 3) return "???";
    const n = ((r + 3) * (c + 7) * 7919) % 48000;
    return n.toLocaleString("en-US");
  }),
);

const SPARK = [18, 22, 20, 27, 25, 31, 30, 36, 34, 41];

/*
 * Each panel keeps its key content on "its" side of the default 50% split:
 * Before on the left, After on the right — the other half holds extras.
 */
function BeforePanel() {
  return (
    <div className="absolute inset-0 grid grid-cols-2 gap-4 bg-[#111319] p-4 pb-14 md:gap-10 md:p-10 md:pb-16">
      <div className="relative flex min-w-0 flex-col justify-center gap-3">
        <span className="w-fit rounded-full bg-danger/90 px-2.5 py-1 text-[10px] font-semibold text-white md:text-xs">
          {before.closeStatus}
        </span>
        <div className="flex items-center gap-1.5 text-[10px] text-white/45 md:text-xs">
          <FileSpreadsheet aria-hidden className="size-3.5 shrink-0" />
          <span className="truncate">Close_tracker_FINAL_v7 (2).xlsx</span>
        </div>
        <div className="relative grid grid-cols-3 overflow-hidden rounded-lg border border-white/10 font-mono text-[9px] md:grid-cols-4 md:text-[11px]">
          {SHEET.flatMap((row, r) =>
            row.map((cell, c) => (
              <span
                key={`${r}-${c}`}
                className={[
                  "truncate border-r border-b border-white/[0.06] px-1.5 py-1 text-right text-white/40 md:px-2.5 md:py-2.5",
                  c === 3 ? "hidden md:block" : "",
                  r === 5 ? "bg-warning/10" : "",
                  cell === "#REF!" ? "bg-danger/15 font-semibold text-danger" : "",
                  cell === "???" ? "text-warning" : "",
                ].join(" ")}
              >
                {cell}
              </span>
            )),
          )}
        </div>
        <div className="absolute right-[-4%] bottom-[8%] hidden w-[55%] -rotate-6 bg-[#f7e27a] p-2.5 font-mono text-[10px] leading-snug text-[#3b3410] shadow-[0_12px_30px_rgba(0,0,0,0.45)] sm:block md:bottom-[12%] md:p-3.5 md:text-xs">
          {before.sticky}
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-3 opacity-80 md:gap-4">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#1b1e27] px-3 py-2.5 text-[10px] text-white/80 shadow-xl md:px-4 md:py-3.5 md:text-sm">
          <span className="relative shrink-0">
            <Mail aria-hidden className="size-4" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-danger" />
          </span>
          {before.inbox}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-warning/30 bg-[#231e12] px-3 py-2.5 text-[10px] text-warning md:px-4 md:py-3.5 md:text-sm">
          <AlertTriangle aria-hidden className="size-4 shrink-0" />
          {before.deadline}
        </div>
        <div className="rounded-xl border border-white/10 bg-[#1b1e27] px-3 py-2.5 text-[10px] text-white/70 md:px-4 md:py-3.5 md:text-sm">
          <span className="font-semibold text-white/90">{before.ping.from}</span>
          <p className="mt-0.5">{before.ping.text}</p>
        </div>
      </div>
    </div>
  );
}

function AfterPanel() {
  const team = [agentsById.bookkeeper, agentsById["ap-ar"], agentsById.controller];
  const max = Math.max(...SPARK);
  const min = Math.min(...SPARK);
  const line = SPARK.map(
    (v, i) => `${i ? "L" : "M"}${(i / (SPARK.length - 1)) * 200} ${56 - ((v - min) / (max - min)) * 48}`,
  ).join(" ");

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-900">
      <div aria-hidden className="absolute -top-24 -right-24 size-80 rounded-full bg-brand-violet/25 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 left-1/4 size-80 rounded-full bg-brand-teal/15 blur-3xl" />
      <div className="relative grid h-full grid-cols-2 gap-4 p-4 pb-14 md:gap-10 md:p-10 md:pb-16">
        <div className="flex min-w-0 flex-col justify-center gap-3 opacity-90">
          <div className="glass rounded-2xl p-3 md:p-4">
            <p className="text-[10px] text-fg-muted md:text-xs">{after.cash.label}</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-base font-medium text-fg md:text-2xl">{after.cash.value}</span>
              <span className="text-[10px] text-success md:text-xs">{after.cash.delta}</span>
            </p>
            <svg viewBox="0 0 200 60" className="mt-2 h-10 w-full md:h-14" aria-hidden>
              <defs>
                <linearGradient id="after-spark" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#1fe0b5" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#1fe0b5" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${line} L200 60 L0 60 Z`} fill="url(#after-spark)" />
              <path d={line} fill="none" stroke="#1fe0b5" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <ul className="hidden flex-col gap-2 sm:flex">
            {after.delivered.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[10px] text-fg-muted md:text-xs">
                <Check aria-hidden className="size-3.5 shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-3 md:gap-4">
          <span className="w-fit rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-semibold text-success ring-1 ring-success/30 md:text-xs">
            {after.closeStatus}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] text-fg-muted md:text-xs">
            <Sparkles aria-hidden className="size-3.5 shrink-0 text-brand-violet" />
            <span className="truncate">{after.title}</span>
          </div>
          <div className="glass flex flex-col gap-2.5 rounded-2xl p-3 md:gap-4 md:p-6">
            {after.checklist.map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-[11px] text-fg md:gap-3 md:text-base">
                <span className="grid size-4 shrink-0 place-items-center rounded-full bg-success/15 text-success md:size-5">
                  <Check aria-hidden className="size-2.5 md:size-3" strokeWidth={3} />
                </span>
                {item}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {team.map((agent) => (
                <AgentAvatar key={agent.id} agent={agent} size="sm" online={false} className="rounded-xl ring-2 ring-ink-900" />
              ))}
            </div>
            <p className="hidden text-[10px] leading-snug text-fg-muted sm:block md:text-xs">{after.handledBy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Draggable before/after comparison (pointer + keyboard). */
export function BeforeAfter() {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const touched = useRef(false);
  const [pos, setPos] = useState(50);
  const inView = useInView(frameRef, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  // A gentle wiggle on first view hints that the divider is draggable.
  useEffect(() => {
    if (!inView || reduced || touched.current) return;
    const controls = animate(50, [50, 30, 66, 50], {
      duration: 2.2,
      delay: 0.4,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        if (!touched.current) setPos(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduced]);

  function updateFromPointer(clientX: number) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(clamp(((clientX - rect.left) / rect.width) * 100));
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    touched.current = true;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 20 : 5;
    const next =
      e.key === "ArrowLeft" ? pos - step
      : e.key === "ArrowRight" ? pos + step
      : e.key === "Home" ? 0
      : e.key === "End" ? 100
      : null;
    if (next === null) return;
    e.preventDefault();
    touched.current = true;
    setPos(clamp(next));
  }

  return (
    <figure className="relative">
      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => dragging.current && updateFromPointer(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        className="relative aspect-[4/5] cursor-ew-resize touch-pan-y overflow-hidden rounded-[1.75rem] bg-ink-950 shadow-[0_40px_100px_-40px_rgba(11,16,32,0.55)] ring-1 ring-ink-on-paper/10 select-none sm:aspect-[16/10] md:aspect-[16/9]"
      >
        <BeforePanel />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
          <AfterPanel />
        </div>

        <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur md:bottom-7 md:left-7">
          {before.tag}
        </span>
        <span
          className="pointer-events-none absolute bottom-4 right-4 rounded-full px-3 py-1 text-xs font-semibold text-white md:bottom-7 md:right-7"
          style={{ backgroundImage: "var(--cta-gradient)", opacity: pos < 92 ? 1 : 0 }}
        >
          {after.tag}
        </span>

        {/* Divider + handle */}
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
          <div className="absolute inset-y-0 -left-px w-0.5 bg-white/80 shadow-[0_0_20px_rgba(157,107,255,0.9)]" />
          <div
            role="slider"
            tabIndex={0}
            aria-label="Compare before and after AI"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            aria-valuetext={`${Math.round(100 - pos)}% after AI visible`}
            onKeyDown={onKeyDown}
            className="pointer-events-auto absolute top-1/2 left-0 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink-950 shadow-[0_8px_30px_rgba(0,0,0,0.45)] ring-4 ring-white/25"
          >
            <ChevronsLeftRight aria-hidden className="size-5" />
          </div>
        </div>
      </div>
      <figcaption className="mt-4 flex items-center justify-between text-sm text-muted-on-paper">
        <span>{hint}</span>
        <span className="eyebrow">{label}</span>
      </figcaption>
    </figure>
  );
}
