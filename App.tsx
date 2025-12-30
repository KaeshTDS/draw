import React, { useState, useRef, useCallback } from 'react';
import DrawingCanvas from './components/DrawingCanvas';
import Toolbar from './components/Toolbar';
import { ToolType, DrawingAction } from './types';

const App: React.FC = () => {
  const [tool, setTool] = useState<ToolType>(ToolType.PENCIL);
  const [color, setColor] = useState<string>('#4F46E5'); // Default indigo color
  const [strokeWidth, setStrokeWidth] = useState<number>(5);
  const [actions, setActions] = useState<DrawingAction[]>([]);
  const [currentActionIndex, setCurrentActionIndex] = useState<number>(-1); // -1 means no actions yet
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleToolChange = useCallback((newTool: ToolType) => {
    setTool(newTool);
  }, []);

  const handleColorChange = useCallback((newColor: string) => {
    setColor(newColor);
  }, []);

  const handleStrokeWidthChange = useCallback((newWidth: number) => {
    setStrokeWidth(newWidth);
  }, []);

  const handleClear = useCallback(() => {
    setActions([]);
    setCurrentActionIndex(-1);
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const handleUndo = useCallback(() => {
    if (currentActionIndex > -1) {
      setCurrentActionIndex(prevIndex => prevIndex - 1);
    }
  }, [currentActionIndex]);

  const handleRedo = useCallback(() => {
    if (currentActionIndex < actions.length - 1) {
      setCurrentActionIndex(prevIndex => prevIndex + 1);
    }
  }, [currentActionIndex, actions.length]);

  const canUndo = currentActionIndex > -1;
  const canRedo = currentActionIndex < actions.length - 1;

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-center w-full max-w-6xl h-full min-h-[90vh] md:min-h-0 bg-transparent gap-4">
      {/* Toolbar - Sticky on top for mobile, sticky left for desktop */}
      <div className="fixed top-0 left-0 right-0 z-10 w-full md:relative md:w-auto md:top-auto md:left-auto md:right-auto flex justify-center py-2 md:py-0 md:h-full">
        <Toolbar
          onToolChange={handleToolChange}
          onColorChange={handleColorChange}
          onStrokeWidthChange={handleStrokeWidthChange}
          onClear={handleClear}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          currentColor={color}
          currentStrokeWidth={strokeWidth}
          activeTool={tool}
        />
      </div>

      {/* Drawing Canvas */}
      <div className="flex-grow w-full h-[calc(100vh-140px)] md:h-auto mt-[95px] md:mt-0 flex items-center justify-center">
        <DrawingCanvas
          tool={tool}
          color={color}
          strokeWidth={strokeWidth}
          actions={actions}
          setActions={setActions}
          currentActionIndex={currentActionIndex}
          setCurrentActionIndex={setCurrentActionIndex}
          canvasRef={canvasRef}
        />
      </div>
    </div>
  );
};

export default App;