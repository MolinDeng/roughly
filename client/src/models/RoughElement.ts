import {
  Anchor,
  ConfigurableOptions,
  EleSnapshot,
  RoughOptions,
  RoughTool,
} from '@/types/type';
import { Drawable } from 'roughjs/bin/core';
import short from 'short-uuid';
import rough from 'roughjs';
import { distance, isInTriangle, nearPoint, slope } from '@/lib/math';

const defaultRoughOptions: RoughOptions = {
  // configurable options
  stroke: 'rgba(0,0,0,0.8)',
  fill: undefined,
  fillStyle: 'hachure',
  strokeWidth: 1.25,
  strokeLineDash: undefined,
  roughness: 0.5,
  // non-configurable options
  bowing: 2, // depending on the roughness
  fillWeight: 1, // thicker lines for hachure (if not set, strokeWidth is strokeWidth / 2)
  //   hachureAngle: 60, // angle of hachure,
  //   hachureGap: 1,
  // simplification: 0.5, // useful for AI-generated SVG
};

const parseOptions = (
  type: RoughTool,
  options: ConfigurableOptions
): RoughOptions => {
  const ro = { ...defaultRoughOptions };
  const { stroke, fill, fillStyle, strokeWidth, strokeLineDash, roughness } =
    options;
  // stroke
  ro.stroke = stroke;
  // fill
  if (fill === 'none') ro.fill = undefined;
  else ro.fill = fill;
  // fillStyle
  if (fill !== 'none') ro.fillStyle = fillStyle;
  // strokeWidth
  ro.strokeWidth = parseFloat(strokeWidth);
  // strokeLineDash
  if (strokeLineDash === 'none') ro.strokeLineDash = undefined;
  else if (strokeLineDash === 'd') ro.strokeLineDash = [8, 8];
  else if (strokeLineDash === 'dd') ro.strokeLineDash = [4, 4];
  else ro.strokeLineDash = undefined;
  // roughness
  ro.roughness = parseFloat(roughness);

  // calculate unconventional options
  ro.bowing = ro.roughness * 2;

  // clean data for certain types
  if (type === 'line' || type === 'arrow') {
    ro.fill = undefined;
    ro.fillStyle = 'hachure';
  }

  return ro;
};

export class RoughElement {
  type: RoughTool;
  uuid: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  drawable: Drawable | null;
  options: ConfigurableOptions;
  // * For moving functionality
  private snapshot?: EleSnapshot;
  private seed: number;
  // * For arrow and line only
  qx?: number;
  qy?: number;

  constructor(
    type: RoughTool,
    options: ConfigurableOptions,
    x1: number,
    y1: number,
    x2: number,
    y2: number
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
    this.seed = Math.floor(Math.random() * 2 ** 31);
  }

  isDrawable() {
    return this.drawable !== null;
  }
  // area smaller than 10 is not visible
  isVisible() {
    return Math.abs(this.x2 - this.x1) > 3 || Math.abs(this.y2 - this.y1) > 3;
  }

  getSnapshot(): EleSnapshot {
    return {
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
      qx: this.qx,
      qy: this.qy,
    };
  }

  getGizmo(): Drawable[] {
    const g = rough.generator();
    const opt1 = {
      stroke: 'purple',
      strokeWidth: 0.25,
      roughness: 0,
      // strokeLineDash: [5, 5],
    };
    const opt2 = {
      stroke: 'purple',
      fillStyle: 'solid',
      fill: 'purple',
      strokeWidth: 0.25,
      roughness: 0,
    };
    let { x1, y1, x2, y2, type, qx, qy } = this;
    if (type === 'rect' || type === 'ellipse' || type === 'diamond') {
      // expand the rectangle a little bit
      const ext = 8;
      [x1, x2, y1, y2] = [
        Math.min(x1, x2) - ext,
        Math.max(x1, x2) + ext,
        Math.min(y1, y2) - ext,
        Math.max(y1, y2) + ext,
      ];
      // draw a rectangle using polygon
      const rect = g.rectangle(x1, y1, x2 - x1, y2 - y1, opt1);
      // draw control points
      const p1 = g.circle(x1, y1, 5, opt2);
      const p2 = g.circle(x2, y1, 5, opt2);
      const p3 = g.circle(x2, y2, 5, opt2);
      const p4 = g.circle(x1, y2, 5, opt2);
      return [rect, p1, p2, p3, p4];
    } else if (type === 'line' || type === 'arrow') {
      // draw three control points
      const p1 = g.circle(x1, y1, 8, opt2);
      const p2 = g.circle(x2, y2, 8, opt2);
      const p3 = g.circle(this.qx!, this.qy!, 8, opt2);
      // straight line
      if (Math.abs(slope(x1, y1, x2, y2) - slope(x1, y1, qx!, qy!)) < 0.15)
        return [p1, p2, p3];
      // quadratic line
      const tri = g.polygon(
        [
          [x1, y1],
          [x2, y2],
          [qx!, qy!],
        ],
        opt1
      );
      return [p1, p2, p3, tri];
    }
    return [];
  }

