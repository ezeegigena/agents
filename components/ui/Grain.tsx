/** Fixed film-grain overlay across the whole page. Decorative. */
export function Grain() {
  return (
    <div
      aria-hidden
      className="grain pointer-events-none fixed inset-0 z-[70] opacity-[0.045] mix-blend-overlay"
    />
  );
}
