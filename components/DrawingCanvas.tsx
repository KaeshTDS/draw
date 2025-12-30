import React, { useRef, useEffect, useState, useCallback, RefObject } from 'react';
import { ToolType, Point, DrawingAction } from '../types';

interface DrawingCanvasProps {
  tool: ToolType;
  color: string;
  strokeWidth: number;
  actions: DrawingAction[];
  setActions: React.Dispatch<React.SetStateAction<DrawingAction[]>>;
  currentActionIndex: number;
  setCurrentActionIndex: React.Dispatch<React.SetStateAction<number>>;
  canvasRef: RefObject<HTMLCanvasElement>;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  tool,
  color,
  strokeWidth,
  actions,
  setActions,
  currentActionIndex,
  setCurrentActionIndex,
  canvasRef,
}) => {
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  const drawAllActions = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i <= currentActionIndex; i++) {
      const action = actions[i];
      if (!action || action.points.length < 2) continue;

      context.beginPath();
      context.moveTo(action.points[0].x, action.points[0].y);

      context.strokeStyle = action.tool === ToolType.ERASER ? '#FFFFFF' : action.color; // Eraser uses white
      context.lineWidth = action.strokeWidth;
      context.lineCap = 'round';
      context.lineJoin = 'round';

      for (let j = 1; j < action.points.length; j++) {
        context.lineTo(action.points[j].x, action.points[j].y);
      }
      context.stroke();
    }
  }, [actions, currentActionIndex, canvasRef]); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const context = canvas.getContext('2d');
      if (context) {
        contextRef.current = context;
        context.lineCap = 'round';
        context.lineJoin = 'round';
      }
    }
  }, [canvasRef]);

  // Re-draw all actions when currentActionIndex or actions change
  useEffect(() => {
    drawAllActions();
  }, [currentActionIndex, actions, drawAllActions]);

  const getCanvasCoordinates = useCallback((event: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Canvas not found");

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, [canvasRef]);

  const startDrawing = useCallback((point: Point) => {
    setIsDrawing(true);
    setLastPoint(point);

    const newAction: DrawingAction = {
      tool,
      color,
      strokeWidth,
      points: [point],
    };

    // If we're not at the end of the history, truncate it
    const newActions = actions.slice(0, currentActionIndex + 1);
    setActions([...newActions, newAction]);
    setCurrentActionIndex(newActions.length); // Update index to point to the new action
  }, [tool, color, strokeWidth, actions, currentActionIndex, setActions, setCurrentActionIndex]);

  const draw = useCallback((currentPoint: Point) => {
    if (!isDrawing || !lastPoint) return;

    setActions((prevActions) => {
      const updatedActions = [...prevActions];
      const currentAction = updatedActions[currentActionIndex];
      if (currentAction) {
        currentAction.points.push(currentPoint);

        const context = contextRef.current;
        if (context) {
          context.beginPath();
          context.moveTo(lastPoint.x, lastPoint.y);
          context.lineTo(currentPoint.x, currentPoint.y);
          context.strokeStyle = tool === ToolType.ERASER ? '#FFFFFF' : color;
          context.lineWidth = strokeWidth;
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.stroke();
        }
      }
      return updatedActions;
    });
    setLastPoint(currentPoint);
  }, [isDrawing, lastPoint, tool, color, strokeWidth, setActions, currentActionIndex]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    const point = getCanvasCoordinates(event);
    startDrawing(point);
  }, [getCanvasCoordinates, startDrawing]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (isDrawing) {
      const point = getCanvasCoordinates(event);
      draw(point);
    }
  }, [isDrawing, getCanvasCoordinates, draw]);

  const handleMouseUp = useCallback(() => {
    stopDrawing();
  }, [stopDrawing]);

  const handleMouseLeave = useCallback(() => {
    stopDrawing();
  }, [stopDrawing]);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const point = getCanvasCoordinates(event);
    startDrawing(point);
  }, [getCanvasCoordinates, startDrawing]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (isDrawing) {
      const point = getCanvasCoordinates(event);
      draw(point);
    }
  }, [isDrawing, getCanvasCoordinates, draw]);

  const handleTouchEnd = useCallback(() => {
    stopDrawing();
  }, [stopDrawing]);

  const handleTouchCancel = useCallback(() => {
    stopDrawing();
  }, [stopDrawing]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      className="bg-white rounded-lg shadow-xl border-4 border-indigo-300 touch-none w-full h-full max-w-full max-h-[80vh] md:max-h-[90vh]"
    ></canvas>
  );
};

export default DrawingCanvas;