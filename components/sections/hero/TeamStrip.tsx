import { agents } from "@/content/agents";
import { hero } from "@/content/hero";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { Marquee } from "@/components/ui/Marquee";

/** Bottom-of-hero marquee introducing the AI team. */
export function TeamStrip() {
  return (
    <div className="relative z-10 border-t border-line bg-ink-950/40 backdrop-blur-sm">
      <div className="container-page flex flex-col gap-4 py-5 md:flex-row md:items-center md:gap-8">
        <p className="eyebrow shrink-0 text-fg-subtle">{hero.teamStripLabel}</p>
        <Marquee duration={45} className="min-w-0 flex-1">
          {agents.map((agent) => (
            <span
              key={agent.id}
              className="flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] py-1.5 pr-4 pl-1.5"
            >
              <AgentAvatar agent={agent} size="sm" online={false} />
              <span className="text-sm whitespace-nowrap text-fg-muted">{agent.name}</span>
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
