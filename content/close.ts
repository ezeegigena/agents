import { CalendarCheck2, FileCheck2, Hourglass, type LucideIcon } from "lucide-react";
import type { AgentId } from "@/content/agents";

/**
 * "Close your month faster" section. All copy and the illustrative close
 * timeline live here.
 *
 * Timeline units are days, 0-based: 0 = start of day 1, 3 = end of day 3.
 * Every number in this section is illustrative — keep the disclaimer visible.
 */

export type CloseTask = {
  label: string;
  start: number;
  end: number;
  /** Small tag shown under the label ("Continuous", "Human review"). */
  tag?: string;
  /** Runs all month long: drawn as a flowing segment before day 1. */
  continuous?: boolean;
};

export type CloseTrackId = "traditional" | "ai";

export type CloseTrack = {
  id: CloseTrackId;
  label: string;
  caption: string;
  /** The (1-based) day the close is finished. */
  closesOn: number;
  status: { running: string; closed: string };
  tasks: CloseTask[];
};

export type CloseChecklistItem = {
  label: string;
  /** Timeline position (days) at which the item ticks off. */
  doneAt: number;
  owner: AgentId | "you";
};

type CloseOutcome = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export const closeContent = {
  index: "04",
  eyebrow: "Month-end close",
  title: { before: "Close the month in ", highlight: "days", after: ", not weeks." },
  lead: "Your AI finance team reconciles every day, so month-end is a final review — not a two-week scramble. The agents do the grinding; your team reviews and signs off.",
  disclaimer: "Illustrative example — actual timelines vary.",

  timeline: {
    title: "September close",
    /** Number of day columns on the timeline. */
    days: 15,
    dayLabel: "Day",
    cursorLabel: "Day",
  },

  tracks: [
    {
      id: "traditional",
      label: "Traditional close",
      caption: "Manual, sequential, spreadsheet-driven",
      closesOn: 14,
      status: { running: "In progress", closed: "Closed" },
      tasks: [
        { label: "Bank & card reconciliations", start: 0, end: 4 },
        { label: "AP/AR cutoff", start: 1, end: 5 },
        { label: "Accruals & prepaids", start: 3, end: 8 },
        { label: "Account reconciliations", start: 4, end: 10 },
        { label: "Review & adjustments", start: 8, end: 12 },
        { label: "Financial statements & reporting", start: 10, end: 14 },
      ],
    },
    {
      id: "ai",
      label: "AI-assisted close",
      caption: "Continuous, agent-run, human-reviewed",
      closesOn: 3,
      status: { running: "In progress", closed: "Closed — ready for review" },
      tasks: [
        {
          label: "Bank & card reconciliations",
          start: 0,
          end: 0.5,
          tag: "Continuous",
          continuous: true,
        },
        { label: "AP/AR cutoff", start: 0, end: 1 },
        { label: "Accruals & prepaids", start: 0.25, end: 1.5 },
        { label: "Account reconciliations", start: 0.5, end: 1.75 },
        { label: "Review & adjustments", start: 1, end: 2.25, tag: "Human review" },
        { label: "Financial statements & reporting", start: 1.75, end: 3 },
      ],
    },
  ] satisfies CloseTrack[],

  /** Callout shown in the empty AI lane once the AI-assisted close is done. */
  aiCallout: { title: "Books closed", body: "Ready for your review" },

  scoreboard: {
    title: "Days to close",
    summary:
      "Illustrative example: the traditional close finishes on day 14; the AI-assisted close finishes on day 3 and is ready for review.",
  },

  checklist: {
    title: "Close checklist",
    youLabel: "Your team",
    items: [
      { label: "Bank & cards reconciled", doneAt: 0.5, owner: "bookkeeper" },
      { label: "AP/AR cutoff confirmed", doneAt: 1, owner: "ap-ar" },
      { label: "Accruals & prepaids booked", doneAt: 1.5, owner: "controller" },
      { label: "Balance sheet reconciled", doneAt: 1.75, owner: "controller" },
      { label: "Variances explained", doneAt: 2, owner: "fpa" },
      { label: "Reviewed & signed off", doneAt: 2.25, owner: "you" },
      { label: "Financial statements drafted", doneAt: 2.75, owner: "controller" },
      { label: "Management report sent", doneAt: 3, owner: "fpa" },
    ] satisfies CloseChecklistItem[],
  },

  outcomes: [
    {
      icon: CalendarCheck2,
      title: "Close in days, not weeks",
      body: "Reconciliations run all month, so month-end starts mostly done.",
    },
    {
      icon: Hourglass,
      title: "Fewer manual hours",
      body: "Agents handle matching, accruals and tie-outs. Your team reviews the exceptions.",
    },
    {
      icon: FileCheck2,
      title: "Audit-ready trail",
      body: "Every entry links to its source document, approver and timestamp.",
    },
  ] satisfies CloseOutcome[],

  ctaNote: "See what your close could look like.",
};
