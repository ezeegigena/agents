"use client";

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

// The first render is the initial page load: skip the fade so the hero
// paints immediately (LCP). Later client navigations animate in.
// Only opacity/translate are animated: a lingering inline `filter` would make
// this wrapper the containing block for position: fixed descendants.
let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const [animateIn] = useState(hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
