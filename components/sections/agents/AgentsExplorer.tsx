"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { agentsSection, type AgentId } from "@/content/agents";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { scrollToHash, setScrollLocked } from "@/lib/scroll";
import { AgentDialog, type DialogState } from "./AgentDialog";
import { OrgChart } from "./OrgChart";
import { TeamView } from "./TeamView";
import { panelId, tabId, ViewToggle } from "./ViewToggle";
import { EASE_OUT_EXPO, type AgentsView, type OpenAgent } from "./shared";

/**
 * Interactive heart of the section: Team / Org chart views and the agent
 * dialog that both open. `heading` is the server-rendered SectionHeading.
 */
export function AgentsExplorer({ heading }: { heading: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [view, setView] = useState<AgentsView>("team");
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const bookAfterClose = useRef(false);
  const isOpen = dialog !== null;

  const open: OpenAgent = useCallback((id, source, trigger) => {
    triggerRef.current = trigger;
    setDialog({ agentId: id, originId: id, source });
  }, []);

  const close = useCallback(() => {
    setDialog(null);
    if (!bookAfterClose.current) triggerRef.current?.focus({ preventScroll: true });
  }, []);

  const book = useCallback(() => {
    bookAfterClose.current = true;
    setDialog(null);
  }, []);

  const switchAgent = useCallback((id: AgentId) => {
    setDialog((current) => current && { ...current, agentId: id });
  }, []);

  // Scroll to the booking section once the dialog has morphed back.
  const onExitComplete = useCallback(() => {
    if (!bookAfterClose.current) return;
    bookAfterClose.current = false;
    scrollToHash(siteConfig.bookingAnchor);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setScrollLocked(true);
    return () => setScrollLocked(false);
  }, [isOpen]);

  // Animate the stage height between views so the page below never jumps.
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageHeight, setStageHeight] = useState<number | "auto">("auto");
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setStageHeight(entry.borderBoxSize[0].blockSize),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const viewProps = { onOpen: open, originId: dialog?.originId ?? null, reduced };

  return (
    <LayoutGroup id="agents">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        {heading}
        <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end lg:pb-2">
          <ViewToggle view={view} onChange={setView} />
          <p className="text-sm text-fg-muted">{agentsSection.hint}</p>
        </div>
      </div>

      <motion.div
        animate={{ height: stageHeight }}
        transition={{ duration: reduced ? 0 : 0.6, ease: EASE_OUT_EXPO }}
        className="mt-12 md:mt-16"
      >
        <div ref={stageRef} className="relative">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={view}
              role="tabpanel"
              id={panelId(view)}
              aria-labelledby={tabId(view)}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.985, filter: "blur(8px)" }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: reduced ? "none" : "blur(0px)",
                transitionEnd: { filter: "none" },
              }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.985, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            >
              {view === "team" ? <TeamView {...viewProps} /> : <OrgChart {...viewProps} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <AgentDialog
        state={dialog}
        onClose={close}
        onSwitch={switchAgent}
        onBook={book}
        onExitComplete={onExitComplete}
      />
    </LayoutGroup>
  );
}
