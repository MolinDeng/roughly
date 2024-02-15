import { RoughType } from '@/types/type';
import { create } from 'zustand';

export interface RoughStore {
  drawType: RoughType;
  setDrawType: (t: RoughType) => void;
}

export const useRoughStore = create<RoughStore>((set) => ({
  drawType: 'line',
  setDrawType: (t: RoughType) => set({ drawType: t }),
}));
