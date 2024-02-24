import { Anchor, EleSnapshot, RoughOptions, RoughTool } from '@/types/type';
import { Drawable } from 'roughjs/bin/core';
import short from 'short-uuid';
import rough from 'roughjs';
import { randomStyle } from '@/lib/rough-utils';
import { distance, isInTriangle, nearPoint } from '@/lib/math';

export class RoughElement {
  type: RoughTool;
  uuid: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  drawable: Drawable | null;
  options: RoughOptions;

  constructor(
    type: RoughTool,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options: RoughOptions
  ) {
    this.type = type;
    this.uuid = short.generate();
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.drawable = null;
    this.options = options;
    // fix seed for consistent hachure
    this.options.seed = Math.floor(Math.random() * 2 ** 31);
    this.options.fillStyle = randomStyle(); // ! Debug only
  }

  isDrawable() {
    return this.drawable !== null;
  }

  getSnapshot(): EleSnapshot {
    return { x1: this.x1, y1: this.y1, x2: this.x2, y2: this.y2 };
  }

  update(x1: number, y1: number, x2: number, y2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    const g = rough.generator();
    if (this.type === 'line') {
      this.drawable = g.line(x1, y1, x2, y2, this.options);
    } else if (this.type === 'arrow') {
      const arrowLength = Math.min(
        20,
        distance({ x: x1, y: y1 }, { x: x2, y: y2 }) / 4
      );
      const Q = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
      const arrowAngle = Math.atan2(y2 - Q.y, x2 - Q.x);
      const arrowPoint1 = {
        x: x2 - arrowLength * Math.cos(arrowAngle - Math.PI / 6),
        y: y2 - arrowLength * Math.sin(arrowAngle - Math.PI / 6),
      };
      const arrowPoint2 = {
        x: x2 - arrowLength * Math.cos(arrowAngle + Math.PI / 6),
        y: y2 - arrowLength * Math.sin(arrowAngle + Math.PI / 6),
      };
      const svgPath = `
          M ${x1} ${y1}
          Q ${Q.x} ${Q.y} ${x2} ${y2}
          L ${arrowPoint1.x} ${arrowPoint1.y}
          M ${x2} ${y2}
          L ${arrowPoint2.x} ${arrowPoint2.y}
        `;

      this.drawable = g.path(svgPath, this.options);
    } else if (this.type === 'rect') {
      this.drawable = g.rectangle(x1, y1, x2 - x1, y2 - y1, this.options);
    } else if (this.type === 'diamond') {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      console.log('fillStyle', this.options.fillStyle);
      this.drawable = g.polygon(
        [
          [midX, y1],
          [x2, midY],
          [midX, y2],
          [x1, midY],
        ],
        this.options
      );
    } else if (this.type === 'ellipse') {
      this.drawable = g.ellipse(
        (x1 + x2) / 2,
        (y1 + y2) / 2,
        x2 - x1,
        y2 - y1,
        this.options
      );
    }
  }

  resize(clientX: number, clientY: number, anchor: Anchor) {
    if (anchor === 'tl') {
      this.x1 = clientX;
      this.y1 = clientY;
    } else if (anchor === 'tr') {
      this.y1 = clientY;
      this.x2 = clientX;
    } else if (anchor === 'bl') {
      this.x1 = clientX;
      this.y2 = clientY;
    } else if (anchor === 'br') {
      this.x2 = clientX;
      this.y2 = clientY;
    }
    this.update(this.x1, this.y1, this.x2, this.y2);
  }

  normalize() {
    // ! Seems there is no need to normalize the line and arrow
    if (this.type === 'line') {
      // if (this.x1 < this.x2 || (this.x1 === this.x2 && this.y1 < this.y2))
      //   return;
      // const [x1, y1, x2, y2] = [this.x2, this.y2, this.x1, this.y1];
      // this.update(x1, y1, x2, y2);
    } else if (this.type === 'arrow') {
      // if (this.x1 < this.x2 || (this.x1 === this.x2 && this.y1 < this.y2))
      //   return;
      // const [x1, y1, x2, y2] = [this.x2, this.y2, this.x1, this.y1];
      // this.update(x1, y1, x2, y2);
    } else if (
      this.type === 'rect' ||
      this.type === 'ellipse' ||
      this.type === 'diamond'
    ) {
      const [xMin, xMax] = [
        Math.min(this.x1, this.x2),
        Math.max(this.x1, this.x2),
      ];
      const [yMin, yMax] = [
        Math.min(this.y1, this.y2),
        Math.max(this.y1, this.y2),
      ];
      this.update(xMin, yMin, xMax, yMax);
    }
  }

  anchorWithinMe(x: number, y: number): Anchor {
    const { type, x1, y1, x2, y2 } = this;
    if (type === 'line' || type === 'arrow') {
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
    } else if (type === 'diamond') {
      const topLeft = nearPoint(x, y, x1, y1, 'tl');
      const topRight = nearPoint(x, y, x2, y1, 'tr');
      const bottomLeft = nearPoint(x, y, x1, y2, 'bl');
      const bottomRight = nearPoint(x, y, x2, y2, 'br');
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const inside =
        isInTriangle(
          { x, y },
          { x: midX, y: y1 },
          { x: x2, y: midY },
          { x: midX, y: y2 }
        ) ||
        isInTriangle(
          { x, y },
          { x: x1, y: midY },
          { x: midX, y: y1 },
          { x: midX, y: y2 }
        )
          ? 'inside'
          : null;

      return topLeft || topRight || bottomLeft || bottomRight || inside;
    }
    return null;
  }

  // TODO serialize
  // toJson(): string {
  // return JSON.stringify(this);
  // }
  // TODO deserialize
  // static fromJson(json: string): RoughElement {
  // const obj = JSON.parse(json);
  // return new RoughElement(obj.type, obj.x1, obj.y1, obj.x2, obj.y2);
  // }
}
