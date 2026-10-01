# yourfinancedone — marketing site

Landing page for **yourfinancedone**: AI agents that do the work of a finance team (bookkeeping, AP/AR, FP&A, close, reporting) for US businesses. The page has one job: get qualified visitors to **book a 30-minute call** (self-hosted cal.com embed).

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Motion (Framer Motion) · GSAP + ScrollTrigger · Lenis · React Three Fiber / three.js · lucide-react · `@calcom/embed-react` · Vitest.

---

## 1. Run it locally

Requirements: **Node.js 20.9+** and npm.

```bash
npm install
cp .env.example .env.local   # optional — see "Connect cal.com" below
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest — checks the demo's 3-statement model ties out (A = L + E, cash reconciles) |

---

## 2. Edit content (no component changes needed)

All copy and data live in typed files. Edit, save, and the page updates.

| What | File |
| --- | --- |
| Brand name, tagline, SEO description, nav links, CTA labels, contact email, socials, legal links | `config/site.ts` |
| Hero headline, subheadline, floating UI cards | `content/hero.ts` |
| Problem → Solution statement, pain points, before/after slider | `content/problem.ts` |
| **The 8 AI agents** — names, roles, descriptions, tasks, colors, icons, org chart (`reportsTo`) and handoffs | `content/agents.ts` |
| Live 3-statement demo — fictional company, months, drivers, transactions | `content/demo.ts` (engine: `lib/three-statement.ts`) |
| Close timeline (traditional vs AI-assisted), checklist, outcomes | `content/close.ts` |
| Automated reporting — reports, chart data, delivery mocks | `content/reporting.ts` |
| AI agent vs. new hire table + footnote | `content/comparison.ts` |
| How it works steps | `content/process.ts` |
| Integrations marquee | `content/integrations.ts` |
| Results / testimonials (**placeholders**) | `content/testimonials.ts` |
| FAQ (also emitted as FAQPage structured data) | `content/faq.ts` |
| Booking section copy + fallback | `content/booking.ts` |

**Brand name:** change `name` in `config/site.ts`. The logo wordmark sets the last word "done" in the gradient automatically when the name ends with "done". The OG image (`app/opengraph-image.tsx`) and favicon (`app/icon.svg`) are generated from code.

**Colors, fonts, easing:** design tokens live at the top of `app/globals.css` (`@theme { … }`):
- `--color-ink-*` (dark base), `--color-fg*` (text), `--color-paper*` (light sections)
- `--color-brand-blue | violet | teal` and the `--brand-gradient` / `--cta-gradient` CSS variables
- `--ease-out-expo`, radii, keyframe animations

Every Tailwind utility (`bg-ink-950`, `text-brand-teal`, …) updates from these. Each agent's accent color is set per agent in `content/agents.ts`. The hero 3D scene reads its brand colors from `components/three/financeBrain.ts`.

**Fonts:** `app/layout.tsx` (Bricolage Grotesque for display, Geist for body, Geist Mono for numbers) via `next/font/google`, self-hosted at build time.

---

## 3. Connect your self-hosted cal.com

The booking section (`#book`) renders the `@calcom/embed-react` inline embed when both env vars are set. Otherwise it shows a styled "Booking coming soon" fallback with an email link, so the page never looks broken.

1. In your cal.com instance, create a **30-minute event type** (e.g. "Qualification call").
2. Set the env vars (`.env.local` locally, project settings on your host):

   ```bash
   NEXT_PUBLIC_CALCOM_URL=https://cal.yourdomain.com   # base URL of your instance, no trailing slash
   NEXT_PUBLIC_CALCOM_EVENT=yourname/30min             # the event path after the base URL
   ```

   Team events work too: `NEXT_PUBLIC_CALCOM_EVENT=team/finance/qualification`.
3. The embed script is loaded from `${NEXT_PUBLIC_CALCOM_URL}/embed/embed.js` and the booker from the same origin. Make sure:
   - your instance is publicly reachable over HTTPS and serves `/embed/embed.js` (standard on self-hosted cal.com);
   - its `NEXT_PUBLIC_WEBAPP_URL` matches the URL above;
   - no `X-Frame-Options: DENY` / restrictive `frame-ancestors` header is added by your reverse proxy — the booker loads in an iframe on your marketing domain.
