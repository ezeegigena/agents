"use client";

import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { agentsById, agentsSection, type Agent, type AgentId } from "@/content/agents";
import { cn } from "@/lib/cn";
import { childrenOf, orgEdges, orgLevels } from "./org";
import { EASE_OUT_EXPO, shellLayoutId, type OpenAgent } from "./shared";

type TreeProps = {
  onOpen: OpenAgent;
  originId: AgentId | null;
  reduced: boolean;
};

/** Phone org chart: vertical indented tree with elbow connectors. */
export function OrgTree(props: TreeProps) {
  const cross = orgEdges.filter((edge) => edge.kind === "cross");

  return (
    <div role="group" aria-label={agentsSection.org.title}>
      <ul>
        {childrenOf(null).map((agent) => (
          <TreeItem key={agent.id} agent={agent} {...props} />
        ))}
      </ul>

      {cross.length > 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-white/12 p-4">
          <h3 className="eyebrow text-[0.6875rem] text-fg-muted">{agentsSection.org.crossTitle}</h3>
          <ul className="mt-3 space-y-3">
            {cross.map((edge) => {
              const from = agentsById[edge.from];
              const to = agentsById[edge.to];
              return (
                <li key={edge.id} className="flex items-center gap-3 text-sm">
                  <span className="flex shrink-0 -space-x-2">
                    <AgentAvatar agent={from} size="sm" online={false} />
                    <AgentAvatar agent={to} size="sm" online={false} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-fg">
                      {from.short} <span className="text-fg-subtle">→</span> {to.short}
                    </span>
                    <span className="block font-mono text-[0.6875rem] text-fg-muted">
                      {edge.label}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function TreeItem({ agent, ...props }: TreeProps & { agent: Agent }) {
  const children = childrenOf(agent.id);
  const nested = agent.reportsTo !== null;

  return (
    <li
      className={cn(
        nested &&
          "relative pt-2.5 pl-5 before:absolute before:top-0 before:left-0 before:h-[calc(0.625rem+2.375rem)] before:w-5 before:rounded-bl-xl before:border-b before:border-l before:border-white/20 after:absolute after:top-[calc(0.625rem+2.375rem)] after:bottom-0 after:left-0 after:border-l after:border-white/20 last:after:hidden",
      )}
    >
      <TreeNode agent={agent} {...props} />
      {children.length > 0 && (
        <ul className="ml-[1.875rem]">
          {children.map((child) => (
            <TreeItem key={child.id} agent={child} {...props} />
          ))}
        </ul>
      )}
    </li>
  );
}

function TreeNode({ agent, onOpen, originId, reduced }: TreeProps & { agent: Agent }) {
  const isOrigin = originId === agent.id;
  const up = agent.handoffs.find((h) => h.to === agent.reportsTo);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, delay: orgLevels[agent.id] * 0.06, ease: EASE_OUT_EXPO }}
    >
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={(e) => onOpen(agent.id, "org", e.currentTarget)}
        className="relative flex h-[4.75rem] w-full items-center gap-3 rounded-2xl px-3 text-left"
      >
        <motion.span
          layoutId={reduced ? undefined : shellLayoutId("org", agent.id)}
          transition={{ layout: { type: "spring", bounce: 0.12, duration: 0.6 } }}
          style={{ borderRadius: 16 }}
          className={cn("glass absolute inset-0", agent.reportsTo === null && "gradient-border")}
        />
        <span
          className={cn(
            "relative flex min-w-0 items-center gap-3 transition-opacity duration-300",
            isOrigin && "opacity-0",
          )}
        >
          <AgentAvatar agent={agent} size="sm" />
          <span className="min-w-0">
            <span className="block truncate font-display text-[0.9375rem] leading-tight font-semibold tracking-[-0.02em] text-fg">
              {agent.short}
            </span>
            <span className="block truncate text-xs text-fg-muted">{agent.role}</span>
            {up && (
              <span className="mt-1 flex min-w-0 items-center gap-1 font-mono text-[0.65625rem] text-fg-muted">
                <ArrowUp aria-hidden className="size-3 shrink-0" style={{ color: agent.accent }} />
                <span className="truncate">
                  <span className="sr-only">{agentsSection.org.handoffPrefix} </span>
                  {up.label}
                </span>
              </span>
            )}
          </span>
        </span>
      </button>
    </motion.div>
  );
}
