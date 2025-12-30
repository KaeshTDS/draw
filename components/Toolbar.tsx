import React from 'react';
import { ToolType } from '../types';
import Button from './Button';

interface ToolbarProps {
  onToolChange: (tool: ToolType) => void;
  onColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  currentColor: string;
  currentStrokeWidth: number;
  activeTool: ToolType;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onToolChange,
  onColorChange,
  onStrokeWidthChange,
  onClear,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  currentColor,
  currentStrokeWidth,
  activeTool,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-lg w-full md:w-auto md:flex-col md:gap-4 lg:p-5">
      {/* Tool Selection */}
      <div className="flex gap-2">
        <Button
          label="Pencil"
          icon="✏️"
          onClick={() => onToolChange(ToolType.PENCIL)}
          isActive={activeTool === ToolType.PENCIL}
          title="Pencil Tool"
        />
        <Button
          label="Eraser"
          icon="🧼"
          onClick={() => onToolChange(ToolType.ERASER)}
          isActive={activeTool === ToolType.ERASER}
          title="Eraser Tool"
        />
      </div>

      {/* Color Picker */}
      <div className="flex items-center gap-2 md:w-full">
        <label htmlFor="color-picker" className="sr-only">Choose Color</label>
        <input
          id="color-picker"
          type="color"
          value={currentColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-10 h-10 md:w-12 md:h-12 rounded-lg cursor-pointer border-2 border-gray-300 overflow-hidden"
          title="Choose Color"
        />
        <span className="hidden md:inline text-gray-700 text-sm font-semibold">Color</span>
      </div>

      {/* Stroke Width Slider */}
      <div className="flex flex-col items-center gap-1 md:w-full">
        <label htmlFor="stroke-width" className="text-gray-700 text-sm font-semibold hidden md:inline">Brush Size: {currentStrokeWidth}</label>
        <input
          id="stroke-width"
          type="range"
          min="1"
          max="30"
          value={currentStrokeWidth}
          onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
          className="w-24 md:w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb-indigo-500"
          title="Adjust Brush Size"
        />
        <span className="inline md:hidden text-gray-700 text-xs font-semibold">Size: {currentStrokeWidth}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 w-full justify-center md:flex-col md:w-auto">
        <Button
          label="Undo"
          icon="↩️"
          onClick={onUndo}
          disabled={!canUndo}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo Last Action"
        />
        <Button
          label="Redo"
          icon="↪️"
          onClick={onRedo}
          disabled={!canRedo}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo Last Action"
        />
        <Button
          label="Clear"
          icon="🗑️"
          onClick={onClear}
          className="bg-red-500 text-white hover:bg-red-600"
          title="Clear Canvas"
        />
      </div>
    </div>
  );
};

export default Toolbar;