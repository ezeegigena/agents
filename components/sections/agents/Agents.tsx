import { Glow } from "@/components/ui/Glow";
import { GradientText } from "@/components/ui/GradientText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { agentsById, agentsSection, type AgentId } from "@/content/agents";
import { AgentsCta } from "./AgentsCta";
import { AgentsExplorer } from "./AgentsExplorer";

/** "Meet your AI finance team" — team grid / org chart + agent profiles. */
export function Agents() {
  const { eyebrow, index, title, titleHighlight, lead } = agentsSection;

  return (
    <section
      id="agents"
      aria-labelledby="agents-title"
      className="relative overflow-hidden bg-ink-950 py-24 md:py-36"
    >
      <Backdrop />
      <div className="container-page relative">
        <AgentsExplorer
          heading={
            <SectionHeading
              id="agents-title"
              eyebrow={eyebrow}
              index={index}
              title={
                <>
                  {title} <GradientText>{titleHighlight}</GradientText>
                </>
              }
              lead={lead}
            />
          }
        />
        <AgentsCta />
      </div>
    </section>
  );
}

const accent = (id: AgentId) => agentsById[id].accent;

/** Calm multi-color glow field in the agents' accent colors. Decorative. */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="bg-grid absolute inset-x-0 top-0 h-[42rem] [mask-image:radial-gradient(60%_70%_at_50%_0%,#000,transparent)] opacity-60" />
      <Glow color={accent("bookkeeper")} size={620} opacity={0.12} className="-top-40 -left-48" />
      <Glow
        color={accent("controller")}
        size={760}
        opacity={0.16}
        className="top-[18%] -right-56"
      />
      <Glow color={accent("fpa")} size={680} opacity={0.12} className="top-[45%] -left-64" />
      <Glow
        color={accent("head-accounting")}
        size={560}
        opacity={0.08}
        className="bottom-[8%] left-[35%]"
      />
      <Glow color={accent("budget")} size={420} opacity={0.06} className="-right-24 bottom-0" />
    </div>
  );
}
