import { Anchor, Point } from '@/types/type';

const distance = (a: Point, b: Point) => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};

const sign = (p1: Point, p2: Point, p3: Point) => {
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
};

const isInTriangle = (p: Point, a: Point, b: Point, c: Point) => {
  const d1 = sign(p, a, b);
  const d2 = sign(p, b, c);
  const d3 = sign(p, c, a);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
};

const nearPoint = (x: number, y: number, x1: number, y1: number): boolean => {
  return Math.abs(x - x1) <= 8 && Math.abs(y - y1) <= 8;
};

const slope = (x1: number, y1: number, x2: number, y2: number) => {
  return (y2 - y1) / (x2 - x1);
};

export { distance, isInTriangle, nearPoint, slope };
