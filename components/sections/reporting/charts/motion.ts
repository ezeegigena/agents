import type { Variants } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Shared "draw on show" variants. A chart root spreads `useShowOnView()`
 * props and children pick a variant; `custom` is the child's stagger index.
 */
export const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.4, ease: EASE, delay: 0.1 + i * 0.18 },
      opacity: { duration: 0.2, delay: 0.1 + i * 0.18 },
    },
  }),
};

/** Left-to-right wipe, for strokes drawn with non-scaling widths. */
export const reveal: Variants = {
  hidden: { clipPath: "inset(-20% 100% -20% 0%)" },
  show: (i: number = 0) => ({
    clipPath: "inset(-20% 0% -20% 0%)",
    transition: { duration: 1.3, ease: EASE, delay: 0.15 + i * 0.1 },
  }),
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: EASE, delay: 0.2 + i * 0.08 },
  }),
};

export const rise: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.1 + i * 0.07 },
  }),
};

/** Bars growing from their base (set transform-origin on the element). */
export const growY: Variants = {
  hidden: { scaleY: 0 },
  show: (i: number = 0) => ({
    scaleY: 1,
    transition: { duration: 0.9, ease: EASE, delay: 0.15 + i * 0.14 },
  }),
};

export const growX: Variants = {
  hidden: { scaleX: 0 },
  show: (i: number = 0) => ({
    scaleX: 1,
    transition: { duration: 1, ease: EASE, delay: 0.15 + i * 0.09 },
  }),
};

export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  show: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 420, damping: 22, delay: 0.3 + i * 0.12 },
  }),
};

/**
 * Props for a chart root that plays its variants once when scrolled into view.
 * Reduced motion renders the final state. The preference resolves after
 * hydration (SSR-safe), so `key` remounts the root once when it flips.
 */
export function useShowOnView() {
  const reduced = usePrefersReducedMotion();
  return {
    key: reduced ? "static" : "animated",
    props: {
      initial: reduced ? "show" : "hidden",
      whileInView: "show",
      viewport: { once: true, amount: 0.3 },
    },
  } as const;
}
