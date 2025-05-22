
import { GridNode, PathfindingResult } from "@/types/pathfinding";

// Manhattan distance heuristic
const calculateHeuristic = (nodeA: GridNode, nodeB: GridNode): number => {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
};

// Get valid neighbors (4-directional movement)
const getNeighbors = (node: GridNode, grid: GridNode[][]): GridNode[] => {
  const neighbors: GridNode[] = [];
  const directions = [
    [-1, 0], // Up
    [1, 0],  // Down
    [0, -1], // Left
    [0, 1],  // Right
  ];

  for (const [deltaRow, deltaCol] of directions) {
    const newRow = node.row + deltaRow;
    const newCol = node.col + deltaCol;

    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length &&
      grid[newRow][newCol].type !== "wall"
    ) {
      neighbors.push(grid[newRow][newCol]);
    }
  }

  return neighbors;
};

// Reconstruct path from goal to start
const reconstructPath = (goalNode: GridNode): GridNode[] => {
  const path: GridNode[] = [];
  let currentNode: GridNode | null = goalNode;

  while (currentNode !== null) {
    path.unshift(currentNode);
    currentNode = currentNode.parent;
  }

  return path;
};

export const findPath = async (
  grid: GridNode[][],
  start: { row: number; col: number },
  goal: { row: number; col: number },
  onProgress?: (exploredNodes: GridNode[], path?: GridNode[]) => void
): Promise<PathfindingResult> => {
  const startNode = grid[start.row][start.col];
  const goalNode = grid[goal.row][goal.col];

  // Initialize all nodes
  for (const row of grid) {
    for (const node of row) {
      node.gCost = Infinity;
      node.hCost = calculateHeuristic(node, goalNode);
      node.fCost = Infinity;
      node.parent = null;
    }
  }

  startNode.gCost = 0;
  startNode.fCost = startNode.hCost;

  const openSet: GridNode[] = [startNode];
  const closedSet: Set<GridNode> = new Set();
  const exploredNodes: GridNode[] = [];

  while (openSet.length > 0) {
    // Find node with lowest fCost
    let currentNode = openSet[0];
    let currentIndex = 0;

    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].fCost < currentNode.fCost) {
        currentNode = openSet[i];
        currentIndex = i;
      }
    }

    // Remove current node from open set and add to closed set
    openSet.splice(currentIndex, 1);
    closedSet.add(currentNode);
    exploredNodes.push(currentNode);

    // Check if we reached the goal
    if (currentNode === goalNode) {
      const path = reconstructPath(goalNode);
      if (onProgress) {
        onProgress(exploredNodes, path);
      }
      return {
        path,
        exploredNodes,
        success: true,
      };
    }

    // Explore neighbors
    const neighbors = getNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor)) {
        continue; // Skip already evaluated nodes
      }

      const tentativeGCost = currentNode.gCost + 1; // Distance between adjacent nodes is 1

      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeGCost >= neighbor.gCost) {
        continue; // This is not a better path
      }

      // This path is the best until now. Record it!
      neighbor.parent = currentNode;
      neighbor.gCost = tentativeGCost;
      neighbor.fCost = neighbor.gCost + neighbor.hCost;
    }

    // Add a small delay and update visualization
    if (onProgress && exploredNodes.length % 5 === 0) {
      onProgress(exploredNodes);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  // No path found
  if (onProgress) {
    onProgress(exploredNodes);
  }
  
  return {
    path: [],
    exploredNodes,
    success: false,
  };
};
