import React from "react";

class Pencil extends React.Component {
  constructor(props) {
    super(props);
  }

  get canvasWidth() {
    return this.props.canvas.width;
  }

  get canvasHeight() {
    return this.props.canvas.height;
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
  }

  drawRect(x, y, w, h, { lineWidth, color } = this.props) {
    this.clearRect(0, 0);
    this.putImageData();
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  clearRect(x, y, width = this.canvasWidth, height = this.canvasHeight) {
    this.ctx.clearRect(x, y, width, height);
  }

  getImageData(width = this.canvasWidth, height = this.canvasHeight) {
    this.imgdata = this.ctx.getImageData(0, 0, width, height);
  }

  putImageData(x = 0, y = 0, imagedata = this.imgdata) {
    if (!imagedata) return;
    this.ctx.putImageData(imagedata,x,y);
  }
}
export default Pencil;
