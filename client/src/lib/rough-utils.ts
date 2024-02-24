import { RoughElement } from '@/models/RoughElement';
import { RoughFillStyle, SelectedPayload } from '@/types/type';

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
    anchor: null,
    ele: null,
    snapshot: { x1: 0, y1: 0, x2: 0, y2: 0 },
  };
};

// generate a random style
const randomStyle = () => {
  const styles = [
    'hachure',
    'solid',
    'zigzag',
    'cross-hatch',
    'dots',
    'dashed',
    'zigzag-line',
  ];
  return styles[Math.floor(Math.random() * styles.length)] as RoughFillStyle;
};

export { getSelectedPayload, getNullPayload, randomStyle };
