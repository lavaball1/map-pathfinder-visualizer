
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { NodeType, PointCoordinates } from "@/types/pathfinding";
import { Eye, EyeOff, Play, Square, Trash2, Upload, X } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  hideExplored: boolean;
  onToggleHideExplored: (hide: boolean) => void;
  startNodes: PointCoordinates[];
  goalNodes: PointCoordinates[];
  activeStartNode: string | null;
  activeGoalNode: string | null;
  onStartNodeSelect: (id: string) => void;
  onGoalNodeSelect: (id: string) => void;
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
  hideExplored,
  onToggleHideExplored,
  startNodes,
  goalNodes,
  activeStartNode,
  activeGoalNode,
  onStartNodeSelect,
  onGoalNodeSelect,
}) => {
  const tools: { type: NodeType; label: string; color: string }[] = [
    { type: "start", label: "Start", color: "bg-blue-500/70" },
    { type: "goal", label: "Goal", color: "bg-red-500/70" },
    { type: "wall", label: "Wall", color: "bg-gray-800/70" },
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
          <p className="text-xs text-gray-400">
            Click to place points. Click and drag to create walls quickly.
          </p>
        </div>

        {/* Start & Goal Point Selection */}
        {(startNodes.length > 0 || goalNodes.length > 0) && (
          <>
            <Separator className="bg-white/20" />
            
            <div className="space-y-4">
              <Label className="text-white font-medium">Path Selection</Label>
              
              {startNodes.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-gray-300">Start Point</Label>
                  <Select 
                    value={activeStartNode || undefined} 
                    onValueChange={onStartNodeSelect}
                    disabled={isSearching || startNodes.length === 0}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select start point" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {startNodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.name || `Start at (${node.row}, ${node.col})`}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {goalNodes.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-gray-300">Goal Point</Label>
                  <Select 
                    value={activeGoalNode || undefined} 
                    onValueChange={onGoalNodeSelect}
                    disabled={isSearching || goalNodes.length === 0}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select goal point" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {goalNodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.name || `Goal at (${node.row}, ${node.col})`}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </>
        )}

        <Separator className="bg-white/20" />

        {/* Background Image Controls */}
        <div className="space-y-4">
          <Label className="text-white font-medium">Display Options</Label>
          <div className="flex flex-col gap-3">
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

          <div className="grid grid-cols-1 gap-3 mt-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-grid"
                checked={showGrid}
                onCheckedChange={onToggleGrid}
                disabled={isSearching}
              />
              <Label htmlFor="show-grid" className="text-gray-300">Show Grid Lines</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="hide-explored"
                checked={hideExplored}
                onCheckedChange={onToggleHideExplored}
                disabled={isSearching}
              />
              <Label htmlFor="hide-explored" className="text-gray-300">Hide Explored Nodes & Walls</Label>
              {hideExplored ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-white/20" />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={onSearch}
            disabled={isSearching || !activeStartNode || !activeGoalNode}
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
