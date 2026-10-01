"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Check, UsersRound } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { agents, agentsById, agentsSection, type Agent, type AgentId } from "@/content/agents";
import { ActivityLog } from "./ActivityLog";
import { DIALOG_TITLE_ID, EASE_OUT_EXPO } from "./shared";

/** Dialog body for one agent: identity, tasks, sample activity and team connections. */
export function AgentProfile({
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
              id={DIALOG_TITLE_ID}
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
