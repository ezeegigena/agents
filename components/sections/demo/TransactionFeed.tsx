import { Check } from "lucide-react";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { agentsById } from "@/content/agents";
import {
  demoSection,
  transactionCategories,
  type CategoryId,
  type DemoMonth,
  type Transaction,
} from "@/content/demo";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { CategoryChip, Spark } from "./CategoryChip";
import { formatCents } from "./model";

const copy = demoSection.feed;

/** Desktop bank/card feed: raw transactions that get AI category chips. */
export function TransactionFeed({
  month,
  onHover,
  className,
}: {
  month: DemoMonth;
  /** Hovering a transaction highlights the statement lines it feeds. */
  onHover: (category: CategoryId | null) => void;
  className?: string;
}) {
  const bookkeeper = agentsById.bookkeeper;

  return (
    <div
      data-demo-feed
      className={cn("glass-strong flex-col overflow-hidden rounded-3xl", className)}
    >
      <header className="flex items-center gap-3 border-b border-line px-4 py-3.5 xl:px-5">
        <div className="min-w-0">
          <h3
            className="text-[0.95rem] leading-tight font-semibold tracking-[-0.02em] text-fg"
          >
            {copy.title}
          </h3>
          <p className="truncate font-mono text-[0.6875rem] text-fg-muted">{copy.accounts}</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 font-mono text-[0.625rem] tracking-[0.12em] text-success uppercase">
          <span aria-hidden className="relative flex size-1.5">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success/70" />
            <span className="relative size-full rounded-full bg-success" />
          </span>
          {copy.live}
        </span>
      </header>

      <ul className="flex flex-col px-2 py-1.5 xl:px-3">
        {month.transactions.map((t) => (
          <FeedRow key={t.id} transaction={t} onHover={onHover} />
        ))}
      </ul>

      <div data-feed-summary className="mt-auto border-t border-line px-4 py-3.5 xl:px-5">
        <p className="text-[0.8125rem] text-fg">
          <span className="font-mono tabular">
            +
            <span key={month.id} data-count data-value={month.moreTransactions}>
              {formatNumber(month.moreTransactions)}
            </span>
          </span>{" "}
          <span className="text-fg-muted">{copy.more}</span>
        </p>
        <div className="mt-2.5 flex items-center gap-3">
          <span aria-hidden className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <span data-feed-bar className="block h-full rounded-full bg-brand-gradient" />
          </span>
          <span
            data-feed-ok
            className="inline-flex items-center gap-1 font-mono text-[0.625rem] tracking-[0.08em] text-success uppercase"
          >
            <Check aria-hidden className="size-3" />
            {copy.reconciled}
          </span>
        </div>
      </div>

      <footer className="flex items-center gap-3 border-t border-line px-4 py-3 xl:px-5">
        <AgentAvatar agent={bookkeeper} size="sm" />
        <div className="min-w-0">
          <p className="text-[0.8125rem] font-medium text-fg">{bookkeeper.name}</p>
          <p className="text-[0.6875rem] leading-snug text-fg-muted">{copy.agentCaption}</p>
        </div>
      </footer>
    </div>
  );
}

function FeedRow({
  transaction: t,
  onHover,
}: {
  transaction: Transaction;
  onHover: (category: CategoryId | null) => void;
}) {
  const inflow = t.amount > 0;
  const { color } = transactionCategories[t.category];

  return (
    <li
      data-feed-row
      onMouseEnter={() => onHover(t.category)}
      onMouseLeave={() => onHover(null)}
      className="relative overflow-hidden rounded-xl px-2.5 py-1.5 transition-colors duration-200 hover:bg-white/[0.035] xl:py-[0.5625rem]"
    >
      <span
        data-feed-scan
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-0"
        style={{ background: `linear-gradient(90deg, transparent, ${color}2e, transparent)` }}
      />
      <div className="relative flex items-baseline justify-between gap-3">
        <p className="truncate text-[0.8125rem] text-fg">{t.description}</p>
        <p
          className={cn(
            "shrink-0 font-mono text-[0.75rem] tabular",
            inflow ? "text-success" : "text-fg",
          )}
        >
          <span className="sr-only">{inflow ? "Deposit" : "Payment"} </span>
          <span aria-hidden>{inflow ? "+" : "−"}</span>
          {formatCents(t.amount)}
        </p>
      </div>
      <div className="relative mt-1 flex items-center justify-between gap-2">
        <p className="truncate font-mono text-[0.625rem] text-fg-muted">
          {t.date}
          <span className="max-xl:hidden"> · {t.account}</span>
        </p>
        <span className="relative inline-flex shrink-0">
          <span
            data-feed-pending
            aria-hidden
            className="absolute inset-y-0 right-0 flex items-center font-mono text-[0.625rem] whitespace-nowrap text-fg-muted opacity-0"
          >
            <span className="animate-pulse">{demoSection.feed.pending}</span>
          </span>
          <CategoryChip category={t.category} />
          <Spark color={color} className="-top-1.5 -left-1.5" />
        </span>
      </div>
    </li>
  );
}
