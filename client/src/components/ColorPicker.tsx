import { RgbaStringColorPicker } from 'react-colorful';

interface ColorPickerProps {
  colorStr: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ colorStr, onChange }: ColorPickerProps) {
  return (
    <div className="fixed left-44 top-[10%] shadow-lg rounded-lg select-none">
      <RgbaStringColorPicker color={colorStr} onChange={onChange} />
    </div>
  );
}
