'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useRoughStore } from '@/stores/rough-store';
import { RoughTool } from '@/types/type';
import {
  Circle,
  Minus,
  MousePointer,
  Square,
  Diamond,
  MoveUpRight,
} from 'lucide-react';

export function ToolBar() {
  const { currTool, setTool } = useRoughStore();
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-md">
      <ToggleGroup
        className="h-3 "
        type="single"
        variant={'violet'}
        value={currTool}
        onValueChange={(value: RoughTool) => {
          if (value === '') return;
          setTool(value);
        }}
      >
        <ToggleGroupItem value="select" aria-label="Select object">
          <MousePointer className="h-3 w-3" />
        </ToggleGroupItem>
        <ToggleGroupItem value="line" aria-label="Toggle line">
          <Minus className="h-3 w-3" />
        </ToggleGroupItem>
        <ToggleGroupItem value="arrow" aria-label="Toggle arrow">
          <MoveUpRight className="h-3 w-3" />
        </ToggleGroupItem>
        <ToggleGroupItem value="rect" aria-label="Toggle rect">
          <Square className="h-3 w-3" />
        </ToggleGroupItem>
        <ToggleGroupItem value="diamond" aria-label="Toggle diamond">
          <Diamond className="h-3 w-3" />
        </ToggleGroupItem>
        <ToggleGroupItem value="ellipse" aria-label="Toggle ellipse">
          <Circle className="h-3 w-3" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
