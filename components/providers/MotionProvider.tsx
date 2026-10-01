"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Framer Motion defaults: honor the OS reduced-motion setting + brand easing. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionConfig>
  );
}
