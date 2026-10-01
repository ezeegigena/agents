"use client";

import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, UsersRound, X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { agents, agentsById, agentsSection, type Agent, type AgentId } from "@/content/agents";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { ActivityLog } from "./ActivityLog";
import { EASE_OUT_EXPO, shellLayoutId, type AgentsView } from "./shared";

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

const TITLE_ID = "agent-dialog-title";
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
  const reduced = useReducedMotion() ?? false;
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
          aria-labelledby={TITLE_ID}
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

function AgentProfile({
  agent,
  reduced,
  focusTitle,
  onSwitch,
}: {
  agent: Agent;
  reduced: boolean;
  /** Move focus to the name after switching agents inside the dialog. */
  focusTitle: boolean;
  onSwitch: (id: AgentId) => void;
}) {
  const { dialog, card } = agentsSection;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const parent = agent.reportsTo ? agentsById[agent.reportsTo] : null;
  const receivesFrom = agents.flatMap((a) =>
    a.handoffs.filter((h) => h.to === agent.id).map((h) => ({ agent: a, label: h.label })),
  );

  useEffect(() => {
    if (focusTitle) titleRef.current?.focus({ preventScroll: true });
  }, [focusTitle]);

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduced ? 0 : -8 }}
      transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
      className="relative"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={{
          background: `radial-gradient(70% 100% at 0% 0%, ${agent.accent}24, transparent 70%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-12 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${agent.accent}, transparent)` }}
      />

      <div className="relative px-5 pt-9 pb-7 md:px-10 md:pt-10 md:pb-9">
        <header className="flex items-center gap-4 pr-12 md:gap-6">
          <AgentAvatar agent={agent} size="lg" />
          <div className="min-w-0">
            <p className="eyebrow tabular text-[0.6875rem] text-fg-subtle">
              {card.tag} {agent.index}
              <span aria-hidden className="mx-2 opacity-50">
                ·
              </span>
              <span style={{ color: agent.accent }}>{dialog.status}</span>
            </p>
            <h3
              id={TITLE_ID}
              ref={titleRef}
              tabIndex={-1}
              className="mt-2 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-fg focus:outline-none"
            >
              {agent.name}
            </h3>
            <p className="mt-1.5 text-fg-muted">{agent.role}</p>
          </div>
        </header>

        <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-fg/85">{agent.description}</p>

        <div className="mt-8 grid gap-8 md:grid-cols-[1.1fr_1fr] md:gap-10">
          <section aria-labelledby="agent-dialog-tasks">
            <h4 id="agent-dialog-tasks" className="eyebrow text-fg-muted">
              {dialog.tasksTitle}
            </h4>
            <ul className="mt-4 space-y-3">
              {agent.tasks.map((task, i) => (
                <motion.li
                  key={task}
                  initial={reduced ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 + i * 0.07, duration: 0.5, ease: EASE_OUT_EXPO }}
                  className="flex gap-3 text-[0.9375rem] leading-snug text-fg"
                >
                  <motion.span
                    aria-hidden
                    initial={reduced ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.3 + i * 0.07,
                      type: "spring",
                      stiffness: 500,
                      damping: 24,
                    }}
                    className="mt-px grid size-5 shrink-0 place-items-center rounded-full"
                    style={{ background: `${agent.accent}2e` }}
                  >
                    <Check className="size-3" strokeWidth={3} style={{ color: agent.accent }} />
                  </motion.span>
                  {task}
                </motion.li>
              ))}
            </ul>
          </section>

          <div className="md:self-start">
            <ActivityLog agent={agent} reduced={reduced} />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-6 border-t border-white/[0.06] pt-7">
          <ConnectionGroup title={dialog.reportsToTitle}>
            {parent ? (
              <AgentChip agent={parent} onClick={() => onSwitch(parent.id)} />
            ) : (
              <span className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] py-1.5 pr-4 pl-1.5">
                <span className="grid size-9 place-items-center rounded-xl bg-white/[0.06]">
                  <UsersRound aria-hidden className="size-4 text-fg-muted" />
                </span>
                <span className="text-sm font-medium text-fg">{dialog.reportsToTop}</span>
              </span>
            )}
          </ConnectionGroup>
          {agent.handoffs.length > 0 && (
            <ConnectionGroup title={dialog.handoffsTitle}>
              {agent.handoffs.map((h) => (
                <AgentChip
                  key={h.to}
                  agent={agentsById[h.to]}
                  detail={h.label}
                  onClick={() => onSwitch(h.to)}
                />
              ))}
            </ConnectionGroup>
          )}
          {receivesFrom.length > 0 && (
            <ConnectionGroup title={dialog.receivesTitle}>
              {receivesFrom.map((r) => (
                <AgentChip
                  key={r.agent.id}
                  agent={r.agent}
                  detail={r.label}
                  onClick={() => onSwitch(r.agent.id)}
                />
              ))}
            </ConnectionGroup>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ConnectionGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="eyebrow text-[0.6875rem] text-fg-subtle">{title}</h4>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function AgentChip({
  agent,
  detail,
  onClick,
}: {
  agent: Agent;
  detail?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-12 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] py-1.5 pr-3.5 pl-1.5 text-left transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.07]"
    >
      <AgentAvatar agent={agent} size="sm" online={false} />
      <span className="flex flex-col">
        <span className="text-sm font-medium text-fg">{agent.short}</span>
        {detail && (
          <span className="font-mono text-[0.6875rem] leading-tight text-fg-muted">{detail}</span>
        )}
      </span>
      <ArrowUpRight
        aria-hidden
        className="ml-1 size-3.5 text-fg-subtle transition-colors duration-200 group-hover:text-fg"
      />
    </button>
  );
}