  private render() {
    const ro = parseOptions(this.type, this.options);
    ro.seed = this.seed;

    const { x1, y1, x2, y2 } = this;
    const g = rough.generator();
    if (this.type === 'line') {
      const Q = { x: this.qx!, y: this.qy! };
      const svgPath = `
          M ${x1} ${y1}
          Q ${Q.x} ${Q.y} ${x2} ${y2}
          M ${x2} ${y2}
        `;
      this.drawable = g.path(svgPath, ro);
    } else if (this.type === 'arrow') {
      const arrowLength = Math.min(
        30,
        distance({ x: x1, y: y1 }, { x: x2, y: y2 }) / 4
      );
      const Q = { x: this.qx!, y: this.qy! };
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

      this.drawable = g.path(svgPath, ro);
    } else if (this.type === 'rect') {
      this.drawable = g.rectangle(x1, y1, x2 - x1, y2 - y1, ro);
    } else if (this.type === 'diamond') {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      this.drawable = g.polygon(
        [
          [midX, y1],
          [x2, midY],
          [midX, y2],
          [x1, midY],
        ],
        ro
      );
    } else if (this.type === 'ellipse') {
      this.drawable = g.ellipse(
        (x1 + x2) / 2,
        (y1 + y2) / 2,
        x2 - x1,
        y2 - y1,
        ro
      );
    }
  }

  updateOptions(options: ConfigurableOptions) {
    this.options = options;
    this.render();
  }

  onDraw(x2: number, y2: number) {
    // x1 and y1 are the starting point, remain unchanged
    this.x2 = x2;
    this.y2 = y2;
    if (this.type === 'arrow' || this.type === 'line') {
      this.qx = (this.x1 + x2) / 2;
      this.qy = (this.y1 + y2) / 2;
    }
    this.render();
  }

  onMove(dx: number, dy: number) {
    const { x1, y1, x2, y2, qx, qy } = this.snapshot!;
    this.x1 = x1 + dx;
    this.y1 = y1 + dy;
    this.x2 = x2 + dx;
    this.y2 = y2 + dy;
    if (this.type === 'arrow' || this.type === 'line') {
      this.qx! = qx! + dx;
      this.qy! = qy! + dy;
    }
    this.render();
  }

  onResize(clientX: number, clientY: number, anchor: Anchor) {
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
    } else if (anchor === 'q') {
      this.qx = clientX;
      this.qy = clientY;
    }
    this.render();
  }

  onNormalize() {
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
      this.x1 = xMin;
      this.y1 = yMin;
      this.x2 = xMax;
      this.y2 = yMax;
      // this.render();
    }
  }

  onSelect() {
    this.snapshot = this.getSnapshot();
  }

  anchorWithinMe(x: number, y: number): Anchor {
    const { type, x1, y1, x2, y2, qx, qy } = this;
    const ext = 8;
    if (type === 'line' || type === 'arrow') {
      let inside: Anchor = null;
      if (Math.abs(slope(x1, y1, x2, y2) - slope(x1, y1, qx!, qy!)) < 0.15) {
        const a = { x: x1, y: y1 };
        const b = { x: x2, y: y2 };
        const c = { x, y };
        const offset = distance(a, b) - (distance(a, c) + distance(b, c));
        inside = Math.abs(offset) <= 3 ? 'inside' : null;
      } else {
        inside = isInTriangle(
          { x, y },
          { x: x1, y: y1 },
          { x: x2, y: y2 },
          { x: qx!, y: qy! }
        )
          ? 'inside'
          : null;
      }
      const start = nearPoint(x, y, x1, y1) ? 'tl' : null;
      const end = nearPoint(x, y, x2, y2) ? 'br' : null;
      const quadratic = nearPoint(x, y, qx!, qy!) ? 'q' : null;
      return quadratic || start || end || inside;
    } else if (type === 'rect') {
      const [gx1, gy1, gx2, gy2] = [x1 - ext, y1 - ext, x2 + ext, y2 + ext];
      const topLeft = nearPoint(x, y, gx1, gy1) ? 'tl' : null;
      const topRight = nearPoint(x, y, gx2, gy1) ? 'tr' : null;
      const bottomLeft = nearPoint(x, y, gx1, gy2) ? 'bl' : null;
      const bottomRight = nearPoint(x, y, gx2, gy2) ? 'br' : null;
      const inside =
        x >= gx1 && x <= gx2 && y >= gy1 && y <= gy2 ? 'inside' : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    } else if (type === 'ellipse') {
      const [gx1, gy1, gx2, gy2] = [x1 - ext, y1 - ext, x2 + ext, y2 + ext];
      const topLeft = nearPoint(x, y, gx1, gy1) ? 'tl' : null;
      const topRight = nearPoint(x, y, gx2, gy1) ? 'tr' : null;
      const bottomLeft = nearPoint(x, y, gx1, gy2) ? 'bl' : null;
      const bottomRight = nearPoint(x, y, gx2, gy2) ? 'br' : null;
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
      const [gx1, gy1, gx2, gy2] = [x1 - ext, y1 - ext, x2 + ext, y2 + ext];
      const topLeft = nearPoint(x, y, gx1, gy1) ? 'tl' : null;
      const topRight = nearPoint(x, y, gx2, gy1) ? 'tr' : null;
      const bottomLeft = nearPoint(x, y, gx1, gy2) ? 'bl' : null;
      const bottomRight = nearPoint(x, y, gx2, gy2) ? 'br' : null;
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
