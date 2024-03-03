'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToolStore } from '@/stores/tool-store';
import { RoughTool } from '@/types/type';
import {
  Circle,
  Minus,
  MousePointer,
  Square,
  Diamond,
  MoveUpRight,
  Hand,
  LucideIcon,
  Pencil,
  Type,
} from 'lucide-react';

type Tool = {
  value: RoughTool;
  ariaLabel: string;
  Icon: LucideIcon;
  shortcut?: string;
  disabled?: boolean;
};

const tools: Tool[] = [
  {
    value: 'pan',
    ariaLabel: 'Pan',
    Icon: Hand,
  },
  {
    value: 'select',
    ariaLabel: 'Select object',
    Icon: MousePointer,
    shortcut: '1',
  },
  {
    value: 'line',
    ariaLabel: 'Toggle line',
    Icon: Minus,
    shortcut: '2',
  },
  {
    value: 'arrow',
    ariaLabel: 'Toggle arrow',
    Icon: MoveUpRight,
    shortcut: '3',
  },
  {
    value: 'rect',
    ariaLabel: 'Toggle rect',
    Icon: Square,
    shortcut: '4',
  },
  {
    value: 'diamond',
    ariaLabel: 'Toggle diamond',
    Icon: Diamond,
    shortcut: '5',
  },
  {
    value: 'ellipse',
    ariaLabel: 'Toggle ellipse',
    Icon: Circle,
    shortcut: '6',
  },
  {
    value: 'pencil',
    ariaLabel: 'Toggle pencil',
    Icon: Pencil,
    shortcut: '7',
    disabled: true,
  },
  {
    value: 'text',
    ariaLabel: 'Toggle text',
    Icon: Type,
    shortcut: '8',
    disabled: true,
  },
];

export function ToolBar() {
  const { currTool, setTool } = useToolStore();
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-md select-none">
      <ToggleGroup
        className="h-3"
        size={'sm'}
        type="single"
        variant={'violet'}
        value={currTool}
        onValueChange={(value: RoughTool) => {
          if (value === '') return;
          setTool(value);
        }}
      >
        {tools.map((tool) => (
          <div key={tool.value} className="relative text-gray-400">
            <ToggleGroupItem
              value={tool.value}
              aria-label={tool.ariaLabel}
              disabled={tool.disabled}
            >
              <tool.Icon className="h-3 w-3" />
              {tool.shortcut && (
                <span className="absolute text-[0.625rem] bottom-[1px] right-[2px]">
                  {tool.shortcut}
                </span>
              )}
            </ToggleGroupItem>
          </div>
        ))}
      </ToggleGroup>
    </div>
  );
}
