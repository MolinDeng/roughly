import { RoughElement } from '@/models/RoughElement';
import { Drawable, Options } from 'roughjs/bin/core';

type RoughTool =
  | ''
  | 'pan'
  | 'select'
  | 'line'
  | 'rect'
  | 'ellipse'
  | 'diamond'
  | 'arrow'
  | 'pencil'
  | 'text';

type CanvasState = 'idle' | 'drawing' | 'moving' | 'resize';

//  hachure(default), solid, zigzag, cross-hatch, dots, dashed, or zigzag-line
type RoughFillStyle =
  | 'hachure'
  | 'solid'
  | 'zigzag'
  | 'cross-hatch'
  // | 'dots' // costly
  | 'dashed'
  | 'zigzag-line'; // TODO Some of them are not efficient to use

type ConfigurableOptions = {
  stroke: string;
  fill: string;
  fillStyle: RoughFillStyle;
  strokeWidth: string;
  strokeLineDash: string;
  roughness: string;
};

type RoughOptions = {
  fillStyle?: RoughFillStyle;
} & Options;

type ClickPayload = {
  anchor: Anchor;
  ele: RoughElement | null;
};

type EleSnapshot = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  qx?: number; // for arrow only
  qy?: number; // for arrow onlys
};

type Point = {
  x: number;
  y: number;
};

// q for quadratic curve's control point
type Anchor = 'tl' | 'tr' | 'bl' | 'br' | 'inside' | 'q' | null;
