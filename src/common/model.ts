export interface PaintCanvas {
  width: string;
  height: string;
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
  lineWidth?: number;
}

export type CanvasContext = CanvasRenderingContext2D | null;

export interface Points {
  sx: number; // 鼠标按下的位置
  sy: number;
  mx: number; // 移动中的位置
  my: number;
  ex: number; // 鼠标抬起的位置
  ey: number;
  px: number; // 鼠标上一个位置
  py: number;
};
