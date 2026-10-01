import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Soft, slowly drifting color blob for section backgrounds. Decorative. */
export function Glow({
  color,
  className,
  size = 520,
  opacity = 0.35,
  drift = true,
}: {
  color: string;
  className?: string;
  size?: number;
  opacity?: number;
  drift?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full blur-[90px]",
        drift && "animate-drift",
        className,
      )}
      style={
        {
          width: size,
          height: size,
          opacity,
          background: `radial-gradient(circle at center, ${color}, transparent 68%)`,
        } as CSSProperties
      }
    />
  );
}
