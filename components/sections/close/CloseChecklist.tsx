import { motion } from "motion/react";
import { Check, UserRound } from "lucide-react";
import { cn } from "@/lib/cn";
import { agentsById } from "@/content/agents";
import { closeContent, type CloseChecklistItem } from "@/content/close";

const { checklist } = closeContent;

/** Close tasks ticking themselves off in sync with the AI track. */
export function CloseChecklist({ day }: { day: number }) {
  const done = checklist.items.filter((item) => day >= item.doneAt).length;
  const total = checklist.items.length;

  return (
    <div className="glass h-full rounded-3xl p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-sans text-sm font-semibold text-fg">{checklist.title}</h3>
        <span aria-hidden className="font-mono text-xs text-fg-muted tabular">
          <span className="text-fg">{done}</span>/{total}
        </span>
      </div>
      <span aria-hidden className="mt-3 block h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <span
          className="block h-full origin-left rounded-full bg-brand-gradient transition-transform duration-500 ease-out-expo"
          style={{ transform: `scaleX(${done / total})` }}
        />
      </span>
      <ul className="mt-3 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-1">
        {checklist.items.map((item) => (
          <ChecklistRow key={item.label} item={item} done={day >= item.doneAt} />
        ))}
      </ul>
    </div>
  );
}

function ChecklistRow({ item, done }: { item: CloseChecklistItem; done: boolean }) {
  const agent = item.owner === "you" ? null : agentsById[item.owner];
  const Icon = agent?.icon ?? UserRound;
  const owner = agent?.short ?? checklist.youLabel;
  const accent = agent?.accent ?? "#f5f7ff";

  return (
    <li className="flex items-center gap-3 border-b border-white/[0.05] py-[7px] last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0 lg:[&:nth-last-child(2)]:border-b">
      <span
        aria-hidden
        className={cn(
          "relative grid size-[18px] shrink-0 place-items-center rounded-full border transition-colors duration-300",
          done ? "border-transparent bg-brand-gradient" : "border-line-strong bg-transparent",
        )}
      >
        <motion.span
          initial={false}
          animate={done ? { scale: 1, opacity: 1 } : { scale: 0.3, opacity: 0 }}
          transition={{ type: "spring", stiffness: 520, damping: 24 }}
          className="grid place-items-center text-white"
        >
          <Check className="size-3" strokeWidth={3.25} />
        </motion.span>
      </span>
      <p
        className={cn(
          "min-w-0 flex-1 text-[13px] leading-snug transition-colors duration-300",
          done ? "text-fg" : "text-fg-muted",
        )}
      >
        {item.label}
        <span className="sr-only"> — {owner}</span>
      </p>
      <span
        aria-hidden
        title={owner}
        className="grid size-6 shrink-0 place-items-center rounded-lg border border-white/[0.06]"
        style={{ backgroundColor: `color-mix(in oklab, ${accent} 12%, transparent)`, color: accent }}
      >
        <Icon className="size-3.5" />
      </span>
    </li>
  );
}
