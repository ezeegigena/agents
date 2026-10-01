import { siteConfig } from "@/config/site";
import { closeContent } from "@/content/close";
import { Button } from "@/components/ui/Button";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";

const { outcomes, ctaNote } = closeContent;

/** Three qualitative outcomes + a secondary booking CTA. */
export function CloseOutcomes() {
  return (
    <div className="container-page mt-14 md:mt-20">
      <Stagger as="ul" className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
        {outcomes.map(({ icon: Icon, title, body }) => (
          <StaggerItem as="li" key={title} className="relative bg-ink-950/90 p-6 md:p-7">
            <span className="grid size-10 place-items-center rounded-xl border border-brand-violet/25 bg-brand-violet/10 text-brand-violet">
              <Icon aria-hidden className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-fg">{title}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-muted">{body}</p>
          </StaggerItem>
        ))}
      </Stagger>
      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-fg-muted">{ctaNote}</p>
        <Button href={siteConfig.bookingAnchor} variant="secondary" arrow>
          {siteConfig.cta.primary}
        </Button>
      </div>
    </div>
  );
}
