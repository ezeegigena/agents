import { reportingContent } from "@/content/reporting";
import { Glow } from "@/components/ui/Glow";
import { GradientText } from "@/components/ui/GradientText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DeliveryColumn } from "./delivery/DeliveryColumn";
import { ReportWindow } from "./ReportWindow";

const { index, eyebrow, title, lead, window: win } = reportingContent;

/** "Automated reporting": a mock report app + scheduled delivery. */
export function Reporting() {
  return (
    <section
      id="reporting"
      aria-labelledby="reporting-title"
      className="relative isolate overflow-clip py-24 md:py-36"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 mask-fade-y">
        <Glow color="#1fe0b5" className="top-0 -left-40" size={760} opacity={0.2} />
        <Glow color="#1fe0b5" className="top-1/2 right-[-12%]" size={720} opacity={0.16} />
        <Glow color="#4c7dff" className="bottom-[-10%] left-1/4" size={560} opacity={0.14} />
      </div>

      <div className="container-page relative">
        <SectionHeading
          id="reporting-title"
          index={index}
          eyebrow={eyebrow}
          title={
            <>
              {title.before}
              <GradientText>{title.highlight}</GradientText>
              {title.after}
            </>
          }
          lead={lead}
        />

        <div className="mt-12 grid gap-8 md:mt-16 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <Reveal y={32}>
            <ReportWindow />
            <p className="mt-3 font-mono text-[11px] text-fg-muted sm:hidden">{win.sampleLabel}</p>
          </Reveal>
          <DeliveryColumn />
        </div>
      </div>
    </section>
  );
}
