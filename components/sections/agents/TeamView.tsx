"use client";

import { motion, useMotionValueEvent, useScroll, useTransform, type Variants } from "motion/react";
import { useRef, useState, type RefObject } from "react";
import { agents, type AgentId } from "@/content/agents";
import { AgentCard } from "./AgentCard";
import { EASE_OUT_EXPO, type OpenAgent } from "./shared";

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const itemVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: reduced ? "none" : "blur(0px)",
    transition: { duration: reduced ? 0.4 : 0.85, ease: EASE_OUT_EXPO },
    transitionEnd: { filter: "none" },
  },
});

/** 4×2 grid on desktop, 2 columns on tablet, snap carousel on phones. */
export function TeamView({
  onOpen,
  originId,
  reduced,
}: {
  onOpen: OpenAgent;
  originId: AgentId | null;
  reduced: boolean;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const item = itemVariants(reduced);

  return (
    <div>
      <motion.ul
        ref={scrollerRef}
        layoutScroll
        variants={list}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pt-2 pb-8 [scrollbar-width:none] md:mx-0 md:-mb-5 md:grid md:grid-cols-2 md:gap-x-5 md:gap-y-0 md:overflow-visible md:p-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
      >
        {agents.map((agent) => (
          <motion.li
            key={agent.id}
            variants={item}
            className="w-[82vw] max-w-[22rem] shrink-0 snap-start md:row-span-5 md:grid md:w-auto md:max-w-none md:grid-rows-subgrid md:pb-5"
          >
            <AgentCard
              agent={agent}
              onOpen={onOpen}
              isOrigin={originId === agent.id}
              reduced={reduced}
            />
          </motion.li>
        ))}
      </motion.ul>
      <CarouselProgress scrollerRef={scrollerRef} />
    </div>
  );
}

/** Phone-only: "03 / 08 · Budget Analyst" + a filling progress bar. */
function CarouselProgress({ scrollerRef }: { scrollerRef: RefObject<HTMLUListElement | null> }) {
  const { scrollXProgress } = useScroll({ container: scrollerRef });
  const fill = useTransform(scrollXProgress, [0, 1], [1 / agents.length, 1]);
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollXProgress, "change", (p) => {
    setActive(Math.round(p * (agents.length - 1)));
  });

  const agent = agents[active];

  return (
    <div aria-hidden className="flex items-center gap-4 md:hidden">
      <span className="eyebrow tabular shrink-0 text-fg-muted">
        <span className="text-fg">{String(active + 1).padStart(2, "0")}</span> /{" "}
        {String(agents.length).padStart(2, "0")}
      </span>
      <span className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <motion.span
          style={{ scaleX: fill }}
          className="absolute inset-0 origin-left rounded-full bg-brand-gradient"
        />
      </span>
      <span
        className="eyebrow shrink-0 text-[0.6875rem] transition-colors duration-300"
        style={{ color: agent.accent }}
      >
        {agent.short}
      </span>
    </div>
  );
}
