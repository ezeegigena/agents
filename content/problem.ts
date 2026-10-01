import { CalendarClock, FileClock, UserRoundSearch, type LucideIcon } from "lucide-react";

/** "Problem → Solution" section copy. */
export const problem = {
  eyebrow: "The problem",
  index: "01",
  /** Scroll-highlighted statement, word by word. */
  statement:
    "Hiring finance staff takes months. Month-end close takes weeks. And reports arrive after the decisions are already made.",
  resolution: "There’s a faster way to run finance.",

  pains: [
    {
      icon: UserRoundSearch,
      title: "Hiring is slow and expensive",
      body: "Recruiting, onboarding and training a finance hire takes months — while the work keeps piling up.",
    },
    {
      icon: CalendarClock,
      title: "Close drags on",
      body: "Reconciliations, accruals and reviews eat the first weeks of every single month.",
    },
    {
      icon: FileClock,
      title: "Reports show up late",
      body: "By the time the numbers land, the decisions they should have informed are already made.",
    },
  ] satisfies { icon: LucideIcon; title: string; body: string }[],

  comparison: {
    title: "Before vs. after AI",
    hint: "Drag to compare",
    label: "Illustrative example",
    before: {
      tag: "Before",
      title: "Spreadsheets, inboxes & late nights",
      closeStatus: "Close: Day 11 of ~15",
      inbox: "47 invoices waiting to be coded",
      deadline: "Board deck due Friday",
      sticky: "chase overdue invoice #4471??",
      ping: { from: "CEO", text: "Where are we on the September numbers?" },
    },
    after: {
      tag: "After AI",
      title: "Agents do the work. You review.",
      closeStatus: "Close: Day 2 · Ready for review",
      checklist: [
        "Bank & card accounts reconciled",
        "47 of 47 invoices coded",
        "Accruals booked for review",
        "Board pack drafted",
      ],
      handledBy: "Handled by AI Bookkeeper, AP/AR Analyst & Controller",
      cash: { label: "Cash position", value: "$1.42M", delta: "+6.1% MoM" },
      delivered: ["P&L summary → #finance", "Board pack draft → inbox"],
    },
  },
};
