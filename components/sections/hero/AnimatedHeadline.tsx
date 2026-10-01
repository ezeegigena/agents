import type { CSSProperties } from "react";

const STAGGER = 0.07;

/**
 * Word-by-word masked rise, driven by CSS so it starts at first paint
 * (no JS needed — keeps the headline fast as the LCP element).
 */
export function AnimatedHeadline({
  plain,
  highlight,
  id,
}: {
  plain: string;
  highlight: string;
  id: string;
}) {
  const plainWords = plain.split(" ");
  const highlightWords = highlight.split(" ");

  const word = (text: string, index: number, style?: CSSProperties) => (
    <span key={index} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
      <span
        className="inline-block animate-word-rise"
        style={{ animationDelay: `${0.1 + index * STAGGER}s`, ...style }}
      >
        {text}
      </span>
    </span>
  );

  return (
    <h1
      id={id}
      className="max-w-[7.6em] text-[clamp(3.1rem,6.9vw,6.6rem)] leading-[0.94] font-semibold tracking-[-0.05em] text-fg"
    >
      <span className="sr-only">
        {plain} {highlight}
      </span>
      <span aria-hidden>
        {plainWords.map((w, i) => (
          <span key={i}>
            {word(w, i)}{" "}
          </span>
        ))}
        {highlightWords.map((w, i) => (
          <span key={`h${i}`}>
            {word(w, plainWords.length + i, {
              backgroundImage: "var(--brand-gradient)",
              backgroundSize: `${highlightWords.length * 100}% 100%`,
              backgroundPosition: `${highlightWords.length > 1 ? (i / (highlightWords.length - 1)) * 100 : 0}% 50%`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            })}
            {i < highlightWords.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </h1>
  );
}
