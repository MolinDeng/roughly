import { Anchor, Point, RoughOptions, RoughTool } from '@/types/type';
import { RoughElement } from '../RoughElement';
import { distance } from '@/lib/math';
import rough from 'roughjs';

export class RArrow extends RoughElement {
  q: Point;
  constructor(
    type: RoughTool,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options: RoughOptions
  ) {
    super(type, x1, y1, x2, y2, options);
    this.q = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
  }
  update(x1: number, y1: number, x2: number, y2: number): void {
    const g = rough.generator();
    const arrowLength = Math.min(
      20,
      distance({ x: x1, y: y1 }, { x: x2, y: y2 }) / 4
    );
    const Q = this.q;
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
  }

  resize(clientX: number, clientY: number, anchor: Anchor): void {
    if (anchor === 'q') {
      this.q = { x: clientX, y: clientY };
    }
    this.update(this.x1, this.y1, this.x2, this.y2);
  }
}
