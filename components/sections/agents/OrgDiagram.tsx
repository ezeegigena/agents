"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { agents, agentsById, agentsSection, type Agent, type AgentId } from "@/content/agents";
import { cn } from "@/lib/cn";
import { useInViewport } from "@/lib/hooks/useInView";
import {
  chainOf,
  columnFraction,
  edgeGeometry,
  levelTop,
  nodeTop,
  nodeWidthCss,
  orgCanvas,
  orgEdges,
  orgLevels,
  type EdgeGeometry,
  type OrgEdge,
} from "./org";
import { EASE_OUT_EXPO, shellLayoutId, type OpenAgent } from "./shared";

type Emphasis = "on" | "off" | "idle";

const DEEPEST = Math.max(...Object.values(orgLevels));
/** Edges start drawing once the nodes have landed. */
const EDGE_DELAY = 0.45;

/** Desktop / tablet org chart: glass nodes + SVG handoff edges with traveling dots. */
export function OrgDiagram({
  onOpen,
  originId,
  reduced,
}: {
  onOpen: OpenAgent;
  originId: AgentId | null;
  reduced: boolean;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<AgentId | null>(null);
  const seen = useInView(canvasRef, { once: true, amount: 0.3 });
  const onScreen = useInViewport(canvasRef);

  // Edge paths are computed from the canvas width (nodes are laid out in CSS
  // with the same formula), so they stay exact at every size.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pause the SMIL dots while the chart is offscreen.
  const hasSvg = width > 0;
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (onScreen) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [onScreen, hasSvg]);

  const chain = active ? chainOf(active) : null;
  const emphasisOf = (on: boolean): Emphasis => (!chain ? "idle" : on ? "on" : "off");
  const edges = hasSvg ? orgEdges.map((edge) => ({ edge, geo: edgeGeometry(edge, width) })) : [];

  return (
    <div
      ref={canvasRef}
      className="relative w-full"
      style={{ height: orgCanvas.height }}
      role="group"
      aria-label={agentsSection.org.title}
    >
      {hasSvg && (
        <svg
          ref={svgRef}
          aria-hidden
          width={width}
          height={orgCanvas.height}
          viewBox={`0 0 ${width} ${orgCanvas.height}`}
          className="absolute inset-0 overflow-visible"
        >
          {edges.map(({ edge, geo }, i) => (
            <Edge
              key={edge.id}
              edge={edge}
              geo={geo}
              index={i}
              width={width}
              drawn={seen}
              reduced={reduced}
              emphasis={emphasisOf(chain?.edges.has(edge.id) ?? false)}
            />
          ))}
        </svg>
      )}

      {edges.map(({ edge, geo }) => (
        <EdgeLabel
          key={edge.id}
          edge={edge}
          geo={geo}
          shown={seen}
          reduced={reduced}
          emphasis={emphasisOf(chain?.edges.has(edge.id) ?? false)}
        />
      ))}

      {agents.map((agent) => (
        <OrgNode
          key={agent.id}
          agent={agent}
          shown={seen}
          reduced={reduced}
          isOrigin={originId === agent.id}
          emphasis={emphasisOf(chain?.nodes.has(agent.id) ?? false)}
          onOpen={onOpen}
          onActive={setActive}
        />
      ))}

      <Legend shown={seen} />
    </div>
  );
}

const edgeDelay = (edge: OrgEdge) => EDGE_DELAY + (DEEPEST - orgLevels[edge.from]) * 0.22;

function Edge({
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
  const draw = {
    initial: reduced ? false : { pathLength: 0 },
    animate: { pathLength: drawn || reduced ? 1 : 0 },
    transition: { duration: 1.1, delay: edgeDelay(edge), ease: EASE_OUT_EXPO },
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

function EdgeLabel({
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

function OrgNode({
  agent,
  shown,
  reduced,
  isOrigin,
  emphasis,
  onOpen,
  onActive,
}: {
  agent: Agent;
  shown: boolean;
  reduced: boolean;
  isOrigin: boolean;
  emphasis: Emphasis;
  onOpen: OpenAgent;
  onActive: (id: AgentId | null) => void;
}) {
  const isTop = agent.reportsTo === null;
  const level = orgLevels[agent.id];
  const handoffs = agent.handoffs.map((h) => `${h.label} → ${agentsById[h.to].short}`).join(", ");

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16, scale: 0.96 }}
      animate={shown || reduced ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.7, delay: level * 0.1, ease: EASE_OUT_EXPO }}
      className="absolute"
      style={{
        left: `calc(${columnFraction(agent.id) * 100}% - ${nodeWidthCss} / 2)`,
        top: nodeTop(agent.id),
        width: nodeWidthCss,
        height: orgCanvas.nodeHeight,
      }}
    >
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={(e) => onOpen(agent.id, "org", e.currentTarget)}
        onPointerEnter={() => onActive(agent.id)}
        onPointerLeave={() => onActive(null)}
        onFocus={() => onActive(agent.id)}
        onBlur={() => onActive(null)}
        style={{ "--accent": agent.accent } as CSSProperties}
        className={cn(
          "group/node @container relative flex size-full items-center rounded-2xl text-left transition-[opacity,translate] duration-300 ease-out-expo hover:-translate-y-0.5",
          emphasis === "off" && "opacity-35",
        )}
      >
        <motion.span
          layoutId={reduced ? undefined : shellLayoutId("org", agent.id)}
          transition={{ layout: { type: "spring", bounce: 0.12, duration: 0.6 } }}
          style={{ borderRadius: 16 }}
          className={cn(
            "glass absolute inset-0",
            isTop && "shadow-[0_0_50px_-12px_rgba(157,107,255,0.55)]",
          )}
        />
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300",
            isTop ? "gradient-border opacity-90" : "opacity-0 group-hover/node:opacity-100",
            emphasis === "on" && "opacity-100",
            isOrigin && "opacity-0",
          )}
          style={
            isTop
              ? undefined
              : { boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--accent) 50%, transparent)" }
          }
        />
        <span
          className={cn(
            "relative flex min-w-0 items-center gap-2.5 px-2.5 transition-opacity duration-300 @min-[12.5rem]:gap-3 @min-[12.5rem]:px-3",
            isOrigin && "opacity-0",
          )}
        >
          <AgentAvatar agent={agent} size="sm" />
          <span className="min-w-0">
            <span className="line-clamp-2 font-display text-[0.875rem] leading-tight font-semibold tracking-[-0.02em] text-fg @min-[12.5rem]:truncate">
              {agent.short}
            </span>
            <span className="mt-0.5 hidden text-[0.71875rem] leading-[1.2] text-fg-muted @min-[12.5rem]:line-clamp-2">
              {agent.role}
            </span>
          </span>
        </span>
        {handoffs && (
          <span className="sr-only">
            . {agentsSection.org.handoffPrefix} {handoffs}
          </span>
        )}
      </button>
    </motion.div>
  );
}

function Legend({ shown }: { shown: boolean }) {
  const { legend } = agentsSection.org;
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: shown ? 1 : 0 }}
      transition={{ duration: 0.6, delay: 1.4 }}
      className="absolute left-0 flex flex-col gap-2.5 text-xs text-fg-muted"
      style={{ top: levelTop(DEEPEST) + 6 }}
    >
      <span className="flex items-center gap-3">
        <span className="h-0.5 w-7 rounded-full bg-brand-gradient" />
        {legend.tree}
      </span>
      <span className="flex items-center gap-3">
        <span className="w-7 border-t border-dashed border-fg-muted/70" />
        {legend.cross}
      </span>
    </motion.div>
  );
}
