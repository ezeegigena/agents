"use client";

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

// The first render is the initial page load: skip the fade so the hero
// paints immediately (LCP). Later client navigations animate in.
let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const [animateIn] = useState(hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 16, filter: "blur(6px)" } : false}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
