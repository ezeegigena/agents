"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import type { CSSProperties } from "react";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { TiltCard } from "@/components/ui/TiltCard";
import { agentsSection, type Agent } from "@/content/agents";
import { cn } from "@/lib/cn";
import { shellLayoutId, type OpenAgent } from "./shared";

const PREVIEW_COUNT = 3;

/** Card rows line up across the grid via subgrid (md+): header, name, role, body, footer. */
const SUBGRID = "md:row-span-5 md:grid md:grid-rows-subgrid";

/** One "team member": glass card that morphs into the agent dialog. */
export function AgentCard({
  agent,
  onOpen,
  isOrigin,
  reduced,
}: {
  agent: Agent;
  onOpen: OpenAgent;
  /** True while this card's dialog is open (its content steps aside). */
  isOrigin: boolean;
  reduced: boolean;
}) {
  const { card } = agentsSection;
  const style = { "--accent": agent.accent } as CSSProperties;

  return (
    <TiltCard
      glow={`${agent.accent}24`}
      max={5}
      style={style}
      className={cn(
        "group/card h-full rounded-3xl transition-[translate] duration-500 ease-out-expo hover:-translate-y-1.5",
        SUBGRID,
      )}
    >
      <motion.div
        layoutId={reduced ? undefined : shellLayoutId("team", agent.id)}
        style={{ borderRadius: 24 }}
        transition={{ layout: { type: "spring", bounce: 0.12, duration: 0.6 } }}
        className="glass absolute inset-0"
      />

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-300",
          isOrigin && "opacity-0",
        )}
      >
        {/* Hover ring + accent glow */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 group-has-[:focus-visible]/card:opacity-100"
          style={{
            boxShadow:
              "inset 0 0 0 1px color-mix(in oklab, var(--accent) 40%, transparent), 0 30px 70px -36px color-mix(in oklab, var(--accent) 70%, transparent)",
          }}
        />
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {/* Accent wash */}
          <div
            className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover/card:opacity-100"
            style={{
              background:
                "radial-gradient(110% 60% at 0% 0%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 62%)",
            }}
          />
          {/* Accent glow line */}
          <div
            className="absolute inset-x-8 top-0 h-px opacity-70 transition-[opacity,left,right] duration-500 ease-out-expo group-hover/card:inset-x-3 group-hover/card:opacity-100"
            style={{
              background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
            }}
          />
          <div
            className="absolute inset-x-10 -top-4 h-8 opacity-25 blur-xl transition-opacity duration-500 group-hover/card:opacity-60"
            style={{ background: "var(--accent)" }}
          />
        </div>
      </div>

      <div
        className={cn(
          "relative flex h-full flex-col p-6 transition-opacity duration-300 lg:p-5 xl:p-6",
          SUBGRID,
          isOrigin && "opacity-0",
        )}
      >
        <div className="flex items-start justify-between md:col-start-1 md:row-start-1">
          <AgentAvatar agent={agent} />
          <span className="eyebrow tabular pt-1 text-[0.6875rem] text-fg-subtle transition-colors duration-300 group-hover/card:text-fg-muted">
            {card.tag} {agent.index}
          </span>
        </div>

        <h3 className="mt-6 text-xl leading-[1.15] font-semibold tracking-[-0.03em] text-fg md:col-start-1 md:row-start-2 lg:mt-5 lg:text-lg xl:mt-6 xl:text-xl">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={(e) => onOpen(agent.id, "team", e.currentTarget)}
            className="text-left after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-brand-violet"
          >
            {agent.name}
          </button>
        </h3>

        {/* Role + description step aside for a task preview on hover / keyboard focus. */}
        <p className="mt-1.5 text-sm text-fg-muted transition-[opacity,translate] duration-500 ease-out-expo md:col-start-1 md:row-start-3 md:pointer-fine:group-hover/card:-translate-y-1.5 md:pointer-fine:group-hover/card:opacity-0 md:pointer-fine:group-has-[:focus-visible]/card:opacity-0">
          {agent.role}
        </p>
        <p className="mb-6 pt-5 text-[0.9375rem] leading-relaxed text-fg-muted transition-[opacity,translate] duration-500 ease-out-expo md:col-start-1 md:row-start-4 md:pointer-fine:group-hover/card:-translate-y-1.5 md:pointer-fine:group-hover/card:opacity-0 md:mb-0 md:pointer-fine:group-has-[:focus-visible]/card:opacity-0 lg:text-sm xl:text-[0.9375rem]">
          {agent.description}
        </p>
        <ul
          aria-label={card.previewLabel}
          className="hidden content-start gap-2.5 pt-3 md:col-start-1 md:row-start-3 md:row-end-5 md:pointer-fine:grid"
        >
          {agent.tasks.slice(0, PREVIEW_COUNT).map((task, i) => (
            <li
              key={task}
              style={{ "--d": `${60 + i * 60}ms` } as CSSProperties}
              className="flex translate-y-2 gap-2.5 text-[0.8125rem] leading-snug text-fg opacity-0 transition-[opacity,translate] duration-500 ease-out-expo group-hover/card:translate-y-0 group-hover/card:opacity-100 group-hover/card:[transition-delay:var(--d)] group-has-[:focus-visible]/card:translate-y-0 group-has-[:focus-visible]/card:opacity-100"
            >
              <span
                aria-hidden
                className="mt-px grid size-4 shrink-0 place-items-center rounded-full"
                style={{ background: "color-mix(in oklab, var(--accent) 22%, transparent)" }}
              >
                <Check className="size-2.5" strokeWidth={3} style={{ color: agent.accent }} />
              </span>
              {task}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4 md:col-start-1 md:row-start-5 md:mt-6 lg:mt-5 xl:mt-6">
          <span className="text-sm text-fg-muted transition-colors duration-300 group-hover/card:text-fg">
            {card.open}
          </span>
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-full border border-white/10 text-fg-muted transition-[background-color,border-color,color,rotate] duration-500 ease-out-expo group-hover/card:rotate-45 group-hover/card:border-transparent group-hover/card:bg-[var(--accent)] group-hover/card:text-ink-950"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </TiltCard>
  );
}
