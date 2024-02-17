import {
  HoverPayload,
  RoughElement,
  RoughOptions,
  RoughTool,
} from '@/types/type';
import rough from 'roughjs';
import short, { uuid } from 'short-uuid';
const createGrainyBg = (ctx: CanvasRenderingContext2D) => {
  return new Promise((resolve, reject) => {
    const bg = new Image();
    bg.src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAElBMVEUAAAD8/vz08vT09vT8+vzs7uxH16TeAAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAuFJREFUOI0Vk+3NLiEIRG1B8ClAYAsQ2AIEt4D9ePtv5Xp/mZgYJ2fOFJKEfInkVWY2aglmQFkimRTV7MblYyVqD7HXyhKsSuPX12MeDhRHLtGvRG+P+B/S0Vu4OswR9tmvwNPyhdCDbVayJGads/WiUWcjCvCnruTBNHS9gmX2VzVbk7ZvB1gb1hkWFGl+A/n+/FowcO34U/XvKqZ/fHY+6vgRfU92XrOBUbGeeDfQmjWjdrK+frc6FdGReQhfSF5JvR29O2QrfNw1huTwlgsyXLo0u+5So82sgv7tsFZR2nxB6lXiquHrfD8nfYZ9SeT0LiuvSoVrxGY16pCNRZKqvwWsn5OHypPBELzohMCaRaa0ceTHYqe7X/gfJEEtKFbJpWoNqO+aS1cuTykGPpK5Ga48m6L3NefTr013KqYBQu929iP1oQ/7UwSR+i3zqruUmT84qmhzLpxyj7pr9kg7LKvqaXxZmdpn+6o8sHqSqojy02gU3U8q9PnpidiaLks0mbMYz+q2uVXsoBQ8bfURULYxRgZVYCHMv9F4OA7qxT2NPPpvGQ/sTDH2yznKh7E2AcErfcNsaIoN1izzbJiaY63x4QjUFdBSvDCvugPpu5xDny0jzEeuUQbcP1aGT9V90uixngTRLYNEIIZ6yOF1H8tm7rj2JxiefsVy53zGVy3ag5uuPsdufYOzYxLRxngKe7nhx3VAq54pmz/DK9/Q3aDam2Yt3hNXB4HuU87jKNd/CKZn77Qdn5QkXPfqSkhk7hGOXXB+7v09KbBbqdvxGqa0AqfK/atIrL2WXdAgXAJ43Wtwe/aIoacXezeGPMlhDOHDbSfHnaXsL2QzbT82GRwZuezdwcoWzx5pnOnGMUdHuiY7lhdyWzWiHnucLZQxYStMJbtcydHaQ6vtMbe0AcDbxG+QG14AL94xry4297xpy9Cpf1OoxZ740gHDfrK+gtsy0xabwJmfgtCeii79B6aj0SJeLbd7AAAAAElFTkSuQmCC';

    bg.onload = () => {
      const pat = ctx.createPattern(bg, 'repeat');
      ctx.fillStyle = pat as CanvasPattern;
      const { width, height } = ctx.canvas.getBoundingClientRect();
      ctx.fillRect(0, 0, width, height);
      resolve('Background image loaded successfully');
    };
    bg.onerror = () => {
      ctx.fillStyle = '#e6f1ff';
      const { width, height } = ctx.canvas.getBoundingClientRect();
      ctx.fillRect(0, 0, width, height);
      reject(new Error('Failed to load background image'));
    };
    // const pat = ctx.createPattern(bg, 'repeat');
    // ctx.fillStyle = pat as CanvasPattern;
    // const { width, height } = ctx.canvas.getBoundingClientRect();
    // ctx.fillRect(0, 0, width, height);
  });
};

const generator = rough.generator();
const roughOptions: RoughOptions = {
  fill: 'hachure',
  fillStyle: 'cross-hatch',
  roughness: 0.5,
};
const createRoughElement = (
  type: RoughTool,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): RoughElement => {
  let drawable = null;
  switch (type) {
    case 'line':
      drawable = generator.line(x1, y1, x2, y2, roughOptions);
      break;
    case 'rect':
      drawable = generator.rectangle(x1, y1, x2 - x1, y2 - y1, roughOptions);
      break;
    case 'ellipse':
      drawable = generator.ellipse(
        (x1 + x2) / 2,
        (y1 + y2) / 2,
        x2 - x1,
        y2 - y1,
        roughOptions
      );
      break;
  }
  const uuid = short.generate();
  return { type, x1, y1, x2, y2, drawable };
};

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};

