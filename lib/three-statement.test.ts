import { describe, expect, it } from "vitest";
import { demoMonths, modelAssumptions, openingBalanceSheet } from "@/content/demo";
import { balanceSheetTotals, buildThreeStatementModel } from "@/lib/three-statement";

const model = buildThreeStatementModel(openingBalanceSheet, demoMonths, modelAssumptions);

/** Compare money to the cent. */
const cents = (value: number) => Math.round(value * 100);

describe("three-statement engine", () => {
  it("starts from a balanced opening balance sheet", () => {
    const t = balanceSheetTotals(openingBalanceSheet);
    expect(cents(t.totalAssets)).toBe(cents(t.totalLiabilitiesAndEquity));
  });

  it("builds one set of statements per month", () => {
    expect(model.map((m) => m.id)).toEqual(demoMonths.map((m) => m.id));
  });

  describe.each(model.map((month, index) => ({ month, index })))(
    "$month.id",
    ({ month, index }) => {
      const { incomeStatement: is, balanceSheet: bs, cashFlow: cfs, opening } = month;
      const prior = index === 0 ? openingBalanceSheet : model[index - 1].balanceSheet;

      it("balances: assets = liabilities + equity", () => {
        expect(cents(bs.totalAssets)).toBe(cents(bs.totalLiabilities + bs.totalEquity));
        expect(cents(bs.totalAssets)).toBe(cents(bs.totalLiabilitiesAndEquity));
      });

      it("ties CFS ending cash to balance sheet cash", () => {
        expect(cents(cfs.endingCash)).toBe(cents(bs.cash));
      });

      it("starts the CFS from the prior balance sheet cash", () => {
        expect(cents(cfs.beginningCash)).toBe(cents(prior.cash));
        expect(cents(cfs.beginningCash + cfs.netChange)).toBe(cents(cfs.endingCash));
      });

      it("rolls retained earnings forward by net income (no dividends)", () => {
        expect(cents(bs.retainedEarnings - prior.retainedEarnings)).toBe(cents(is.netIncome));
        expect(cents(cfs.netIncome)).toBe(cents(is.netIncome));
      });

      it("opens on the prior month's closing balance sheet", () => {
        expect(opening.cash).toBe(prior.cash);
        expect(opening.retainedEarnings).toBe(prior.retainedEarnings);
        expect(opening.termLoan).toBe(prior.termLoan);
      });

      it("foots every subtotal", () => {
        expect(is.grossProfit).toBe(is.revenue - is.cogs);
        expect(is.ebitda).toBe(is.grossProfit - is.totalOpex);
        expect(is.netIncome).toBe(is.ebitda - is.depreciation - is.interest - is.incomeTax);
        expect(cfs.netChange).toBe(cfs.operating + cfs.investing + cfs.financing);
      });

      it("produces non-trivial statements", () => {
        expect(is.revenue).toBeGreaterThan(150_000);
        expect(is.netIncome).toBeGreaterThan(0);
        expect(is.netIncome).toBeLessThan(is.revenue);
        expect(is.depreciation).toBeGreaterThan(0);
        expect(is.interest).toBeGreaterThan(0);
        expect(is.incomeTax).toBeGreaterThan(0);
        expect(bs.cash).toBeGreaterThan(0);
        expect(cfs.capex).toBeLessThan(0);
        expect(cfs.financing).toBeLessThan(0);
        const workingCapital = [
          cfs.changeReceivables,
          cfs.changeInventory,
          cfs.changePayables,
          cfs.changeAccrued,
        ];
        expect(workingCapital.some((v) => v !== 0)).toBe(true);
        expect(cents(cfs.operating)).not.toBe(cents(is.netIncome));
      });
    },
  );

  it("grows revenue month over month", () => {
    const revenue = model.map((m) => m.incomeStatement.revenue);
    revenue.slice(1).forEach((value, i) => expect(value).toBeGreaterThan(revenue[i]));
  });
});
