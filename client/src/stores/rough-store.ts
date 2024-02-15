import { RoughTool } from '@/types/type';
import { create } from 'zustand';

export interface RoughStore {
  currTool: RoughTool;
  setTool: (t: RoughTool) => void;
}

export const useRoughStore = create<RoughStore>((set) => ({
  currTool: 'line',
  setTool: (t: RoughTool) => set({ currTool: t }),
}));
