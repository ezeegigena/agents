import { MessagesSquare } from "lucide-react";
import { siteConfig } from "@/config/site";
import { faq } from "@/content/faq";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "./FaqAccordion";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-24 md:py-36">
      <div className="container-page grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading id="faq-title" eyebrow={faq.eyebrow} index={faq.index} title={faq.title} lead={faq.lead} />
            <Reveal delay={0.15} className="glass mt-10 hidden rounded-3xl p-6 lg:block">
              <MessagesSquare aria-hidden className="size-6 text-brand-teal" />
              <p className="mt-4 font-display text-xl font-semibold tracking-[-0.03em]">{faq.ctaTitle}</p>
              <p className="mt-2 text-fg-muted">{faq.ctaBody}</p>
              <Button href={siteConfig.bookingAnchor} arrow className="mt-6">
                {siteConfig.cta.primary}
              </Button>
            </Reveal>
          </div>
        </div>
        <Reveal delay={0.1} className="lg:col-span-7">
          <FaqAccordion />
        </Reveal>
        <div className="glass rounded-3xl p-6 lg:hidden">
          <p className="font-display text-xl font-semibold tracking-[-0.03em]">{faq.ctaTitle}</p>
          <p className="mt-2 text-fg-muted">{faq.ctaBody}</p>
          <Button href={siteConfig.bookingAnchor} arrow className="mt-6 w-full">
            {siteConfig.cta.primary}
          </Button>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </section>
  );
}
