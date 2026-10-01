import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Soft, slowly drifting color blob for section backgrounds. Decorative.
 * Softness comes from a multi-stop radial gradient rather than a CSS blur
 * filter, which is very expensive to rasterize at this size.
 */
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
        "pointer-events-none absolute rounded-full",
        drift && "md:animate-drift",
        className,
      )}
      style={
        {
          width: size,
          height: size,
          opacity,
          background: `radial-gradient(circle at center, ${color} 0%, color-mix(in oklab, ${color} 55%, transparent) 22%, color-mix(in oklab, ${color} 22%, transparent) 45%, transparent 70%)`,
        } as CSSProperties
      }
    />
  );
}
