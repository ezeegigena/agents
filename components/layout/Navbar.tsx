"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";
import { scrollToHash, setScrollLocked } from "@/lib/scroll";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the nav link for the section currently in the middle of the viewport.
  useEffect(() => {
    if (!isHome) return;
    const sections = siteConfig.nav
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!open) return;
    const menuButton = menuButtonRef.current;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
      menuButton?.focus();
    };
  }, [open]);

  const hrefFor = (hash: string) => (isHome ? hash : `/${hash}`);

  function onNavClick(e: React.MouseEvent<HTMLAnchorElement>, hash: string) {
    setOpen(false);
    if (isHome && scrollToHash(hash)) e.preventDefault();
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-[padding] duration-700 ease-out-expo",
          scrolled ? "px-3 pt-3 md:px-5" : "px-0 pt-0",
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "relative mx-auto flex items-center justify-between gap-4 transition-all duration-700 ease-out-expo",
            scrolled
              ? "glass-strong h-14 max-w-[1180px] rounded-full pr-2 pl-4 md:pl-5"
              : "h-[var(--nav-height)] max-w-[1240px] border border-transparent px-5 md:px-8",
          )}
        >
          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            className="rounded-lg"
            onClick={(e) => {
              if (isHome && scrollToHash("#top")) e.preventDefault();
            }}
          >
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {siteConfig.nav.map((item) => {
              const isActive = active === item.href;
              return (
                <li key={item.href} className="relative">
                  <a
                    href={hrefFor(item.href)}
                    onClick={(e) => onNavClick(e, item.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative z-10 block rounded-full px-3.5 py-2 text-sm transition-colors duration-300",
                      isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </a>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-white/[0.07] ring-1 ring-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Button
              href={hrefFor(siteConfig.bookingAnchor)}
              size="sm"
              arrow
              className="h-10 px-4 md:px-5"
            >
              {siteConfig.cta.short}
            </Button>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-full text-fg ring-1 ring-white/10 transition-colors hover:bg-white/5 lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          <motion.div
            aria-hidden
            style={{ scaleX: progress }}
            className={cn(
              "absolute inset-x-6 -bottom-px h-px origin-left bg-brand-gradient transition-opacity duration-500",
              scrolled ? "opacity-80" : "opacity-0",
            )}
          />
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 top-0 -z-10 bg-ink-950/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="container-page flex h-full flex-col justify-between pt-28 pb-10">
              <ul className="flex flex-col gap-1">
                {siteConfig.nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={hrefFor(item.href)}
                      onClick={(e) => onNavClick(e, item.href)}
                      autoFocus={i === 0}
                      className="flex items-baseline gap-4 py-2.5 font-display text-4xl font-semibold tracking-[-0.04em] text-fg"
                    >
                      <span className="eyebrow text-fg-subtle">0{i + 1}</span>
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Button
                  href={hrefFor(siteConfig.bookingAnchor)}
                  size="lg"
                  arrow
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  {siteConfig.cta.primary}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
