import { Cable, MessagesSquare, Route, TrendingUp, type LucideIcon } from "lucide-react";

/** "How it works" steps. */
export const process = {
  eyebrow: "How it works",
  index: "07",
  title: "From first call to a finance team that",
  titleHighlight: "runs itself.",
  lead: "A clear, low-lift path. Your team stays in control at every step.",
  steps: [
    {
      icon: MessagesSquare,
      tag: "30-min call",
      title: "Discovery call",
      body: "We learn how your finance function runs today — tools, team, volume and the work that eats your week.",
    },
    {
      icon: Route,
      tag: "Workflow map",
      title: "Map your processes",
      body: "We document your workflows, approval rules and controls, and pick the agents with the biggest impact to start.",
    },
    {
      icon: Cable,
      tag: "Agents live",
      title: "Build & connect your agents",
      body: "We connect your accounting, banking and payment tools, configure your agents and run them alongside your team until the output matches.",
    },
    {
      icon: TrendingUp,
      tag: "Always improving",
      title: "Ongoing optimization",
      body: "We monitor accuracy, handle exceptions and add new workflows as you grow — no re-hiring, no re-training.",
    },
  ] satisfies { icon: LucideIcon; tag: string; title: string; body: string }[],
  cta: "Start with step one",
};
