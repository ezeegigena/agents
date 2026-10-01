/**
 * Chart colors for the dark report window. Validated with the dataviz palette
 * checker (dark mode, surface #12172f): lightness band, chroma floor, CVD and
 * normal-vision separation and ≥3:1 contrast all pass. Never pair brand blue
 * and violet as two series — they collapse under protanopia.
 */
export const chartColors = {
  /** Slot 1 — revenue, actuals, increases. */
  teal: "#12ae8b",
  /** Slot 2 — expenses. */
  violet: "#9d6bff",
  /** Waterfall totals (opening / ending levels). */
  blue: "#4c7dff",
  /** Waterfall decreases (warm pole opposite teal). */
  coral: "#e36b4c",
  /** De-emphasis line for sparklines. */
  muted: "#646e9e",
  grid: "rgb(160 170 255 / 0.08)",
  axis: "rgb(160 170 255 / 0.18)",
  /** Matches the panel surface; used for 2px rings and gaps. */
  surface: "#10152b",
} as const;
