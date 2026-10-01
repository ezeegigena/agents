"use client";

import { motion } from "motion/react";
import { Network, UsersRound } from "lucide-react";
import { useRef, type KeyboardEvent } from "react";
import { agentsSection } from "@/content/agents";
import { cn } from "@/lib/cn";
import type { AgentsView } from "./shared";

const views: { id: AgentsView; icon: typeof Network }[] = [
  { id: "team", icon: UsersRound },
  { id: "org", icon: Network },
];

export const tabId = (view: AgentsView) => `agents-tab-${view}`;
export const panelId = (view: AgentsView) => `agents-panel-${view}`;

/** Segmented Team / Org chart switch (tablist with arrow-key navigation). */
export function ViewToggle({
  view,
  onChange,
}: {
  view: AgentsView;
  onChange: (view: AgentsView) => void;
}) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = views.findIndex((v) => v.id === view);
    const last = views.length - 1;
    const next = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    onChange(views[next].id);
    tabsRef.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={agentsSection.viewToggleLabel}
      onKeyDown={onKeyDown}
      className="glass inline-flex rounded-full p-1"
    >
      {views.map(({ id, icon: Icon }, i) => {
        const selected = id === view;
        return (
          <button
            key={id}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            type="button"
            role="tab"
            id={tabId(id)}
            aria-selected={selected}
            aria-controls={panelId(id)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(id)}
            className={cn(
              "relative flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-300 focus-visible:outline-offset-1 sm:px-5",
              selected ? "text-fg" : "text-fg-muted hover:text-fg",
            )}
          >
            {selected && (
              <motion.span
                layoutId="agents-view-pill"
                aria-hidden
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-full bg-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_24px_-10px_rgba(157,107,255,0.6)] ring-1 ring-white/12"
              />
            )}
            <Icon aria-hidden className="relative size-4" />
            <span className="relative">{agentsSection.viewLabels[id]}</span>
          </button>
        );
      })}
    </div>
  );
}
