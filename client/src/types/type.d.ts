import { Drawable, Options } from 'roughjs/bin/core';

type RoughType =
  | 'line'
  | 'rect'
  | 'ellipse'
  | 'circle'
  | 'linearPath'
  | 'arc'
  | 'curve'
  | 'polygon'
  | 'path';

type RoughElement = {
  type: RoughType;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  drawable: Drawable | null;
};

type RoughOptions = {} & Options;
