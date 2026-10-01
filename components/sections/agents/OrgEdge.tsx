"use client";

import { motion } from "motion/react";
import { agentsById } from "@/content/agents";
import { cn } from "@/lib/cn";
import {
  orgCanvas,
  orgDepth,
  orgLevels,
  type EdgeGeometry,
  type Emphasis,
  type OrgEdge,
} from "./org";
import { EASE_OUT_EXPO } from "./shared";

/** Edges start drawing once the nodes have landed, deepest level first (work flows up). */
const edgeDelay = (edge: OrgEdge) => 0.45 + (orgDepth - orgLevels[edge.from]) * 0.22;

/** One handoff: gradient curve (dashed across teams) with dots traveling sender → receiver. */
export function Edge({
  edge,
  geo,
  index,
  width,
  drawn,
  reduced,
  emphasis,
}: {
  edge: OrgEdge;
  geo: EdgeGeometry;
  index: number;
  width: number;
  drawn: boolean;
  reduced: boolean;
  emphasis: Emphasis;
}) {
  const from = agentsById[edge.from];
  const to = agentsById[edge.to];
  const cross = edge.kind === "cross";
  const gradientId = `org-gradient-${edge.id}`;
  const maskId = `org-mask-${edge.id}`;
  const pathId = `org-path-${edge.id}`;
  // Opacity rides along so a zero-length path doesn't show its round cap.
  const draw = {
    initial: reduced ? false : { pathLength: 0, opacity: 0 },
    animate: drawn || reduced ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
    transition: {
      duration: 1.1,
      delay: edgeDelay(edge),
      ease: EASE_OUT_EXPO,
      opacity: { duration: 0.15, delay: edgeDelay(edge) },
    },
  } as const;
  const opacity = { idle: cross ? 0.55 : 0.75, on: 1, off: 0.12 }[emphasis];
  const duration = cross ? 4.6 : 3;

  return (
    <g style={{ opacity }} className="transition-opacity duration-300">
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={geo.start.x}
          y1={geo.start.y}
          x2={geo.end.x}
          y2={geo.end.y}
        >
          <stop offset="0" stopColor={from.accent} />
          <stop offset="1" stopColor={to.accentTo ?? to.accent} />
        </linearGradient>
        {cross && (
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={width}
            height={orgCanvas.height + 80}
          >
            <motion.path d={geo.d} fill="none" stroke="#fff" strokeWidth={8} {...draw} />
          </mask>
        )}
      </defs>

      {cross ? (
        <path
          id={pathId}
          d={geo.d}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={1.4}
          strokeDasharray="3 6"
          strokeLinecap="round"
          mask={`url(#${maskId})`}
        />
      ) : (
        <>
          <motion.path
            d={geo.d}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={7}
            strokeOpacity={0.14}
            strokeLinecap="round"
            {...draw}
          />
          <motion.path
            id={pathId}
            d={geo.d}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={1.6}
            strokeLinecap="round"
            {...draw}
          />
        </>
      )}

      {/* Work in motion: dots travel from sender to receiver. Static when reduced. */}
      {reduced ? (
        <circle cx={geo.end.x} cy={geo.end.y} r={3} fill={to.accent} />
      ) : (
        drawn && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: edgeDelay(edge) + 0.9 }}
          >
            {[0, 0.5].map((offset) => {
              const begin = `${-(offset + index * 0.17) * duration}s`;
              return (
                <g key={offset} opacity={0}>
                  <circle r={6} fill={from.accent} opacity={0.22} />
                  <circle r={2.4} fill="#fff" />
                  <circle r={2.4} fill={from.accent} opacity={0.55} />
                  <animateMotion
                    dur={`${duration}s`}
                    begin={begin}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    keySplines="0.45 0 0.4 1"
                  >
                    <mpath href={`#${pathId}`} />
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.12;0.82;1"
                    dur={`${duration}s`}
                    begin={begin}
                    repeatCount="indefinite"
                  />
                </g>
              );
            })}
          </motion.g>
        )
      )}
    </g>
  );
}

export function EdgeLabel({
  edge,
  geo,
  shown,
  reduced,
  emphasis,
}: {
  edge: OrgEdge;
  geo: EdgeGeometry;
  shown: boolean;
  reduced: boolean;
  emphasis: Emphasis;
}) {
  const from = agentsById[edge.from];
  const cross = edge.kind === "cross";
  const opacity = { idle: 1, on: 1, off: 0.25 }[emphasis];

  return (
    <motion.span
      aria-hidden
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: shown || reduced ? 1 : 0 }}
      transition={{ duration: 0.5, delay: edgeDelay(edge) + 0.5 }}
      className="pointer-events-none absolute"
      style={{ left: geo.label.x, top: geo.label.y }}
    >
      <span
        style={{ opacity }}
        className={cn(
          "flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border bg-ink-950/90 px-2.5 py-1 font-mono text-[0.65625rem] leading-none whitespace-nowrap backdrop-blur-sm transition-[opacity,color,border-color] duration-300",
          cross ? "border-dashed border-white/15 text-fg-muted" : "border-white/10 text-fg-muted",
          emphasis === "on" && "border-white/25 text-fg",
        )}
      >
        <span aria-hidden className="size-1.5 rounded-full" style={{ background: from.accent }} />
        {edge.label}
      </span>
    </motion.span>
  );
}
