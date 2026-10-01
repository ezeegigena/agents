import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";
import { agents, agentsSection } from "@/content/agents";

/** Closing CTA row: the whole team as an avatar stack + booking button. */
export function AgentsCta() {
  const { cta } = agentsSection;

  return (
    <Reveal className="mt-16 md:mt-20">
      <div className="glass relative flex flex-col gap-6 overflow-hidden rounded-[2rem] p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-brand-gradient opacity-60"
        />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div aria-hidden className="flex shrink-0 -space-x-2.5">
            {agents.map((agent) => (
              <AgentAvatar
                key={agent.id}
                agent={agent}
                size="sm"
                online={false}
                className="ring-4 ring-ink-900"
              />
            ))}
          </div>
          <div>
            <p className="font-display text-xl leading-snug font-semibold tracking-[-0.03em] text-fg md:text-2xl">
              {cta.line}
            </p>
            <p className="mt-1 text-fg-muted">{cta.sub}</p>
          </div>
        </div>
        <Button
          href={siteConfig.bookingAnchor}
          arrow
          size="lg"
          className="w-full sm:w-auto sm:self-start lg:self-auto"
        >
          {siteConfig.cta.primary}
        </Button>
      </div>
    </Reveal>
  );
}
