import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { agentAccentBg, type Agent } from "@/content/agents";

const sizes = {
  sm: { box: "size-9 rounded-xl", icon: "size-4", dot: "size-2" },
  md: { box: "size-12 rounded-2xl", icon: "size-5", dot: "size-2.5" },
  lg: { box: "size-16 rounded-[1.35rem]", icon: "size-7", dot: "size-3" },
} as const;

/**
 * An agent's "face": a glassy chip with concentric accent rings, the role
 * icon and a pulsing online dot.
 */
export function AgentAvatar({
  agent,
  size = "md",
  online = true,
  className,
}: {
  agent: Agent;
  size?: keyof typeof sizes;
  online?: boolean;
  className?: string;
}) {
  const s = sizes[size];
  const Icon = agent.icon;
  const style = { "--accent": agent.accent } as CSSProperties;

  return (
    <span
      style={style}
      className={cn("relative inline-grid shrink-0 place-items-center", s.box, className)}
    >
      {/* Accent ring */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-[inherit] p-px"
        style={{ background: agentAccentBg(agent) }}
      >
        <span className="block size-full rounded-[inherit] bg-ink-900" />
      </span>
      {/* Inner glow + rings */}
      <span
        aria-hidden
        className="absolute inset-px overflow-hidden rounded-[inherit]"
        style={{
          background:
            "radial-gradient(circle at 50% 120%, color-mix(in oklab, var(--accent) 45%, transparent), transparent 70%)",
        }}
      >
        <svg viewBox="0 0 40 40" className="absolute inset-0 size-full opacity-40">
          <circle cx="20" cy="20" r="11" fill="none" stroke="var(--accent)" strokeOpacity="0.5" />
          <circle cx="20" cy="20" r="16" fill="none" stroke="var(--accent)" strokeOpacity="0.25" />
        </svg>
      </span>
      <Icon aria-hidden className={cn("relative", s.icon)} style={{ color: agent.accent }} />
      {online && (
        <span aria-hidden className={cn("absolute -top-0.5 -right-0.5 flex", s.dot)}>
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success/70" />
          <span className="relative size-full rounded-full border-2 border-ink-950 bg-success" />
        </span>
      )}
    </span>
  );
}
