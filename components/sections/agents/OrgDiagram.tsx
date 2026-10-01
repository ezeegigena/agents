"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { agents, agentsSection, type AgentId } from "@/content/agents";
import { useInViewport } from "@/lib/hooks/useInView";
import {
  chainOf,
  edgeGeometry,
  levelTop,
  orgCanvas,
  orgDepth,
  orgEdges,
  type Emphasis,
} from "./org";
import { Edge, EdgeLabel } from "./OrgEdge";
import { OrgNode } from "./OrgNode";
import type { OpenAgent } from "./shared";

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

function Legend({ shown }: { shown: boolean }) {
  const { legend } = agentsSection.org;
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: shown ? 1 : 0 }}
      transition={{ duration: 0.6, delay: 1.4 }}
      className="absolute left-0 flex flex-col gap-2.5 text-xs text-fg-muted"
      style={{ top: levelTop(orgDepth) + 6 }}
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
