"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { calConfig } from "@/config/site";

const NAMESPACE = "qualification-call";

/** Inline cal.com booker from your self-hosted instance, themed to the brand. */
export function CalEmbed() {
  useEffect(() => {
    let cancelled = false;
    getCalApi({ embedJsUrl: calConfig.embedJsUrl, namespace: NAMESPACE }).then((cal) => {
      if (cancelled) return;
      cal("ui", {
        theme: "dark",
        layout: "month_view",
        hideEventTypeDetails: false,
        cssVarsPerTheme: {
          dark: { "cal-brand": "#9d6bff", "cal-bg": "#0a0d1c" },
          light: { "cal-brand": "#6d3aed" },
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Cal
      namespace={NAMESPACE}
      calLink={calConfig.event}
      calOrigin={calConfig.origin}
      embedJsUrl={calConfig.embedJsUrl}
      config={{ layout: "month_view", theme: "dark" }}
      className="relative z-10 size-full overflow-auto"
      data-lenis-prevent
    />
  );
}
