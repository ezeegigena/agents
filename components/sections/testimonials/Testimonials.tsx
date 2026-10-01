import { Quote } from "lucide-react";
import { testimonials } from "@/content/testimonials";
import { Glow } from "@/components/ui/Glow";
import { GradientText } from "@/components/ui/GradientText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/cn";

function PlaceholderTag() {
  return (
    <span className="eyebrow rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-[10px] text-warning">
      {testimonials.placeholderTag}
    </span>
  );
}

export function Testimonials() {
  return (
    <section id="results" aria-labelledby="results-title" className="relative overflow-hidden py-24 md:py-36">
      <Glow color="#9d6bff" size={620} opacity={0.18} className="top-0 -right-40" />
      <Glow color="#1fe0b5" size={520} opacity={0.12} className="bottom-0 -left-40" />
      <div className="container-page relative">
        <SectionHeading
          id="results-title"
          eyebrow={testimonials.eyebrow}
          index={testimonials.index}
          title={
            <>
              {testimonials.title} <GradientText>{testimonials.titleHighlight}</GradientText>
            </>
          }
          lead={testimonials.lead}
        />

        <Stagger as="dl" className="mt-14 grid gap-4 sm:grid-cols-3">
          {testimonials.metrics.map((m) => (
            <StaggerItem key={m.label} className="glass rounded-3xl p-6">
              <dt className="text-sm text-fg-muted">{m.label}</dt>
              <dd className="mt-3 font-mono text-lg font-medium text-warning">{m.value}</dd>
            </StaggerItem>
          ))}
        </Stagger>

        <Stagger className="mt-4 grid gap-4 md:grid-cols-3">
          {testimonials.quotes.map((t, i) => (
            <StaggerItem key={i} className={cn(i === 1 && "md:translate-y-8")}>
              <TiltCard className="h-full rounded-3xl" max={4}>
                <figure className="glass flex h-full flex-col rounded-3xl p-7">
                  <div className="flex items-center justify-between">
                    <Quote aria-hidden className="size-7 text-brand-violet" />
                    <PlaceholderTag />
                  </div>
                  <blockquote className="mt-6 flex-1 text-lg leading-relaxed text-fg">{t.quote}</blockquote>
                  <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-5">
                    <span aria-hidden className="grid size-10 place-items-center rounded-full bg-brand-gradient font-mono text-xs font-semibold text-ink-950">
                      ??
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-medium text-fg">{t.name}</span>
                      <span className="text-sm text-fg-subtle">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
