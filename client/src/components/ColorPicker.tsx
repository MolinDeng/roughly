import { cn } from '@/lib/utils';
import { useColorPickerStore } from '@/stores/colorpicker-store';
import { RgbaStringColorPicker } from 'react-colorful';

interface ColorPickerProps {
  colorStr: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ colorStr, onChange }: ColorPickerProps) {
  const { active } = useColorPickerStore();
  return (
    <div className={cn()}>
      <RgbaStringColorPicker color={colorStr} onChange={onChange} />
    </div>
  );
}
