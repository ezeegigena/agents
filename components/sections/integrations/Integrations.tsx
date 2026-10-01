import { integrations } from "@/content/integrations";
import { LogoMark } from "@/components/layout/Logo";
import { Glow } from "@/components/ui/Glow";
import { GradientText } from "@/components/ui/GradientText";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const MONOGRAM_COLORS = ["#4C7DFF", "#9D6BFF", "#1FE0B5", "#36C5F0", "#FFC24B", "#FF6BC1", "#FF8A5B"];

function monogram(name: string) {
  const words = name.split(" ");
  return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
}

function ToolBadge({ name, category, color }: { name: string; category: string; color: string }) {
  return (
    <span className="glass flex items-center gap-3 rounded-2xl py-2.5 pr-5 pl-2.5">
      <span
        className="grid size-10 place-items-center rounded-xl font-mono text-xs font-semibold"
        style={{ background: `color-mix(in oklab, ${color} 16%, transparent)`, color }}
      >
        {monogram(name)}
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-medium whitespace-nowrap text-fg">{name}</span>
        <span className="text-xs whitespace-nowrap text-fg-subtle">{category}</span>
      </span>
    </span>
  );
}

export function Integrations() {
  const [first, second] = integrations.rows;
  const allTools = [...first, ...second];

  return (
    <section id="integrations" aria-labelledby="integrations-title" className="relative overflow-hidden py-24 md:py-36">
      <Glow color="#4c7dff" size={700} opacity={0.18} className="top-1/3 left-1/2 -translate-x-1/2" drift={false} />
      <div className="container-page">
        <SectionHeading
          id="integrations-title"
          align="center"
          eyebrow={integrations.eyebrow}
          index={integrations.index}
          title={
            <>
              {integrations.title} <GradientText>{integrations.titleHighlight}</GradientText>
            </>
          }
          lead={integrations.lead}
        />
      </div>

      <Reveal className="relative mt-16 md:mt-20">
        {/* Screen readers get one plain list; the marquee is decorative motion. */}
        <ul className="sr-only">
          {allTools.map((tool) => (
            <li key={tool.name}>
              {tool.name} ({tool.category})
            </li>
          ))}
        </ul>
        <div aria-hidden className="flex flex-col gap-4 motion-reduce:hidden">
          <Marquee duration={55}>
            {first.map((tool, i) => (
              <ToolBadge key={tool.name} {...tool} color={MONOGRAM_COLORS[i % MONOGRAM_COLORS.length]} />
            ))}
          </Marquee>
          <Marquee duration={60} reverse>
            {second.map((tool, i) => (
              <ToolBadge key={tool.name} {...tool} color={MONOGRAM_COLORS[(i + 3) % MONOGRAM_COLORS.length]} />
            ))}
          </Marquee>
        </div>
        {/* Reduced motion: a static, wrapped grid instead of the marquee. */}
        <div aria-hidden className="container-page hidden flex-wrap justify-center gap-3 motion-reduce:flex">
          {allTools.map((tool, i) => (
            <ToolBadge key={tool.name} {...tool} color={MONOGRAM_COLORS[i % MONOGRAM_COLORS.length]} />
          ))}
        </div>

        {/* Hub: everything connects to your agents */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden place-items-center md:grid motion-reduce:hidden">
          <div className="relative grid size-24 place-items-center rounded-[1.75rem] bg-ink-950/80 shadow-[0_0_0_10px_rgba(6,8,20,0.9),0_0_80px_10px_rgba(157,107,255,0.45)] backdrop-blur">
            <span className="absolute inset-0 animate-pulse-ring rounded-[1.75rem] border border-brand-violet/50" />
            <LogoMark className="size-14" />
          </div>
        </div>
      </Reveal>

      <div className="container-page mt-12 text-center">
        <p className="text-fg-muted">{integrations.footnote}</p>
        <p className="mx-auto mt-3 max-w-xl text-xs text-fg-subtle">{integrations.trademark}</p>
      </div>
    </section>
  );
}
