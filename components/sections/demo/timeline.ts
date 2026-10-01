import { statementLinks } from "@/content/demo";
import { formatNumber, formatUsd } from "@/lib/format";
import { gsap } from "@/lib/gsap";

/**
 * GSAP choreography for the 3-statement demo. Elements are found through
 * data attributes (data-feed-row, data-row, data-link-path, …) so the React
 * components stay purely declarative. Numbers are written into the existing
 * text node on every frame — no React state per frame.
 */

export type Phase = "idle" | "feed" | "statements" | "done";
type OnPhase = (phase: Phase) => void;
type Timeline = gsap.core.Timeline;

const EXPO = "expo.out";

const all = (root: ParentNode, selector: string) =>
  Array.from(root.querySelectorAll<HTMLElement>(selector));

/** Writes into the existing text node so React keeps ownership of it. */
function writeText(el: Element, text: string) {
  const node = el.firstChild;
  if (node && node.nodeType === Node.TEXT_NODE) node.nodeValue = text;
  else el.textContent = text;
}

function rgba(hex: string, alpha: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

const formatCount = (value: number) => formatNumber(value);

/** Puts every animated number back to its final value (after a revert). */
export function restoreFinalText(root: ParentNode) {
  all(root, "[data-amount]").forEach((el) => writeText(el, formatUsd(Number(el.dataset.value))));
  all(root, "[data-count]").forEach((el) => writeText(el, formatCount(Number(el.dataset.value))));
}

function countUp(
  tl: Timeline,
  el: HTMLElement,
  at: number,
  duration: number,
  format: (value: number) => string,
) {
  const counter = { value: 0 };
  tl.to(
    counter,
    {
      value: Number(el.dataset.value),
      duration,
      ease: "power3.out",
      onStart: () => writeText(el, format(0)),
      onUpdate: () => writeText(el, format(counter.value)),
    },
    at,
  );
}

function flash(tl: Timeline, cells: Element[], color: string, alpha: number, at: number, duration: number) {
  tl.fromTo(
    cells,
    { backgroundColor: rgba(color, alpha) },
    {
      backgroundColor: rgba(color, 0),
      duration,
      ease: "power2.out",
      immediateRender: false,
      clearProps: "backgroundColor",
    },
    at,
  );
}

/* ----------------------------------------------------------------------------
 * Statement rows
 * ------------------------------------------------------------------------- */

function primeRows(rows: HTMLElement[]) {
  rows.forEach((row) => {
    gsap.set(all(row, "[data-label]"), { opacity: 0.22 });
    gsap.set(all(row, "[data-amount], [data-margin], [data-link-icon], [data-note]"), {
      opacity: 0,
    });
  });
}

function buildRow(tl: Timeline, row: HTMLElement, at: number, accent: string, withFlash = true) {
  const amount = row.querySelector<HTMLElement>("[data-amount]");
  const extras = all(row, "[data-margin], [data-note], [data-link-icon]");
  const strong = row.dataset.kind !== "line";

  tl.to(all(row, "[data-label]"), { opacity: 1, duration: 0.3, ease: "power1.out" }, at);
  if (amount) {
    tl.to(amount, { opacity: 1, duration: 0.15 }, at);
    countUp(tl, amount, at, strong ? 0.8 : 0.6, formatUsd);
    if (strong) {
      tl.fromTo(
        amount,
        { scale: 1 },
        { scale: 1.07, duration: 0.16, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false },
        at + 0.62,
      );
    }
  }
  if (extras.length) tl.to(extras, { opacity: 1, duration: 0.35 }, at + 0.35);
  if (withFlash) {
    const cells = all(row, "th, td");
    if (strong) flash(tl, cells, accent, 0.2, at + 0.55, 1.1);
    else flash(tl, cells, accent, 0.07, at, 0.55);
  }
}

/** A linked cell sending or receiving a value: tinted pulse. */
function pulseAnchor(tl: Timeline, row: HTMLElement | null, color: string, at: number) {
  if (row) flash(tl, all(row, "th, td"), color, 0.34, at, 1.5);
}

/** Builds a statement's rows line by line; returns when the last line lands. */
function buildStatement(
  tl: Timeline,
  card: HTMLElement,
  at: number,
  stagger: number,
  anchors: Partial<Record<string, number>> = {},
) {
  const accent = card.dataset.accent ?? "#4C7DFF";
  const rows = all(card, "[data-row]");
  let t = at;
  rows.forEach((row) => {
    const anchorAt = anchors[row.dataset.row ?? ""];
    t = anchorAt !== undefined ? Math.max(t, anchorAt) : t;
    // Linked rows get their own pulse when an arrow leaves or arrives.
    buildRow(tl, row, t, accent, row.dataset.anchor === undefined);
    t += stagger;
  });
  return t - stagger + 0.8;
}

/* ----------------------------------------------------------------------------
 * Link arrows (desktop)
 * ------------------------------------------------------------------------- */

function primeLink(root: ParentNode, id: string) {
  const q = (part: string) => all(root, `[data-link-${part}="${id}"]`);
  gsap.set([...q("path"), ...q("glow"), ...q("halo")], { strokeDashoffset: 1 });
  gsap.set([...q("start"), ...q("head")], { opacity: 0, scale: 0.3, transformOrigin: "50% 50%" });
  gsap.set([...q("dot"), ...q("ring")], { opacity: 0 });
}

/** Draws a link trace with a traveling spark; returns its arrival time. */
function drawLink(tl: Timeline, root: ParentNode, id: string, at: number, duration: number) {
  const q = (part: string) => all(root, `[data-link-${part}="${id}"]`);
  const path = root.querySelector<SVGPathElement>(`[data-link-path="${id}"]`);
  const dot = root.querySelector<SVGCircleElement>(`[data-link-dot="${id}"]`);
  if (!path || !dot) return at;

  tl.to(q("start"), { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(3)" }, at);
  tl.to([...q("path"), ...q("glow"), ...q("halo")], {
    strokeDashoffset: 0,
    duration,
    ease: "power2.inOut",
  }, at);

  const travel = { p: 0 };
  tl.to(travel, {
    p: 1,
    duration,
    ease: "power2.inOut",
    onUpdate: () => {
      const length = path.getTotalLength();
      if (!length) return;
      const point = path.getPointAtLength(length * travel.p);
      dot.setAttribute("cx", point.x.toFixed(1));
      dot.setAttribute("cy", point.y.toFixed(1));
    },
  }, at);
  tl.to(dot, { opacity: 1, duration: 0.12 }, at);
  tl.to(dot, { opacity: 0, duration: 0.2 }, at + duration - 0.1);
  tl.to(q("head"), { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(3)" }, at + duration - 0.08);
  tl.fromTo(
    q("ring"),
    { opacity: 0.9, scale: 1, transformOrigin: "50% 50%" },
    { opacity: 0, scale: 3.4, duration: 0.9, ease: EXPO, immediateRender: false },
    at + duration,
  );
  return at + duration;
}

/* ----------------------------------------------------------------------------
 * Feed, tie-out, progress
 * ------------------------------------------------------------------------- */

function buildFeedRow(tl: Timeline, row: HTMLElement, at: number) {
  const scan = all(row, "[data-feed-scan]");
  const pending = all(row, "[data-feed-pending]");
  const chip = all(row, "[data-feed-chip]");
  const spark = all(row, "[data-feed-spark]");

  gsap.set(row, { opacity: 0, y: -14, filter: "blur(4px)" });
  gsap.set(chip, { opacity: 0, scale: 0.6, transformOrigin: "100% 50%" });
  gsap.set(pending, { opacity: 1 });
  gsap.set(spark, { opacity: 0, scale: 0, rotate: -60 });
  gsap.set(scan, { xPercent: -100, opacity: 0 });

  tl.to(row, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: EXPO }, at);
  tl.to(scan, { opacity: 1, duration: 0.1 }, at + 0.08);
  tl.to(scan, { xPercent: 320, duration: 0.65, ease: "power2.inOut" }, at + 0.08);
  tl.to(scan, { opacity: 0, duration: 0.15 }, at + 0.58);
  tl.to(pending, { opacity: 0, duration: 0.15 }, at + 0.5);
  tl.to(chip, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.2)" }, at + 0.55);
  tl.to(spark, { opacity: 1, scale: 1, rotate: 45, duration: 0.3, ease: "back.out(3)" }, at + 0.55);
  tl.to(spark, { opacity: 0, scale: 0.3, rotate: 140, duration: 0.45, ease: "power2.in" }, at + 0.85);
}

function buildSummary(tl: Timeline, summary: HTMLElement | null, at: number) {
  if (!summary) return;
  const count = summary.querySelector<HTMLElement>("[data-count]");
  const bar = all(summary, "[data-feed-bar]");
  const ok = all(summary, "[data-feed-ok]");
  gsap.set(summary, { opacity: 0, y: 8 });
  gsap.set(bar, { scaleX: 0, transformOrigin: "0% 50%" });
  gsap.set(ok, { opacity: 0, scale: 0.6 });

  tl.to(summary, { opacity: 1, y: 0, duration: 0.5, ease: EXPO }, at);
  if (count) countUp(tl, count, at, 1.1, formatCount);
  tl.to(bar, { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, at);
  tl.to(ok, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(3)" }, at + 1);
}

function buildTieOut(tl: Timeline, root: ParentNode, at: number) {
  const card = root.querySelector<HTMLElement>("[data-tieout]");
  if (!card) return;
  const badge = all(card, "[data-balanced]");
  const pending = all(card, "[data-balanced-pending]");
  const shine = all(card, "[data-balanced-shine]");
  const checks = all(card, "[data-check]");
  const note = all(card, "[data-tieout-note]");

  gsap.set(badge, { opacity: 0, scale: 0.92, y: 8 });
  gsap.set(pending, { opacity: 1 });
  gsap.set(shine, { xPercent: -150 });
  gsap.set(checks, { opacity: 0.25 });
  gsap.set(all(card, "[data-check-icon]"), { scale: 0 });
  gsap.set(note, { opacity: 0, y: 8 });

  tl.to(pending, { opacity: 0, duration: 0.25 }, at);
  tl.to(badge, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.8)" }, at);
  tl.to(shine, { xPercent: 450, duration: 1.1, ease: "power2.inOut" }, at + 0.2);
  checks.forEach((check, i) => {
    const t = at + 0.25 + i * 0.18;
    tl.to(check, { opacity: 1, duration: 0.3 }, t);
    tl.to(all(check, "[data-check-icon]"), { scale: 1, duration: 0.45, ease: "back.out(3)" }, t);
  });
  tl.to(note, { opacity: 1, y: 0, duration: 0.6, ease: EXPO }, at + 0.8);
}

function trackProgress(tl: Timeline, root: ParentNode) {
  const bar = all(root, "[data-progress]");
  gsap.set(bar, { scaleX: 0, transformOrigin: "0% 50%" });
  tl.eventCallback("onUpdate", () => gsap.set(bar, { scaleX: tl.progress() }));
}

/* ----------------------------------------------------------------------------
 * Sequences
 * ------------------------------------------------------------------------- */

/**
 * Desktop: feed → income statement → NI flows into the CFS → CFS builds →
 * ending cash flows into BS cash → BS builds while NI lands in retained
 * earnings → totals → tie-out badge.
 */
export function buildDesktopTimeline(root: HTMLElement, onPhase: OnPhase): Timeline {
  const tl = gsap.timeline({ paused: true });
  const card = (id: string) => root.querySelector<HTMLElement>(`[data-statement="${id}"]`);
  const row = (ref: string) => root.querySelector<HTMLElement>(`[data-row="${ref}"]`);
  const is = card("is");
  const cfs = card("cfs");
  const bs = card("bs");
  if (!is || !cfs || !bs) return tl;
  const color = (el: HTMLElement) => el.dataset.accent ?? "#4C7DFF";

  tl.call(onPhase, ["feed"], 0);
  const feedRows = all(root, "[data-demo-feed] [data-feed-row]");
  feedRows.forEach((r, i) => buildFeedRow(tl, r, 0.1 + i * 0.13));
  buildSummary(tl, root.querySelector("[data-demo-feed] [data-feed-summary]"), 0.1 + feedRows.length * 0.13);

  statementLinks.forEach((link) => primeLink(root, link.id));
  primeRows(all(root, "[data-statement] [data-row]"));

  // Income statement
  const isStart = 1.3;
  tl.call(onPhase, ["statements"], isStart);
  const isDone = buildStatement(tl, is, isStart, 0.065);

  // Net income → top of the cash flow statement
  const niCfsAt = drawLink(tl, root, "ni-cfs", isDone - 0.35, 0.6);
  pulseAnchor(tl, row("is.netIncome"), color(is), isDone - 0.35);
  pulseAnchor(tl, row("cfs.netIncome"), color(cfs), niCfsAt);
  const cfsDone = buildStatement(tl, cfs, niCfsAt, 0.06, { "cfs.netIncome": niCfsAt });

  // Ending cash → balance sheet cash; net income → retained earnings
  const cashAt = drawLink(tl, root, "cash-bs", cfsDone - 0.3, 0.85);
  pulseAnchor(tl, row("cfs.endingCash"), color(cfs), cfsDone - 0.3);
  pulseAnchor(tl, row("bs.cash"), color(bs), cashAt);
  const bsRows = all(bs, "[data-row]");
  const reIndex = bsRows.findIndex((r) => r.dataset.row === "bs.retainedEarnings");
  const reAt = cashAt + Math.max(reIndex, 0) * 0.06 + 0.25;
  drawLink(tl, root, "ni-re", reAt - 0.75, 0.75);
  pulseAnchor(tl, row("bs.retainedEarnings"), color(bs), reAt);
  const bsDone = buildStatement(tl, bs, cashAt, 0.06, {
    "bs.cash": cashAt,
    "bs.retainedEarnings": reAt,
  });

  buildTieOut(tl, root, bsDone);
  tl.call(onPhase, ["done"], bsDone + 1);
  trackProgress(tl, root);
  return tl;
}

/** Mobile: compact ticker, then the visible statement builds, then tie-out. */
export function buildMobileTimeline(root: HTMLElement, onPhase: OnPhase): Timeline {
  const tl = gsap.timeline({ paused: true });
  tl.call(onPhase, ["feed"], 0);

  const items = all(root, "[data-ticker-item]");
  const step = 0.28;
  gsap.set(items, { yPercent: 100, opacity: 0 });
  gsap.set(all(root, "[data-ticker-item] [data-feed-chip]"), { opacity: 0, scale: 0.6 });
  items.forEach((item, i) => {
    const at = i * step;
    tl.to(item, { yPercent: 0, opacity: 1, duration: 0.32, ease: EXPO }, at);
    tl.to(all(item, "[data-feed-chip]"), { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.4)" }, at + 0.1);
    tl.to(item, { yPercent: -100, opacity: 0, duration: 0.26, ease: "power2.in" }, at + step);
  });
  const summaryAt = items.length * step;
  const summary = root.querySelector<HTMLElement>("[data-ticker-summary]");
  if (summary) {
    gsap.set(summary, { yPercent: 100, opacity: 0 });
    tl.to(summary, { yPercent: 0, opacity: 1, duration: 0.45, ease: EXPO }, summaryAt);
    const count = summary.querySelector<HTMLElement>("[data-count]");
    if (count) countUp(tl, count, summaryAt, 0.8, formatCount);
  }

  const panel = root.querySelector<HTMLElement>('[data-statement][data-active="true"]');
  let end = summaryAt + 0.6;
  if (panel) {
    tl.call(onPhase, ["statements"], 0.6);
    primeRows(all(panel, "[data-row]"));
    end = Math.max(end, buildStatement(tl, panel, 0.6, 0.06));
  }
  buildTieOut(tl, root, end);
  tl.call(onPhase, ["done"], end + 1);
  trackProgress(tl, root);
  return tl;
}

/** Mobile tab switch: rebuild the newly visible statement line by line. */
export function buildPanelTimeline(panel: HTMLElement): Timeline {
  const tl = gsap.timeline();
  primeRows(all(panel, "[data-row]"));
  buildStatement(tl, panel, 0.05, 0.045);
  return tl;
}
