import { RoughOptions, RoughTool } from '@/types/type';
import { RoughElement } from './RoughElement';
import { useOptionStore } from '@/stores/option-store';

export class RoughFactor {
  static create(
    type: RoughTool,
    x1: number,
    y1: number,
    x2: number = 0,
    y2: number = 0
  ): RoughElement {
    const { options: o } = useOptionStore();
    const options = { ...o };
    return new RoughElement(type, x1, y1, x2, y2, options);
  }
}
