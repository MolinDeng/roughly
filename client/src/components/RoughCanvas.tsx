'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { useWindowSize } from '@/hooks/UseWindowSize';
import { getClickPayload } from '@/lib/rough-utils';
import { RoughElement } from '@/models/RoughElement';
import { RoughFactor } from '@/models/RoughFactor';
import { useToolStore } from '@/stores/tool-store';
import { Anchor, CanvasState, ClickPayload, Point } from '@/types/type';
import { useOptionStore } from '@/stores/option-store';

import rough from 'roughjs';
import OptionPanel from './OptionPanel';

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

  const { currTool, setTool } = useToolStore();
  const { options, setOptions, resetOptions } = useOptionStore();
  const { height, width } = useWindowSize();
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
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const rc = rough.canvas(canvasRef.current);
    // update selected element's options: options updated -> useEffect -> ele update drawable
    const { ele } = selectPayload.current;
    if (currTool === 'select' && ele !== null)
      ele.updateOptions({ ...options });
    // draw elements
    elements
      .filter((ele) => ele.isDrawable())
      .forEach(({ drawable }) => {
        rc.draw(drawable!);
      });
    // Draw the Gizmo for the selected element
    if (currTool === 'select' && ele !== null)
      ele.getGizmo().forEach((g) => rc.draw(g));
  }, [canvasRef, elements, height, width, options]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    clickPos.current = { x: clientX, y: clientY };
    if (currTool === 'select') {
      const payload = getClickPayload(elements, clientX, clientY);
      if (payload.ele !== null) {
        const { ele, anchor } = payload;
        // display ele's options to the option panel
        setOptions(ele.options);
        const { ele: currEle } = selectPayload.current;
        // update the action state
        if (anchor === 'inside') {
          ele.onSelect(); // save the snapshot
          canvasState.current = 'moving';
        } // if (ele === currEle)
        else canvasState.current = 'resize';
      } // reset the option panel
      else resetOptions();
      // set the selected payload
      selectPayload.current = payload;
    } else {
      canvasState.current = 'drawing';
      const newEle = RoughFactor.create(currTool, options, clientX, clientY);
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
        setTool('select');
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

  const hidden = currTool === 'select' && selectPayload.current.ele === null;
  const optPanelType =
    selectPayload.current.ele === null
      ? currTool
      : selectPayload.current.ele.type;
  return (
    <>
      <OptionPanel height={height} currTool={optPanelType} hidden={hidden} />
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
};

export default RoughCanvas;
