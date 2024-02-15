'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useRoughStore } from '@/stores/rough-store';
import { Circle, Minus, Square } from 'lucide-react';

export function ToolBar() {
  const { drawType, setDrawType } = useRoughStore();
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-md">
      <ToggleGroup
        className="h-3"
        type="single"
        value={drawType}
        onValueChange={setDrawType}
      >
        <ToggleGroupItem value="line" aria-label="Toggle line">
          <Minus className="h-3 w-3 rotate-45" />
        </ToggleGroupItem>
        <ToggleGroupItem value="rect" aria-label="Toggle rect">
          <Square className="h-3 w-3" />
        </ToggleGroupItem>
        <ToggleGroupItem value="circle" aria-label="Toggle circle">
          <Circle className="h-3 w-3" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
