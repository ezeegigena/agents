"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CloseChecklist } from "./CloseChecklist";
import { CloseScoreboard } from "./CloseScoreboard";
import { CloseTimeline } from "./CloseTimeline";
import { FILL_EMPTY, FILL_FULL } from "./CloseTrack";
import { AI_CLOSE_END, TIMELINE_END, laneFraction, sequenceEase } from "./geometry";

/** Must match the `lg:motion-safe:[@media(min-height:720px)]` classes below. */
const PINNED_QUERY =
  "(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
/** Seconds the in-view (unpinned) version takes to play. */
const PLAY_DURATION = 6;

const ease = sequenceEase(AI_CLOSE_END, TIMELINE_END);

/** Desktop + motion: a tall scroll track with a sticky, viewport-high stage. */
const pinnedTrack = cn(
  "mt-12 md:mt-16",
  "lg:motion-safe:[@media(min-height:720px)]:mt-0",
  "lg:motion-safe:[@media(min-height:720px)]:h-[280vh]",
);
const pinnedStage = cn(
  "lg:motion-safe:[@media(min-height:720px)]:sticky",
  "lg:motion-safe:[@media(min-height:720px)]:top-0",
  "lg:motion-safe:[@media(min-height:720px)]:flex",
  "lg:motion-safe:[@media(min-height:720px)]:h-screen",
  "lg:motion-safe:[@media(min-height:720px)]:flex-col",
  "lg:motion-safe:[@media(min-height:720px)]:justify-center",
  "lg:motion-safe:[@media(min-height:720px)]:pt-[calc(var(--nav-height)+0.25rem)]",
  "lg:motion-safe:[@media(min-height:720px)]:pb-4",
);

/**
 * The close race. Desktop: the stage sticks for ~180vh while scroll scrubs a
 * GSAP timeline (day cursor + bar fills). Smaller screens play it once in view;
 * reduced motion shows the final state. Discrete UI (counters, checks,
 * checklist) follows the timeline through `day`, quantized to quarter days.
 */
export function CloseSequence() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [day, setDay] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const mm = gsap.matchMedia();
    mm.add(
      { pinned: PINNED_QUERY, reduced: REDUCED_QUERY, any: "all" },
      (context) => {
        const { pinned, reduced } = context.conditions ?? {};
        const cursor = root.querySelector("[data-close-cursor]");
        const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

        root.querySelectorAll<HTMLElement>("[data-close-fill]").forEach((fill) => {
          const start = Number(fill.dataset.start);
          const end = Number(fill.dataset.end);
          tl.fromTo(
            fill,
            { clipPath: FILL_EMPTY },
            { clipPath: FILL_FULL, duration: end - start },
            start,
          );
        });
        tl.fromTo(
          cursor,
          { xPercent: laneFraction(0) * 100 },
          { xPercent: laneFraction(TIMELINE_END) * 100, duration: TIMELINE_END },
          0,
        );

        let last = -1;
        const sync = () => {
          const quantized = Math.floor(tl.time() * 4 + 1e-6) / 4;
          if (quantized === last) return;
          last = quantized;
          setDay(quantized);
        };
        tl.eventCallback("onUpdate", sync);

        if (reduced) {
          tl.progress(1);
          return;
        }

        gsap.set(cursor, { autoAlpha: 1 });
        sync();

        if (pinned) {
          gsap.to(tl, {
            progress: 1,
            ease,
            scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.5 },
          });
          return;
        }

        ScrollTrigger.create({
          trigger: stage,
          start: "top 70%",
          end: "max",
          once: true,
          onEnter: () => {
            gsap.to(tl, { progress: 1, duration: PLAY_DURATION, ease });
          },
        });
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", pinnedTrack)}>
      <div ref={stageRef} className={pinnedStage}>
        <div className="container-page grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:grid-rows-[auto_1fr] xl:grid-cols-[minmax(0,1fr)_21rem]">
          <div className="lg:col-start-2 lg:row-start-1">
            <CloseScoreboard day={day} />
          </div>
          <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <CloseTimeline day={day} />
          </div>
          <div className="lg:col-start-2 lg:row-start-2">
            <CloseChecklist day={day} />
          </div>
        </div>
      </div>
    </div>
  );
}
