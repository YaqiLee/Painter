import { CanvasContext, Circle, Rect } from "./config";

class Pencil {
  options: any;
  ctx!: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D, options?: any) {
    this.ctx = ctx;
    this.options = options;
  }

  drawCircle({ x, y, r, fill, color }: Circle) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI, true);
    this.renderShape(color, fill);
  }

  drawRect({ x, y, width, height, fill, color }: Rect) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    this.renderShape(color, fill);
  }

  renderShape(color = "#000", fill = false) {
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
