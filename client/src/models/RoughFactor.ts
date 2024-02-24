import { RoughOptions, RoughTool } from '@/types/type';
import { RoughElement } from './RoughElement';
import { RArrow } from './derived/RArrow';

const defaultRoughOptions: RoughOptions = {
  fill: 'hachure',
  fillStyle: 'dots',
  roughness: 0.5,
  strokeWidth: 1,
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
