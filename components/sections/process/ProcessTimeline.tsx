"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { process } from "@/content/process";

const { steps } = process;

function StepNode({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const threshold = index / (steps.length - 1);
  const active = useTransform(progress, [threshold - 0.04, threshold], [0, 1]);
  const scale = useTransform(active, [0, 1], [0.85, 1]);
  const color = useTransform(active, [0, 1], ["#0b1020", "#ffffff"]);
  return (
    <span className="relative grid size-12 place-items-center rounded-full bg-paper ring-1 ring-paper-line">
      <motion.span
        aria-hidden
        style={{ opacity: active, scale }}
        className="absolute inset-0 rounded-full bg-brand-gradient shadow-[0_8px_30px_-6px_rgba(109,58,237,0.65)]"
      />
      <motion.span aria-hidden style={{ opacity: active }} className="absolute inset-0">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-violet/30" />
      </motion.span>
      <motion.span style={{ color }} className="relative font-mono text-sm font-medium">
        {String(index + 1).padStart(2, "0")}
      </motion.span>
    </span>
  );
}

/** Four steps joined by a line that draws itself as you scroll. */
export function ProcessTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const complete = useMotionValue(1);
  const progress = reduced ? complete : smooth;

  return (
    <ol ref={ref} className="relative mt-16 grid gap-10 md:mt-20 md:grid-cols-4 md:gap-6">
      {/* Track: horizontal on desktop (node centers 12.5% → 87.5%), vertical on mobile */}
      <div aria-hidden className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-px bg-paper-line md:block">
        <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-brand-gradient" />
      </div>
      <div aria-hidden className="absolute top-6 bottom-6 left-6 w-px bg-paper-line md:hidden">
        <motion.div style={{ scaleY: progress }} className="h-full w-full origin-top bg-brand-gradient" />
      </div>

      {steps.map(({ icon: Icon, tag, title, body }, i) => (
        <li key={title} className="relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center">
          <StepNode index={i} progress={progress} />
          <div className="flex-1 rounded-3xl border border-paper-line bg-white/75 p-6 transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(11,16,32,0.35)] md:mt-8 md:w-full md:p-7">
            <div className="flex items-center justify-between md:flex-col md:gap-4">
              <span className="grid size-11 place-items-center rounded-2xl bg-brand-violet/10 text-brand-violet">
                <Icon aria-hidden className="size-5" />
              </span>
              <span className="eyebrow rounded-full border border-paper-line px-2.5 py-1 text-muted-on-paper">
                {tag}
              </span>
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-ink-on-paper">{title}</h3>
            <p className="mt-2 leading-relaxed text-muted-on-paper">{body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
