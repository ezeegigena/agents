import { Glow } from "@/components/ui/Glow";
import { GradientText } from "@/components/ui/GradientText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { demoSection } from "@/content/demo";
import { DemoStage } from "./DemoStage";

/** 03 — Live demo: an automated, fully linked 3-statement model. */
export function Demo() {
  const { id, eyebrow, index, title, lead } = demoSection;

  return (
    <section id={id} aria-labelledby="demo-title" className="relative isolate overflow-hidden py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_80%_70%_at_50%_55%,#000_20%,transparent_78%)]"
      />
      <Glow color="#4c7dff" size={1100} opacity={0.3} className="top-[28%] left-[calc(50%-550px)] -z-10" />
      <Glow color="#9d6bff" size={560} opacity={0.12} className="-top-24 -right-56 -z-10" />
      <Glow color="#1fe0b5" size={460} opacity={0.08} drift={false} className="bottom-0 -left-48 -z-10" />

      <div className="container-page">
        <SectionHeading
          id="demo-title"
          eyebrow={eyebrow}
          index={index}
          title={
            <>
              {title.lead} <GradientText>{title.highlight}</GradientText>
            </>
          }
          lead={lead}
        />
        <DemoStage className="mt-12 md:mt-14" />
      </div>
    </section>
  );
}
