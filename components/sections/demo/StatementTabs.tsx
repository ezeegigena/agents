"use client";

import { motion } from "motion/react";
import { useRef, type KeyboardEvent } from "react";
import { demoSection, statementLayouts, statementOrder, type StatementId } from "@/content/demo";
import { cn } from "@/lib/cn";

/** Mobile tablist (IS / BS / CFS) with arrow-key navigation. */
export function StatementTabs({
  active,
  onChange,
  className,
}: {
  active: StatementId;
  onChange: (id: StatementId) => void;
  className?: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = statementOrder.indexOf(active);
    const last = statementOrder.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % statementOrder.length
        : event.key === "ArrowLeft"
          ? (index - 1 + statementOrder.length) % statementOrder.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    const id = statementOrder[next];
    onChange(id);
    listRef.current?.querySelector<HTMLButtonElement>(`#demo-tab-${id}`)?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={demoSection.tabsLabel}
      className={cn(
        "grid grid-cols-3 gap-1 rounded-full border border-line bg-ink-900/70 p-1 backdrop-blur",
        className,
      )}
    >
      {statementOrder.map((id) => {
        const layout = statementLayouts[id];
        const selected = id === active;
        return (
          <button
            key={id}
            id={`demo-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`demo-panel-${id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(id)}
            onKeyDown={onKeyDown}
            className={cn(
              "relative h-10 rounded-full text-[0.8125rem] font-medium transition-colors duration-200",
              selected ? "text-fg" : "text-fg-muted hover:text-fg",
            )}
          >
            {selected && (
              <motion.span
                layoutId="demo-statement-tab"
                aria-hidden
                className="absolute inset-0 rounded-full bg-white/[0.09] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="size-1.5 rounded-full"
                style={{ background: layout.accent }}
              />
              {layout.tabLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
