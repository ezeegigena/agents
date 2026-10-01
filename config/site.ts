/**
 * Global brand + site settings.
 * Edit this file to change the brand name, navigation, CTA labels, contact
 * details and SEO defaults. Section copy lives in `/content`.
 */

export const siteConfig = {
  name: "yourfinancedone",
  /** Short line used in the footer, OG image and metadata. */
  tagline: "Automate your complete finance team.",
  description:
    "yourfinancedone builds AI agents that do the work of your bookkeeper, AP/AR analyst, FP&A analyst, controller and CFO — 24/7, at a fraction of the cost of a new hire. Built for US businesses.",
  /** Public URL of the deployed site (used for canonical URLs, sitemap, OG). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  keywords: [
    "AI finance automation",
    "AI bookkeeper",
    "AI accounting agents",
    "automated month-end close",
    "AI FP&A",
    "fractional CFO AI",
    "finance automation for small business",
  ],

  /** Anchor navigation (ids must match the section ids on the home page). */
  nav: [
    { label: "Agents", href: "#agents" },
    { label: "Live demo", href: "#demo" },
    { label: "Close", href: "#close" },
    { label: "Reporting", href: "#reporting" },
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],

  /** Every primary CTA scrolls to this section id. */
  bookingAnchor: "#book",
  cta: {
    primary: "Book a free 30-min call",
    short: "Book a call",
    secondary: "Meet the agents",
  },

  // TODO: replace with your real contact email.
  contactEmail: "hello@yourfinancedone.com",
  // TODO: replace with your real social profiles (set href to "" to hide one).
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "X", href: "https://x.com/" },
  ],

  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;

/**
 * Self-hosted cal.com settings, read from env vars at build time.
 * NEXT_PUBLIC_CALCOM_URL   e.g. https://cal.yourdomain.com
 * NEXT_PUBLIC_CALCOM_EVENT e.g. yourname/30min  or  team/finance/discovery
 */
export const calConfig = (() => {
  const origin = process.env.NEXT_PUBLIC_CALCOM_URL?.replace(/\/+$/, "") ?? "";
  const event = process.env.NEXT_PUBLIC_CALCOM_EVENT?.replace(/^\/+/, "") ?? "";
  return {
    origin,
    event,
    embedJsUrl: origin ? `${origin}/embed/embed.js` : "",
    enabled: Boolean(origin && event),
  };
})();
