import { RoughOptions, RoughTool } from '@/types/type';
import { create } from 'zustand';

const defaultRoughOptions: RoughOptions = {
  stroke: '#000',
  // fill: 'rgba(255,0,200,0.2)',
  // fillStyle: 'hachure',
  // fillWeight: 3, // thicker lines for hachure
  roughness: 1,
  // strokeWidth: 1,
  // hachureAngle: 60, // angle of hachure,
  // hachureGap: 8,
  // simplification: 0.5, // useful for AI-generated SVG
};

export interface OptionStore {
  options: RoughOptions;
  setOption: (key: string, value: string) => void;
}

export const useOptionStore = create<OptionStore>((set) => ({
  options: defaultRoughOptions,
  setOption: (key, value) =>
    set((state) => {
      if (value === 'none') delete (state.options as any)[key];
      else (state.options as any)[key] = value;
      return state;
    }),
}));
