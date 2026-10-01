import { FileText, Inbox, Paperclip } from "lucide-react";
import { reportingContent } from "@/content/reporting";
import { LogoMark } from "@/components/layout/Logo";

const { email } = reportingContent.delivery;

/** Generic inbox row: the monthly board pack arriving by email. */
export function EmailMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-ink-900/80">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5 text-[13px] font-semibold text-fg">
        <Inbox aria-hidden className="size-3.5 text-fg-muted" />
        {email.inbox}
        <span aria-hidden className="ml-auto size-2 rounded-full bg-brand-blue shadow-[0_0_10px_rgb(76_125_255/0.8)]" />
      </div>
      <div className="flex gap-3 p-4">
        <LogoMark className="size-9 rounded-full" />
        <div className="min-w-0 flex-1">
          <p className="flex items-baseline justify-between gap-2 text-[13px]">
            <span className="truncate font-semibold text-fg">{email.from}</span>
            <span className="shrink-0 font-mono text-[11px] text-fg-muted">{email.time}</span>
          </p>
          <p className="mt-0.5 text-[13px] font-medium text-fg">{email.subject}</p>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-fg-muted">{email.preview}</p>
          <p className="mt-2.5 inline-flex max-w-full items-center gap-2 rounded-lg border border-line bg-white/[0.03] py-1.5 pr-3 pl-2 text-[12px]">
            <span className="grid size-6 shrink-0 place-items-center rounded-md bg-danger/15 text-danger">
              <FileText aria-hidden className="size-3.5" />
            </span>
            <span className="truncate text-fg">{email.attachment}</span>
            <span className="shrink-0 font-mono text-[10.5px] text-fg-muted">{email.attachmentMeta}</span>
            <Paperclip aria-hidden className="size-3.5 shrink-0 text-fg-muted" />
          </p>
        </div>
      </div>
    </div>
  );
}
