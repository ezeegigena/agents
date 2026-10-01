"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Tracks whether an element is in the viewport (continuously, not once).
 * Used to pause expensive loops (WebGL, auto-cycling demos) offscreen.
 */
export function useInViewport<T extends Element>(
  ref: RefObject<T | null>,
  rootMargin = "0px",
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
