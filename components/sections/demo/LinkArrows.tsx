"use client";

import { useEffect, useId, useState, type RefObject } from "react";
import { statementLayouts, statementLinks, type LinkId, type StatementId } from "@/content/demo";

type Route = { side: "left" | "right"; lane: number; halo?: boolean };

/**
 * How each link travels through the gutters between cards. "left" runs in
 * the gutter between the feed and the IS/CFS column; "right" runs in the
 * gutter between that column and the balance sheet. `lane` is the position
 * across the gutter (0–1). The NI → RE trace crosses the cash trace, so it
 * gets a dark halo that reads as a clean bridge.
 */
const ROUTES: Record<LinkId, Route> = {
  "ni-cfs": { side: "left", lane: 0.5 },
  "cash-bs": { side: "right", lane: 0.33 },
  "ni-re": { side: "right", lane: 0.67, halo: true },
};

const RADIUS = 10;
const HEAD = 7;

type LinkGeometry = { d: string; x1: number; y1: number; x2: number; y2: number };
type Geometry = { width: number; height: number; links: Partial<Record<LinkId, LinkGeometry>> };

const px = (v: number) => Math.round(v * 2) / 2;

/** Orthogonal path with rounded corners: horizontal → vertical → horizontal. */
function elbow(x1: number, y1: number, lane: number, x2: number, y2: number) {
  const sy = y2 >= y1 ? 1 : -1;
  const s1 = lane >= x1 ? 1 : -1;
  const s2 = x2 >= lane ? 1 : -1;
  const r = Math.max(
    0,
    Math.min(RADIUS, Math.abs(y2 - y1) / 2, Math.abs(lane - x1), Math.abs(x2 - lane)),
  );
  return [
    `M${px(x1)} ${px(y1)}`,
    `H${px(lane - s1 * r)}`,
    `Q${px(lane)} ${px(y1)} ${px(lane)} ${px(y1 + sy * r)}`,
    `V${px(y2 - sy * r)}`,
    `Q${px(lane)} ${px(y2)} ${px(lane + s2 * r)} ${px(y2)}`,
    `H${px(x2)}`,
  ].join("");
}

function measure(container: HTMLElement): Geometry {
  const box = container.getBoundingClientRect();
  const feed = container.querySelector("[data-demo-feed]")?.getBoundingClientRect();
  const links: Geometry["links"] = {};

  for (const link of statementLinks) {
    const fromRow = container.querySelector(`[data-row="${link.from}"]`);
    const toRow = container.querySelector(`[data-row="${link.to}"]`);
    const fromCard = fromRow?.closest("[data-statement]")?.getBoundingClientRect();
    const toCard = toRow?.closest("[data-statement]")?.getBoundingClientRect();
    if (!fromRow || !toRow || !fromCard || !toCard || !fromCard.width || !toCard.width) continue;

    const a = fromRow.getBoundingClientRect();
    const b = toRow.getBoundingClientRect();
    const y1 = a.top + a.height / 2 - box.top;
    const y2 = b.top + b.height / 2 - box.top;
    const route = ROUTES[link.id];
    const x2 = toCard.left - box.left;
    let x1: number;
    let lane: number;
    if (route.side === "left") {
      x1 = fromCard.left - box.left;
      const gutter = feed?.width ? fromCard.left - feed.right : 32;
      lane = x1 - gutter * route.lane;
    } else {
      x1 = fromCard.right - box.left;
      lane = x1 + (toCard.left - fromCard.right) * route.lane;
    }
    links[link.id] = { d: elbow(x1, y1, lane, x2 - HEAD + 1, y2), x1, y1, x2, y2 };
  }
  return { width: box.width, height: box.height, links };
}

const accentOf = (ref: string) => statementLayouts[ref.split(".")[0] as StatementId].accent;

