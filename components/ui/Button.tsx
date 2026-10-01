"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { scrollToHash } from "@/lib/scroll";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
  /** Show a trailing arrow that nudges on hover. */
  arrow?: boolean;
  children: ReactNode;
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-[0.95rem] gap-2",
  lg: "h-14 px-7 text-base gap-2.5",
};

const variants: Record<Variant, string> = {
  primary:
    "text-white [background-image:var(--cta-gradient)] bg-[length:200%_100%] bg-left hover:bg-right shadow-[0_12px_40px_-12px_rgba(109,58,237,0.85),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_16px_50px_-10px_rgba(109,58,237,0.95),0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.3)]",
  secondary:
    "glass text-fg hover:bg-white/[0.08] hover:border-line-strong",
  ghost: "text-fg-muted hover:text-fg",
  dark: "bg-ink-950 text-white hover:bg-ink-800 shadow-[0_12px_30px_-12px_rgba(6,8,20,0.6)]",
};

/**
 * Link styled as a button. In-page anchors ("#book") use Lenis-aware smooth
 * scrolling; everything still works as a plain link without JS.
 */
export function Button({
  href,
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || !href.startsWith("#")) return;
    if (scrollToHash(href)) event.preventDefault();
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "group relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium tracking-[-0.01em] whitespace-nowrap",
        "transition-[background-position,box-shadow,background-color,border-color,color,transform] duration-500 ease-out-expo active:scale-[0.98]",
        sizes[size],
        variants[variant],
        className,
      )}
      {...rest}
    >
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
      )}
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
        />
      )}
    </a>
  );
}
