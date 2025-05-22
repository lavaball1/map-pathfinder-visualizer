
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
  id?: string; // Unique identifier for multiple starts/goals
  name?: string; // Custom name for the node
}

export interface PathfindingResult {
  path: GridNode[];
  exploredNodes: GridNode[];
  success: boolean;
}

export interface PointCoordinates {
  row: number;
  col: number;
  id: string;
  name?: string; // Custom name for the point
}
