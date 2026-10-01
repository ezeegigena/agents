"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import {
  buildDesktopTimeline,
  buildMobileTimeline,
  buildPanelTimeline,
  restoreFinalText,
  type Phase,
} from "./timeline";

type Options = {
  scopeRef: RefObject<HTMLElement | null>;
  /** Changes whenever the build should restart (month switch, replay). */
  buildKey: string;
  isDesktop: boolean;
  reduced: boolean;
  inView: boolean;
  /** Visible statement on mobile — switching rebuilds it line by line. */
  activeTab: string;
  onPhase: (phase: Phase) => void;
};

/**
 * Owns the demo's GSAP timeline: builds it for the current month/layout,
 * auto-plays it once the stage is on screen, pauses it offscreen and
 * reverts everything to the final (server-rendered) state on cleanup.
 * With reduced motion no timeline exists — the final state simply renders.
 */
export function useDemoTimeline({
  scopeRef,
  buildKey,
  isDesktop,
  reduced,
  inView,
  activeTab,
  onPhase,
}: Options) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const panelTlRef = useRef<gsap.core.Timeline | null>(null);
  const pendingRef = useRef(false);
  const inViewRef = useRef(inView);
  const tabRef = useRef(activeTab);

  useLayoutEffect(() => {
    const root = scopeRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const tl = isDesktop ? buildDesktopTimeline(root, onPhase) : buildMobileTimeline(root, onPhase);
      tl.eventCallback("onComplete", () => {
        pendingRef.current = false;
      });
      tlRef.current = tl;
    }, root);
    ctxRef.current = ctx;
    pendingRef.current = true;
    if (inViewRef.current) tlRef.current?.play();

    return () => {
      ctx.revert();
      ctxRef.current = null;
      tlRef.current = null;
      panelTlRef.current = null;
      restoreFinalText(root);
    };
  }, [scopeRef, buildKey, isDesktop, reduced, onPhase]);

  // Auto-play once on screen; pause while offscreen.
  useEffect(() => {
    inViewRef.current = inView;
    const tl = tlRef.current;
    if (!tl) return;
    if (inView && pendingRef.current) tl.play();
    else tl.pause();
  }, [inView]);

  // Mobile tab switch: finish the main build, then rebuild the new panel.
  useEffect(() => {
    if (tabRef.current === activeTab) return;
    tabRef.current = activeTab;
    const root = scopeRef.current;
    const ctx = ctxRef.current;
    if (!root || !ctx || isDesktop) return;
    const panel = root.querySelector<HTMLElement>(`[data-statement="${activeTab}"]`);
    if (!panel) return;
    tlRef.current?.progress(1);
    ctx.add(() => {
      panelTlRef.current?.kill();
      panelTlRef.current = buildPanelTimeline(panel);
    });
  }, [activeTab, isDesktop, scopeRef]);
}
