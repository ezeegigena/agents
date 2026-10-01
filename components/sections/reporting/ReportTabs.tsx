import { motion, type MotionValue } from "motion/react";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { reportingContent } from "@/content/reporting";

const { reports, window: win } = reportingContent;

export const tabId = (id: string) => `report-tab-${id}`;
export const panelId = (id: string) => `report-panel-${id}`;

/**
 * Report list: a vertical sidebar from `md`, a horizontally scrolling tab row
 * below it. Arrow keys / Home / End move between reports (automatic activation).
 */
export function ReportTabs({
  active,
  onSelect,
  progress,
  showProgress,
}: {
  active: number;
  onSelect: (index: number) => void;
  progress: MotionValue<number>;
  showProgress: boolean;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the active tab visible in the mobile row without scrolling the page.
  useEffect(() => {
    const list = listRef.current;
    const tab = list?.querySelectorAll<HTMLElement>('[role="tab"]')[active];
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: tab.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const last = reports.length - 1;
    const next: Record<string, number> = {
      ArrowDown: active === last ? 0 : active + 1,
      ArrowRight: active === last ? 0 : active + 1,
      ArrowUp: active === 0 ? last : active - 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in next)) return;
    e.preventDefault();
    onSelect(next[e.key]);
    listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next[e.key]]?.focus();
  }

  return (
    <div className="border-b border-line md:border-r md:border-b-0">
      <p className="eyebrow hidden px-5 pt-5 pb-3 text-[10.5px] text-fg-muted md:block">
        {win.sidebarLabel}
      </p>
      <div
        ref={listRef}
        role="tablist"
        aria-label={win.tablistLabel}
        onKeyDown={onKeyDown}
        className="relative flex snap-x gap-1.5 overflow-x-auto px-3 py-3 [scrollbar-width:none] md:flex-col md:gap-1 md:overflow-visible md:px-3 md:pt-0 md:pb-4 [&::-webkit-scrollbar]:hidden"
      >
        {reports.map((report, i) => {
          const selected = i === active;
          const Icon = report.icon;
          return (
            <button
              key={report.id}
              id={tabId(report.id)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(report.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(i)}
              className={cn(
                "group relative flex min-h-11 shrink-0 snap-start items-center gap-2.5 overflow-hidden rounded-xl border px-3 py-2 text-left transition-colors duration-200 md:w-full md:py-2.5",
                selected
                  ? "border-line-strong bg-white/[0.07] text-fg"
                  : "border-transparent text-fg-muted hover:bg-white/[0.035] hover:text-fg",
              )}
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-lg border transition-colors duration-200",
                  selected
                    ? "border-brand-teal/30 bg-brand-teal/10 text-brand-teal"
                    : "border-line bg-white/[0.03] text-fg-muted group-hover:text-fg",
                )}
              >
                <Icon aria-hidden className="size-3.5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-medium whitespace-nowrap">{report.name}</span>
                <span className="hidden font-mono text-[10.5px] whitespace-nowrap text-fg-muted md:block">
                  {report.cadence} · {report.schedule}
                </span>
              </span>
              {selected && showProgress && (
                <span aria-hidden className="absolute inset-x-3 bottom-0 h-0.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.span
                    className="block h-full origin-left rounded-full bg-brand-gradient"
                    style={{ scaleX: progress }}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
