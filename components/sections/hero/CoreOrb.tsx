import { cn } from "@/lib/cn";

/** CSS rendition of the finance-brain core (poster + no-WebGL fallback). */
export function CoreOrb({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative", className)}>
      <div className="absolute -inset-[45%] rounded-full bg-[radial-gradient(circle,rgba(122,92,255,0.5),rgba(76,125,255,0.15)_45%,transparent_68%)]" />
      <div className="absolute inset-0 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,#4c7dff,#9d6bff,#1fe0b5,#4c7dff)] opacity-90 blur-md" />
      <div className="absolute inset-[4%] rounded-full bg-[radial-gradient(circle_at_50%_38%,#151b3d,#070914_72%)] shadow-[inset_0_0_32px_rgba(157,107,255,0.65),inset_0_0_70px_rgba(76,125,255,0.35)]" />
      <div className="absolute inset-[4%] rounded-full bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.2),transparent_42%)]" />
    </div>
  );
}
