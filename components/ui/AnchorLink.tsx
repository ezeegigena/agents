"use client";

import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { scrollToHash } from "@/lib/scroll";

/**
 * Link to a home-page section ("#faq"). Smooth-scrolls on the home page,
 * navigates to "/#faq" from any other page.
 */
export function AnchorLink({
  hash,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { hash: string; children: ReactNode }) {
  const isHome = usePathname() === "/";
  return (
    <a
      href={isHome ? hash : `/${hash}`}
      onClick={(e) => {
        if (isHome && scrollToHash(hash)) e.preventDefault();
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
