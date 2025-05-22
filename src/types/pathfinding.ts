
export type NodeType = "empty" | "wall" | "start" | "goal";

export interface GridNode {
  row: number;
  col: number;
  type: NodeType;
  isPath: boolean;
  isExplored: boolean;
  gCost: number; // Distance from start
  hCost: number; // Heuristic distance to goal
  fCost: number; // gCost + hCost
  parent: GridNode | null;
}

export interface PathfindingResult {
  path: GridNode[];
  exploredNodes: GridNode[];
  success: boolean;
}
