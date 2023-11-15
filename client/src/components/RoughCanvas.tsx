'use client';
import { FC } from 'react';
import { use, useEffect, useLayoutEffect, useRef } from 'react';
import rough from 'roughjs';

const generator = rough.generator();
interface RoughCanvasProps {}

const RoughCanvas: FC<RoughCanvasProps> = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    // const { width, height } = canvasRef.current!.getBoundingClientRect();
    // ctx.fillRect(0, 0, width, height);
    // * Debug only end

    const roughCanvas = rough.canvas(canvasRef.current);
    const rect = generator.rectangle(10, 10, 300, 200);
    const line = generator.line(80, 10, 10, 100);
    roughCanvas.draw(rect);
    roughCanvas.draw(line);
  }, [canvasRef]);

  const handleMouseDown = () => {
    console.log('mouse down');
  };
  const handleMouseMove = () => {
    console.log('mouse move');
  };
  const handleMouseUp = () => {
    console.log('mouse up');
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
