import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Brand-gradient text with a slow color pan. */
export function GradientText({
  children,
  className,
  animated = true,
}: {
  children: ReactNode;
  className?: string;
  animated?: boolean;
}) {
  return (
    <span className={cn("text-gradient", animated && "animate-gradient-pan", className)}>
      {children}
    </span>
  );
}
