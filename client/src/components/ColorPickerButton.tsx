import React from 'react';
import { Button } from './ui/button';

interface ColorPickerButtonProps {
  currValue: string;
}

export default function ColorPickerButton({
  currValue,
}: ColorPickerButtonProps) {
  return (
    <Button variant={'ghostViolet'} size="icon" className="h-7 w-7 rounded-sm">
      <div
        className="h-3.5 w-3.5 rounded-[4px]"
        style={{
          backgroundColor: currValue,
        }}
      />
    </Button>
  );
}
