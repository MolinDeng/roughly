import { create } from 'zustand';

export interface ColorPickerStore {
  active: boolean;
  setActive: (active: boolean) => void;
}

export const useColorPickerStore = create<ColorPickerStore>((set) => ({
  active: false,
  setActive: (active) => set({ active }),
}));
