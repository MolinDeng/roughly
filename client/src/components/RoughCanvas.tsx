'use client';

import {
  adjustCoords,
  createGrainyBg,
  createRoughElement,
  getSelectPayload,
} from '@/lib/rough-utils';
import { useRoughStore } from '@/stores/rough-store';
import { RoughAction, RoughElement, SelectPayload } from '@/types/type';
import { FC, useEffect, useRef, useState } from 'react';
import rough from 'roughjs';

interface RoughCanvasProps {}
const RoughCanvas: FC<RoughCanvasProps> = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const actionState = useRef<RoughAction>('idle');
  // selected element state
  const selectState = useRef<SelectPayload>({ x: 0, y: 0, id: -1, ele: null });
  const [elements, setElements] = useState<RoughElement[]>([]);
  const { currTool } = useRoughStore();

  // set canvas size to window size
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.width = window.innerWidth - 10; // ! Debug only
    canvasRef.current.height = window.innerHeight - 10; // ! Debug only
  }, [canvasRef, window]);

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
    if (currTool === 'select') {
      const { clientX, clientY } = event;
      const payload = getSelectPayload(elements, clientX, clientY);
      if (payload.id === -1) return;
      actionState.current = 'moving';
      selectState.current = payload;
    } else {
      actionState.current = 'drawing';
      const { clientX: x, clientY: y } = event;
      const newEle = createRoughElement(currTool, x, y, x, y);
      setElements([...elements, newEle]);
    }
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (currTool === 'select')
      (event.target as HTMLElement).style.cursor =
        getSelectPayload(elements, event.clientX, event.clientY).id === -1
          ? 'default'
          : 'move';

    if (actionState.current === 'drawing') {
      const { clientX, clientY } = event;
      const { type, x1, y1 } = elements[elements.length - 1];
      const updatedEle = createRoughElement(type, x1, y1, clientX, clientY);
      setElements([...elements.slice(0, -1), updatedEle]);
    } else if (actionState.current === 'moving') {
      const { clientX, clientY } = event;
      const { x, y, id, ele } = selectState.current;
      if (ele === null) return;
      const { type, x1, y1, x2, y2 } = ele;
      elements[id] = createRoughElement(
        type,
        x1 + clientX - x,
        y1 + clientY - y,
        x2 + clientX - x,
        y2 + clientY - y
      );
      setElements([...elements]);
    }
  };
  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (actionState.current === 'drawing') {
      const ele = elements[elements.length - 1];
      const { x1, y1, x2, y2 } = adjustCoords(ele);
      const newEle = createRoughElement(ele.type, x1, y1, x2, y2);
      setElements([...elements.slice(0, -1), newEle]);
    }

    actionState.current = 'idle';
    selectState.current = { x: 0, y: 0, id: -1, ele: null };
  };
  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="border-2 border-foreground rounded-md grainy items-center" // ! Debug only
    />
  );
};

export default RoughCanvas;
