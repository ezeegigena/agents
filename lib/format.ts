const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** $12,345 — negative values render as ($12,345), accounting style. */
export function formatUsd(value: number, { accounting = true } = {}) {
  const rounded = Math.round(value);
  if (accounting && rounded < 0) return `(${usd0.format(Math.abs(rounded))})`;
  return usd0.format(rounded);
}

/** 12.3K, 4.5M */
export function formatCompact(value: number) {
  return compact.format(value);
}

export function formatNumber(value: number, decimals = 0) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
