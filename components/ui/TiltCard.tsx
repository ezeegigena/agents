"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useCanHover } from "@/lib/hooks/useMediaQuery";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. */
  max?: number;
  /** Spotlight color (any CSS color). */
  glow?: string;
  style?: CSSProperties;
};

/**
 * 3D hover tilt + cursor-following spotlight. Inert on touch devices and
 * with reduced motion.
 */
export function TiltCard({
  children,
  className,
  max = 6,
  glow = "rgba(157,107,255,0.22)",
  style,
}: TiltCardProps) {
  const canHover = useCanHover();
  const reduced = useReducedMotion();
  const enabled = canHover && !reduced;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 300, damping: 30, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, ${glow}, transparent 65%)`;

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={
        enabled
          ? { rotateX, rotateY, transformPerspective: 1000, ...style }
          : style
      }
      className={cn("group/tilt relative will-change-transform", className)}
    >
      {children}
      {enabled && (
        <motion.div
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
        />
      )}
    </motion.div>
  );
}
