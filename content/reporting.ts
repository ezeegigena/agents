import {
  BookOpen,
  LayoutDashboard,
  LineChart,
  Scale,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/**
 * "Automated reporting" section. Copy, report list and all sample data.
 * The company and every figure are fictional — keep the sample-data label.
 *
 * The numbers are internally consistent: September revenue − expenses = net
 * income; opex by department sums to expenses − COGS; the Q3 cash waterfall
 * ends at the September cash balance.
 */

export type ReportId = "pnl" | "cash" | "budget" | "kpi" | "board";

export type Report = {
  id: ReportId;
  name: string;
  icon: LucideIcon;
  cadence: string;
  /** Short schedule shown in the sidebar ("Mon 8:00 AM"). */
  schedule: string;
  period: string;
  /** Where it gets delivered. */
  destination: string;
};

export type Kpi = {
  label: string;
  value: number;
  format: "usd" | "percent" | "days" | "months";
  /** Signed change vs the comparison period, in the KPI's own unit. */
  delta: number;
  deltaFormat: "percent" | "points" | "usd" | "days" | "months";
  /** Whether an increase is good news (DSO: lower is better). */
  upIsGood: boolean;
  trend: number[];
};

export type CashStep = {
  label: string;
  sub: string;
  value: number;
  /** Totals are levels (opening/ending); changes float from the running level. */
  kind: "total" | "change";
};

export type CashStat = { label: string; value: number; signed?: boolean; unit?: string };

export type BudgetLine = { name: string; budget: number; actual: number };

const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const monthsLong = [
  "October 2025",
  "November 2025",
  "December 2025",
  "January 2026",
  "February 2026",
  "March 2026",
  "April 2026",
  "May 2026",
  "June 2026",
  "July 2026",
  "August 2026",
  "September 2026",
];

const k = (values: number[]) => values.map((v) => v * 1000);

const revenue = k([382, 395, 441, 368, 377, 404, 418, 431, 446, 452, 471, 486]);
const expenses = k([351, 358, 389, 352, 349, 362, 371, 378, 384, 389, 398, 404]);
const netIncome = revenue.map((r, i) => r - expenses[i]);
const grossMargin = [40.8, 41.0, 41.9, 40.2, 40.6, 41.1, 41.4, 41.6, 41.9, 41.5, 41.8, 42.6];
const netMargin = netIncome.map((n, i) => Math.round((n / revenue[i]) * 1000) / 10);
const cashBalance = k([1012, 1034, 1071, 1058, 1069, 1092, 1118, 1146, 1180, 1214, 1251, 1289]);
const operatingCash = k([41, 47, 63, 22, 35, 51, 56, 62, 71, 74, 80, 92]);
const cashCoverage = cashBalance.map((c, i) => Math.round((c / expenses[i]) * 10) / 10);
const dso = [46, 45, 47, 44, 44, 43, 43, 42, 42, 41, 42, 38];

const last = <T,>(values: T[]) => values[values.length - 1];
const prev = <T,>(values: T[]) => values[values.length - 2];

export const reportingContent = {
  index: "05",
  eyebrow: "Automated reporting",
  title: { before: "Reports that ", highlight: "write themselves", after: " — and show up on time." },
  lead: "Your AI analysts build the P&L, cash flow, budget vs actual and board pack straight from your closed books — then deliver them to email or Slack, daily, weekly or monthly. No chasing, no copy-paste.",

  window: {
    title: "Reports · Harbor & Pine Co.",
    sampleLabel: "Fictional company · sample data",
    sidebarLabel: "Reports",
    generatedLabel: "Auto-generated",
    generatedAt: "Oct 3 · 6:02 AM",
    tablistLabel: "Sample reports",
  },

  reports: [
    {
      id: "pnl",
      name: "P&L summary",
      icon: LineChart,
      cadence: "Weekly",
      schedule: "Mon 8:00 AM",
      period: "September 2026",
      destination: "Slack #finance",
    },
    {
      id: "cash",
      name: "Cash flow",
      icon: Wallet,
      cadence: "Monthly",
      schedule: "After close",
      period: "Q3 2026 · Jul–Sep",
      destination: "Email · CEO, CFO",
    },
    {
      id: "budget",
      name: "Budget vs actual",
      icon: Scale,
      cadence: "Monthly",
      schedule: "After close",
      period: "September 2026 · Opex",
      destination: "Email · budget owners",
    },
    {
      id: "kpi",
      name: "KPI dashboard",
      icon: LayoutDashboard,
      cadence: "Daily",
      schedule: "7:00 AM",
      period: "As of Sep 30, 2026",
      destination: "Slack #leadership",
    },
    {
      id: "board",
      name: "Board pack",
      icon: BookOpen,
      cadence: "Quarterly",
      schedule: "After close",
      period: "Q3 2026",
      destination: "Email · board",
    },
  ] satisfies Report[],

  pnl: {
    months,
    monthsLong,
    revenue,
    expenses,
    netIncome,
    series: { revenue: "Revenue", expenses: "Expenses", net: "Net income" },
    chartLabel: "Revenue and expenses, October 2025 to September 2026",
    keyboardHint: "Use the left and right arrow keys to inspect each month.",
    tiles: [
      {
        label: "Revenue",
        value: last(revenue),
        format: "usd",
        delta: Math.round((last(revenue) / prev(revenue) - 1) * 1000) / 10,
        deltaFormat: "percent",
        upIsGood: true,
        trend: revenue,
      },
      {
        label: "Gross margin",
        value: last(grossMargin),
        format: "percent",
        delta: Math.round((last(grossMargin) - prev(grossMargin)) * 10) / 10,
        deltaFormat: "points",
        upIsGood: true,
        trend: grossMargin,
      },
      {
        label: "Net income",
        value: last(netIncome),
        format: "usd",
        delta: Math.round((last(netIncome) / prev(netIncome) - 1) * 1000) / 10,
        deltaFormat: "percent",
        upIsGood: true,
        trend: netIncome,
      },
    ] satisfies Kpi[],
    comparison: "vs Aug",
  },

  cash: {
    caption: "Cash bridge, Q3 2026",
    axisNote: "Axis starts at $1.0M",
    steps: [
      { label: "Opening", sub: "Jul 1", value: 1_180_000, kind: "total" },
      { label: "Operating", sub: "activities", value: 246_000, kind: "change" },
      { label: "Investing", sub: "activities", value: -92_000, kind: "change" },
      { label: "Financing", sub: "activities", value: -45_000, kind: "change" },
      { label: "Ending", sub: "Sep 30", value: 1_289_000, kind: "total" },
    ] satisfies CashStep[],
    stats: [
      { label: "Net change", value: 109_000, signed: true },
      { label: "Free cash flow", value: 154_000, signed: false },
      { label: "Cash coverage", value: last(cashCoverage), unit: "months" },
    ] satisfies CashStat[],
  },

  budget: {
    caption: "Operating expenses by department, September 2026",
    departments: [
      { name: "Sales & marketing", budget: 42_000, actual: 45_200 },
      { name: "Product & engineering", budget: 34_000, actual: 32_100 },
      { name: "Operations", budget: 22_000, actual: 21_400 },
      { name: "General & admin", budget: 18_000, actual: 18_900 },
      { name: "Customer success", budget: 8_000, actual: 7_400 },
    ] satisfies BudgetLine[],
    legend: { actual: "Actual", budget: "Budget" },
    over: "over",
    under: "under",
    totalLabel: "Total opex",
    ofBudget: "budget",
  },

  kpi: {
    caption: "Key metrics, September 2026",
    comparison: "vs Aug",
    tiles: [
      {
        label: "Gross margin",
        value: last(grossMargin),
        format: "percent",
        delta: Math.round((last(grossMargin) - prev(grossMargin)) * 10) / 10,
        deltaFormat: "points",
        upIsGood: true,
        trend: grossMargin,
      },
      {
        label: "Net margin",
        value: last(netMargin),
        format: "percent",
        delta: Math.round((last(netMargin) - prev(netMargin)) * 10) / 10,
        deltaFormat: "points",
        upIsGood: true,
        trend: netMargin,
      },
      {
        label: "Operating cash flow",
        value: last(operatingCash),
        format: "usd",
        delta: last(operatingCash) - prev(operatingCash),
        deltaFormat: "usd",
        upIsGood: true,
        trend: operatingCash,
      },
      {
        label: "Cash on hand",
        value: last(cashBalance),
        format: "usd",
        delta: last(cashBalance) - prev(cashBalance),
        deltaFormat: "usd",
        upIsGood: true,
        trend: cashBalance,
      },
      {
        label: "Cash coverage",
        value: last(cashCoverage),
        format: "months",
        delta: Math.round((last(cashCoverage) - prev(cashCoverage)) * 10) / 10,
        deltaFormat: "months",
        upIsGood: true,
        trend: cashCoverage,
      },
      {
        label: "DSO",
        value: last(dso),
        format: "days",
        delta: last(dso) - prev(dso),
        deltaFormat: "days",
        upIsGood: false,
        trend: dso,
      },
    ] satisfies Kpi[],
  },

  board: {
    cover: { kicker: "Harbor & Pine Co.", title: "Q3 2026 Board Pack", footer: "Prepared by yourfinancedone" },
    pages: ["Cover", "P&L & margins", "Cash flow", "KPI dashboard"],
    contentsLabel: "Contents",
    contents: [
      { title: "Executive summary", page: 2 },
      { title: "P&L & margins", page: 3 },
      { title: "Cash flow & liquidity", page: 6 },
      { title: "Budget vs actual", page: 8 },
      { title: "KPI dashboard", page: 10 },
      { title: "Outlook & decisions", page: 12 },
    ],
    status: "Compiled from closed books · 14 pages · PDF",
    ready: "Ready to send",
  },

  delivery: {
    title: "Scheduled delivery",
    body: "Set the cadence and channel once. Reports arrive on schedule, tied out to your books.",
    frequencies: [
      { label: "Daily", detail: "KPI dashboard · weekdays at 7:00 AM" },
      { label: "Weekly", detail: "P&L summary · Mondays at 8:00 AM" },
      { label: "Monthly", detail: "Cash flow, budget vs actual & board pack · after close" },
    ],
    slack: {
      channel: "finance",
      app: "yourfinancedone",
      appTag: "App",
      time: "8:00 AM",
      message: "Weekly P&L summary is ready — week 39 (Sep 22–28).",
      card: {
        title: "P&L summary · Week 39",
        metrics: [
          { label: "Revenue", value: "$112K" },
          { label: "Gross margin", value: "42.4%" },
          { label: "Net income", value: "$19K" },
        ],
        trend: [24, 26, 25, 27, 26, 28, 27, 29, 28, 30, 29, 31],
        link: "Open report",
      },
    },
    email: {
      inbox: "Inbox",
      from: "yourfinancedone Reports",
      time: "Oct 3 · 9:00 AM",
      subject: "Your September board pack is ready",
      preview:
        "Q3 2026 Board Pack — compiled from your closed books. Revenue up 3.2% month over month; opex within 1% of budget.",
      attachment: "Q3-2026-Board-Pack.pdf",
      attachmentMeta: "14 pages",
    },
  },
};
