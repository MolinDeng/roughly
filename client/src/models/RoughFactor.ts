import { RoughOptions, RoughTool } from '@/types/type';
import { RoughElement } from './RoughElement';

export class RoughFactor {
  static create(
    type: RoughTool,
    options: RoughOptions,
    x1: number,
    y1: number,
    x2: number = 0,
    y2: number = 0
  ): RoughElement {
    return new RoughElement(type, options, x1, y1, x2, y2);
  }
}
