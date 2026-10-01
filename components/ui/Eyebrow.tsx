import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Mono uppercase label with an accent dot — "01 — The team". */
export function Eyebrow({
  children,
  index,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  index?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "eyebrow inline-flex items-center gap-2.5",
        tone === "dark" ? "text-fg-muted" : "text-muted-on-paper",
        className,
      )}
    >
      <span aria-hidden className="relative flex size-1.5">
        <span className="absolute inset-0 rounded-full bg-brand-gradient" />
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-violet/60" />
      </span>
      {index && (
        <>
          <span className={tone === "dark" ? "text-fg" : "text-ink-on-paper"}>{index}</span>
          <span aria-hidden className="opacity-40">
            —
          </span>
        </>
      )}
      <span>{children}</span>
    </p>
  );
}
