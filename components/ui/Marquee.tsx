import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Infinite CSS marquee. Content is duplicated once for a seamless loop;
 * the duplicate is hidden from assistive tech. Pauses on hover.
 */
export function Marquee({
  children,
  reverse = false,
  duration = 40,
  className,
}: {
  children: ReactNode;
  reverse?: boolean;
  /** Seconds per loop. */
  duration?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("group/marquee flex overflow-hidden mask-fade-x", className)}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <div
        className={cn(
          "flex w-max shrink-0 group-hover/marquee:[animation-play-state:paused]",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
      >
        <div className="flex shrink-0 items-center gap-3 pr-3">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center gap-3 pr-3">
          {children}
        </div>
      </div>
    </div>
  );
}
