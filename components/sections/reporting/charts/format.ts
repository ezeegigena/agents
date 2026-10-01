import type { Kpi } from "@/content/reporting";

const MINUS = "−";

/** $486K · $1.29M — compact USD for tiles and chart labels. */
export function usdShort(value: number) {
  const abs = Math.abs(value);
  const sign = value < 0 ? MINUS : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 100_000) return `${sign}$${Math.round(abs / 1000)}K`;
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${sign}$${Math.round(abs)}`;
}

/** +$246K / −$92K */
export function usdSigned(value: number) {
  return value >= 0 ? `+${usdShort(value)}` : usdShort(value);
}

export function formatKpiValue(value: number, format: Kpi["format"]) {
  switch (format) {
    case "usd":
      return usdShort(value);
    case "percent":
      return `${value.toFixed(1)}%`;
    case "days":
      return `${Math.round(value)} days`;
    case "months":
      return `${value.toFixed(1)} mo`;
  }
}

export function formatKpiDelta(delta: number, format: Kpi["deltaFormat"]) {
  const sign = delta > 0 ? "+" : delta < 0 ? MINUS : "";
  const abs = Math.abs(delta);
  switch (format) {
    case "percent":
      return `${sign}${abs.toFixed(1)}%`;
    case "points":
      return `${sign}${abs.toFixed(1)} pts`;
    case "usd":
      return `${sign}${usdShort(abs)}`;
    case "days":
      return `${sign}${abs} days`;
    case "months":
      return `${sign}${abs.toFixed(1)} mo`;
  }
}
