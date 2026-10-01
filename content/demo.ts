import { ArrowDownUp, Scale, TrendingUp, type LucideIcon } from "lucide-react";
import type { AgentId } from "@/content/agents";
import type {
  BalanceSheet,
  BalanceSheetTotals,
  CashFlowStatement,
  IncomeStatement,
  ModelAssumptions,
  MonthDrivers,
} from "@/lib/three-statement";

/**
 * "Live demo: automated 3-statement model" — section copy, the fictional
 * company, its opening balance sheet, monthly drivers and the sample bank
 * feed. Every statement figure is computed by `lib/three-statement.ts`;
 * nothing below is a typed-in result. All data is fictional sample data.
 */

export const demoSection = {
  id: "demo",
  eyebrow: "Live demo · 3-statement model",
  index: "03",
  title: { lead: "Watch your financials", highlight: "build themselves." },
  lead: "Raw bank and card transactions stream in. Your AI team categorizes every one, then builds a linked income statement, balance sheet and cash flow — tied out to the dollar.",
  company: {
    name: "Harbor & Pine Co.",
    monogram: "H&P",
    descriptor: "DTC home goods · USD",
    sampleLabel: "Fictional company · sample data",
  },
  controls: {
    monthGroupLabel: "Choose a month to build",
    replay: "Replay",
    replayAria: "Replay the demo",
  },
  status: {
    idle: "Ready to build",
    feed: "AI Bookkeeper is categorizing transactions…",
    statements: "AI Controller is building the statements…",
    done: "Built in 2.4s by AI Bookkeeper + AI Controller",
    illustrative: "Illustrative",
    agents: ["bookkeeper", "controller"] satisfies AgentId[],
  },
  feed: {
    title: "Bank & card feed",
    accounts: "Bank ••4821 · Card ••0937",
    live: "Live",
    pending: "Categorizing…",
    /** Follows the "+1,184" sample count in the summary row. */
    more: "more transactions categorized",
    reconciled: "Bank reconciled",
    agentCaption: "Categorizes every transaction to the right statement line",
  },
  tabsLabel: "Financial statements",
  columnHeader: "Line item",
  links: { to: "Links to", from: "From" },
  tieOut: {
    title: "Tie-out checks",
    balanced: "Balanced",
    balancedDetail: "Assets = Liabilities + Equity",
    cash: "Cash ties",
    cashTerms: ["CFS ending cash", "BS cash"],
    earnings: "Earnings roll forward",
    earningsTerms: ["Δ Retained earnings", "Net income"],
    noteTitle: "Controller note",
    note: (p: { netIncome: string; cashChange: string; fell: boolean; driver: string }) =>
      `Net income of ${p.netIncome}, while cash ${p.fell ? "fell" : "rose"} ${p.cashChange}. ${p.driver} was the largest use of cash this month.`,
    agentCaption: "reviews every tie-out",
    pending: "Running tie-out checks…",
  },
  announce: (p: { period: string; assets: string; cash: string }) =>
    `${p.period} statements built. Balanced: total assets of ${p.assets} equal total liabilities plus equity. Cash flow ending cash matches balance sheet cash of ${p.cash}.`,
};

/* -------------------------------------------------------------------------- */
/* Model inputs                                                               */
/* -------------------------------------------------------------------------- */

/** Balance sheet at Jun 30, 2026 (fictional). */
export const openingBalanceSheet: BalanceSheet = {
  cash: 286_500,
  accountsReceivable: 48_900,
  inventory: 171_800,
  prepaidExpenses: 13_600,
  ppeNet: 118_400,
  accountsPayable: 79_300,
  accruedLiabilities: 16_900,
  termLoan: 225_000,
  paidInCapital: 240_000,
  retainedEarnings: 78_000,
};

export const modelAssumptions: ModelAssumptions = {
  interestRate: 0.09,
  taxRate: 0.25,
  ppeLifeMonths: 60,
};

