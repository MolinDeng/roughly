import { RoughTool } from '@/types/type';
import { create } from 'zustand';

interface ToolStore {
  currTool: RoughTool;
  setTool: (t: RoughTool) => void;
}

export const useToolStore = create<ToolStore>((set) => ({
  currTool: 'line',
  setTool: (t: RoughTool) => set({ currTool: t }),
}));
