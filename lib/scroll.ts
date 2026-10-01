"use client";

import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Smooth-scrolls to an in-page anchor (e.g. "#book"), Lenis-aware. */
export function scrollToHash(hash: string) {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return false;

  if (lenis) {
    // Resync first: native scrolls (keyboard, find-in-page…) can leave Lenis'
    // internal position stale, which would skew the destination.
    if (Math.abs(lenis.animatedScroll - window.scrollY) > 1) {
      lenis.scrollTo(window.scrollY, { immediate: true });
    }
    // Same landing spot as native anchors: honor `scroll-padding-top` (navbar).
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    lenis.scrollTo(target.getBoundingClientRect().top + window.scrollY - padding, { duration: 1.4 });
  } else {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  history.replaceState(null, "", hash);
  // Move focus for keyboard + screen reader users without jumping the page.
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  return true;
}

/** Locks page scroll (mobile menu, dialogs) — works with or without Lenis. */
export function setScrollLocked(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}
