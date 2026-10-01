import type { AgentId } from "@/content/agents";

export type AgentsView = "team" | "org";

export type OpenAgent = (id: AgentId, source: AgentsView, trigger: HTMLElement) => void;

/** Shared layoutId that morphs a card / org node into the agent dialog. */
export const shellLayoutId = (source: AgentsView, id: AgentId) => `agent-shell-${source}-${id}`;

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
