import { Drawable, Options } from 'roughjs/bin/core';

type RoughTool = 'any' | 'select' | 'line' | 'rect';

type RoughElement = {
  type: RoughTool;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  drawable: Drawable | null;
};

type RoughAction = 'idle' | 'drawing' | 'moving';

type RoughOptions = {} & Options;

type SelectPayload = {
  x: number;
  y: number;
  id: number;
  ele: RoughElement | null;
};
