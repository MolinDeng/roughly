import { RoughElement } from '@/models/RoughElement';
import { SelectedPayload } from '@/types/type';

// * Not that efficient, but it works
const getSelectedPayload = (
  elements: RoughElement[],
  hitX: number,
  hitY: number
): SelectedPayload => {
  for (let i = elements.length - 1; i >= 0; i--) {
    const anchor = elements[i].anchorWithinMe(hitX, hitY);
    if (anchor !== null)
      return {
        hitX,
        hitY,
        anchor,
        ele: elements[i],
        snapshot: elements[i].getSnapshot(),
      };
  }
  return getNullPayload();
};

const getNullPayload = (): SelectedPayload => {
  return {
    hitX: 0,
    hitY: 0,
    anchor: '',
    ele: null,
    snapshot: { x1: 0, y1: 0, x2: 0, y2: 0 },
  };
};

export { getSelectedPayload, getNullPayload };
