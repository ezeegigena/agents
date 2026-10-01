import { Check } from "lucide-react";
import { siteConfig } from "@/config/site";
import { hero } from "@/content/hero";
import { Button } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Glow";
import { AnimatedHeadline } from "./AnimatedHeadline";
import { HeroCards } from "./HeroCards";
import { HeroVisual } from "./HeroVisual";
import { OrbitFallback } from "./OrbitFallback";
import { TeamStrip } from "./TeamStrip";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Background: gradient mesh + masked grid */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Glow color="#4c7dff" size={720} opacity={0.32} className="-top-[30%] -left-[18%]" />
        <Glow color="#9d6bff" size={820} opacity={0.3} className="top-[0%] right-[-22%]" />
        <Glow color="#1fe0b5" size={560} opacity={0.18} className="right-[8%] bottom-[-20%]" />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_70%_45%,#000_20%,transparent_75%)] opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className="container-page relative grid min-h-[100svh] items-center gap-6 pt-28 pb-12 lg:grid-cols-12 lg:pt-32 lg:pb-20">
        <div className="relative z-10 lg:col-span-8">
          <p className="glass inline-flex animate-fade-up items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 text-[13px] text-fg-muted">
            <span className="rounded-full bg-brand-gradient px-2 py-0.5 text-[11px] font-semibold text-ink-950">
              New
            </span>
            {hero.eyebrow}
          </p>

          <div className="mt-7">
            <AnimatedHeadline id="hero-title" {...hero.headline} />
          </div>

          <p
            className="mt-7 max-w-[34rem] animate-fade-up text-lg leading-relaxed text-fg-muted md:text-xl"
            style={{ animationDelay: "0.55s" }}
          >
            {hero.subheadline}
          </p>

          <div
            className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "0.7s" }}
          >
            <Button href={siteConfig.bookingAnchor} size="lg" arrow>
              {siteConfig.cta.primary}
            </Button>
            <Button href="#agents" size="lg" variant="secondary">
              {siteConfig.cta.secondary}
            </Button>
          </div>

          <ul
            className="mt-7 flex animate-fade-up flex-wrap gap-x-5 gap-y-2 text-sm text-fg-subtle"
            style={{ animationDelay: "0.85s" }}
          >
            {hero.microcopy.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check aria-hidden className="size-3.5 text-brand-teal" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual: WebGL on capable desktops, CSS orbit everywhere else */}
        <div className="relative mx-auto w-full max-w-[520px] lg:absolute lg:top-1/2 lg:right-[-4%] lg:mx-0 lg:w-[50vw] lg:max-w-none lg:-translate-y-[46%] xl:right-[-9%] xl:w-[min(52vw,800px)]">
          <div className="lg:hidden">
            <OrbitFallback />
          </div>
          <div className="hidden lg:block">
            <HeroVisual />
          </div>
          <div className="hidden sm:block">
            <HeroCards />
          </div>
        </div>
      </div>

      <TeamStrip />
    </section>
  );
}
