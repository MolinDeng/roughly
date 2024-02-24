'use client';

import {
  getNullPayload,
  createGrainyBg,
  getSelectedPayload,
} from '@/lib/rough-utils';
import { RoughElement } from '@/models/RoughElement';
import { useRoughStore } from '@/stores/rough-store';
import { CanvasState, SelectedPayload } from '@/types/type';
import { FC, useEffect, useRef, useState } from 'react';
import rough from 'roughjs';

const cursorFromAnchor = (anchor: string | null): string => {
  if (anchor === 'inside') return 'move';
  if (anchor === 'tl' || anchor === 'br') return 'nwse-resize';
  if (anchor === 'tr' || anchor === 'bl') return 'nesw-resize';
  return 'default';
};

interface RoughCanvasProps {}
const RoughCanvas: FC<RoughCanvasProps> = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasState = useRef<CanvasState>('idle');
  // selected element state
  const selectState = useRef<SelectedPayload>(getNullPayload());
  const [elements, setElements] = useState<RoughElement[]>([]);
  const { currTool } = useRoughStore();

  // Key  listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('Elements: ', elements);
      }
      // modifier keys
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z') {
          // ctrl + z or cmd + z
          console.log('Undo');
        }
      }
      // shift key
      if (event.shiftKey) {
        // shift + any key
        console.log('shift key is pressed');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        // shift + any key
        console.log('shift key is released');
      }
    };
    window.addEventListener('keyup', handleKeyUp);
    const handleKeyPress = (event: KeyboardEvent) => {
      console.log('key pressed');
    };
    // window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keypress', handleKeyPress);
    };
  });

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
      elements
        .filter((ele) => ele.isDrawable())
        .forEach(({ drawable }) => {
          roughCanvas.draw(drawable!);
        });
    };
    // * Load elements after creating grainy background
    createGrainyBg(ctx).then(callback).catch(callback);
  }, [canvasRef, elements]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (currTool === 'select') {
      const { clientX, clientY } = event;
      const payload = getSelectedPayload(elements, clientX, clientY);
      if (payload.ele === null) return;
      // * Set the selected element
      selectState.current = payload;
      // * Update the action state
      if (payload.anchor === 'inside') {
        canvasState.current = 'moving';
      } else {
        canvasState.current = 'resize';
      }
    } else {
      canvasState.current = 'drawing';
      const { clientX: x, clientY: y } = event;
      const newEle = RoughElement.factory()(currTool, x, y);
      selectState.current.ele = newEle;
      setElements([...elements, newEle]);
    }
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (currTool === 'select') {
      const { clientX, clientY } = event;
      const { anchor } = getSelectedPayload(elements, clientX, clientY);
      (event.target as HTMLElement).style.cursor = cursorFromAnchor(anchor);
    }

    if (canvasState.current === 'drawing') {
      const { clientX, clientY } = event;
      const ele = selectState.current.ele!;
      ele.update(ele.x1, ele.y1, clientX, clientY);
      setElements([...elements]);
    } else if (canvasState.current === 'moving') {
      const { clientX, clientY } = event;
      const { hitX, hitY, ele, snapshot } = selectState.current;
      // this element is the object that is created before the mouse down event
      ele!.update(
        snapshot.x1 + clientX - hitX,
        snapshot.y1 + clientY - hitY,
        snapshot.x2 + clientX - hitX,
        snapshot.y2 + clientY - hitY
      );
      setElements([...elements]);
    } else if (canvasState.current === 'resize') {
      const { clientX, clientY } = event;
      const { ele, anchor } = selectState.current;
      ele!.resize(clientX, clientY, anchor);
      setElements([...elements]);
    }
  };
  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // * Adjust position of the element
    if (canvasState.current === 'drawing') {
      const ele = selectState.current.ele!;
      if (ele.isDrawable()) {
        ele.normalize();
        setElements([...elements]);
      }
    } else if (canvasState.current === 'resize') {
      const ele = selectState.current.ele!;
      ele.normalize();
      setElements([...elements]);
    }

    // * Filter out the elements that are not drawable
    setElements([...elements.filter((ele) => ele.isDrawable())]);
    // * Reset the canvas state
    canvasState.current = 'idle';
    selectState.current = getNullPayload();
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
