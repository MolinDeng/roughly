import { ConfigurableOptions, RoughOptions, RoughTool } from '@/types/type';
import { RoughElement } from './RoughElement';

const defaultRoughOptions: RoughOptions = {
  // configurable options
  stroke: 'rgba(0,0,0,1)',
  fill: undefined,
  fillStyle: 'hachure',
  strokeWidth: 1,
  strokeLineDash: undefined,
  roughness: 0.5,
  // non-configurable options
  bowing: 6, // depending on the roughness
  //   fillWeight: 1, // thicker lines for hachure
  //   hachureAngle: 60, // angle of hachure,
  //   hachureGap: 1,
  // simplification: 0.5, // useful for AI-generated SVG
};

const parseOptions = (options: ConfigurableOptions): RoughOptions => {
  const ro = { ...defaultRoughOptions };
  const { stroke, fill, fillStyle, strokeWidth, strokeLineDash, roughness } =
    options;
  // stroke
  ro.stroke = stroke;
  // fill
  if (fill === 'none') ro.fill = undefined;
  else ro.fill = fill;
  // fillStyle
  if (fill !== 'none') ro.fillStyle = fillStyle;
  // strokeWidth
  ro.strokeWidth = parseFloat(strokeWidth);
  // strokeLineDash
  if (strokeLineDash === 'none') ro.strokeLineDash = undefined;
  else if (strokeLineDash === 'd') ro.strokeLineDash = [8, 8];
  else if (strokeLineDash === 'dd') ro.strokeLineDash = [4, 4];
  else ro.strokeLineDash = undefined;
  // roughness
  ro.roughness = parseFloat(roughness);

  // calculate unconventional options
  ro.bowing = ro.roughness * 2;

  return ro;
};

export class RoughFactor {
  static create(
    type: RoughTool,
    options: ConfigurableOptions,
    x1: number,
    y1: number,
    x2: number = 0,
    y2: number = 0
  ): RoughElement {
    return new RoughElement(type, parseOptions(options), x1, y1, x2, y2);
  }
}
