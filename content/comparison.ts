import { Bot, UserRound, type LucideIcon } from "lucide-react";

/**
 * "AI agent vs. new hire". Keep claims modest — rows marked `estimate`
 * render with an asterisk that points to the footnote.
 */
export const comparison = {
  eyebrow: "AI agent vs. new hire",
  index: "06",
  title: "Same work.",
  titleHighlight: "Very different math.",
  lead: "Here’s how a yourfinancedone agent compares with hiring for a single finance role.",
  columns: {
    hire: { label: "Traditional new hire", icon: UserRound as LucideIcon },
    agent: { label: "yourfinancedone AI agent", icon: Bot as LucideIcon },
  },
  rows: [
    {
      label: "Cost",
      hire: "Salary, benefits, recruiting fees and tools",
      agent: "A predictable monthly fee — a fraction of a full-time hire",
      estimate: true,
    },
    {
      label: "Availability",
      hire: "Around 40 hours a week, minus PTO and sick days",
      agent: "24/7/365 — including the month-end crunch",
    },
    {
      label: "Ramp-up time",
      hire: "Typically months to recruit, onboard and train",
      agent: "Live in weeks, configured to your processes",
      estimate: true,
    },
    {
      label: "Scalability",
      hire: "More volume usually means another hire",
      agent: "Scales with your transaction volume",
    },
    {
      label: "Errors & quality",
      hire: "Manual entry and copy-paste mistakes happen",
      agent: "Rule-based checks on every entry, human review on exceptions",
    },
  ],
  footnote:
    "*Estimates for illustration only. Actual costs and timelines vary by role, location and scope — we’ll give you specifics on the call.",
};
