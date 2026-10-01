import Link from "next/link";
import { siteConfig } from "@/config/site";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  const linkClass =
    "text-fg-muted transition-colors duration-300 hover:text-fg";

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-950">
      <div className="container-page relative z-10 grid gap-12 pt-20 pb-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-sm text-fg-muted">{siteConfig.tagline}</p>
          <p className="mt-2 max-w-sm text-sm text-fg-subtle">
            AI finance agents for US businesses.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
          <div>
            <h2 className="eyebrow text-fg-subtle">Explore</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <AnchorLink hash={item.href} className={linkClass}>
                    {item.label}
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-fg-subtle">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <AnchorLink hash={siteConfig.bookingAnchor} className={linkClass}>
                  {siteConfig.cta.short}
                </AnchorLink>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contactEmail}`} className={linkClass}>
                  {siteConfig.contactEmail}
                </a>
              </li>
              {siteConfig.socials
                .filter((s) => s.href)
                .map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {s.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-fg-subtle">Legal</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {siteConfig.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="flex flex-col justify-between gap-3 border-t border-line pt-6 text-xs text-fg-subtle sm:flex-row md:col-span-12">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Product names shown are trademarks of their respective owners.</p>
        </div>
      </div>

      <p
        aria-hidden
        className="pointer-events-none relative -mb-[0.22em] text-center font-display text-[clamp(2.75rem,12.6vw,12rem)] leading-none font-bold tracking-[-0.06em] whitespace-nowrap select-none"
      >
        <span className="bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text text-transparent">
          {siteConfig.name}
        </span>
      </p>
    </footer>
  );
}