/**
 * Decorative SVG overlay (desktop only) that draws the links between the
 * statements from real DOM positions. Re-measures on any size change; all
 * coordinates are relative to the grid container, so scrolling is safe.
 * Paths always render (hidden until measured) so the GSAP timeline can
 * target them from the first frame.
 */
export function LinkArrows({
  containerRef,
  version,
}: {
  containerRef: RefObject<HTMLElement | null>;
  /** Re-measure when this changes (e.g. the month). */
  version: string;
}) {
  const uid = useId().replace(/:/g, "");
  const [geo, setGeo] = useState<Geometry | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setGeo(measure(container)));
    };
    const observer = new ResizeObserver(update);
    observer.observe(container);
    container
      .querySelectorAll("[data-statement], [data-demo-feed]")
      .forEach((el) => observer.observe(el));
    document.fonts?.ready.then(update);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [containerRef, version]);

  // Paint order: the haloed (bridging) trace goes last so it sits on top.
  const ordered = [...statementLinks].sort(
    (a, b) => Number(Boolean(ROUTES[a.id].halo)) - Number(Boolean(ROUTES[b.id].halo)),
  );

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 hidden size-full overflow-visible lg:block"
      viewBox={geo ? `0 0 ${geo.width} ${geo.height}` : undefined}
      style={{ visibility: geo ? "visible" : "hidden" }}
      fill="none"
    >
      <defs>
        {ordered.map((link) => {
          const g = geo?.links[link.id];
          return (
            <linearGradient
              key={link.id}
              id={`${uid}-${link.id}`}
              gradientUnits="userSpaceOnUse"
              x1={g?.x1 ?? 0}
              y1={g?.y1 ?? 0}
              x2={g?.x2 ?? 1}
              y2={g?.y2 ?? 1}
            >
              <stop offset="0" stopColor={accentOf(link.from)} />
              <stop offset="1" stopColor={accentOf(link.to)} />
            </linearGradient>
          );
        })}
      </defs>

      {/* Blueprint ghost tracks */}
      {ordered.map((link) => (
        <path
          key={link.id}
          d={geo?.links[link.id]?.d ?? ""}
          stroke="rgb(160 170 255 / 0.22)"
          strokeWidth={1}
          strokeDasharray="2 4"
        />
      ))}

      {ordered.map((link) => {
        const g = geo?.links[link.id];
        const d = g?.d ?? "";
        const stroke = `url(#${uid}-${link.id})`;
        const from = accentOf(link.from);
        const to = accentOf(link.to);
        return (
          <g key={link.id}>
            {ROUTES[link.id].halo && (
              <path
                data-link-halo={link.id}
                d={d}
                stroke="#060814"
                strokeWidth={7}
                pathLength={1}
                strokeDasharray="1"
              />
            )}
            <path
              data-link-glow={link.id}
              d={d}
              stroke={stroke}
              strokeWidth={6}
              strokeOpacity={0.16}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
            />
            <path
              data-link-path={link.id}
              d={d}
              stroke={stroke}
              strokeWidth={1.6}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
            />
            <g transform={`translate(${px(g?.x1 ?? 0)} ${px(g?.y1 ?? 0)})`}>
              <g data-link-start={link.id}>
                <circle r={5.5} stroke={from} strokeOpacity={0.4} fill="#060814" />
                <circle r={2.5} fill={from} />
              </g>
            </g>
            <g transform={`translate(${px(g?.x2 ?? 0)} ${px(g?.y2 ?? 0)})`}>
              <circle data-link-ring={link.id} r={4} stroke={to} strokeWidth={1.5} opacity={0} />
              <g data-link-head={link.id}>
                <path
                  d={`M${-HEAD} -4.5L0 0L${-HEAD} 4.5`}
                  stroke={to}
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </g>
            <circle
              data-link-dot={link.id}
              r={3}
              fill="#fff"
              opacity={0}
              style={{ filter: `drop-shadow(0 0 5px ${to})` }}
            />
          </g>
        );
      })}
    </svg>
  );
}
