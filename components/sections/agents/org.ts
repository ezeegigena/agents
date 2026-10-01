import { agents, agentsById, type AgentId } from "@/content/agents";

/**
 * Org chart model + geometry. Structure (levels, edges, labels) comes from
 * `reportsTo` / `handoffs` in content/agents.ts; only the column of each
 * agent is fixed here. Columns are 0–3 (halves center a parent over two
 * children) on a 4-column canvas.
 */
const orgColumns: Record<AgentId, number> = {
  cfo: 1.5,
  "head-finance": 0.5,
  "head-accounting": 2.5,
  budget: 0,
  fpa: 1,
  controller: 2.5,
  bookkeeper: 2,
  "ap-ar": 3,
};

const COLUMNS = 4;
const LEVEL_GAP = 152;

/** Canvas metrics in CSS px. Node width is responsive: see `nodeWidthCss`. */
export const orgCanvas = {
  height: 640,
  nodeHeight: 64,
  maxNodeWidth: 252,
  columnGutter: 32,
  top: 8,
} as const;

/** Same formula as `orgNodeWidth`, as CSS (percent of the canvas width). */
export const nodeWidthCss = `min(${orgCanvas.maxNodeWidth}px, calc(${100 / COLUMNS}% - ${orgCanvas.columnGutter}px))`;

function orgNodeWidth(width: number) {
  return Math.min(orgCanvas.maxNodeWidth, width / COLUMNS - orgCanvas.columnGutter);
}

function levelOf(id: AgentId): number {
  const parent = agentsById[id].reportsTo;
  return parent ? levelOf(parent) + 1 : 0;
}

export const orgLevels = Object.fromEntries(agents.map((a) => [a.id, levelOf(a.id)])) as Record<
  AgentId,
  number
>;

/** Deepest level in the chart (0 = top). */
export const orgDepth = Math.max(...Object.values(orgLevels));

/** How strongly a node / edge is drawn while another agent is hovered. */
export type Emphasis = "on" | "off" | "idle";

/** Fraction (0–1) of the canvas width where a node's center sits. */
export const columnFraction = (id: AgentId) => (orgColumns[id] + 0.5) / COLUMNS;

export const levelTop = (level: number) => orgCanvas.top + level * LEVEL_GAP;

export const nodeTop = (id: AgentId) => levelTop(orgLevels[id]);

export type OrgEdge = {
  id: string;
  from: AgentId;
  to: AgentId;
  label: string;
  /** "tree" follows reportsTo; "cross" is a handoff to another branch. */
  kind: "tree" | "cross";
};

export const orgEdges: OrgEdge[] = agents.flatMap((agent) =>
  agent.handoffs.map((handoff) => ({
    id: `${agent.id}--${handoff.to}`,
    from: agent.id,
    to: handoff.to,
    label: handoff.label,
    kind: handoff.to === agent.reportsTo ? ("tree" as const) : ("cross" as const),
  })),
);

/** Children in left-to-right chart order. */
export function childrenOf(id: AgentId | null) {
  return agents
    .filter((a) => a.reportsTo === id)
    .sort((a, b) => orgColumns[a.id] - orgColumns[b.id]);
}

function ancestorsOf(id: AgentId): AgentId[] {
  const parent = agentsById[id].reportsTo;
  return parent ? [parent, ...ancestorsOf(parent)] : [];
}

function descendantsOf(id: AgentId): AgentId[] {
  return childrenOf(id).flatMap((child) => [child.id, ...descendantsOf(child.id)]);
}

/** Nodes + edges lit when an agent is hovered: its reporting line and cross-team links. */
export function chainOf(id: AgentId) {
  const nodes = new Set<AgentId>([id, ...ancestorsOf(id), ...descendantsOf(id)]);
  const edges = new Set<string>();
  for (const edge of orgEdges) {
    if (edge.kind === "tree" && nodes.has(edge.from) && nodes.has(edge.to)) edges.add(edge.id);
  }
  for (const edge of orgEdges) {
    if (edge.kind === "cross" && (edge.from === id || edge.to === id)) {
      edges.add(edge.id);
      nodes.add(edge.from);
      nodes.add(edge.to);
    }
  }
  return { nodes, edges };
}

type Point = { x: number; y: number };

export type EdgeGeometry = {
  d: string;
  start: Point;
  end: Point;
  label: Point;
};

const cubicMid = (p0: Point, p1: Point, p2: Point, p3: Point): Point => ({
  x: (p0.x + 3 * p1.x + 3 * p2.x + p3.x) / 8,
  y: (p0.y + 3 * p1.y + 3 * p2.y + p3.y) / 8,
});

const curve = (p0: Point, p1: Point, p2: Point, p3: Point) =>
  `M${p0.x},${p0.y} C${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;

/** Path from the sending agent to the receiving one, in canvas px. */
export function edgeGeometry(edge: OrgEdge, width: number): EdgeGeometry {
  const { nodeHeight: h } = orgCanvas;
  const w = orgNodeWidth(width);
  const x = (id: AgentId) => columnFraction(id) * width;
  const from = { x: x(edge.from), top: nodeTop(edge.from), level: orgLevels[edge.from] };
  const to = { x: x(edge.to), top: nodeTop(edge.to), level: orgLevels[edge.to] };

  // Same level: a soft arc between the facing sides.
  if (from.level === to.level) {
    const dir = Math.sign(to.x - from.x) || 1;
    const start = { x: from.x + (dir * w) / 2, y: from.top + h / 2 };
    const end = { x: to.x - (dir * w) / 2, y: to.top + h / 2 };
    const span = end.x - start.x;
    const c1 = { x: start.x + span * 0.3, y: start.y + 34 };
    const c2 = { x: end.x - span * 0.3, y: end.y + 34 };
    return { d: curve(start, c1, c2, end), start, end, label: cubicMid(start, c1, c2, end) };
  }

  // Child → parent: S-curve from the child's top to the parent's bottom,
  // labeled just above the child.
  if (edge.kind === "tree" && from.level > to.level) {
    const start = { x: from.x, y: from.top };
    const end = { x: to.x, y: to.top + h };
    const midY = (start.y + end.y) / 2;
    return {
      d: curve(start, { x: start.x, y: midY }, { x: end.x, y: midY }, end),
      start,
      end,
      label: { x: start.x, y: start.y - 22 },
    };
  }

  // Cross-team, deeper → higher: loop under the sender's row, rise into the receiver.
  if (from.level > to.level) {
    const start = { x: from.x, y: from.top + h };
    const end = { x: to.x, y: to.top + h };
    const low = start.y + 112;
    const c1 = { x: start.x, y: low };
    const c2 = { x: end.x, y: low };
    return { d: curve(start, c1, c2, end), start, end, label: cubicMid(start, c1, c2, end) };
  }

  // Higher → deeper: S-curve from the sender's bottom down to the receiver's top.
  const start = { x: from.x, y: from.top + h };
  const end = { x: to.x, y: to.top };
  const midY = (start.y + end.y) / 2;
  const c1 = { x: start.x, y: midY };
  const c2 = { x: end.x, y: midY };
  return { d: curve(start, c1, c2, end), start, end, label: cubicMid(start, c1, c2, end) };
}
