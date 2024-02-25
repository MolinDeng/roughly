'use client';

import usePapyrusBg from '@/hooks/UsePapyrusBg';
import { useWindowSize } from '@/hooks/UseWindowSize';
import { getNullPayload, getSelectedPayload } from '@/lib/rough-utils';
import { RoughElement } from '@/models/RoughElement';
import { RoughFactor } from '@/models/RoughFactor';
import { useRoughStore } from '@/stores/rough-store';
import { Anchor, CanvasState, SelectedPayload } from '@/types/type';
import { Loader } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import { Drawable } from 'roughjs/bin/core';

const cursorFromAnchor = (anchor: Anchor): string => {
  if (anchor === 'inside') return 'move';
  if (anchor === 'tl' || anchor === 'br') return 'nwse-resize';
  if (anchor === 'tr' || anchor === 'bl') return 'nesw-resize';
  if (anchor === 'q') return 'pointer';
  return 'default';
};

interface RoughCanvasProps {}
const RoughCanvas: FC<RoughCanvasProps> = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasState = useRef<CanvasState>('idle');
  const selectState = useRef<SelectedPayload>(getNullPayload()); // selected element
  const [elements, setElements] = useState<RoughElement[]>([]);
  const [gizmo, setGizmo] = useState<Drawable[]>([]);

  const { currTool } = useRoughStore();
  const size = useWindowSize();
  const { img: bg, loaded: bgLoaded } = usePapyrusBg();
  // Key listener
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

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    // * Resize the canvas
    canvasRef.current.width = size.width - 10; // ! -10 for debug only
    canvasRef.current.height = size.height - 10; // ! -10 for debug only
    // * Create grainy background
    if (bgLoaded && bg) {
      const pat = ctx.createPattern(bg, 'repeat');
      ctx.fillStyle = pat as CanvasPattern;
    } else {
      // white
      ctx.fillStyle = '#fff';
    }
    const { width, height } = ctx.canvas.getBoundingClientRect();
    ctx.fillRect(0, 0, width, height);
    // * Create rough canvas
    const rc = rough.canvas(canvasRef.current);
    elements
      .filter((ele) => ele.isDrawable())
      .forEach(({ drawable }) => {
        rc.draw(drawable!);
      });
    // Draw the Gizmo for the selected element
    gizmo.forEach((g) => rc.draw(g));
  }, [canvasRef, elements, size, bg, gizmo]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (currTool === 'select') {
      const { clientX, clientY } = event;
      const payload = getSelectedPayload(elements, clientX, clientY);
      if (payload.ele === null) return;
      // * Set the selected element
      selectState.current = payload;
      // * Update the action state
      if (payload.anchor === 'inside') {
        payload.ele.onSelect(); // * Save the snapshot
        canvasState.current = 'moving';
      } else {
        canvasState.current = 'resize';
      }
    } else {
      canvasState.current = 'drawing';
      const { clientX: x, clientY: y } = event;
      const newEle = RoughFactor.create(currTool, x, y);
      selectState.current.ele = newEle;
      setElements([...elements, newEle]);
    }
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (currTool === 'select') {
      const { clientX, clientY } = event;
      const { anchor, ele } = getSelectedPayload(elements, clientX, clientY);
      (event.target as HTMLElement).style.cursor = cursorFromAnchor(anchor);
      if (ele !== null) {
        setGizmo(ele.getGizmo());
      } else if (gizmo.length > 0) {
        setGizmo([]);
      }
    }

    if (canvasState.current === 'drawing') {
      const { clientX, clientY } = event;
      const ele = selectState.current.ele!;
      ele.onDraw(clientX, clientY);
      setElements([...elements]);
    } else if (canvasState.current === 'moving') {
      const { clientX, clientY } = event;
      const { hitX, hitY, ele } = selectState.current;
      // this element is the object that is created before the mouse down event
      ele!.onMove(clientX - hitX, clientY - hitY);
      setElements([...elements]);
    } else if (canvasState.current === 'resize') {
      const { clientX, clientY } = event;
      const { ele, anchor } = selectState.current;
      ele!.onResize(clientX, clientY, anchor);
      setElements([...elements]);
    }
  };
  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // * Adjust position of the element
    if (canvasState.current === 'drawing' || canvasState.current === 'resize') {
      const ele = selectState.current.ele!;
      if (ele.isDrawable() && ele.isVisible()) {
        ele.onNormalize();
        setElements([...elements]);
      }
    }

    // * Filter out the elements that are not drawable or not visible
    setElements([
      ...elements.filter((ele) => ele.isDrawable() && ele.isVisible()),
    ]);
    // * Reset the canvas state
    canvasState.current = 'idle';
    selectState.current = getNullPayload();
  };

  return bgLoaded ? (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="border-2 border-foreground rounded-md" // ! Debug only
    />
  ) : (
    <div className="flex justify-center items-center h-screen">
      <Loader className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default RoughCanvas;
