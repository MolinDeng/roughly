import { ConfigurableOptions } from '@/types/type';
import { create } from 'zustand';

export interface OptionStore {
  options: ConfigurableOptions;
  setKeyValue: (key: string, value: string) => void;
  setOptions: (options: ConfigurableOptions) => void;
  resetOptions: () => void;
}

const d: ConfigurableOptions = {
  stroke: 'rgba(0,0,0,0.8)',
  fill: 'none',
  fillStyle: 'zigzag',
  strokeWidth: '1.25',
  strokeLineDash: 'none',
  roughness: '0.5',
};

export const useOptionStore = create<OptionStore>((set) => ({
  options: { ...d },
  setKeyValue: (key, value) =>
    set(({ options }) => {
      (options as any)[key] = value;
      options = { ...options };
      return { options };
    }),
  setOptions: (options) => set({ options: { ...options } }),
  resetOptions: () => set({ options: { ...d } }),
}));
