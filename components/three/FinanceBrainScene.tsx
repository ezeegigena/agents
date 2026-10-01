"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { createFinanceBrain } from "./financeBrain";

type SceneProps = {
  /** Run the render loop (false while the hero is offscreen). */
  active: boolean;
  reducedMotion: boolean;
  /** DOM labels (one per agent) positioned over each orbiting node. */
  labelRefs: RefObject<(HTMLElement | null)[]>;
  /** Normalized pointer position (-1..1) for parallax. */
  pointer: RefObject<{ x: number; y: number }>;
  /** Called once the first frame has rendered. */
  onReady: () => void;
};

function Brain({ reducedMotion, labelRefs, pointer, onReady }: Omit<SceneProps, "active">) {
  const brain = useMemo(() => createFinanceBrain(), []);
  const ready = useRef(false);

  useEffect(() => brain.dispose, [brain]);

  useFrame((state, delta) => {
    brain.update({
      time: reducedMotion ? 2.4 : state.clock.elapsedTime,
      delta,
      camera: state.camera,
      width: state.size.width,
      height: state.size.height,
      dpr: state.viewport.dpr,
      pointer: reducedMotion ? null : pointer.current,
      labels: labelRefs.current ?? [],
    });
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  return <primitive object={brain.root} />;
}

/** The hero's WebGL "finance brain": a living core with eight orbiting agents. */
export default function FinanceBrainScene({ active, ...props }: SceneProps) {
  return (
    <Canvas
      linear
      flat
      dpr={[1, 1.75]}
      frameloop={props.reducedMotion ? "demand" : active ? "always" : "never"}
      camera={{ position: [0, 0, 12], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <Brain {...props} />
    </Canvas>
  );
}
