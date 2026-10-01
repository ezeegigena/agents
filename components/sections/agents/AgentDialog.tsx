"use client";

import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { agentsById, agentsSection, type AgentId } from "@/content/agents";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { AgentProfile } from "./AgentProfile";
import { DIALOG_TITLE_ID, shellLayoutId, type AgentsView } from "./shared";

export type DialogState = {
  /** Agent currently shown (changes when a handoff chip is clicked). */
  agentId: AgentId;
  /** Card / node the dialog grew out of — it morphs back into it on close. */
  originId: AgentId;
  source: AgentsView;
};

type DialogProps = {
  state: DialogState | null;
  onClose: () => void;
  onSwitch: (id: AgentId) => void;
  onBook: () => void;
  onExitComplete: () => void;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const noopSubscribe = () => () => {};

/** Expanded agent profile: modal dialog (bottom sheet on phones), portaled to <body>. */
export function AgentDialog({ state, onExitComplete, ...rest }: DialogProps) {
  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  if (!isClient) return null;

  return createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
      {state && <DialogPanel key="agent-dialog" state={state} {...rest} />}
    </AnimatePresence>,
    document.body,
  );
}

function DialogPanel({
  state,
  onClose,
  onSwitch,
  onBook,
}: Omit<DialogProps, "state" | "onExitComplete"> & { state: DialogState }) {
  const { dialog } = agentsSection;
  const reduced = usePrefersReducedMotion();
  const isSheet = useMediaQuery("(max-width: 767px)");
  const isPresent = useIsPresent();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [switched, setSwitched] = useState(false);
  const agent = agentsById[state.agentId];

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  // Esc to close + keep Tab focus inside the dialog.
  useEffect(() => {
    if (!isPresent) return;
    function onKeyDown(event: KeyboardEvent) {
      const root = dialogRef.current;
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = root.contains(active);
      if (event.shiftKey && (active === first || !inside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !inside)) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isPresent, onClose]);

  function switchTo(id: AgentId) {
    setSwitched(true);
    scrollRef.current?.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    onSwitch(id);
  }

  const corner = isSheet ? 0 : 32;

  return (
    <div className="fixed inset-0 z-[80]" inert={!isPresent}>
      <motion.div
        aria-hidden
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="absolute inset-0 bg-ink-950/75 backdrop-blur-md"
      />

      <div className="pointer-events-none absolute inset-0 flex items-end justify-center md:items-center md:p-8">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={DIALOG_TITLE_ID}
          className="pointer-events-auto relative flex max-h-[92dvh] w-full flex-col md:max-h-full md:max-w-[58rem]"
        >
          <motion.div
            layoutId={reduced ? undefined : shellLayoutId(state.source, state.originId)}
            {...(reduced && {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
            })}
            transition={{ layout: { type: "spring", bounce: 0.12, duration: 0.6 }, duration: 0.3 }}
            style={{
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              borderBottomLeftRadius: corner,
              borderBottomRightRadius: corner,
            }}
            className="glass-strong absolute inset-0"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: reduced ? 0 : 0.16, duration: 0.35 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[2rem] md:rounded-[2rem]"
          >
            <span
              aria-hidden
              className="absolute top-2.5 left-1/2 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-white/20 md:hidden"
            />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={dialog.close}
              className="absolute top-4 right-4 z-10 grid size-11 place-items-center rounded-full border border-white/10 bg-ink-900/70 text-fg-muted backdrop-blur transition-colors duration-200 hover:bg-white/10 hover:text-fg md:top-6 md:right-6"
            >
              <X aria-hidden className="size-5" />
            </button>

            <div
              ref={scrollRef}
              data-lenis-prevent
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain [mask-image:linear-gradient(to_bottom,transparent,#000_1.75rem)]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <AgentProfile
                  key={agent.id}
                  agent={agent}
                  reduced={reduced}
                  focusTitle={switched}
                  onSwitch={switchTo}
                />
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/[0.07] bg-ink-950/30 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between md:px-10 md:py-5">
              <Button
                href={siteConfig.bookingAnchor}
                arrow
                className="w-full sm:w-auto"
                onClick={(event) => {
                  event.preventDefault();
                  onBook();
                }}
              >
                {dialog.cta}
              </Button>
              <p className="text-center text-xs text-fg-muted sm:text-right md:text-sm">
                {agentsSection.cta.sub}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