const nearPoint = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  name: string
): string | null => {
  return Math.abs(x - x1) <= 5 && Math.abs(y - y1) <= 5 ? name : null;
};

const positionWithinElement = (
  x: number,
  y: number,
  ele: RoughElement
): string | null => {
  const { type, x1, y1, x2, y2 } = ele;
  if (type === 'line') {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    const start = nearPoint(x, y, x1, y1, 'tl');
    const end = nearPoint(x, y, x2, y2, 'br');
    const inside = Math.abs(offset) <= 1 ? 'inside' : null;
    return start || end || inside;
  } else if (type === 'rect') {
    const topLeft = nearPoint(x, y, x1, y1, 'tl');
    const topRight = nearPoint(x, y, x2, y1, 'tr');
    const bottomLeft = nearPoint(x, y, x1, y2, 'bl');
    const bottomRight = nearPoint(x, y, x2, y2, 'br');
    const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
    return topLeft || topRight || bottomLeft || bottomRight || inside;
  } else if (type === 'ellipse') {
    const topLeft = nearPoint(x, y, x1, y1, 'tl');
    const topRight = nearPoint(x, y, x2, y1, 'tr');
    const bottomLeft = nearPoint(x, y, x1, y2, 'bl');
    const bottomRight = nearPoint(x, y, x2, y2, 'br');
    // TODO: Maybe just use the rectangle formula for the ellipse
    const center = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
    const rx = Math.abs(x2 - x1) / 2;
    const ry = Math.abs(y2 - y1) / 2;
    const inside =
      (x - center.x) ** 2 / rx ** 2 + (y - center.y) ** 2 / ry ** 2 <= 1
        ? 'inside'
        : null;
    return topLeft || topRight || bottomLeft || bottomRight || inside;
  }
  return null;
};
// * Not that efficient, but it works
const getHoverPayload = (
  elements: RoughElement[],
  x: number,
  y: number
): HoverPayload => {
  for (let i = elements.length - 1; i >= 0; i--) {
    const pos = positionWithinElement(x, y, elements[i]);
    if (pos !== null) return { x, y, id: i, ele: elements[i], position: pos };
  }
  return { x, y, id: -1, ele: null, position: null };
};

const adjustCoords = (
  ele: RoughElement
): { x1: number; y1: number; x2: number; y2: number } => {
  const { type, x1, y1, x2, y2 } = ele;
  if (type === 'line') {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) return { x1, y1, x2, y2 };
    return { x1: x2, y1: y2, x2: x1, y2: y1 };
  } else if (type === 'rect') {
    const [xMin, xMax] = [Math.min(x1, x2), Math.max(x1, x2)];
    const [yMin, yMax] = [Math.min(y1, y2), Math.max(y1, y2)];
    return { x1: xMin, y1: yMin, x2: xMax, y2: yMax };
  } else if (type === 'ellipse') {
    const [xMin, xMax] = [Math.min(x1, x2), Math.max(x1, x2)];
    const [yMin, yMax] = [Math.min(y1, y2), Math.max(y1, y2)];
    return { x1: xMin, y1: yMin, x2: xMax, y2: yMax };
  }
  return { x1, y1, x2, y2 };
};

const nullPayload: HoverPayload = {
  x: 0,
  y: 0,
  id: -1,
  position: null,
  ele: null,
};

const cursorFromPosition = (pos: string | null): string => {
  if (pos === 'inside') return 'move';
  if (pos === 'tl' || pos === 'br') return 'nwse-resize';
  if (pos === 'tr' || pos === 'bl') return 'nesw-resize';
  return 'default';
};

const resizeElement = (
  clientX: number,
  clientY: number,
  position: string,
  ele: RoughElement
): { x1: number; y1: number; x2: number; y2: number } => {
  const { x1, y1, x2, y2 } = ele;
  if (position === 'tl') return { x1: clientX, y1: clientY, x2, y2 };
  if (position === 'tr') return { x1, y1: clientY, x2: clientX, y2 };
  if (position === 'bl') return { x1: clientX, y1, x2, y2: clientY };
  if (position === 'br') return { x1, y1, x2: clientX, y2: clientY };
  return { x1, y1, x2, y2 };
};
export {
  createGrainyBg,
  createRoughElement,
  getHoverPayload,
  adjustCoords,
  nullPayload,
  cursorFromPosition,
  resizeElement,
};
