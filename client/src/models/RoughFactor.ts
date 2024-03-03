import { ConfigurableOptions, RoughTool } from '@/types/type';
import { RoughElement } from './RoughElement';

export class RoughFactor {
  static create(
    type: RoughTool,
    options: ConfigurableOptions,
    x1: number,
    y1: number,
    x2: number = 0,
    y2: number = 0
  ): RoughElement {
    const o = { ...options };
    return new RoughElement(type, o, x1, y1, x2, y2);
  }
}
