"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const CalEmbed = dynamic(() => import("./CalEmbed").then((m) => m.CalEmbed), { ssr: false });

/** Sits behind the embed until the cal.com iframe paints over it. */
function EmbedSkeleton() {
  return (
    <div aria-hidden className="absolute inset-0 grid animate-pulse grid-cols-7 content-center gap-2 p-8 opacity-40">
      {Array.from({ length: 35 }, (_, i) => (
        <span key={i} className="aspect-square rounded-xl bg-white/[0.06]" />
      ))}
    </div>
  );
}

/**
 * Loads the cal.com embed (script + iframe) only when the booking section
 * approaches the viewport, keeping it off the initial page load.
 */
export function LazyCalEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "1200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative size-full">
      <EmbedSkeleton />
      {visible && <CalEmbed />}
    </div>
  );
}
