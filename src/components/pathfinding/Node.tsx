
import React from "react";
import { GridNode } from "@/types/pathfinding";
import { cn } from "@/lib/utils";

interface NodeProps {
  node: GridNode;
  onClick: () => void;
  onEnter: () => void;
  showGrid: boolean;
  hideExplored: boolean;
}

export const Node: React.FC<NodeProps> = ({ node, onClick, onEnter, showGrid, hideExplored }) => {
  const getNodeClasses = () => {
    const baseClasses = "w-full h-full cursor-pointer transition-all duration-100 relative";
    const borderClasses = showGrid ? "border border-gray-400/30" : "";
    
    if (node.type === "start") {
      return cn(baseClasses, borderClasses, "bg-blue-500/70 hover:bg-blue-600/70");
    }
    
    if (node.type === "goal") {
      return cn(baseClasses, borderClasses, "bg-red-500/70 hover:bg-red-600/70");
    }
    
    if (node.type === "wall") {
      return cn(baseClasses, borderClasses, "bg-gray-800/70 hover:bg-gray-700/70");
    }
    
    if (node.isPath) {
      return cn(baseClasses, borderClasses, "bg-green-400/70 hover:bg-green-500/70");
    }
    
    if (node.isExplored && !hideExplored) {
      return cn(baseClasses, borderClasses, "bg-yellow-300/60 hover:bg-yellow-400/60");
    }
    
    return cn(baseClasses, borderClasses, "bg-transparent hover:bg-white/10");
  };

  // Show node name if it exists and the node is start or goal
  const showName = node.name && (node.type === "start" || node.type === "goal");

  return (
    <div
      className={getNodeClasses()}
      onClick={onClick}
      onMouseEnter={onEnter}
      title={`${node.name ? `${node.name} - ` : ''}(${node.row}, ${node.col}) - ${node.type}`}
    >
      {showName && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold overflow-hidden p-1">
          <span className="truncate">{node.name}</span>
        </div>
      )}
    </div>
  );
};
