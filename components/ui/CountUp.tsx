"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type CountUpProps = {
  value: number;
  from?: number;
  /** Formats the in-flight number for display. */
  format?: (value: number) => string;
  duration?: number;
  delay?: number;
  className?: string;
};

const defaultFormat = (v: number) => Math.round(v).toLocaleString("en-US");

/**
 * Counts up when scrolled into view. Updates textContent directly (no React
 * re-render per frame). Server-renders the final value for SEO/no-JS.
 */
export function CountUp({
  value,
  from = 0,
  format = defaultFormat,
  duration = 1.6,
  delay = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  // Reset to the start value once hydrated so the count-up has room to run.
  useEffect(() => {
    if (!reduced && ref.current && !inView) ref.current.textContent = format(from);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduced) return;
    const controls = animate(from, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduced, from, value, duration, delay, format]);

  return (
    <span ref={ref} className={cn("tabular", className)}>
      {format(value)}
    </span>
  );
}
