export enum ToolType {
  PENCIL = 'PENCIL',
  ERASER = 'ERASER',
}

export interface Point {
  x: number;
  y: number;
}

export interface DrawingAction {
  tool: ToolType;
  color: string;
  strokeWidth: number;
  points: Point[];
}