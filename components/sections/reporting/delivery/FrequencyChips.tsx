import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { reportingContent } from "@/content/reporting";
import { useInViewport } from "@/lib/hooks/useInView";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";

const { frequencies } = reportingContent.delivery;
const STEP_MS = 2400;

/** Daily / Weekly / Monthly chips lighting up in sequence (decorative loop). */
export function FrequencyChips() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(1);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % frequencies.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  return (
    <div ref={ref}>
      <ul className="flex max-w-md gap-1.5 rounded-full border border-line bg-white/[0.025] p-1 xl:max-w-none">
        {frequencies.map((f, i) => (
          <li
            key={f.label}
            className={cn(
              "relative flex-1 rounded-full px-3 py-1.5 text-center text-[13px] font-medium transition-colors duration-300",
              i === active ? "text-fg" : "text-fg-muted",
            )}
          >
            {i === active && (
              <motion.span
                layoutId="report-frequency"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full border border-brand-teal/30 bg-brand-teal/[0.12] shadow-[0_0_24px_-6px_rgb(31_224_181/0.55)]"
              />
            )}
            <span className="relative">{f.label}</span>
          </li>
        ))}
      </ul>
      <div className="relative mt-2.5 h-5 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="truncate font-mono text-[11.5px] text-fg-muted"
          >
            {frequencies[active].detail}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
