import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Glow } from "@/components/ui/Glow";

/** Shared shell for the placeholder legal pages. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <article className="relative overflow-hidden pt-40 pb-28">
      <Glow color="#4c7dff" className="-top-40 -left-40" opacity={0.25} />
      <Glow color="#9d6bff" className="-top-20 right-[-15%]" opacity={0.2} />
      <div className="container-page relative max-w-3xl">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-5 text-5xl font-semibold tracking-[-0.045em] md:text-6xl">{title}</h1>
        <p className="mt-4 text-sm text-fg-subtle">Last updated: {updated}</p>
        <div className="mt-6 rounded-2xl border border-warning/30 bg-warning/[0.06] px-5 py-4 text-sm text-warning">
          [PLACEHOLDER] This page is a template. Replace it with legal copy reviewed by your
          counsel before launch.
        </div>
        <div className="mt-12 space-y-10 text-fg-muted [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-0.03em] [&_h2]:text-fg [&_p]:mt-3 [&_p]:leading-relaxed">
          {children}
        </div>
      </div>
    </article>
  );
}
