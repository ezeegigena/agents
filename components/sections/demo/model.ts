import {
  cashUseCandidates,
  demoMonths,
  demoSection,
  modelAssumptions,
  openingBalanceSheet,
  statementLayouts,
  statementLinks,
  type RowRef,
  type StatementId,
  type StatementLayout,
} from "@/content/demo";
import { formatUsd } from "@/lib/format";
import { buildThreeStatementModel, type MonthStatements } from "@/lib/three-statement";

/** All three months, computed once from the opening balance sheet + drivers. */
export const demoModel = buildThreeStatementModel(
  openingBalanceSheet,
  demoMonths,
  modelAssumptions,
);

export function statementValues(month: MonthStatements, id: StatementId): Record<string, number> {
  if (id === "is") return month.incomeStatement;
  if (id === "bs") return month.balanceSheet;
  return month.cashFlow;
}

/** "$12,345.67" for raw bank transactions (statements use whole dollars). */
export const formatCents = (value: number) =>
  Math.abs(value).toLocaleString("en-US", { style: "currency", currency: "USD" });

function rowInfo(ref: RowRef) {
  const [statementId, key] = ref.split(".") as [StatementId, string];
  const layout: StatementLayout<string> = statementLayouts[statementId];
  const row = layout.groups.flatMap((g) => g.rows).find((r) => r.key === key);
  return { label: row?.label ?? key, short: layout.short };
}

/** Rows that start or end a link, for the link icon and the mobile notes. */
export const anchorRows = new Set<RowRef>(statementLinks.flatMap((l) => [l.from, l.to]));

/** "→ Links to Retained earnings (BS)" / "← From Net income (IS)". */
export function linkNotes(ref: RowRef) {
  const { to, from } = demoSection.links;
  return statementLinks.flatMap((link) => {
    if (link.from === ref) {
      const target = rowInfo(link.to);
      return [{ id: link.id, arrow: "→", text: `${to} ${target.label} (${target.short})` }];
    }
    if (link.to === ref) {
      const source = rowInfo(link.from);
      return [{ id: link.id, arrow: "←", text: `${from} ${source.label} (${source.short})` }];
    }
    return [];
  });
}

/** Plain-language controller note derived from the month's cash flow. */
export function controllerNote(month: MonthStatements) {
  const { cashFlow } = month;
  const largest = cashUseCandidates.reduce((min, c) =>
    cashFlow[c.key] < cashFlow[min.key] ? c : min,
  );
  return demoSection.tieOut.note({
    netIncome: formatUsd(cashFlow.netIncome),
    cashChange: formatUsd(Math.abs(cashFlow.netChange)),
    fell: cashFlow.netChange < 0,
    driver: largest.label,
  });
}
