import { siteConfig } from "@/config/site";
import { process } from "@/content/process";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessTimeline } from "./ProcessTimeline";

export function Process() {
  return (
    <section id="how-it-works" aria-labelledby="process-title" className="relative pt-16 pb-24 md:pt-24 md:pb-36">
      <div className="container-page">
        <SectionHeading
          id="process-title"
          tone="light"
          align="center"
          eyebrow={process.eyebrow}
          index={process.index}
          title={
            <>
              {process.title} <GradientText>{process.titleHighlight}</GradientText>
            </>
          }
          lead={process.lead}
        />
        <ProcessTimeline />
        <Reveal className="mt-14 flex justify-center">
          <Button href={siteConfig.bookingAnchor} size="lg" arrow variant="dark">
            {process.cta} — {siteConfig.cta.short.toLowerCase()}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
