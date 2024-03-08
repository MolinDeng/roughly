import { create } from 'zustand';

export interface ColorPickerStore {
  active: boolean;
  name: 'fill' | 'stroke';
  setActive: (active: boolean) => void;
  setName: (name: 'fill' | 'stroke') => void;
}

export const useColorPickerStore = create<ColorPickerStore>((set) => ({
  active: false,
  name: 'fill',
  setActive: (active) => set({ active }),
  setName: (name) => set({ name }),
}));
