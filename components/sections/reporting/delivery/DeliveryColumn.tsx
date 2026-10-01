"use client";

import { motion } from "motion/react";
import { reportingContent } from "@/content/reporting";
import { EmailMock } from "./EmailMock";
import { FrequencyChips } from "./FrequencyChips";
import { SlackMock } from "./SlackMock";

const { delivery } = reportingContent;

/** Scheduled delivery: cadence chips + Slack and email mocks springing in. */
export function DeliveryColumn() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="font-sans text-lg font-semibold tracking-[-0.02em] text-fg">{delivery.title}</h3>
        <p className="mt-1.5 text-[0.95rem] leading-relaxed text-fg-muted">{delivery.body}</p>
      </div>
      <FrequencyChips />
      <div className="grid gap-3 md:grid-cols-2 md:items-start xl:grid-cols-1">
        {[SlackMock, EmailMock].map((Mock, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.1 + i * 0.14 }}
          >
            <Mock />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