export type CategoryId =
  | "revenue"
  | "receivables"
  | "inventory"
  | "cogs"
  | "payroll"
  | "marketing"
  | "software"
  | "rent"
  | "prepaid"
  | "capex"
  | "loan";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  account: string;
  /** Signed: deposits positive, payments negative. */
  amount: number;
  category: CategoryId;
};

export type DemoMonth = MonthDrivers & {
  label: string;
  period: string;
  monthEnd: string;
  /** Sample count shown in the feed summary row. */
  moreTransactions: number;
  transactions: Transaction[];
};

const OPERATING = "Bank ••4821";
const CARD = "Card ••0937";

export const demoMonths: DemoMonth[] = [
  {
    id: "jul",
    label: "Jul",
    period: "July 2026",
    monthEnd: "Jul 31, 2026",
    days: 31,
    revenue: 186_400,
    cogsPct: 0.42,
    payroll: 43_800,
    marketing: 32_600,
    software: 5_900,
    rent: 8_400,
    dsoDays: 8,
    dioDays: 70,
    dpoDays: 32,
    prepaidChange: -1_100,
    accruedPayrollPct: 0.3,
    capex: 4_860,
    loanRepayment: 5_000,
    moreTransactions: 1_184,
    transactions: [
      { id: "jul-1", date: "Jul 31", description: "Storefront payout #0731", account: OPERATING, amount: 6_482.19, category: "revenue" },
      { id: "jul-2", date: "Jul 31", description: "Wholesale remit · INV-2207", account: OPERATING, amount: 12_400, category: "receivables" },
      { id: "jul-3", date: "Jul 30", description: "Linen mill · PO 1182", account: OPERATING, amount: -18_920, category: "inventory" },
      { id: "jul-4", date: "Jul 30", description: "Payroll · Jul 16–31", account: OPERATING, amount: -21_480.55, category: "payroll" },
      { id: "jul-5", date: "Jul 29", description: "Paid social ads", account: CARD, amount: -1_286.4, category: "marketing" },
      { id: "jul-6", date: "Jul 29", description: "3PL fulfillment · Jul", account: OPERATING, amount: -7_215.8, category: "cogs" },
      { id: "jul-7", date: "Jul 28", description: "Analytics software", account: CARD, amount: -412, category: "software" },
      { id: "jul-8", date: "Jul 28", description: "Warehouse lease · Jul", account: OPERATING, amount: -8_400, category: "rent" },
      { id: "jul-9", date: "Jul 27", description: "Pallet racking install", account: OPERATING, amount: -4_860, category: "capex" },
      { id: "jul-10", date: "Jul 27", description: "Term loan · principal", account: OPERATING, amount: -5_000, category: "loan" },
      { id: "jul-11", date: "Jul 26", description: "Customer refund #10482", account: CARD, amount: -86.5, category: "revenue" },
      { id: "jul-12", date: "Jul 26", description: "Warehouse utilities", account: OPERATING, amount: -1_240.36, category: "rent" },
    ],
  },
  {
    id: "aug",
    label: "Aug",
    period: "August 2026",
    monthEnd: "Aug 31, 2026",
    days: 31,
    revenue: 207_900,
    cogsPct: 0.415,
    payroll: 44_600,
    marketing: 36_200,
    software: 6_100,
    rent: 8_400,
    dsoDays: 8,
    dioDays: 72,
    dpoDays: 33,
    prepaidChange: 6_400,
    accruedPayrollPct: 0.3,
    capex: 2_200,
    loanRepayment: 5_000,
    moreTransactions: 1_262,
    transactions: [
      { id: "aug-1", date: "Aug 31", description: "Storefront payout #0831", account: OPERATING, amount: 7_918.42, category: "revenue" },
      { id: "aug-2", date: "Aug 31", description: "Wholesale remit · INV-2251", account: OPERATING, amount: 9_860, category: "receivables" },
      { id: "aug-3", date: "Aug 28", description: "Ceramics studio · PO 1207", account: OPERATING, amount: -24_310, category: "inventory" },
      { id: "aug-4", date: "Aug 28", description: "Payroll · Aug 16–31", account: OPERATING, amount: -22_036.1, category: "payroll" },
      { id: "aug-5", date: "Aug 27", description: "Annual insurance premium", account: OPERATING, amount: -7_650, category: "prepaid" },
      { id: "aug-6", date: "Aug 27", description: "Paid social ads", account: CARD, amount: -1_942.75, category: "marketing" },
      { id: "aug-7", date: "Aug 26", description: "3PL fulfillment · Aug", account: OPERATING, amount: -8_064.3, category: "cogs" },
      { id: "aug-8", date: "Aug 26", description: "Analytics software", account: CARD, amount: -436, category: "software" },
      { id: "aug-9", date: "Aug 25", description: "Warehouse lease · Aug", account: OPERATING, amount: -8_400, category: "rent" },
      { id: "aug-10", date: "Aug 25", description: "Term loan · principal", account: OPERATING, amount: -5_000, category: "loan" },
      { id: "aug-11", date: "Aug 24", description: "Customer refund #11307", account: CARD, amount: -129, category: "revenue" },
      { id: "aug-12", date: "Aug 24", description: "Packaging supplies", account: CARD, amount: -2_318.9, category: "cogs" },
    ],
  },
  {
    id: "sep",
    label: "Sep",
    period: "September 2026",
    monthEnd: "Sep 30, 2026",
    days: 30,
    revenue: 233_700,
    cogsPct: 0.41,
    payroll: 47_900,
    marketing: 41_500,
    software: 6_300,
    rent: 8_400,
    dsoDays: 9,
    dioDays: 82,
    dpoDays: 34,
    prepaidChange: -1_500,
    accruedPayrollPct: 0.3,
    capex: 12_800,
    loanRepayment: 5_000,
    moreTransactions: 1_347,
    transactions: [
      { id: "sep-1", date: "Sep 30", description: "Storefront payout #0930", account: OPERATING, amount: 9_204.66, category: "revenue" },
      { id: "sep-2", date: "Sep 30", description: "Wholesale remit · INV-2318", account: OPERATING, amount: 15_720, category: "receivables" },
      { id: "sep-3", date: "Sep 29", description: "Linen mill · PO 1244", account: OPERATING, amount: -31_480, category: "inventory" },
      { id: "sep-4", date: "Sep 29", description: "Packing line · deposit", account: OPERATING, amount: -12_800, category: "capex" },
      { id: "sep-5", date: "Sep 29", description: "Payroll · Sep 16–30", account: OPERATING, amount: -23_950.4, category: "payroll" },
      { id: "sep-6", date: "Sep 28", description: "Paid social ads", account: CARD, amount: -2_318.2, category: "marketing" },
      { id: "sep-7", date: "Sep 28", description: "3PL fulfillment · Sep", account: OPERATING, amount: -9_122.65, category: "cogs" },
      { id: "sep-8", date: "Sep 27", description: "Analytics software", account: CARD, amount: -436, category: "software" },
      { id: "sep-9", date: "Sep 26", description: "Warehouse lease · Sep", account: OPERATING, amount: -8_400, category: "rent" },
      { id: "sep-10", date: "Sep 25", description: "Term loan · principal", account: OPERATING, amount: -5_000, category: "loan" },
      { id: "sep-11", date: "Sep 24", description: "Customer refund #12115", account: CARD, amount: -64, category: "revenue" },
      { id: "sep-12", date: "Sep 24", description: "Influencer campaign", account: CARD, amount: -3_500, category: "marketing" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Statement layouts                                                          */
/* -------------------------------------------------------------------------- */

export type StatementId = "is" | "bs" | "cfs";
/** "is.netIncome", "bs.cash", … — identifies one statement line. */
export type RowRef = `${StatementId}.${string}`;
export type RowKind = "line" | "subtotal" | "total";

export type StatementRow<K extends string> = {
  key: K;
  label: string;
  kind?: RowKind;
  indent?: boolean;
  /** Display as a negative (expenses on the income statement). */
  negate?: boolean;
  /** Show the gross-margin chip next to the label. */
  margin?: boolean;
};

export type StatementGroup<K extends string> = {
  heading?: string;
  rows: StatementRow<K>[];
};

export type StatementLayout<K extends string> = {
  id: StatementId;
  title: string;
  short: string;
  /** Compact label for the mobile tab. */
  tabLabel: string;
  accent: string;
  icon: LucideIcon;
  /** "For the month ended" / "As of" — prefixed to the month-end date. */
  periodPrefix: string;
  method?: string;
  groups: StatementGroup<K>[];
};

export type BalanceSheetKey = keyof (BalanceSheet & BalanceSheetTotals);

const incomeStatement: StatementLayout<keyof IncomeStatement> = {
  id: "is",
  title: "Income statement",
  short: "IS",
  tabLabel: "Income",
  accent: "#4C7DFF",
  icon: TrendingUp,
  periodPrefix: "Month ended",
  groups: [
    {
      rows: [
        { key: "revenue", label: "Revenue" },
        { key: "cogs", label: "Cost of goods sold", negate: true },
        { key: "grossProfit", label: "Gross profit", kind: "subtotal", margin: true },
      ],
    },
    {
      heading: "Operating expenses",
      rows: [
        { key: "payroll", label: "Payroll", indent: true, negate: true },
        { key: "marketing", label: "Marketing", indent: true, negate: true },
        { key: "software", label: "Software & tools", indent: true, negate: true },
        { key: "rent", label: "Rent & facilities", indent: true, negate: true },
        { key: "totalOpex", label: "Total operating expenses", kind: "subtotal", negate: true },
      ],
    },
    {
      rows: [
        { key: "ebitda", label: "EBITDA", kind: "subtotal" },
        { key: "depreciation", label: "Depreciation", negate: true },
        { key: "interest", label: "Interest", negate: true },
        { key: "incomeTax", label: "Income tax", negate: true },
        { key: "netIncome", label: "Net income", kind: "total" },
      ],
    },
  ],
};

const balanceSheet: StatementLayout<BalanceSheetKey> = {
  id: "bs",
  title: "Balance sheet",
  short: "BS",
  tabLabel: "Balance sheet",
  accent: "#9D6BFF",
  icon: Scale,
  periodPrefix: "As of",
  groups: [
    {
      heading: "Assets",
      rows: [
        { key: "cash", label: "Cash", indent: true },
        { key: "accountsReceivable", label: "Accounts receivable", indent: true },
        { key: "inventory", label: "Inventory", indent: true },
        { key: "prepaidExpenses", label: "Prepaid expenses", indent: true },
        { key: "ppeNet", label: "PP&E, net", indent: true },
        { key: "totalAssets", label: "Total assets", kind: "total" },
      ],
    },
    {
      heading: "Liabilities",
      rows: [
        { key: "accountsPayable", label: "Accounts payable", indent: true },
        { key: "accruedLiabilities", label: "Accrued liabilities", indent: true },
        { key: "termLoan", label: "Term loan", indent: true },
        { key: "totalLiabilities", label: "Total liabilities", kind: "subtotal" },
      ],
    },
    {
      heading: "Equity",
      rows: [
        { key: "paidInCapital", label: "Paid-in capital", indent: true },
        { key: "retainedEarnings", label: "Retained earnings", indent: true },
        { key: "totalEquity", label: "Total equity", kind: "subtotal" },
      ],
    },
    {
      rows: [{ key: "totalLiabilitiesAndEquity", label: "Total liabilities & equity", kind: "total" }],
    },
  ],
};

const cashFlow: StatementLayout<keyof CashFlowStatement> = {
  id: "cfs",
  title: "Cash flow statement",
  short: "CFS",
  tabLabel: "Cash flow",
  accent: "#1FE0B5",
  icon: ArrowDownUp,
  periodPrefix: "Month ended",
  method: "Indirect method",
  groups: [
    {
      heading: "Operating activities · indirect",
      rows: [
        { key: "netIncome", label: "Net income" },
        { key: "depreciation", label: "Depreciation", indent: true },
        { key: "changeReceivables", label: "Δ Accounts receivable", indent: true },
        { key: "changeInventory", label: "Δ Inventory", indent: true },
        { key: "changePrepaids", label: "Δ Prepaid expenses", indent: true },
        { key: "changePayables", label: "Δ Accounts payable", indent: true },
        { key: "changeAccrued", label: "Δ Accrued liabilities", indent: true },
        { key: "operating", label: "Cash from operations", kind: "subtotal" },
      ],
    },
    {
      rows: [
        { key: "capex", label: "Capital expenditures", indent: true },
        { key: "investing", label: "Cash from investing", kind: "subtotal" },
        { key: "loanRepayment", label: "Term loan principal", indent: true },
        { key: "financing", label: "Cash from financing", kind: "subtotal" },
      ],
    },
    {
      rows: [
        { key: "netChange", label: "Net change in cash", kind: "subtotal" },
        { key: "beginningCash", label: "Beginning cash" },
        { key: "endingCash", label: "Ending cash", kind: "total" },
      ],
    },
  ],
};

export const statementLayouts = { is: incomeStatement, bs: balanceSheet, cfs: cashFlow };

/** Tab order on mobile. */
export const statementOrder: StatementId[] = ["is", "bs", "cfs"];

/** The links the demo draws between statements (arrows on desktop, notes on mobile). */
export const statementLinks = [
  { id: "ni-cfs", from: "is.netIncome", to: "cfs.netIncome" },
  { id: "cash-bs", from: "cfs.endingCash", to: "bs.cash" },
  { id: "ni-re", from: "is.netIncome", to: "bs.retainedEarnings" },
] as const satisfies readonly { id: string; from: RowRef; to: RowRef }[];

export type LinkId = (typeof statementLinks)[number]["id"];

/** AI category chips — color, statement tag and the lines each one feeds. */
export const transactionCategories: Record<
  CategoryId,
  { label: string; statement: string; color: string; rows: RowRef[] }
> = {
  revenue: { label: "Revenue", statement: "IS", color: "#1FE0B5", rows: ["is.revenue"] },
  receivables: {
    label: "AR collection",
    statement: "BS",
    color: "#36C5F0",
    rows: ["bs.accountsReceivable", "cfs.changeReceivables"],
  },
  inventory: {
    label: "Inventory",
    statement: "BS",
    color: "#FFC24B",
    rows: ["bs.inventory", "cfs.changeInventory"],
  },
  cogs: { label: "COGS", statement: "IS", color: "#FFA45B", rows: ["is.cogs"] },
  payroll: { label: "Payroll", statement: "IS", color: "#9D6BFF", rows: ["is.payroll"] },
  marketing: { label: "Marketing", statement: "IS", color: "#FF6BC1", rows: ["is.marketing"] },
  software: { label: "Software", statement: "IS", color: "#8FA2FF", rows: ["is.software"] },
  rent: { label: "Rent", statement: "IS", color: "#FF8A5B", rows: ["is.rent"] },
  prepaid: {
    label: "Prepaid",
    statement: "BS",
    color: "#C9A7FF",
    rows: ["bs.prepaidExpenses", "cfs.changePrepaids"],
  },
  capex: {
    label: "PP&E",
    statement: "BS",
    color: "#4C7DFF",
    rows: ["bs.ppeNet", "cfs.capex", "cfs.investing"],
  },
  loan: {
    label: "Term loan",
    statement: "CFS",
    color: "#7FE7FF",
    rows: ["bs.termLoan", "cfs.loanRepayment", "cfs.financing"],
  },
};

/** Cash-flow lines considered for the controller note's "largest use of cash". */
export const cashUseCandidates: { key: keyof CashFlowStatement; label: string }[] = [
  { key: "changeReceivables", label: "Higher accounts receivable" },
  { key: "changeInventory", label: "Inventory build" },
  { key: "changePrepaids", label: "Prepaid expenses" },
  { key: "changePayables", label: "Paying down payables" },
  { key: "changeAccrued", label: "Settling accrued liabilities" },
  { key: "capex", label: "Capital expenditure" },
  { key: "loanRepayment", label: "Term loan principal" },
];
