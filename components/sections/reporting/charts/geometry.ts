export type Point = [x: number, y: number];

/** Linear scale: maps [d0, d1] onto [r0, r1]. */
export function scaleLinear(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  return (v: number) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

/** Smooth monotone cubic path through points (no overshoot between samples). */
export function monotonePath(points: Point[]) {
  const n = points.length;
  if (n < 2) return "";
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const dx = xs.slice(1).map((x, i) => x - xs[i]);
  const slopes = ys.slice(1).map((y, i) => (y - ys[i]) / dx[i]);
  const t = xs.map((_, i) => {
    if (i === 0) return slopes[0];
    if (i === n - 1) return slopes[n - 2];
    const a = slopes[i - 1];
    const b = slopes[i];
    return a * b <= 0 ? 0 : (a + b) / 2;
  });
  for (let i = 0; i < n - 1; i++) {
    if (slopes[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / slopes[i];
    const b = t[i + 1] / slopes[i];
    const s = a * a + b * b;
    if (s > 9) {
      const tau = 3 / Math.sqrt(s);
      t[i] = tau * a * slopes[i];
      t[i + 1] = tau * b * slopes[i];
    }
  }
  let d = `M${xs[0]},${ys[0]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${xs[i] + h},${ys[i] + t[i] * h} ${xs[i + 1] - h},${ys[i + 1] - t[i + 1] * h} ${xs[i + 1]},${ys[i + 1]}`;
  }
  return d;
}

/** Closed area between an upper and a lower series (same x positions). */
export function bandPath(upper: Point[], lower: Point[]) {
  const back = monotonePath([...lower].reverse()).replace(/^M/, "L");
  return `${monotonePath(upper)}${back}Z`;
}

/**
 * Rectangle path with a rounded data end only (square at the baseline).
 * `end` is the side the value grows toward.
 */
export function barPath(x: number, y: number, w: number, h: number, r: number, end: "top" | "bottom") {
  const rr = Math.min(r, h / 2, w / 2);
  if (end === "top") {
    return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`;
  }
  return `M${x},${y}H${x + w}V${y + h - rr}Q${x + w},${y + h} ${x + w - rr},${y + h}H${x + rr}Q${x},${y + h} ${x},${y + h - rr}Z`;
}
