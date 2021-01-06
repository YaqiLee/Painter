import { BrushShape } from "./config";
import { Circle, Ellipse, Line, Rect } from "./model";

class Pencil {
  private defaults: any = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    fill: false,
    r: 0,
    lineWidth: 1,
    color: "#f00",
    brush: BrushShape.rect,
  };

  options: any = {};

  ctx!: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D, options?: any) {
    this.ctx = ctx;
    this.options = Object.assign(this.defaults, options);
  }

  setOptions(options: any = {}) {
    return Object.assign(this.options, options);
  }

  drawCircle({ x = 0, y = 0, r = 1, fill, color }: Circle = this.defaults) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI, true);
    this.renderShape();
  }

  drawRect({ x, y, width, height, fill, color }: Rect) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    this.renderShape();
  }

  drawLine({ x, y, xEnd, yEnd, color, lineWidth = 1 }: Line) {
    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(xEnd, yEnd);
    this.ctx.strokeStyle = color ?? "#f00";
    this.ctx.stroke();
    this.ctx.closePath();
  }
  /**
   * 画椭圆
   * @param param0
   */
  drawEllipse({ x, y, xEnd, yEnd, color, fill, lineWidth = 1 }: Ellipse) {
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, xEnd, yEnd, 0, 0, 2 * Math.PI);
    this.renderShape();
  }

  clear(x: number, y: number, w: number, h: number) {
    this.ctx.clearRect(x, y, w, h);
  }

  renderShape({ color = "#000", fill = false, lineWidth } = this.options) {
    this.ctx.lineWidth = lineWidth;
    if (fill) {
      this.ctx.fillStyle = color;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    }
  }
}
export default Pencil;
