"use client";

import { useSyncExternalStore } from "react";

/** SSR-safe media query hook. Returns `fallback` on the server. */
export function useMediaQuery(query: string, fallback = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

/** True on devices with a precise pointer that can hover (desktop/laptop). */
export const useCanHover = () => useMediaQuery("(hover: hover) and (pointer: fine)");
