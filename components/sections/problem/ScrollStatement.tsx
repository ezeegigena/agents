"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
    </motion.span>
  );
}

/** Statement whose words light up one by one as it scrolls through view. */
export function ScrollStatement({ text, id }: { text: string; id: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");

  return (
    <h2
      ref={ref}
      id={id}
      className="max-w-[22ch] text-[clamp(2.1rem,4.8vw,4.25rem)] leading-[1.04] font-semibold tracking-[-0.045em] text-ink-on-paper"
    >
      {reduced
        ? text
        : words.map((word, i) => (
            <span key={i}>
              <Word
                progress={scrollYProgress}
                range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]}
              >
                {word}
              </Word>{" "}
            </span>
          ))}
    </h2>
  );
}
