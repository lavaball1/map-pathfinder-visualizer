
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { NodeType } from "@/types/pathfinding";
import { Play, Square, Trash2, Upload, X } from "lucide-react";

interface ControlsProps {
  gridSize: { rows: number; cols: number };
  onGridSizeChange: (size: { rows: number; cols: number }) => void;
  currentTool: NodeType;
  onToolChange: (tool: NodeType) => void;
  onSearch: () => void;
  onClear: () => void;
  isSearching: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  backgroundImage: string | null;
  onRemoveImage: () => void;
  showGrid: boolean;
  onToggleGrid: (show: boolean) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  gridSize,
  onGridSizeChange,
  currentTool,
  onToolChange,
  onSearch,
  onClear,
  isSearching,
  onImageUpload,
  backgroundImage,
  onRemoveImage,
  showGrid,
  onToggleGrid,
}) => {
  const tools: { type: NodeType; label: string; color: string }[] = [
    { type: "start", label: "Start", color: "bg-blue-500" },
    { type: "goal", label: "Goal", color: "bg-red-500" },
    { type: "wall", label: "Wall", color: "bg-gray-800" },
  ];

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Pathfinding Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Grid Size Controls */}
        <div className="space-y-4">
          <Label className="text-white font-medium">Grid Size</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rows" className="text-gray-300">Rows</Label>
              <Input
                id="rows"
                type="number"
                min="5"
                max="50"
                value={gridSize.rows}
                onChange={(e) => onGridSizeChange({ ...gridSize, rows: parseInt(e.target.value) || 5 })}
                className="bg-white/10 border-white/20 text-white"
                disabled={isSearching}
              />
            </div>
            <div>
              <Label htmlFor="cols" className="text-gray-300">Columns</Label>
              <Input
                id="cols"
                type="number"
                min="5"
                max="80"
                value={gridSize.cols}
                onChange={(e) => onGridSizeChange({ ...gridSize, cols: parseInt(e.target.value) || 5 })}
                className="bg-white/10 border-white/20 text-white"
                disabled={isSearching}
              />
            </div>
          </div>
        </div>

        <Separator className="bg-white/20" />

        {/* Tool Selection */}
        <div className="space-y-4">
          <Label className="text-white font-medium">Drawing Tool</Label>
          <div className="grid grid-cols-3 gap-2">
            {tools.map((tool) => (
              <Button
                key={tool.type}
                variant={currentTool === tool.type ? "default" : "outline"}
                onClick={() => onToolChange(tool.type)}
                className={`${
                  currentTool === tool.type
                    ? "bg-white/20 text-white border-white/40"
                    : "bg-transparent text-gray-300 border-white/20 hover:bg-white/10"
                }`}
                disabled={isSearching}
              >
                <div className={`w-3 h-3 rounded-sm mr-2 ${tool.color}`} />
                {tool.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="bg-white/20" />

        {/* Background Image Controls */}
        <div className="space-y-4">
          <Label className="text-white font-medium">Background Image</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="bg-white/10 border-white/20 text-white file:bg-white/10 file:border-0 file:text-white"
                disabled={isSearching}
              />
            </div>
            {backgroundImage && (
              <Button
                variant="outline"
                size="icon"
                onClick={onRemoveImage}
                className="bg-transparent text-gray-300 border-white/20 hover:bg-white/10"
                disabled={isSearching}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-grid"
              checked={showGrid}
              onCheckedChange={onToggleGrid}
              disabled={isSearching}
            />
            <Label htmlFor="show-grid" className="text-gray-300">Show Grid Lines</Label>
          </div>
        </div>

        <Separator className="bg-white/20" />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={onSearch}
            disabled={isSearching}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            {isSearching ? "Searching..." : "Find Path"}
          </Button>
          <Button
            onClick={onClear}
            disabled={isSearching}
            variant="outline"
            className="bg-transparent text-gray-300 border-white/20 hover:bg-white/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Grid
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
