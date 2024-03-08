import React from 'react';
import { Button } from './ui/button';
import Checkboard from './Checkboard';
import { useColorPickerStore } from '@/stores/colorpicker-store';

const getAlpha = (color: string): number => {
  // alpha should match 0, 1, and 0.xx
  const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)/);
  if (match) {
    return parseFloat(match[4]);
  }
  return 1;
};

interface ColorPickerButtonProps {
  currValue: string;
  for: 'fill' | 'stroke';
}

export default function ColorPickerButton({
  currValue,
  for: _for,
}: ColorPickerButtonProps) {
  const { setActive, active, setName, name } = useColorPickerStore();

  return (
    <Button
      variant={'ghostViolet'}
      size="icon"
      className="h-7 w-7 rounded-sm"
      onClick={(e) => {
        if (active && name === _for) {
          setActive(false);
          return;
        }
        if (active && name !== _for) {
          setName(_for);
          return;
        }
        setActive(!active);
        setName(_for);
      }}
    >
      {currValue === 'none' || getAlpha(currValue) <= 0.05 ? (
        <Checkboard className="h-3.5 w-3.5 rounded-[4px]" />
      ) : (
        <div
          className="h-3.5 w-3.5 rounded-[4px]"
          style={{
            backgroundColor: currValue,
          }}
        />
      )}
    </Button>
  );
}
