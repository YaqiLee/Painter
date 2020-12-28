import React from "react";
import { brush } from "./config";

class Pencil extends React.Component {
  // 这是一个函数
  finishShape = null;
  historys = [];

  constructor(props) {
    super(props);
  }

  get canvasWidth() {
    return this.props.canvas.width;
  }

  get canvasHeight() {
    return this.props.canvas.height;
  }

  initCanvas() {
    // 清空画布
    this.clearRect(0, 0);
    this.getImageData();
    // 清空历史记录
    this.historys = [this.imgdata];
  }

  drawTable() {
    this.ctxbg.moveTo(0, 0)
    this.ctxbg.lineTo(500, 500);
    this.ctxbg.stroke();
  }

  drawArc(x, y, r, { color } = this.props) {
    this.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  drawLine(sx, sy, x, y, { lineWidth, color } = this.props) {
    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = "round";
    this.ctx.moveTo(sx, sy);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    this.ctx.closePath();
  }
  // 单一职责
  drawRect(x, y, w, h, { lineWidth, color, brush } = this.props) {
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.setShapeType(brush)(color);
    this.ctx.closePath();
  }

  drawCircle(x, y, r, { lineWidth, color, brush } = this.props) {
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.setShapeType(brush)(color);
  }

  drawEllipse(sx, sy, x, y, { lineWidth, color, brush } = this.props) {
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.ellipse(sx, sy, x, y, 0, 0, 2 * Math.PI);
    this.setShapeType(brush)(color);
  }

  initDraw() {
    // 清空画布
    this.clearRect(0, 0);
    // 放入之前的数据
    this.putImageData()
  }

  clearRect(x, y, width = this.canvasWidth, height = this.canvasHeight) {
    this.ctx.clearRect(x, y, width, height);
  }
  // 是否空心
  setShapeType(brushType) {
    if (this.finishShape !== null) {
      return this.finishShape;
    }
    //
    let shapes = [brush.oRect, brush.oCircle];
    this.finishShape = shapes.includes(brushType)
      ? this.strokeShape
      : this.fillShape;
    return this.finishShape;
  }

  getImageData(width = this.canvasWidth, height = this.canvasHeight) {
    this.imgdata = this.ctx.getImageData(0, 0, width, height);
    return this.imgdata;
  }

  putImageData(x = 0, y = 0, imagedata = this.imgdata) {
    if (!imagedata) return;
    this.ctx.putImageData(imagedata, x, y);
  }

  fillShape = (color) => {
    this.ctx.fillStyle = color;
    this.ctx.fill();
  };

  strokeShape = (color) => {
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  };
}
export default Pencil;
