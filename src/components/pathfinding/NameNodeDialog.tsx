
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface NameNodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  nodeType: "start" | "goal";
  defaultName?: string;
}

export const NameNodeDialog: React.FC<NameNodeDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  nodeType,
  defaultName = "",
}) => {
  const [name, setName] = useState(defaultName);

  const handleSave = () => {
    onSave(name);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 text-white border border-slate-700">
        <DialogHeader>
          <DialogTitle>Name {nodeType === "start" ? "Start" : "Goal"} Point</DialogTitle>
        </DialogHeader>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Enter a name for this ${nodeType} point`}
          className="bg-slate-700 border-slate-600 text-white"
          autoFocus
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="border-slate-600 text-slate-300">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
