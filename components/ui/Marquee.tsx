import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Infinite CSS marquee. Content is duplicated once for a seamless loop;
 * the duplicate is hidden from assistive tech. Pauses on hover. With reduced
 * motion it becomes a static, centered, wrapping row.
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
      className={cn("group/marquee flex overflow-hidden mask-fade-x motion-reduce:[mask-image:none]", className)}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <div
        className={cn(
          "flex w-max shrink-0 group-hover/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
      >
        <div className="flex shrink-0 items-center gap-3 pr-3 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0">
          {children}
        </div>
        <div aria-hidden className="flex shrink-0 items-center gap-3 pr-3 motion-reduce:hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