4. Rebuild/redeploy — `NEXT_PUBLIC_*` vars are inlined at build time.

Theme/brand color of the embed: `components/sections/booking/CalEmbed.tsx` (`cssVarsPerTheme`, `layout`).

**Pre-qualification form:** a clearly marked `TODO` stub lives in `components/sections/booking/PreQualificationForm.tsx` (company size, revenue range, current tools, biggest pain point). It renders a dashed placeholder in development only and nothing in production. Answers can later be passed to cal.com as prefill/metadata through the `config` prop of `<Cal />`.

Every CTA on the page (`siteConfig.bookingAnchor`, `#book`) smooth-scrolls to this section.

---

## 4. Deploy (Vercel)

1. Push this repo to GitHub and **Import Project** on [vercel.com](https://vercel.com/new) — the Next.js preset needs no changes.
2. Add environment variables (Production + Preview):
   - `NEXT_PUBLIC_SITE_URL` — e.g. `https://yourfinancedone.com` (canonical URLs, sitemap, OG image)
   - `NEXT_PUBLIC_CALCOM_URL`, `NEXT_PUBLIC_CALCOM_EVENT`
3. Deploy, then add your custom domain under **Settings → Domains**.

Any Node host works too: `npm run build && npm start` (port 3000 by default).

---

## 5. Project structure

```
app/                 layout (fonts, metadata, providers), page, legal pages, OG image, sitemap, robots, 404
config/site.ts       brand + global settings, cal.com env parsing
content/             all section copy and data
components/
  layout/            Navbar, Footer, Logo, LegalPage
  providers/         Lenis + GSAP smooth scroll, Motion config
  ui/                Button, SectionHeading, Reveal/Stagger, CountUp, TiltCard, Marquee, Glow, LightPanel, AgentAvatar…
  sections/<name>/   one folder per page section
  three/             hero WebGL scene (lazy-loaded)
lib/                 helpers (format, scroll, gsap, hooks) + 3-statement engine and tests
```

## 6. Performance & accessibility notes

- The hero headline animates with pure CSS from first paint, so it isn't held back by JavaScript.
- The three.js scene is code-split and only loads on desktops with GPU-backed WebGL2, after the browser is idle. It stops rendering when scrolled offscreen.
- Mobile, low-power and software-rendered devices get a lightweight CSS/SVG version of the hero visual.
- The cal.com script and iframe load only when the booking section approaches the viewport.
- Lighthouse at hand-off, on a local production build:
  - Desktop: 99–100 performance; 100 accessibility, best practices and SEO.
  - Mobile (simulated slow 4G with 4× CPU slowdown): about 75–80 performance; 100 accessibility, best practices and SEO.
  - What limits mobile is the JavaScript needed to hydrate the interactive sections. The next lever would be mounting the heaviest below-the-fold demos on demand.
- `prefers-reduced-motion` turns off smooth scrolling, parallax, tilt, pinning and scrubbing. Demos show their final state, and Replay still works.
- Semantic landmarks, skip link, visible focus rings, keyboard-operable slider/tabs/accordion/dialog, real `<table>`s for financial statements, and an `aria-live` tie-out status.

## 7. Before launch — replace placeholders

- [ ] `content/testimonials.ts` — all `[PLACEHOLDER]` quotes and metrics (only real, approved quotes and verified numbers)
- [ ] `config/site.ts` — `contactEmail`, `socials`, `NEXT_PUBLIC_SITE_URL`
- [ ] `content/faq.ts` — confirm the security, setup-time and pricing answers
- [ ] `content/comparison.ts` — confirm the estimate wording
- [ ] `content/integrations.ts` — confirm the tools you actually support
- [ ] `app/privacy`, `app/terms` — replace with counsel-reviewed legal copy
- [ ] cal.com env vars set and the booker tested end-to-end

See `CREDITS.md` for fonts, libraries and licenses.
