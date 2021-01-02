export const brush = {
  select: "select", // 选区
  curve: "curve",
  line: "line",
  rect: "rect", // 填充
  oRect: "oRect", // 空心矩形
  circle: "circle", // 填充圆
  oCircle: "oCircle", // 空心圆
};

export const KEY = {
  SHIFT: 16,
  DELETE: 46,
};

export interface PaintCanvas {
  width: string;
  height: string;
}

export enum BrushShape {
  select,
  curve,
  line,
  rect,
  circle,
}

export interface BaseShape {
  x: number;
  y: number;
  color?: string;
}

export interface Rect extends BaseShape {
  width: number;
  height: number;
  fill?: boolean;
}

export interface Line extends BaseShape {
  x: number; // 开始位置
  y: number;
  xEnd: number;
  yEnd: number;
  lineWidth?: number;
}

export interface Text extends BaseShape {
  text: string;
  font?: string;
}

export interface Circle extends BaseShape {
  r: number;
  fill?: boolean;
}

export interface Ellipse extends BaseShape {
  xEnd: number;
  yEnd: number;
  fill?: boolean;
}

export type CanvasContext = CanvasRenderingContext2D | null;
