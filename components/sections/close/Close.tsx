import { closeContent } from "@/content/close";
import { Glow } from "@/components/ui/Glow";
import { GradientText } from "@/components/ui/GradientText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CloseOutcomes } from "./CloseOutcomes";
import { CloseSequence } from "./CloseSequence";

const { index, eyebrow, title, lead } = closeContent;

/** "Close your month faster": the traditional vs AI-assisted close race. */
export function Close() {
  return (
    <section
      id="close"
      aria-labelledby="close-title"
      className="relative overflow-clip py-24 md:py-36"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
      />
      <Glow color="#9d6bff" className="-top-56 right-[-10%]" size={820} opacity={0.32} />
      <Glow color="#4c7dff" className="top-[40%] -left-72" size={680} opacity={0.18} />
      <Glow color="#9d6bff" className="bottom-0 left-1/3" size={620} opacity={0.16} />

      <div className="container-page relative">
        <SectionHeading
          id="close-title"
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
      </div>

      <CloseSequence />

      <CloseOutcomes />
    </section>
  );
}
