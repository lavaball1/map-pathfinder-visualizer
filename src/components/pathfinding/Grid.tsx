
import React from "react";
import { GridNode } from "@/types/pathfinding";
import { Node } from "./Node";

interface GridProps {
  grid: GridNode[][];
  onCellClick: (row: number, col: number) => void;
  onCellEnter: (row: number, col: number) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  backgroundImage?: string | null;
  showGrid: boolean;
}

export const Grid: React.FC<GridProps> = ({ 
  grid, 
  onCellClick, 
  onCellEnter,
  onMouseDown,
  onMouseUp,
  backgroundImage, 
  showGrid 
}) => {
  if (grid.length === 0) return null;

  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <div className="flex justify-center">
      <div 
        className="relative inline-block border-2 border-gray-400 rounded-lg overflow-hidden"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div 
          className="grid gap-0"
          style={{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            width: `${Math.min(800, cols * 20)}px`,
            height: `${Math.min(600, rows * 20)}px`,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((node, colIndex) => (
              <Node
                key={`${rowIndex}-${colIndex}`}
                node={node}
                onClick={() => onCellClick(rowIndex, colIndex)}
                onEnter={() => onCellEnter(rowIndex, colIndex)}
                showGrid={showGrid}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
