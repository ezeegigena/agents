import { Hash } from "lucide-react";
import { reportingContent } from "@/content/reporting";
import { LogoMark } from "@/components/layout/Logo";
import { Sparkline } from "../charts/Sparkline";

const { slack } = reportingContent.delivery;

/** Generic chat-app message: the weekly P&L posted to #finance. */
export function SlackMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-ink-900/80">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5 text-[13px] font-semibold text-fg">
        <Hash aria-hidden className="size-3.5 text-fg-muted" />
        {slack.channel}
      </div>
      <div className="flex gap-3 p-4">
        <LogoMark className="size-9 rounded-lg" />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-1.5 text-[13px]">
            <span className="font-semibold text-fg">{slack.app}</span>
            <span className="rounded bg-white/10 px-1 py-px text-[9.5px] font-semibold tracking-wide text-fg-muted uppercase">
              {slack.appTag}
            </span>
            <span className="font-mono text-[11px] text-fg-muted">{slack.time}</span>
          </p>
          <p className="mt-0.5 text-[13px] leading-snug text-fg-muted">{slack.message}</p>
          <div className="relative mt-2.5 overflow-hidden rounded-lg border border-line bg-white/[0.025] py-2.5 pr-3 pl-4">
            <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-brand-gradient" />
            <p className="text-[12.5px] font-semibold text-fg">{slack.card.title}</p>
            <dl className="mt-2 grid grid-cols-3 gap-2">
              {slack.card.metrics.map((metric) => (
                <div key={metric.label} className="min-w-0">
                  <dt className="truncate text-[10.5px] text-fg-muted">{metric.label}</dt>
                  <dd className="font-mono text-[13px] font-medium text-fg tabular">{metric.value}</dd>
                </div>
              ))}
            </dl>
            <Sparkline values={slack.card.trend} className="mt-2 h-6" />
            <p className="mt-1.5 text-[12px] font-medium text-brand-teal">{slack.card.link} →</p>
          </div>
        </div>
      </div>
    </div>
  );
}
