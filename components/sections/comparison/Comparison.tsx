import { Check, Minus } from "lucide-react";
import { comparison } from "@/content/comparison";
import { LogoMark } from "@/components/layout/Logo";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GradientText } from "@/components/ui/GradientText";
import { cn } from "@/lib/cn";

const { rows, columns } = comparison;
const HireIcon = columns.hire.icon;

function HireValue({ text }: { text: string }) {
  return (
    <span className="flex gap-3 text-muted-on-paper">
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink-on-paper/[0.06]">
        <Minus aria-hidden className="size-3" />
      </span>
      {text}
    </span>
  );
}

function AgentValue({ text, estimate }: { text: string; estimate?: boolean }) {
  return (
    <span className="flex gap-3 text-fg">
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-gradient text-ink-950">
        <Check aria-hidden className="size-3" strokeWidth={3} />
      </span>
      <span>
        {text}
        {estimate && <span className="text-fg-muted">*</span>}
      </span>
    </span>
  );
}

export function Comparison() {
  return (
    <section id="compare" aria-labelledby="compare-title" className="relative pt-24 pb-16 md:pt-36 md:pb-24">
      <div className="container-page">
        <SectionHeading
          id="compare-title"
          tone="light"
          align="center"
          eyebrow={comparison.eyebrow}
          index={comparison.index}
          title={
            <>
              {comparison.title} <GradientText>{comparison.titleHighlight}</GradientText>
            </>
          }
          lead={comparison.lead}
        />

        {/* Desktop: table with a highlighted agent column */}
        <Reveal y={40} className="mt-16 hidden md:block">
          <div role="table" aria-label="AI agent compared with a new hire" className="relative grid grid-cols-[0.75fr_1fr_1fr] gap-x-4 lg:gap-x-6">
            <div
              aria-hidden
              className="gradient-border relative rounded-[2rem] bg-ink-950 shadow-[0_40px_80px_-40px_rgba(76,61,255,0.55)]"
              style={{ gridColumn: 3, gridRow: `1 / span ${rows.length + 1}` }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                <div className="absolute -top-24 right-0 size-64 rounded-full bg-brand-violet/30 blur-3xl" />
                <div className="absolute bottom-0 -left-20 size-64 rounded-full bg-brand-teal/15 blur-3xl" />
              </div>
            </div>

            <div role="row" className="contents">
              <span role="columnheader" style={{ gridColumn: 1, gridRow: 1 }} className="sr-only">
                Category
              </span>
              <div role="columnheader" style={{ gridColumn: 2, gridRow: 1 }} className="flex items-center gap-3 px-6 pt-8 pb-6 font-medium text-ink-on-paper">
                <span className="grid size-9 place-items-center rounded-xl bg-ink-on-paper/[0.06]">
                  <HireIcon aria-hidden className="size-4" />
                </span>
                {columns.hire.label}
              </div>
              <div role="columnheader" style={{ gridColumn: 3, gridRow: 1 }} className="relative flex items-center gap-3 px-7 pt-8 pb-6 font-medium text-fg">
                <LogoMark className="size-9" />
                {columns.agent.label}
              </div>
            </div>

            {rows.map((row, i) => (
              <div role="row" key={row.label} className="contents">
                <span
                  role="rowheader"
                  style={{ gridColumn: 1, gridRow: i + 2 }}
                  className={cn("eyebrow flex items-center py-6 text-muted-on-paper", i > 0 && "border-t border-paper-line")}
                >
                  {row.label}
                </span>
                <span
                  role="cell"
                  style={{ gridColumn: 2, gridRow: i + 2 }}
                  className={cn("flex items-center px-6 py-6", i > 0 && "border-t border-paper-line")}
                >
                  <HireValue text={row.hire} />
                </span>
                <span
                  role="cell"
                  style={{ gridColumn: 3, gridRow: i + 2 }}
                  className={cn(
                    "relative flex items-center px-7 py-6",
                    i > 0 && "border-t border-white/[0.07]",
                    i === rows.length - 1 && "pb-9",
                  )}
                >
                  <AgentValue text={row.agent} estimate={row.estimate} />
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Mobile: stacked cards */}
        <Stagger className="mt-12 grid gap-4 md:hidden">
          <StaggerItem className="rounded-3xl border border-paper-line bg-white/70 p-6">
            <p className="flex items-center gap-3 font-medium text-ink-on-paper">
              <HireIcon aria-hidden className="size-4" />
              {columns.hire.label}
            </p>
            <dl className="mt-5 space-y-4">
              {rows.map((row) => (
                <div key={row.label}>
                  <dt className="eyebrow text-muted-on-paper">{row.label}</dt>
                  <dd className="mt-1.5 text-[0.95rem]">
                    <HireValue text={row.hire} />
                  </dd>
                </div>
              ))}
            </dl>
          </StaggerItem>
          <StaggerItem className="gradient-border relative overflow-hidden rounded-3xl bg-ink-950 p-6">
            <div aria-hidden className="absolute -top-20 -right-10 size-56 rounded-full bg-brand-violet/30 blur-3xl" />
            <p className="relative flex items-center gap-3 font-medium text-fg">
              <LogoMark className="size-7" />
              {columns.agent.label}
            </p>
            <dl className="relative mt-5 space-y-4">
              {rows.map((row) => (
                <div key={row.label}>
                  <dt className="eyebrow text-fg-muted">{row.label}</dt>
                  <dd className="mt-1.5 text-[0.95rem]">
                    <AgentValue text={row.agent} estimate={row.estimate} />
                  </dd>
                </div>
              ))}
            </dl>
          </StaggerItem>
        </Stagger>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-on-paper">{comparison.footnote}</p>
      </div>
    </section>
  );
}
