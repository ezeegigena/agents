"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { agents, agentAccentBg } from "@/content/agents";
import { cn } from "@/lib/cn";
import { useInViewport } from "@/lib/hooks/useInView";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { CoreOrb } from "./CoreOrb";
import { OrbitFallback } from "./OrbitFallback";

const FinanceBrainScene = dynamic(() => import("@/components/three/FinanceBrainScene"), {
  ssr: false,
});

type Mode = "pending" | "webgl" | "fallback";

let cachedMode: Mode | null = null;

/** WebGL only where it will run smoothly; everything else gets the CSS orbit. */
function detectMode(): Mode {
  if (cachedMode) return cachedMode;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  const desktop = window.matchMedia("(min-width: 1024px)").matches;
  const capable = (nav.hardwareConcurrency ?? 4) >= 4 && !nav.connection?.saveData;
  let webgl = false;
  try {
    webgl = !!document.createElement("canvas").getContext("webgl2");
  } catch {
    webgl = false;
  }
  cachedMode = desktop && capable && webgl ? "webgl" : "fallback";
  return cachedMode;
}

const noopSubscribe = () => () => {};

/** Desktop hero visual: CSS poster first, then the WebGL scene once idle. */
export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLElement | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const inView = useInViewport(containerRef, "100px");
  const reduced = usePrefersReducedMotion();
  const mode = useSyncExternalStore<Mode>(noopSubscribe, detectMode, () => "pending");
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  // Defer the three.js chunk until the main thread is idle (protects LCP/TBT).
  useEffect(() => {
    if (mode !== "webgl") return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => setMounted(true), { timeout: 1500 });
    return () => cancel(id);
  }, [mode]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (mode === "fallback") return <OrbitFallback className="mx-auto max-w-[560px]" />;

  return (
    <div ref={containerRef} aria-hidden className="relative aspect-square w-full">
      {/* Poster: same palette as the scene so the swap is seamless. */}
      <div
        className={cn(
          "absolute inset-0 grid place-items-center transition-opacity duration-1000",
          ready ? "opacity-0" : "opacity-100",
        )}
      >
        <CoreOrb className="size-[34%]" />
      </div>

      {mode === "webgl" && mounted && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-[1400ms] ease-out-expo",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <FinanceBrainScene
            active={inView}
            reducedMotion={reduced}
            labelRefs={labelRefs}
            pointer={pointer}
            onReady={() => setReady(true)}
          />
        </div>
      )}

      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity delay-300 duration-1000",
          ready ? "opacity-100" : "opacity-0",
        )}
      >
        {agents.map((agent, i) => {
          const Icon = agent.icon;
          return (
            <div
              key={agent.id}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              className="absolute top-0 left-0 transition-opacity duration-500 will-change-transform"
            >
              <span className="glass-strong flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-1 text-[11px] font-medium whitespace-nowrap text-fg">
                <span
                  className="grid size-5 place-items-center rounded-full text-ink-950"
                  style={{ background: agentAccentBg(agent) }}
                >
                  <Icon className="size-3" />
                </span>
                {agent.short}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
