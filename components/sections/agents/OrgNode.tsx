"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { agentsById, agentsSection, type Agent, type AgentId } from "@/content/agents";
import { cn } from "@/lib/cn";
import { columnFraction, nodeTop, nodeWidthCss, orgCanvas, orgLevels, type Emphasis } from "./org";
import { EASE_OUT_EXPO, shellLayoutId, type OpenAgent } from "./shared";

/** Compact glass node; hovering / focusing it lights its chain. */
export function OrgNode({
  agent,
  shown,
  reduced,
  isOrigin,
  emphasis,
  onOpen,
  onActive,
}: {
  agent: Agent;
  shown: boolean;
  reduced: boolean;
  isOrigin: boolean;
  emphasis: Emphasis;
  onOpen: OpenAgent;
  onActive: (id: AgentId | null) => void;
}) {
  const isTop = agent.reportsTo === null;
  const level = orgLevels[agent.id];
  const handoffs = agent.handoffs.map((h) => `${h.label} → ${agentsById[h.to].short}`).join(", ");

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16, scale: 0.96 }}
      animate={shown || reduced ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.7, delay: level * 0.1, ease: EASE_OUT_EXPO }}
      className="absolute"
      style={{
        left: `calc(${columnFraction(agent.id) * 100}% - ${nodeWidthCss} / 2)`,
        top: nodeTop(agent.id),
        width: nodeWidthCss,
        height: orgCanvas.nodeHeight,
      }}
    >
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={(e) => onOpen(agent.id, "org", e.currentTarget)}
        onPointerEnter={() => onActive(agent.id)}
        onPointerLeave={() => onActive(null)}
        onFocus={() => onActive(agent.id)}
        onBlur={() => onActive(null)}
        style={{ "--accent": agent.accent } as CSSProperties}
        className={cn(
          "group/node @container relative flex size-full items-center rounded-2xl text-left transition-[opacity,translate] duration-300 ease-out-expo hover:-translate-y-0.5",
          emphasis === "off" && "opacity-35",
        )}
      >
        <motion.span
          layoutId={reduced ? undefined : shellLayoutId("org", agent.id)}
          transition={{ layout: { type: "spring", bounce: 0.12, duration: 0.6 } }}
          style={{ borderRadius: 16 }}
          className={cn(
            "glass absolute inset-0",
            isTop && "shadow-[0_0_50px_-12px_rgba(157,107,255,0.55)]",
          )}
        />
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300",
            isTop ? "gradient-border opacity-90" : "opacity-0 group-hover/node:opacity-100",
            emphasis === "on" && "opacity-100",
            isOrigin && "opacity-0",
          )}
          style={
            isTop
              ? undefined
              : { boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--accent) 50%, transparent)" }
          }
        />
        <span
          className={cn(
            "relative flex min-w-0 items-center gap-2.5 px-2.5 transition-opacity duration-300 @min-[12.5rem]:gap-3 @min-[12.5rem]:px-3",
            isOrigin && "opacity-0",
          )}
        >
          <AgentAvatar agent={agent} size="sm" />
          <span className="min-w-0">
            <span className="line-clamp-2 font-display text-[0.875rem] leading-tight font-semibold tracking-[-0.02em] text-fg @min-[12.5rem]:truncate">
              {agent.short}
            </span>
            <span className="mt-0.5 hidden text-[0.71875rem] leading-[1.2] text-fg-muted @min-[12.5rem]:line-clamp-2">
              {agent.role}
            </span>
          </span>
        </span>
        {handoffs && (
          <span className="sr-only">
            . {agentsSection.org.handoffPrefix} {handoffs}
          </span>
        )}
      </button>
    </motion.div>
  );
}
