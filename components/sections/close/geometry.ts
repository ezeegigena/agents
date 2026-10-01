import { closeContent, type CloseTask } from "@/content/close";

const closeDays = closeContent.tracks.map((t) => t.closesOn);
/** Timeline length: the slowest track's close day. */
export const TIMELINE_END = Math.max(...closeDays);
/** The fastest (AI-assisted) track's close day. */
export const AI_CLOSE_END = Math.min(...closeDays);

/** Columns on the lane: one "ongoing" column before day 1, then the days. */
export const laneColumns = (days: number) => days + 1;

/** Horizontal position (0–1) of a timeline instant (0 = start of day 1). */
export function laneFraction(t: number, days: number) {
  return (t + 1) / laneColumns(days);
}

/** The 1-based day shown on a counter at timeline position `t`. */
export function dayAt(t: number, closesOn: number) {
  return Math.min(closesOn, Math.max(1, Math.ceil(t)));
}

/** Screen-reader description of when a task runs ("Day 1 to day 4"). */
export function taskSpan(task: CloseTask, dayLabel: string) {
  const first = Math.floor(task.start) + 1;
  const last = Math.ceil(task.end);
  return first === last ? `${dayLabel} ${first}` : `${dayLabel} ${first} to ${last}`;
}

/**
 * Maps sequence progress (scroll or time, 0–1) to timeline progress (0–1).
 * Holds briefly at both ends and gives the short AI close a generous share
 * of the sequence so its check marks are easy to follow.
 */
export function sequenceEase(aiEnd: number, total: number) {
  const hold = 0.04;
  const aiShare = 0.4;
  const end = 0.92;
  const aiFraction = aiEnd / total;
  return (p: number) => {
    if (p <= hold) return 0;
    if (p <= aiShare) return ((p - hold) / (aiShare - hold)) * aiFraction;
    if (p <= end) return aiFraction + ((p - aiShare) / (end - aiShare)) * (1 - aiFraction);
    return 1;
  };
}
