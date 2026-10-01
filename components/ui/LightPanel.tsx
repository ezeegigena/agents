"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A light "sheet" section: inset, rounded and scaling up as it scrolls into
 * view over the dark page. Used for the light chapters of the page.
 */
export function LightPanel({
  id,
  labelledBy,
  children,
  className,
}: {
  id?: string;
  labelledBy?: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.35"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);

  return (
    <motion.section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      style={reduced ? undefined : { scale }}
      className={cn(
        "relative mx-2 overflow-hidden rounded-[2rem] bg-paper text-ink-on-paper md:mx-4 md:rounded-[3rem]",
        className,
      )}
    >
      {children}
    </motion.section>
  );
}
