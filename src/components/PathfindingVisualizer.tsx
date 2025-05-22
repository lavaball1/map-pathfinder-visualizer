import React, { useState, useCallback, useRef } from "react";
import { Grid } from "./pathfinding/Grid";
import { Controls } from "./pathfinding/Controls";
import { NameNodeDialog } from "./pathfinding/NameNodeDialog";
import { findPath } from "@/utils/aStar";
import { GridNode, NodeType, PointCoordinates } from "@/types/pathfinding";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const PathfindingVisualizer = () => {
  const [gridSize, setGridSize] = useState({ rows: 20, cols: 30 });
  const [grid, setGrid] = useState<GridNode[][]>([]);
  const [startNodes, setStartNodes] = useState<PointCoordinates[]>([]);
  const [goalNodes, setGoalNodes] = useState<PointCoordinates[]>([]);
  const [activeStartNode, setActiveStartNode] = useState<string | null>(null);
  const [activeGoalNode, setActiveGoalNode] = useState<string | null>(null);
  const [currentTool, setCurrentTool] = useState<NodeType>("wall");
  const [isSearching, setIsSearching] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const lastVisitedNode = useRef<{ row: number, col: number } | null>(null);
  
  // State for node naming
  const [namingDialogOpen, setNamingDialogOpen] = useState(false);
  const [nodeToName, setNodeToName] = useState<{
    type: "start" | "goal";
    id: string;
    row: number;
    col: number;
    currentName?: string;
  } | null>(null);

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
    setStartNodes([]);
    setGoalNodes([]);
    setActiveStartNode(null);
    setActiveGoalNode(null);
  }, [gridSize]);

  React.useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  // Set default active nodes when available
  React.useEffect(() => {
    if (startNodes.length > 0 && !activeStartNode) {
      setActiveStartNode(startNodes[0].id);
    }
    if (goalNodes.length > 0 && !activeGoalNode) {
      setActiveGoalNode(goalNodes[0].id);
    }
  }, [startNodes, goalNodes, activeStartNode, activeGoalNode]);

  const handleCellClick = (row: number, col: number) => {
    if (isSearching) return;
    lastVisitedNode.current = { row, col };
    
    // Check if clicking on an existing start or goal node to rename it
    const clickedNode = grid[row][col];
    if (clickedNode.type === "start" || clickedNode.type === "goal") {
      setNodeToName({
        type: clickedNode.type as "start" | "goal",
        id: clickedNode.id!,
        row,
        col,
        currentName: clickedNode.name
      });
      setNamingDialogOpen(true);
      return;
    }
    
    // Otherwise, handle normal cell updates
    updateCell(row, col);
  };
  
  const handleCellEnter = (row: number, col: number) => {
    if (!isDragging || isSearching) return;
    
    // Skip if it's the same cell we already processed
    if (lastVisitedNode.current?.row === row && lastVisitedNode.current?.col === col) {
      return;
    }
    
    lastVisitedNode.current = { row, col };
    updateCell(row, col);
  };

  const updateCell = (row: number, col: number) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => r.map(cell => ({ ...cell, isPath: false, isExplored: false })));
      
      if (currentTool === "start") {
        const id = uuidv4();
        newGrid[row][col].type = "start";
        newGrid[row][col].id = id;
        setStartNodes(prev => [...prev, { row, col, id }]);
        if (!activeStartNode) {
          setActiveStartNode(id);
        }
        // Open dialog to name the new start node
        setTimeout(() => {
          setNodeToName({ type: "start", id, row, col });
          setNamingDialogOpen(true);
        }, 100);
      } else if (currentTool === "goal") {
        const id = uuidv4();
        newGrid[row][col].type = "goal";
        newGrid[row][col].id = id;
        setGoalNodes(prev => [...prev, { row, col, id }]);
        if (!activeGoalNode) {
          setActiveGoalNode(id);
        }
        // Open dialog to name the new goal node
        setTimeout(() => {
          setNodeToName({ type: "goal", id, row, col });
          setNamingDialogOpen(true);
        }, 100);
      } else if (currentTool === "wall") {
        // Toggle wall state if clicking, always add wall if dragging
        if (isDragging || newGrid[row][col].type === "empty") {
          newGrid[row][col].type = "wall";
        } else if (newGrid[row][col].type === "wall") {
          newGrid[row][col].type = "empty";
        }
      }
      
      return newGrid;
    });
  };

  const handleNodeNaming = (name: string) => {
    if (!nodeToName) return;
    
    // Update the grid with the new name
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      const node = newGrid[nodeToName.row][nodeToName.col];
      node.name = name;
      return newGrid;
    });
    
    // Update the point collections with the new name
    if (nodeToName.type === "start") {
      setStartNodes(prev => prev.map(node => 
        node.id === nodeToName.id ? { ...node, name } : node
      ));
    } else {
      setGoalNodes(prev => prev.map(node => 
        node.id === nodeToName.id ? { ...node, name } : node
      ));
    }
    
    // Show a toast to confirm
    toast.success(`${nodeToName.type === "start" ? "Start" : "Goal"} point named: ${name}`);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    lastVisitedNode.current = null;
  };

  const handleSearch = async () => {
    if (!activeStartNode || !activeGoalNode) {
      toast.error("Please select both start and goal points!");
      return;
    }

    const selectedStart = startNodes.find(node => node.id === activeStartNode);
    const selectedGoal = goalNodes.find(node => node.id === activeGoalNode);

    if (!selectedStart || !selectedGoal) {
      toast.error("Invalid start or goal selection!");
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
      const result = await findPath(grid, selectedStart, selectedGoal, (exploredNodes, path) => {
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
        startNodes={startNodes}
        goalNodes={goalNodes}
        activeStartNode={activeStartNode}
        activeGoalNode={activeGoalNode}
        onStartNodeSelect={setActiveStartNode}
        onGoalNodeSelect={setActiveGoalNode}
      />
      
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <Grid
          grid={grid}
          onCellClick={handleCellClick}
          onCellEnter={handleCellEnter}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          backgroundImage={backgroundImage}
          showGrid={showGrid}
        />
      </div>

      {/* Dialog for naming nodes */}
      <NameNodeDialog 
        isOpen={namingDialogOpen}
        onClose={() => setNamingDialogOpen(false)}
        onSave={handleNodeNaming}
        nodeType={nodeToName?.type || "start"}
        defaultName={nodeToName?.currentName || ""}
      />
    </div>
  );
};

export default PathfindingVisualizer;
