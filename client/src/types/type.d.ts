import { Drawable, Options } from 'roughjs/bin/core';

type RoughTool = 'any' | 'select' | 'line' | 'rect' | 'ellipse';

type RoughElement = {
  type: RoughTool;
  // uuid: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  drawable: Drawable | null;
};

type RoughAction = 'idle' | 'drawing' | 'moving' | 'resize';

type RoughOptions = {} & Options;

type HoverPayload = {
  x: number;
  y: number;
  id: number;
  position: string | null;
  ele: RoughElement | null;
};
