import { Check, Video } from "lucide-react";
import { calConfig } from "@/config/site";
import { booking } from "@/content/booking";
import { Glow } from "@/components/ui/Glow";
import { GradientText } from "@/components/ui/GradientText";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookingFallback } from "./BookingFallback";
import { CalEmbed } from "./CalEmbed";
import { PreQualificationForm } from "./PreQualificationForm";

export function Booking() {
  return (
    <section id="book" aria-labelledby="book-title" className="relative overflow-hidden py-24 md:py-36">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Glow color="#9d6bff" size={900} opacity={0.28} className="top-[10%] left-[45%]" />
        <Glow color="#4c7dff" size={700} opacity={0.22} className="-top-40 -left-40" />
        <Glow color="#1fe0b5" size={600} opacity={0.14} className="right-[-10%] bottom-[-20%]" />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_60%_50%,#000,transparent_75%)] opacity-60" />
      </div>

      <div className="container-page">
        <SectionHeading
          id="book-title"
          eyebrow={booking.eyebrow}
          index={booking.index}
          title={
            <>
              {booking.title} <GradientText>{booking.titleHighlight}</GradientText>
            </>
          }
          lead={booking.lead}
        />

        <div className="mt-12 grid grid-cols-1 gap-14 md:mt-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <ul className="flex flex-wrap gap-2">
                {booking.assurances.map((item) => (
                  <li key={item} className="glass flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm text-fg">
                    <Check aria-hidden className="size-3.5 text-brand-teal" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2} className="mt-10">
              <h3 className="eyebrow text-fg-subtle">{booking.audienceLabel}</h3>
              <p className="mt-3 text-fg-muted">{booking.audience}</p>
            </Reveal>

            <div className="mt-10">
              <h3 className="eyebrow text-fg-subtle">{booking.agendaLabel}</h3>
              <Stagger as="ol" className="relative mt-5 space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-gradient-to-b before:from-brand-blue before:via-brand-violet before:to-brand-teal">
                {booking.agenda.map((step) => (
                  <StaggerItem as="li" key={step.time} className="relative pl-8">
                    <span aria-hidden className="absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-ink-950 bg-brand-violet ring-1 ring-brand-violet/50" />
                    <p className="font-mono text-xs text-brand-teal">{step.time}</p>
                    <p className="mt-1 font-medium text-fg">{step.title}</p>
                    <p className="text-fg-muted">{step.body}</p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <PreQualificationForm />
          </div>

          <Reveal delay={0.1} y={40} className="lg:col-span-7">
            <div className="gradient-border relative overflow-hidden rounded-[2rem] bg-ink-900/85 shadow-[0_50px_120px_-40px_rgba(109,58,237,0.55)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-line px-5 py-4 md:px-6">
                <div className="flex items-center gap-3">
                  <span aria-hidden className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-white/15" />
                    <span className="size-2.5 rounded-full bg-white/15" />
                    <span className="size-2.5 rounded-full bg-white/15" />
                  </span>
                  <p className="text-sm font-medium text-fg">{booking.embedTitle}</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-fg-muted">
                  <Video aria-hidden className="size-3.5" />
                  30 min
                </span>
              </div>
              <div className={calConfig.enabled ? "relative h-[720px] md:h-[660px]" : "relative h-[540px] md:h-[600px]"}>
                {calConfig.enabled ? <CalEmbed /> : <BookingFallback />}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
