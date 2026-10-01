"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

/**
 * A light "sheet" section: inset, rounded and scaling up as it scrolls into
 * view over the dark page. Used for the light chapters of the page.
 */
export function LightPanel({
  id,
  labelledBy,
  as = "section",
  children,
  className,
}: {
  id?: string;
  labelledBy?: string;
  /** Use "div" when the panel wraps several <section>s. */
  as?: "section" | "div";
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const Component = as === "div" ? motion.div : motion.section;
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.35"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);

  return (
    <Component
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
    </Component>
  );
}
