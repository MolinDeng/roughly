import { RoughElement } from '@/models/RoughElement';
import { Drawable, Options } from 'roughjs/bin/core';

type RoughTool = 'any' | 'select' | 'line' | 'rect' | 'ellipse';

// type RoughElement = {
//   type: RoughTool;
//   // uuid: string;
//   x1: number;
//   y1: number;
//   x2: number;
//   y2: number;
//   drawable: Drawable | null;
// };

type CanvasState = 'idle' | 'drawing' | 'moving' | 'resize';

type RoughOptions = {} & Options;

type SelectedPayload = {
  hitX: number;
  hitY: number;
  anchor: string;
  ele: RoughElement | null;
  snapshot: EleSnapshot;
};

type EleSnapshot = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
