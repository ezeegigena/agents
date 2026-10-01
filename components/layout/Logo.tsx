import { cn } from "@/lib/cn";
import { siteConfig } from "@/config/site";

/** Brand mark: gradient tile with a check that doubles as a rising line. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={cn("size-8 shrink-0", className)}
    >
      <defs>
        <linearGradient id="yfd-mark" x1="0" y1="32" x2="32" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4c7dff" />
          <stop offset="0.5" stopColor="#9d6bff" />
          <stop offset="1" stopColor="#1fe0b5" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#yfd-mark)" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="8.5" fill="none" stroke="white" strokeOpacity="0.25" />
      <path
        d="M8.5 17.2 13.4 22 23.5 10.5"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23.5" cy="10.5" r="2.2" fill="white" />
    </svg>
  );
}

/** Mark + wordmark. "done" is set in the brand gradient. */
export function Logo({ className }: { className?: string }) {
  const name = siteConfig.name;
  const splitAt = name.endsWith("done") ? name.length - 4 : name.length;
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-[1.15rem] font-semibold tracking-[-0.04em] text-fg">
        {name.slice(0, splitAt)}
        <span className="text-gradient">{name.slice(splitAt)}</span>
      </span>
    </span>
  );
}
