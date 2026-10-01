import { Check } from "lucide-react";
import { demoSection, type DemoMonth } from "@/content/demo";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { CategoryChip } from "./CategoryChip";
import { formatCents } from "./model";

const copy = demoSection.feed;

/**
 * Mobile version of the feed: a one-line ticker. Transactions flip through
 * during the build; the final (and reduced-motion) state is the summary.
 */
export function FeedTicker({ month, className }: { month: DemoMonth; className?: string }) {
  return (
    <div data-ticker className={cn("glass-strong overflow-hidden rounded-2xl", className)}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-2">
        <span aria-hidden className="relative flex size-1.5">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success/70" />
          <span className="relative size-full rounded-full bg-success" />
        </span>
        <p className="font-mono text-[0.625rem] tracking-[0.12em] text-fg-muted uppercase">
          {copy.title}
        </p>
        <p className="ml-auto truncate font-mono text-[0.625rem] text-fg-muted">{copy.accounts}</p>
      </div>
      <div className="relative h-14 overflow-hidden">
        {month.transactions.map((t) => (
          <div
            key={t.id}
            data-ticker-item
            aria-hidden
            className="absolute inset-0 flex items-center gap-3 px-4 opacity-0"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.8125rem] text-fg">{t.description}</p>
              <p className="font-mono text-[0.625rem] text-fg-muted">{t.date}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span
                className={cn(
                  "font-mono text-[0.75rem] tabular",
                  t.amount > 0 ? "text-success" : "text-fg",
                )}
              >
                {t.amount > 0 ? "+" : "−"}
                {formatCents(t.amount)}
              </span>
              <CategoryChip category={t.category} />
            </div>
          </div>
        ))}
        <p
          data-ticker-summary
          className="absolute inset-0 flex items-center gap-2.5 px-4 text-[0.8125rem] text-fg"
        >
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-success/15 text-success">
            <Check aria-hidden className="size-3.5" />
          </span>
          <span className="min-w-0 truncate">
            <span className="font-mono tabular">
              +
              <span key={month.id} data-count data-value={month.moreTransactions}>
                {formatNumber(month.moreTransactions)}
              </span>
            </span>{" "}
            <span className="text-fg-muted">{copy.more}</span>
          </span>
        </p>
      </div>
    </div>
  );
}
