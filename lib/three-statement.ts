/**
 * Pure three-statement engine.
 *
 * Builds a monthly Income Statement, Balance Sheet and Cash Flow Statement
 * (indirect method) from an opening balance sheet plus monthly drivers.
 * Every computed amount is rounded to whole dollars at the point it is
 * created, so subtotals foot exactly and the statements tie out to the cent.
 * The closing balance sheet of month N is the opening balance sheet of N+1.
 */

export type BalanceSheet = {
  cash: number;
  accountsReceivable: number;
  inventory: number;
  prepaidExpenses: number;
  ppeNet: number;
  accountsPayable: number;
  accruedLiabilities: number;
  termLoan: number;
  paidInCapital: number;
  retainedEarnings: number;
};

export type BalanceSheetTotals = {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalLiabilitiesAndEquity: number;
};

export type MonthDrivers = {
  id: string;
  /** Days in the month — used by the DSO / DIO / DPO working-capital ratios. */
  days: number;
  revenue: number;
  /** Cost of goods sold as a share of revenue (0–1). */
  cogsPct: number;
  payroll: number;
  marketing: number;
  software: number;
  rent: number;
  /** Days sales outstanding: AR = revenue × DSO / days. */
  dsoDays: number;
  /** Days inventory outstanding: inventory = COGS × DIO / days. */
  dioDays: number;
  /** Days payables outstanding: AP = COGS × DPO / days. */
  dpoDays: number;
  /** Net change in prepaid expenses (new prepayments less amortization). */
  prepaidChange: number;
  /** Share of the month's payroll accrued but unpaid at month-end (0–1). */
  accruedPayrollPct: number;
  capex: number;
  loanRepayment: number;
};

export type ModelAssumptions = {
  /** Annual interest rate on the opening term-loan balance. */
  interestRate: number;
  /** Blended income tax rate, accrued monthly and remitted the next month. */
  taxRate: number;
  /** Straight-line depreciation: opening net PP&E ÷ remaining life. */
  ppeLifeMonths: number;
};

export type IncomeStatement = {
  revenue: number;
  cogs: number;
  grossProfit: number;
  /** Gross margin as a ratio (0–1). */
  grossMargin: number;
  payroll: number;
  marketing: number;
  software: number;
  rent: number;
  totalOpex: number;
  ebitda: number;
  depreciation: number;
  interest: number;
  pretaxIncome: number;
  incomeTax: number;
  netIncome: number;
};

/** Signed cash effects: inflows positive, outflows negative. */
export type CashFlowStatement = {
  netIncome: number;
  depreciation: number;
  changeReceivables: number;
  changeInventory: number;
  changePrepaids: number;
  changePayables: number;
  changeAccrued: number;
  operating: number;
  capex: number;
  investing: number;
  loanRepayment: number;
  financing: number;
  netChange: number;
  beginningCash: number;
  endingCash: number;
};

export type MonthStatements = {
  id: string;
  opening: BalanceSheet;
  incomeStatement: IncomeStatement;
  balanceSheet: BalanceSheet & BalanceSheetTotals;
  cashFlow: CashFlowStatement;
};

const round = (value: number) => Math.round(value);

export function balanceSheetTotals(bs: BalanceSheet): BalanceSheetTotals {
  const totalAssets =
    bs.cash + bs.accountsReceivable + bs.inventory + bs.prepaidExpenses + bs.ppeNet;
  const totalLiabilities = bs.accountsPayable + bs.accruedLiabilities + bs.termLoan;
  const totalEquity = bs.paidInCapital + bs.retainedEarnings;
  return {
    totalAssets,
    totalLiabilities,
    totalEquity,
    totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
  };
}

function buildMonth(
  opening: BalanceSheet,
  d: MonthDrivers,
  a: ModelAssumptions,
): MonthStatements {
  // Income statement
  const cogs = round(d.revenue * d.cogsPct);
  const grossProfit = d.revenue - cogs;
  const totalOpex = d.payroll + d.marketing + d.software + d.rent;
  const ebitda = grossProfit - totalOpex;
  const depreciation = round(opening.ppeNet / a.ppeLifeMonths);
  const interest = round((opening.termLoan * a.interestRate) / 12);
  const pretaxIncome = ebitda - depreciation - interest;
  const incomeTax = round(Math.max(0, pretaxIncome) * a.taxRate);
  const netIncome = pretaxIncome - incomeTax;

  // Working capital from drivers
  const accountsReceivable = round((d.revenue * d.dsoDays) / d.days);
  const inventory = round((cogs * d.dioDays) / d.days);
  const accountsPayable = round((cogs * d.dpoDays) / d.days);
  const prepaidExpenses = opening.prepaidExpenses + d.prepaidChange;
  const accruedLiabilities = round(d.payroll * d.accruedPayrollPct) + incomeTax;
  const ppeNet = opening.ppeNet + d.capex - depreciation;
  const termLoan = opening.termLoan - d.loanRepayment;
  const retainedEarnings = opening.retainedEarnings + netIncome;

  // Cash flow statement (indirect method)
  const changeReceivables = opening.accountsReceivable - accountsReceivable;
  const changeInventory = opening.inventory - inventory;
  const changePrepaids = opening.prepaidExpenses - prepaidExpenses;
  const changePayables = accountsPayable - opening.accountsPayable;
  const changeAccrued = accruedLiabilities - opening.accruedLiabilities;
  const operating =
    netIncome +
    depreciation +
    changeReceivables +
    changeInventory +
    changePrepaids +
    changePayables +
    changeAccrued;
  const investing = -d.capex;
  const financing = -d.loanRepayment;
  const netChange = operating + investing + financing;
  const endingCash = opening.cash + netChange;

  const balanceSheet: BalanceSheet = {
    cash: endingCash,
    accountsReceivable,
    inventory,
    prepaidExpenses,
    ppeNet,
    accountsPayable,
    accruedLiabilities,
    termLoan,
    paidInCapital: opening.paidInCapital,
    retainedEarnings,
  };

  return {
    id: d.id,
    opening,
    incomeStatement: {
      revenue: d.revenue,
      cogs,
      grossProfit,
      grossMargin: grossProfit / d.revenue,
      payroll: d.payroll,
      marketing: d.marketing,
      software: d.software,
      rent: d.rent,
      totalOpex,
      ebitda,
      depreciation,
      interest,
      pretaxIncome,
      incomeTax,
      netIncome,
    },
    balanceSheet: { ...balanceSheet, ...balanceSheetTotals(balanceSheet) },
    cashFlow: {
      netIncome,
      depreciation,
      changeReceivables,
      changeInventory,
      changePrepaids,
      changePayables,
      changeAccrued,
      operating,
      capex: -d.capex,
      investing,
      loanRepayment: -d.loanRepayment,
      financing,
      netChange,
      beginningCash: opening.cash,
      endingCash,
    },
  };
}

/** Rolls the model forward month by month. */
export function buildThreeStatementModel(
  opening: BalanceSheet,
  months: readonly MonthDrivers[],
  assumptions: ModelAssumptions,
): MonthStatements[] {
  const result: MonthStatements[] = [];
  let current: BalanceSheet = opening;
  for (const drivers of months) {
    const month = buildMonth(current, drivers, assumptions);
    result.push(month);
    current = month.balanceSheet;
  }
  return result;
}
