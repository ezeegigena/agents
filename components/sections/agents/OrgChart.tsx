"use client";

import type { AgentId } from "@/content/agents";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { OrgDiagram } from "./OrgDiagram";
import { OrgTree } from "./OrgTree";
import type { OpenAgent } from "./shared";

/** SVG diagram from 768px up, indented tree on phones. */
export function OrgChart(props: { onOpen: OpenAgent; originId: AgentId | null; reduced: boolean }) {
  const isWide = useMediaQuery("(min-width: 768px)", true);
  return isWide ? <OrgDiagram {...props} /> : <OrgTree {...props} />;
}
