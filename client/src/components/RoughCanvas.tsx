'use client';

import { createGrainyBg } from '@/lib/canvas-utils';
import { useRoughStore } from '@/stores/rough-store';
import { RoughElement, RoughOptions, RoughType } from '@/types/type';
import { FC, useEffect, useRef, useState } from 'react';
import rough from 'roughjs';

const generator = rough.generator();
const roughOptions: RoughOptions = {
  fill: 'red',
  fillStyle: 'cross-hatch',
  roughness: 0.5,
};
const createElement = (
  type: RoughType,
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
  }
  return { type, x1, y1, x2, y2, drawable };
};

interface RoughCanvasProps {}
const RoughCanvas: FC<RoughCanvasProps> = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [elements, setElements] = useState<RoughElement[]>([]);
  const { drawType } = useRoughStore();

  // set canvas size to window size
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.width = window.innerWidth - 10; // ! Debug only
    canvasRef.current.height = window.innerHeight - 10; // ! Debug only
  }, [canvasRef]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const roughCanvas = rough.canvas(canvasRef.current);
    const callback = () => {
      elements.forEach(({ drawable }) => {
        roughCanvas.draw(drawable!);
      });
    };
    createGrainyBg(ctx).then(callback).catch(callback);
  }, [canvasRef, elements]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);

    const { clientX, clientY } = event;
    const newEle = createElement(
      drawType,
      clientX,
      clientY,
      clientX + 1,
      clientY + 1
    );
    setElements([...elements, newEle]);
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const { clientX, clientY } = event;
    const { type: curretType, x1, y1 } = elements[elements.length - 1];
    const updatedEle = createElement(curretType, x1, y1, clientX, clientY);
    setElements([...elements.slice(0, -1), updatedEle]);
  };
  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(false);
  };
  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="border-2 border-foreground rounded-md grainy items-center" // ! Debug only
      // width={0}
      // height={0}
    />
  );
};

export default RoughCanvas;
