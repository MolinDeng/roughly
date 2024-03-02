import { RoughElement } from '@/models/RoughElement';
import { ClickPayload, RoughFillStyle } from '@/types/type';

const getClickPayload = (
  elements: RoughElement[],
  hitX: number,
  hitY: number
): ClickPayload => {
  for (let i = elements.length - 1; i >= 0; i--) {
    const anchor = elements[i].anchorWithinMe(hitX, hitY);
    if (anchor !== null) return { anchor, ele: elements[i] };
  }
  return { anchor: null, ele: null };
};

export { getClickPayload };
