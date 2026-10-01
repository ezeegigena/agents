import { agents } from "@/content/agents";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { cn } from "@/lib/cn";
import { CoreOrb } from "./CoreOrb";

const RINGS = [31, 45];

/**
 * Lightweight SVG/CSS version of the hero visual for mobile, low-power
 * devices and browsers without WebGL: agents orbit the core and stream
 * data into it.
 */
export function OrbitFallback({ className }: { className?: string }) {
  const nodes = agents.map((agent, i) => {
    const angle = (i / agents.length) * Math.PI * 2 - Math.PI / 2;
    const r = RINGS[i % 2];
    return { agent, x: 50 + r * Math.cos(angle), y: 50 + r * Math.sin(angle) };
  });

  return (
    <div aria-hidden className={cn("relative aspect-square w-full", className)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
        {RINGS.map((r) => (
          <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#8a93c8" strokeOpacity="0.16" strokeWidth="0.25" />
        ))}
      </svg>

      <CoreOrb className="absolute inset-[33%]" />

      <div className="absolute inset-0 animate-spin-slow [animation-duration:80s]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
          <defs>
            {nodes.map(({ agent }, i) => (
              <linearGradient key={agent.id} id={`orbit-line-${i}`} gradientUnits="userSpaceOnUse" x1={nodes[i].x} y1={nodes[i].y} x2="50" y2="50">
                <stop offset="0" stopColor={agent.accent} stopOpacity="0.9" />
                <stop offset="1" stopColor={agent.accent} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {nodes.map(({ agent, x, y }, i) => (
            <line
              key={agent.id}
              x1={x}
              y1={y}
              x2="50"
              y2="50"
              stroke={`url(#orbit-line-${i})`}
              strokeWidth="0.45"
              strokeDasharray="1.2 2.8"
              strokeLinecap="round"
              className="animate-dash-flow"
              style={{ animationDuration: `${2.4 + (i % 3) * 0.5}s` }}
            />
          ))}
        </svg>
        {nodes.map(({ agent, x, y }) => (
          <div
            key={agent.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="animate-spin-slow [animation-direction:reverse] [animation-duration:80s]">
              <AgentAvatar agent={agent} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
