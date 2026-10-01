/**
 * TODO(pre-qualification): replace this placeholder with the pre-qualification
 * form shown before (or alongside) the booking calendar. Planned fields:
 *   - Company size (employees)
 *   - Annual revenue range
 *   - Current finance tools (accounting, banking, payroll…)
 *   - Biggest finance pain point
 * Answers can be passed to cal.com as booking prefill/metadata via the
 * `config` prop of <Cal /> in ./CalEmbed.tsx.
 *
 * Renders a visible placeholder in development only; nothing in production.
 */
export function PreQualificationForm() {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-warning/40 p-4 text-sm [overflow-wrap:anywhere] text-warning">
      TODO: Pre-qualification form (company size, revenue range, current tools, biggest pain point)
      — see components/sections/booking/PreQualificationForm.tsx. Visible in development only.
    </div>
  );
}
