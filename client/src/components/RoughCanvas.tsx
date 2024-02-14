'use client';

import { createGrainyBg } from '@/lib/canvas-utils';
import { FC, useEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import { Drawable } from 'roughjs/bin/core';

const generator = rough.generator();
interface RoughCanvasProps {}

const RoughCanvas: FC<RoughCanvasProps> = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [elements, setElements] = useState<any[]>([]); // * May need to change type to Drawable[]

  // set canvas size to window size
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.width = window.innerWidth - 10;
    canvasRef.current.height = window.innerHeight - 10;
  }, [canvasRef]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    // * Debug only fill canvas with light blue

    // ctx.fillStyle = '#e6f1ff';
    // const { width, height } = ctx.canvas.getBoundingClientRect();
    // ctx.fillRect(0, 0, width, height);
    // * Debug only end
    createGrainyBg(ctx);
    const roughCanvas = rough.canvas(canvasRef.current);
    const rect: Drawable = generator.rectangle(10, 10, 300, 200);
    const line: Drawable = generator.line(80, 10, 10, 100);
    roughCanvas.draw(rect);
    roughCanvas.draw(line);
  }, [canvasRef]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    console.log('mouse move' + event.clientX + ' ' + event.clientY);
  };
  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(false);
  };
  return (
    <canvas
      ref={canvasRef}
      className="border-2 border-foreground rounded-md grainy"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      width={0}
      height={0}
    />
  );
};

export default RoughCanvas;
