"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
  as?: "div" | "li" | "section" | "article" | "span" | "p";
};

/** Scroll-triggered fade/slide/de-blur, once. */
export function Reveal({ children, className, delay = 0, y = 24, as = "div" }: RevealProps) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Component>
  );
}

const container: Variants = {
  hidden: {},
  show: (stagger: number = 0.07) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.05 },
  }),
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE },
  },
};

/** Parent that staggers its <StaggerItem> children into view. */
export function Stagger({
  children,
  className,
  stagger = 0.07,
  as = "div",
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol" | "dl";
  amount?: number;
}) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={container}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Component = motion[as];
  return (
    <Component className={className} variants={staggerItem}>
      {children}
    </Component>
  );
}
