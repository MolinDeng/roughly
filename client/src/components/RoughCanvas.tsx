'use client';

import usePapyrusBg from '@/hooks/UsePapyrusBg';
import { useWindowSize } from '@/hooks/UseWindowSize';
import { getClickPayload } from '@/lib/rough-utils';
import { RoughElement } from '@/models/RoughElement';
import { RoughFactor } from '@/models/RoughFactor';
import { useRoughStore } from '@/stores/rough-store';
import { Anchor, CanvasState, ClickPayload, Point } from '@/types/type';
import { Loader } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';
import rough from 'roughjs';

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
  const clickPos = useRef<Point>({ x: 0, y: 0 });
  const selectPayload = useRef<ClickPayload>({ anchor: null, ele: null });

  const [elements, setElements] = useState<RoughElement[]>([]);

  const { currTool, setTool } = useRoughStore();
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
      if (event.key === 'Backspace' || event.key === 'Delete') {
        // delete key
        console.log('Delete');
        if (selectPayload.current.ele !== null) {
          const { ele } = selectPayload.current;
          setElements([...elements.filter((e) => e !== ele)]);
          selectPayload.current = { anchor: null, ele: null };
        }
      }
      // shift key
      if (event.shiftKey) {
        // shift + any key
        console.log('shift key is pressed');
      }
      // number keys
      switch (event.key) {
        case '1':
          setTool('select');
          break;
        case '2':
          setTool('line');
          break;
        case '3':
          setTool('arrow');
          break;
        case '4':
          setTool('rect');
          break;
        case '5':
          setTool('diamond');
          break;
        case '6':
          setTool('ellipse');
          break;
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
    // resize the canvas
    canvasRef.current.width = size.width - 10; // ! -10 for debug only
    canvasRef.current.height = size.height - 10; // ! -10 for debug only
    // create grainy background
    if (bgLoaded && bg) {
      const pat = ctx.createPattern(bg, 'repeat');
      ctx.fillStyle = pat as CanvasPattern;
    } else ctx.fillStyle = '#fff'; // white
    const { width, height } = ctx.canvas.getBoundingClientRect();
    ctx.fillRect(0, 0, width, height);
    // create rough canvas
    const rc = rough.canvas(canvasRef.current);
    elements
      .filter((ele) => ele.isDrawable())
      .forEach(({ drawable }) => {
        rc.draw(drawable!);
      });
    // Draw the Gizmo for the selected element
    const { ele } = selectPayload.current;
    if (currTool === 'select' && ele !== null)
      ele.getGizmo().forEach((g) => rc.draw(g));
  }, [canvasRef, elements, size, bg]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    clickPos.current = { x: clientX, y: clientY };
    if (currTool === 'select') {
      const payload = getClickPayload(elements, clientX, clientY);
      if (payload.ele !== null) {
        const { ele, anchor } = payload;
        const { ele: currEle } = selectPayload.current;
        // update the action state
        if (anchor === 'inside') {
          ele.onSelect(); // save the snapshot
          canvasState.current = 'moving';
        } // if (ele === currEle)
        else canvasState.current = 'resize';
      }
      // set the selected payload
      selectPayload.current = payload;
    } else {
      canvasState.current = 'drawing';
      const newEle = RoughFactor.create(currTool, clientX, clientY);
      selectPayload.current.ele = newEle;
      setElements([...elements, newEle]);
    }
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasState.current === 'idle') {
      const { clientX, clientY } = event;
      (event.target as HTMLElement).style.cursor = cursorFromAnchor(
        getClickPayload(elements, clientX, clientY).anchor
      );
    } else if (canvasState.current === 'drawing') {
      const { clientX, clientY } = event;
      const ele = selectPayload.current.ele!;
      ele.onDraw(clientX, clientY);
      setElements([...elements]);
    } else if (canvasState.current === 'moving') {
      const { clientX, clientY } = event;
      const { x: hitX, y: hitY } = clickPos.current;
      const ele = selectPayload.current.ele!;
      ele.onMove(clientX - hitX, clientY - hitY);
      setElements([...elements]);
      (event.target as HTMLElement).style.cursor = cursorFromAnchor('inside');
    } else if (canvasState.current === 'resize') {
      const { clientX, clientY } = event;
      const { ele, anchor } = selectPayload.current;
      ele!.onResize(clientX, clientY, anchor);
      setElements([...elements]);
      (event.target as HTMLElement).style.cursor = cursorFromAnchor(anchor);
    }
  };
  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // normalize the element
    if (canvasState.current === 'drawing') {
      const ele = selectPayload.current.ele!;
      if (ele.isDrawable() && ele.isVisible()) {
        ele.onNormalize();
        // setElements([...elements]); // not be necessary
        // after drawing, set the tool to select
        if (canvasState.current === 'drawing') setTool('select');
      } // reset the selected payload
      else selectPayload.current = { anchor: null, ele: null };
    } else if (canvasState.current === 'resize') {
      const ele = selectPayload.current.ele!;
      ele.onNormalize();
      // setElements([...elements]); // not be necessary
    }
    // Filter out the elements that are not drawable or not visible
    setElements([
      ...elements.filter((ele) => ele.isDrawable() && ele.isVisible()),
    ]);

    // Reset the canvas state
    canvasState.current = 'idle';
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
