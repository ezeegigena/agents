import { Sparkles } from "lucide-react";
import { transactionCategories, type CategoryId } from "@/content/demo";
import { cn } from "@/lib/cn";

/** AI category chip ("IS · Revenue"), tinted by the statement line it feeds. */
export function CategoryChip({ category, className }: { category: CategoryId; className?: string }) {
  const { label, statement, color } = transactionCategories[category];
  return (
    <span
      data-feed-chip
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[0.625rem] leading-3 whitespace-nowrap",
        className,
      )}
      style={{
        color,
        background: `color-mix(in oklab, ${color} 13%, transparent)`,
        boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${color} 32%, transparent)`,
      }}
    >
      <Sparkles aria-hidden className="size-2.5" />
      <span className="opacity-70">{statement}</span>
      <span aria-hidden className="opacity-40">
        ·
      </span>
      {label}
    </span>
  );
}

/** Four-point star that bursts when a chip is assigned. Decorative. */
export function Spark({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      data-feed-spark
      aria-hidden
      viewBox="0 0 12 12"
      className={cn("pointer-events-none absolute size-3 opacity-0", className)}
    >
      <path d="M6 0L7.1 4.9L12 6L7.1 7.1L6 12L4.9 7.1L0 6L4.9 4.9Z" fill={color} />
    </svg>
  );
}
