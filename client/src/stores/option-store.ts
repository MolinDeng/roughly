import { ConfigurableOptions } from '@/types/type';
import { create } from 'zustand';

export interface OptionStore {
  options: ConfigurableOptions;
  setOption: (key: string, value: string) => void;
}

export const useOptionStore = create<OptionStore>((set) => ({
  options: {
    stroke: 'rgba(0,0,0,1)',
    fill: 'none',
    fillStyle: 'zigzag',
    strokeWidth: '1',
    strokeLineDash: 'none',
    roughness: '0.5',
  },
  setOption: (key, value) =>
    set(({ options }) => {
      (options as any)[key] = value;
      return { options };
    }),
}));
