
import React, { useState, useCallback } from "react";
import { Grid } from "./pathfinding/Grid";
import { Controls } from "./pathfinding/Controls";
import { findPath } from "@/utils/aStar";
import { GridNode, NodeType } from "@/types/pathfinding";
import { toast } from "sonner";

const PathfindingVisualizer = () => {
  const [gridSize, setGridSize] = useState({ rows: 20, cols: 30 });
  const [grid, setGrid] = useState<GridNode[][]>([]);
  const [startNode, setStartNode] = useState<{ row: number; col: number } | null>(null);
  const [goalNode, setGoalNode] = useState<{ row: number; col: number } | null>(null);
  const [currentTool, setCurrentTool] = useState<NodeType>("wall");
  const [isSearching, setIsSearching] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);

  const initializeGrid = useCallback(() => {
    const newGrid: GridNode[][] = [];
    for (let row = 0; row < gridSize.rows; row++) {
      const currentRow: GridNode[] = [];
      for (let col = 0; col < gridSize.cols; col++) {
        currentRow.push({
          row,
          col,
          type: "empty",
          isPath: false,
          isExplored: false,
          gCost: 0,
          hCost: 0,
          fCost: 0,
          parent: null,
        });
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
    setStartNode(null);
    setGoalNode(null);
  }, [gridSize]);

  React.useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const handleCellClick = (row: number, col: number) => {
    if (isSearching) return;

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => r.map(cell => ({ ...cell, isPath: false, isExplored: false })));
      
      if (currentTool === "start") {
        if (startNode) {
          newGrid[startNode.row][startNode.col].type = "empty";
        }
        newGrid[row][col].type = "start";
        setStartNode({ row, col });
      } else if (currentTool === "goal") {
        if (goalNode) {
          newGrid[goalNode.row][goalNode.col].type = "empty";
        }
        newGrid[row][col].type = "goal";
        setGoalNode({ row, col });
      } else if (currentTool === "wall") {
        if (newGrid[row][col].type === "wall") {
          newGrid[row][col].type = "empty";
        } else if (newGrid[row][col].type === "empty") {
          newGrid[row][col].type = "wall";
        }
      }
      
      return newGrid;
    });
  };

  const handleSearch = async () => {
    if (!startNode || !goalNode) {
      toast.error("Please set both start and goal points!");
      return;
    }

    setIsSearching(true);
    
    // Clear previous search results
    setGrid(prevGrid => 
      prevGrid.map(row => 
        row.map(cell => ({ ...cell, isPath: false, isExplored: false }))
      )
    );

    try {
      const result = await findPath(grid, startNode, goalNode, (exploredNodes, path) => {
        setGrid(prevGrid => {
          const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
          
          // Mark explored nodes
          exploredNodes.forEach(node => {
            if (newGrid[node.row] && newGrid[node.row][node.col]) {
              newGrid[node.row][node.col].isExplored = true;
            }
          });
          
          // Mark path
          if (path) {
            path.forEach(node => {
              if (newGrid[node.row] && newGrid[node.row][node.col]) {
                newGrid[node.row][node.col].isPath = true;
              }
            });
          }
          
          return newGrid;
        });
      });

      if (result.path.length === 0) {
        toast.error("No path found!");
      } else {
        toast.success(`Path found! Length: ${result.path.length} steps`);
      }
    } catch (error) {
      toast.error("Search failed!");
    }

    setIsSearching(false);
  };

  const handleClear = () => {
    if (isSearching) return;
    initializeGrid();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Controls
        gridSize={gridSize}
        onGridSizeChange={setGridSize}
        currentTool={currentTool}
        onToolChange={setCurrentTool}
        onSearch={handleSearch}
        onClear={handleClear}
        isSearching={isSearching}
        onImageUpload={handleImageUpload}
        backgroundImage={backgroundImage}
        onRemoveImage={() => setBackgroundImage(null)}
        showGrid={showGrid}
        onToggleGrid={setShowGrid}
      />
      
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <Grid
          grid={grid}
          onCellClick={handleCellClick}
          backgroundImage={backgroundImage}
          showGrid={showGrid}
        />
      </div>
    </div>
  );
};

export default PathfindingVisualizer;
