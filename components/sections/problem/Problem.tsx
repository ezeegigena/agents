import { problem } from "@/content/problem";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GradientText } from "@/components/ui/GradientText";
import { LightPanel } from "@/components/ui/LightPanel";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { BeforeAfter } from "./BeforeAfter";
import { ScrollStatement } from "./ScrollStatement";

export function Problem() {
  return (
    <LightPanel id="problem" labelledBy="problem-title">
      <div aria-hidden className="absolute inset-0 bg-grid-paper [mask-image:linear-gradient(180deg,#000,transparent_45%)]" />
      <div className="container-page relative py-24 md:py-36">
        <Reveal>
          <Eyebrow index={problem.index} tone="light">
            {problem.eyebrow}
          </Eyebrow>
        </Reveal>
        <div className="mt-8">
          <ScrollStatement id="problem-title" text={problem.statement} />
        </div>

        <Stagger as="ul" className="mt-16 grid gap-4 md:mt-20 md:grid-cols-3 md:gap-5">
          {problem.pains.map(({ icon: Icon, title, body }) => (
            <StaggerItem
              as="li"
              key={title}
              className="rounded-3xl border border-paper-line bg-white/70 p-6 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_20px_40px_-30px_rgba(11,16,32,0.25)] md:p-7"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-danger/10 text-danger">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-ink-on-paper">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted-on-paper">{body}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-24 flex flex-col gap-4 md:mt-32 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="max-w-[16ch] font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-ink-on-paper">
              <GradientText>{problem.resolution}</GradientText>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow text-muted-on-paper">{problem.comparison.title}</p>
          </Reveal>
        </div>
        <Reveal className="mt-10" y={40}>
          <BeforeAfter />
        </Reveal>
      </div>
    </LightPanel>
  );
}
