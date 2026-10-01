import { CheckCheck, CalendarCheck2, TrendingUp } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { hero } from "@/content/hero";
import { cn } from "@/lib/cn";

function FloatingCard({
  children,
  className,
  delay,
  floatDelay,
}: {
  children: ReactNode;
  className?: string;
  delay: number;
  floatDelay: number;
}) {
  return (
    <div
      className={cn("absolute z-20 animate-fade-up", className)}
      style={{ animationDelay: `${delay}s` } as CSSProperties}
    >
      <div
        className="glass-strong w-[13rem] animate-float rounded-2xl p-3.5 xl:w-[14rem] xl:p-4"
        style={{ animationDelay: `${floatDelay}s` }}
      >
        {children}
      </div>
    </div>
  );
}

function CardHeader({ icon, title, accent }: { icon: ReactNode; title: string; accent: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="grid size-6 place-items-center rounded-lg"
        style={{ background: `color-mix(in oklab, ${accent} 18%, transparent)`, color: accent }}
      >
        {icon}
      </span>
      <span className="text-xs font-medium whitespace-nowrap text-fg-muted">{title}</span>
    </div>
  );
}

function Sparkline({ series }: { series: number[] }) {
  const w = 180;
  const h = 44;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const pts = series.map((v, i) => [
    (i / (series.length - 1)) * w,
    h - 4 - ((v - min) / (max - min)) * (h - 8),
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-11 w-full" aria-hidden>
      <defs>
        <linearGradient id="hero-spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c7dff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#4c7dff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-spark-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4c7dff" />
          <stop offset="1" stopColor="#1fe0b5" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w} ${h} L0 ${h} Z`} fill="url(#hero-spark-fill)" />
      <path
        d={line}
        fill="none"
        stroke="url(#hero-spark-line)"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        className="[animation:hero-draw_1.8s_var(--ease-out-expo)_1.6s_both]"
      />
      <circle cx={pts.at(-1)![0]} cy={pts.at(-1)![1]} r="3" fill="#1fe0b5" />
    </svg>
  );
}

/** Illustrative product UI floating around the hero visual. */
export function HeroCards() {
  const { reconciliation, close, forecast } = hero.cards;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <FloatingCard className="top-[6%] left-[0%] lg:top-[8%] lg:left-[4%] xl:left-[10%]" delay={1.1} floatDelay={0}>
        <div className="flex items-center justify-between">
          <CardHeader icon={<CheckCheck className="size-3.5" />} title={reconciliation.title} accent="#1FE0B5" />
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
            {reconciliation.status}
          </span>
        </div>
        <p className="mt-3 font-mono text-2xl font-medium tracking-tight text-fg tabular">
          {reconciliation.value}
        </p>
        <p className="text-xs text-fg-muted">{reconciliation.caption}</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full origin-left animate-fill-x rounded-full bg-gradient-to-r from-brand-teal/70 to-brand-teal"
            style={{ animationDelay: "1.5s" }}
          />
        </div>
      </FloatingCard>

      <FloatingCard className="top-[40%] right-[0%] lg:hidden xl:block xl:top-[38%] xl:right-[9%]" delay={1.3} floatDelay={1.6}>
        <CardHeader icon={<CalendarCheck2 className="size-3.5" />} title={close.title} accent="#9D6BFF" />
        <p className="mt-3 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tracking-tight text-fg">{close.value}</span>
          <span className="text-xs text-fg-muted">{close.caption}</span>
        </p>
        <ol className="mt-3 grid grid-cols-4 gap-1.5">
          {close.steps.map((step, i) => {
            const done = i < close.completed;
            return (
              <li key={step} className="flex flex-col gap-1.5">
                <span
                  className={cn(
                    "h-1.5 rounded-full",
                    done ? "bg-brand-violet" : "animate-pulse bg-brand-violet/30",
                  )}
                />
                <span className="text-[9px] text-fg-subtle">{step}</span>
              </li>
            );
          })}
        </ol>
      </FloatingCard>

      <FloatingCard className="bottom-[4%] left-[6%] lg:bottom-[6%] lg:left-[38%] xl:bottom-[10%] xl:left-[34%]" delay={1.5} floatDelay={3.1}>
        <div className="flex items-center justify-between">
          <CardHeader icon={<TrendingUp className="size-3.5" />} title={forecast.title} accent="#4C7DFF" />
          <span className="text-[10px] font-medium text-brand-teal">{forecast.value}</span>
        </div>
        <Sparkline series={forecast.series} />
        <p className="mt-1 text-xs text-fg-muted">{forecast.caption}</p>
      </FloatingCard>
    </div>
  );
}
