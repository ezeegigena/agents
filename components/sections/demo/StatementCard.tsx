import type { CSSProperties } from "react";
import { Link2 } from "lucide-react";
import {
  demoSection,
  type DemoMonth,
  type RowRef,
  type StatementLayout,
  type StatementRow,
} from "@/content/demo";
import { cn } from "@/lib/cn";
import { formatUsd } from "@/lib/format";
import { anchorRows, linkNotes } from "./model";

type StatementCardProps = {
  layout: StatementLayout<string>;
  values: Record<string, number>;
  month: DemoMonth;
  /** Mobile: only the active tab's card is shown. */
  active: boolean;
  /** Mobile: the card is a tab panel. */
  asTabPanel: boolean;
  /** Rows to highlight (hovered feed transaction) and the highlight color. */
  highlighted: ReadonlySet<string>;
  highlightColor?: string;
  className?: string;
};

/** One financial statement as a glass card with a real, semantic table. */
export function StatementCard({
  layout,
  values,
  month,
  active,
  asTabPanel,
  highlighted,
  highlightColor,
  className,
}: StatementCardProps) {
  const Icon = layout.icon;
  const accent = layout.accent;

  return (
    <article
      id={`demo-panel-${layout.id}`}
      data-statement={layout.id}
      data-accent={accent}
      data-active={active}
      role={asTabPanel ? "tabpanel" : undefined}
      aria-labelledby={asTabPanel ? `demo-tab-${layout.id}` : `demo-${layout.id}-title`}
      tabIndex={asTabPanel ? 0 : undefined}
      style={{ "--accent": accent } as CSSProperties}
      className={cn(
        "glass-strong relative rounded-3xl p-3.5 sm:p-4 xl:p-5",
        !active && "max-lg:hidden",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <header className="mb-2.5 flex items-center gap-3 px-1">
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-xl"
          style={{
            background: `color-mix(in oklab, ${accent} 16%, transparent)`,
            boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${accent} 35%, transparent)`,
          }}
        >
          <Icon className="size-4" style={{ color: accent }} />
        </span>
        <div className="min-w-0">
          <h3
            id={`demo-${layout.id}-title`}
            className="text-[0.95rem] leading-tight font-semibold tracking-[-0.02em] text-fg"
          >
            {layout.title}
          </h3>
          <p className="truncate font-mono text-[0.6875rem] text-fg-muted">
            {layout.periodPrefix} {month.monthEnd}
          </p>
        </div>
        <span
          className="ml-auto rounded-full px-2 py-0.5 font-mono text-[0.625rem] tracking-[0.14em]"
          style={{
            color: accent,
            boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${accent} 40%, transparent)`,
          }}
        >
          {layout.short}
        </span>
      </header>

      <table className="w-full border-separate border-spacing-0 text-[0.8125rem] leading-[1.125rem]">
        <caption className="sr-only">
          {layout.title}, {demoSection.company.name}, {month.period}, in US dollars
          {layout.method ? ` (${layout.method.toLowerCase()})` : ""}
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">{demoSection.columnHeader}</th>
            <th scope="col">{month.period}</th>
          </tr>
        </thead>
        {layout.groups.map((group, gi) => (
          <tbody key={group.heading ?? gi}>
            {group.heading && (
              <tr>
                <th
                  colSpan={2}
                  scope="rowgroup"
                  className="px-2 pt-2 pb-0.5 text-left font-mono text-[0.625rem] font-normal tracking-[0.14em] text-fg-muted uppercase"
                >
                  {group.heading}
                </th>
              </tr>
            )}
            {group.rows.map((row) => (
              <Row
                key={`${month.id}:${row.key}`}
                rowRef={`${layout.id}.${row.key}`}
                row={row}
                value={row.negate ? -values[row.key] : values[row.key]}
                margin={row.margin ? values.grossMargin : undefined}
                accent={accent}
                highlightColor={highlighted.has(`${layout.id}.${row.key}`) ? highlightColor : undefined}
              />
            ))}
          </tbody>
        ))}
      </table>
    </article>
  );
}

function Row({
  rowRef,
  row,
  value,
  margin,
  accent,
  highlightColor,
}: {
  rowRef: RowRef;
  row: StatementRow<string>;
  value: number;
  margin?: number;
  accent: string;
  highlightColor?: string;
}) {
  const kind = row.kind ?? "line";
  const isAnchor = anchorRows.has(rowRef);
  const notes = isAnchor ? linkNotes(rowRef) : [];
  const cell = cn(
    "py-[0.1875rem]",
    kind === "total" && "bg-[color-mix(in_oklab,var(--accent)_9%,transparent)]",
    highlightColor && "bg-[var(--hl)]",
  );

  return (
    <tr
      data-row={rowRef}
      data-kind={kind}
      data-anchor={isAnchor || undefined}
      style={
        highlightColor
          ? ({ "--hl": `color-mix(in oklab, ${highlightColor} 22%, transparent)` } as CSSProperties)
          : undefined
      }
    >
      <th
        scope="row"
        className={cn(
          cell,
          "rounded-l-md pr-2 text-left align-top",
          row.indent ? "pl-4" : "pl-2",
          kind === "line" && "font-normal text-fg-muted",
          kind === "subtotal" && "font-medium text-fg",
          kind === "total" && "font-semibold text-fg",
        )}
      >
        <span data-label className="inline-flex items-center gap-1.5">
          {row.label}
          {margin !== undefined && (
            <span
              data-margin
              className="rounded bg-success/10 px-1 font-mono text-[0.625rem] leading-4 font-normal text-success"
            >
              {(margin * 100).toFixed(1)}%
            </span>
          )}
          {isAnchor && (
            <Link2 data-link-icon aria-hidden className="size-3" style={{ color: accent }} />
          )}
        </span>
        {notes.map((note) => (
          <span
            key={note.id}
            data-note
            className="block font-mono text-[0.625rem] leading-4 font-normal text-fg-muted lg:hidden"
          >
            <span aria-hidden style={{ color: accent }}>
              {note.arrow}{" "}
            </span>
            {note.text}
          </span>
        ))}
      </th>
      <td
        className={cn(
          cell,
          "w-[1%] rounded-r-md pr-2 pl-3 text-right align-top font-mono whitespace-nowrap tabular",
          kind === "line" ? "text-fg/90" : "font-medium text-fg",
          kind === "total" && "font-semibold",
        )}
      >
        <span
          data-amount
          data-value={value}
          className={cn(
            "block origin-right",
            kind !== "line" && "border-t border-fg/25",
            kind === "total" && "border-b-[3px] border-double border-b-fg/45",
          )}
        >
          {formatUsd(value)}
        </span>
      </td>
    </tr>
  );
}
