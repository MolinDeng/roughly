import { RoughOptions, RoughTool } from '@/types/type';
import { RoughElement } from './RoughElement';

const defaultRoughOptions: RoughOptions = {
  fill: 'rgba(255,0,200,0.2)',
  fillStyle: 'hachure',
  fillWeight: 3, // thicker lines for hachure
  roughness: 0.5,
  strokeWidth: 1,
  hachureAngle: 60, // angle of hachure,
  hachureGap: 8,
  // simplification: 0.5, // useful for AI-generated SVG
};

export class RoughFactor {
  static create(
    type: RoughTool,
    x1: number,
    y1: number,
    x2: number = 0,
    y2: number = 0,
    options: RoughOptions = { ...defaultRoughOptions }
  ): RoughElement {
    return new RoughElement(type, x1, y1, x2, y2, options);
  }
}
