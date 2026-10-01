import type { CloseTrackId } from "@/content/close";

/** Legend swatch per track (also used on the scoreboard). */
export const trackSwatch: Record<CloseTrackId, string> = {
  traditional: "bg-[rgb(255_92_122/0.7)]",
  ai: "bg-brand-gradient",
};

/** Filled bar per track. */
export const trackFill: Record<CloseTrackId, string> = {
  traditional:
    "bg-[linear-gradient(90deg,rgb(255_92_122/0.78),rgb(255_92_122/0.5))] shadow-[0_0_18px_-6px_rgb(255_92_122/0.7)]",
  ai: "bg-brand-gradient shadow-[0_0_20px_-4px_rgb(157_107_255/0.75)]",
};
