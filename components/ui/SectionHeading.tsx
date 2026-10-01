import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  index?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  /** Heading id for aria-labelledby on the parent section. */
  id?: string;
};

export function SectionHeading({
  eyebrow,
  index,
  title,
  lead,
  align = "left",
  tone = "dark",
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Reveal>
        <Eyebrow index={index} tone={tone}>
          {eyebrow}
        </Eyebrow>
      </Reveal>
      <Reveal delay={0.06}>
        <h2
          id={id}
          className={cn(
            "max-w-[18ch] text-[clamp(2.25rem,4.6vw,4rem)] leading-[0.98] font-semibold tracking-[-0.045em]",
            tone === "dark" ? "text-fg" : "text-ink-on-paper",
            align === "center" && "mx-auto",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "max-w-[60ch] text-lg leading-relaxed md:text-xl",
              tone === "dark" ? "text-fg-muted" : "text-muted-on-paper",
              align === "center" && "mx-auto",
            )}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}
