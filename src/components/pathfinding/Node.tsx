
import React from "react";
import { GridNode } from "@/types/pathfinding";
import { cn } from "@/lib/utils";

interface NodeProps {
  node: GridNode;
  onClick: () => void;
  onEnter: () => void;
  showGrid: boolean;
}

export const Node: React.FC<NodeProps> = ({ node, onClick, onEnter, showGrid }) => {
  const getNodeClasses = () => {
    const baseClasses = "w-full h-full cursor-pointer transition-all duration-100";
    const borderClasses = showGrid ? "border border-gray-400/30" : "";
    
    if (node.type === "start") {
      return cn(baseClasses, borderClasses, "bg-blue-500 hover:bg-blue-600");
    }
    
    if (node.type === "goal") {
      return cn(baseClasses, borderClasses, "bg-red-500 hover:bg-red-600");
    }
    
    if (node.type === "wall") {
      return cn(baseClasses, borderClasses, "bg-gray-800 hover:bg-gray-700");
    }
    
    if (node.isPath) {
      return cn(baseClasses, borderClasses, "bg-green-400 hover:bg-green-500");
    }
    
    if (node.isExplored) {
      return cn(baseClasses, borderClasses, "bg-yellow-300 hover:bg-yellow-400");
    }
    
    return cn(baseClasses, borderClasses, "bg-transparent hover:bg-white/10");
  };

  return (
    <div
      className={getNodeClasses()}
      onClick={onClick}
      onMouseEnter={onEnter}
      title={`(${node.row}, ${node.col}) - ${node.type}`}
    />
  );
};
