import { CalendarClock, ChevronLeft, ChevronRight, Clock, Mail, Video } from "lucide-react";
import { siteConfig } from "@/config/site";
import { booking } from "@/content/booking";
import { LogoMark } from "@/components/layout/Logo";
import { cn } from "@/lib/cn";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// A sample 31-day month grid starting on a Thursday.
const LEADING_BLANKS = 4;
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const SELECTED_DAY = 14;
const isAvailable = (day: number) => {
  const weekday = (LEADING_BLANKS + day - 1) % 7;
  return weekday > 0 && weekday < 6 && day >= 6 && day % 4 !== 0;
};

/**
 * Shown when NEXT_PUBLIC_CALCOM_URL / NEXT_PUBLIC_CALCOM_EVENT are not set:
 * a decorative mock booker plus a working email fallback.
 */
export function BookingFallback() {
  const { fallback } = booking;
  return (
    <div className="relative size-full">
      <div aria-hidden className="flex size-full flex-col gap-6 p-5 opacity-55 blur-[1px] select-none md:p-8">
        <div className="flex items-center gap-3 border-b border-line pb-5">
          <LogoMark className="size-9" />
          <div>
            <p className="text-xs text-fg-muted">{siteConfig.name}</p>
            <p className="font-medium text-fg">30-min qualification call</p>
          </div>
          <div className="ml-auto hidden gap-4 text-xs text-fg-muted sm:flex">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" /> 30 min
            </span>
            <span className="flex items-center gap-1.5">
              <Video className="size-3.5" /> Video call
            </span>
          </div>
        </div>

        <div className="grid flex-1 gap-6 md:grid-cols-[1.45fr_1fr]">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-fg-subtle">{fallback.sampleMonth}</p>
              <span className="flex gap-2 text-fg-muted">
                <ChevronLeft className="size-4" />
                <ChevronRight className="size-4" />
              </span>
            </div>
            <div className="mt-4 grid flex-1 grid-cols-7 content-start gap-1.5 text-center">
              {WEEKDAYS.map((d) => (
                <span key={d} className="pb-1 text-[11px] text-fg-subtle uppercase">
                  {d}
                </span>
              ))}
              {Array.from({ length: LEADING_BLANKS }, (_, i) => (
                <span key={`b${i}`} />
              ))}
              {DAYS.map((day) => (
                <span
                  key={day}
                  className={cn(
                    "grid aspect-square place-items-center rounded-xl font-mono text-xs md:text-sm",
                    day === SELECTED_DAY
                      ? "bg-brand-gradient font-semibold text-ink-950"
                      : isAvailable(day)
                        ? "bg-white/[0.07] text-fg ring-1 ring-white/10"
                        : "text-fg-subtle/60",
                  )}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden flex-col gap-2.5 md:flex">
            <p className="pb-2 text-sm text-fg-muted">Available times</p>
            {fallback.slots.map((slot, i) => (
              <span
                key={slot}
                className={cn(
                  "rounded-xl border px-4 py-3 text-center font-mono text-sm",
                  i === 1 ? "border-brand-violet bg-brand-violet/15 text-fg" : "border-line-strong text-fg",
                )}
              >
                {slot}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 grid place-items-center bg-ink-950/30 p-6">
        <div className="glass-strong max-w-sm rounded-3xl p-7 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand-violet/15 text-brand-violet">
            <CalendarClock aria-hidden className="size-6" />
          </span>
          <p className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em] text-fg">{fallback.title}</p>
          <p className="mt-2 text-fg-muted">{fallback.body}</p>
          <a
            href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent("30-min qualification call")}`}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-ink-950 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <Mail aria-hidden className="size-4" />
            {fallback.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
