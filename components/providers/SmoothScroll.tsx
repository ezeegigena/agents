"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { registerLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling driven by the GSAP ticker so ScrollTrigger and
 * Lenis share one animation frame. Started once the browser is idle (keeps
 * it off the critical path) and disabled for prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    const start = () => {
      lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        autoRaf: false,
      });
      registerLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(start, { timeout: 1200 });

    return () => {
      cancelIdle(id);
      gsap.ticker.remove(tick);
      registerLenis(null);
      lenis?.destroy();
    };
  }, []);

  return null;
}
