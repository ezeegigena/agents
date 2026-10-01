import {
  ArrowLeftRight,
  BookOpenCheck,
  Crown,
  Landmark,
  PieChart,
  Scale,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

/**
 * Your AI finance team. Edit names, copy, tasks, colors and the org chart
 * (reportsTo / handoffs) here — every section that shows agents reads from
 * this file.
 */

export type AgentId =
  | "bookkeeper"
  | "ap-ar"
  | "budget"
  | "fpa"
  | "controller"
  | "head-accounting"
  | "head-finance"
  | "cfo";

export type Agent = {
  id: AgentId;
  /** Two-digit tag shown as "Agent 01". */
  index: string;
  name: string;
  /** Compact label for chips, orbit nodes and the org chart. */
  short: string;
  role: string;
  description: string;
  /** Accent color (hex). `accentTo` turns it into a gradient. */
  accent: string;
  accentTo?: string;
  icon: LucideIcon;
  /** 4–6 tasks shown when the card expands. */
  tasks: string[];
  /** Org chart parent. */
  reportsTo: AgentId | null;
  /** Work this agent hands to others (drawn as org-chart edges). */
  handoffs: { to: AgentId; label: string }[];
  /** Sample activity log lines for the expanded card (illustrative). */
  activity: { time: string; text: string }[];
};

export const agents: Agent[] = [
  {
    id: "bookkeeper",
    index: "01",
    name: "AI Bookkeeper",
    short: "Bookkeeper",
    role: "Bookkeeping & reconciliations",
    description: "Keeps your books clean and current every single day — not just at month-end.",
    accent: "#1FE0B5",
    icon: BookOpenCheck,
    tasks: [
      "Categorizes every bank and card transaction",
      "Reconciles bank and credit card accounts daily",
      "Maintains the general ledger and chart of accounts",
      "Captures, matches and files receipts",
      "Flags duplicates, anomalies and missing documents",
    ],
    reportsTo: "controller",
    handoffs: [{ to: "controller", label: "Reconciled ledger" }],
    activity: [
      { time: "08:02", text: "Categorized 312 new transactions" },
      { time: "08:05", text: "Matched 46 receipts to card spend" },
      { time: "08:06", text: "Bank rec complete — 0 unmatched items" },
    ],
  },
  {
    id: "ap-ar",
    index: "02",
    name: "AI Accounts Payable / Receivable Analyst",
    short: "AP/AR Analyst",
    role: "Payables & receivables",
    description: "Gets bills paid on time and gets you paid faster — without inbox archaeology.",
    accent: "#36C5F0",
    icon: ArrowLeftRight,
    tasks: [
      "Captures and codes incoming invoices",
      "Matches invoices to POs and receipts",
      "Schedules payments for approval",
      "Sends invoices and chases overdue balances",
      "Applies customer payments to open invoices",
      "Keeps aging reports current",
    ],
    reportsTo: "controller",
    handoffs: [
      { to: "controller", label: "Payables & receivables" },
      { to: "fpa", label: "Cash timing" },
    ],
    activity: [
      { time: "09:14", text: "Coded 37 vendor invoices" },
      { time: "09:20", text: "3-way matched 12 POs" },
      { time: "09:31", text: "Sent 8 friendly payment reminders" },
    ],
  },
  {
    id: "budget",
    index: "03",
    name: "AI Budget Analyst",
    short: "Budget Analyst",
    role: "Budgets & spend control",
    description: "Builds the budget with you, then watches every dollar against it.",
    accent: "#FFC24B",
    icon: PieChart,
    tasks: [
      "Builds annual and quarterly budgets by department",
      "Tracks actuals against budget in real time",
      "Flags variances before they become surprises",
      "Monitors spend by department, vendor and project",
      "Prepares budget owner summaries",
    ],
    reportsTo: "head-finance",
    handoffs: [{ to: "head-finance", label: "Variance flags" }],
    activity: [
      { time: "10:02", text: "Updated budget vs actual for 6 departments" },
      { time: "10:04", text: "Flagged Marketing at 112% of plan" },
      { time: "10:05", text: "Sent variance note to budget owner" },
    ],
  },
  {
    id: "fpa",
    index: "04",
    name: "AI FP&A Analyst",
    short: "FP&A Analyst",
    role: "Forecasting & planning",
    description: "Turns your actuals into forecasts you can actually plan around.",
    accent: "#4C7DFF",
    icon: TrendingUp,
    tasks: [
      "Maintains a rolling 12–18 month forecast",
      "Builds scenario models (base, upside, downside)",
      "Runs monthly variance analysis with commentary",
      "Models hiring plans and their cash impact",
      "Updates driver-based revenue and cost models",
    ],
    reportsTo: "head-finance",
    handoffs: [{ to: "head-finance", label: "Forecasts & scenarios" }],
    activity: [
      { time: "11:10", text: "Rolled forecast forward with September actuals" },
      { time: "11:12", text: "Re-ran downside scenario" },
      { time: "11:15", text: "Drafted variance commentary" },
    ],
  },
  {
    id: "controller",
    index: "05",
    name: "AI Financial Controller",
    short: "Controller",
    role: "Close & controls",
    description: "Runs your month-end close like clockwork and keeps you audit-ready.",
    accent: "#9D6BFF",
    icon: ShieldCheck,
    tasks: [
      "Runs the month-end close checklist",
      "Books accruals, prepaids and deferrals",
      "Prepares balance sheet reconciliations",
      "Enforces internal controls and approvals",
      "Assembles audit-ready documentation",
    ],
    reportsTo: "head-accounting",
    handoffs: [
      { to: "head-accounting", label: "Close package" },
      { to: "fpa", label: "Final actuals" },
    ],
    activity: [
      { time: "07:45", text: "Close checklist: 18 of 22 tasks done" },
      { time: "07:52", text: "Booked 9 accrual entries for review" },
      { time: "07:58", text: "Balance sheet recs prepared" },
    ],
  },
  {
    id: "head-accounting",
    index: "06",
    name: "AI Head of Accounting",
    short: "Head of Accounting",
    role: "Accounting operations",
    description: "Oversees the whole accounting function so nothing slips through.",
    accent: "#FF6BC1",
    icon: Scale,
    tasks: [
      "Oversees day-to-day accounting operations",
      "Reviews journal entries and reconciliations",
      "Keeps policies aligned with US GAAP",
      "Manages revenue recognition schedules",
      "Coordinates with your CPA and auditors",
    ],
    reportsTo: "cfo",
    handoffs: [{ to: "cfo", label: "GAAP financials" }],
    activity: [
      { time: "12:20", text: "Reviewed 9 accrual entries — approved 8" },
      { time: "12:24", text: "Returned 1 entry with a question" },
      { time: "12:30", text: "Financials marked ready for CFO review" },
    ],
  },
  {
    id: "head-finance",
    index: "07",
    name: "AI Head of Finance",
    short: "Head of Finance",
    role: "Cash & performance",
    description: "Keeps cash, KPIs and the numbers behind every decision in one clear view.",
    accent: "#FF8A5B",
    icon: Landmark,
    tasks: [
      "Manages cash position and 13-week cash flow",
      "Maintains live KPI dashboards",
      "Supports pricing, hiring and spend decisions",
      "Coordinates budget and forecast cycles",
      "Prepares leadership finance updates",
    ],
    reportsTo: "cfo",
    handoffs: [{ to: "cfo", label: "KPIs & cash outlook" }],
    activity: [
      { time: "13:05", text: "Refreshed 13-week cash forecast" },
      { time: "13:07", text: "KPI dashboard updated" },
      { time: "13:10", text: "Weekly finance update posted to Slack" },
    ],
  },
  {
    id: "cfo",
    index: "08",
    name: "AI Fractional CFO",
    short: "Fractional CFO",
    role: "Strategy & board reporting",
    description: "Board-ready insight on demand: runway, scenarios and the story behind the numbers.",
    accent: "#9D6BFF",
    accentTo: "#1FE0B5",
    icon: Crown,
    tasks: [
      "Prepares board-ready insights and decks",
      "Tracks cash runway and burn",
      "Models pricing and growth scenarios",
      "Prepares investor reporting and updates",
      "Highlights risks and opportunities each month",
    ],
    reportsTo: null,
    handoffs: [],
    activity: [
      { time: "15:00", text: "Board pack draft assembled" },
      { time: "15:04", text: "Runway scenarios updated" },
      { time: "15:06", text: "Investor update ready for your review" },
    ],
  },
];

export const agentsById = Object.fromEntries(agents.map((a) => [a.id, a])) as Record<
  AgentId,
  Agent
>;

/** CSS background for an agent accent (solid or gradient). */
export function agentAccentBg(agent: Agent) {
  return agent.accentTo
    ? `linear-gradient(135deg, ${agent.accent}, ${agent.accentTo})`
    : agent.accent;
}

/** Section copy for "Meet your AI finance team". */
export const agentsSection = {
  eyebrow: "Your AI finance team",
  index: "02",
  title: "Meet the team that never misses a close.",
  lead: "Eight specialized AI agents, each trained for a real finance role. Deploy one or the whole department — they work together, hand off work and escalate to your people when judgment is needed.",
  viewLabels: { team: "Team", org: "Org chart" },
};
