import React from "react";

class CanvasBackground extends React.Component {

  constructor(props) {
    super(props);
    this.canvas$ = React.createRef();

    this.verticalCount = "5";
    this.horizontalCount = "5";
  }

  get canvas() {
    return this.canvas$.current;
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext("2d");

    setTimeout(() => {
      this.afterRender();
    }, 0);
  }

  afterRender = () => {
    const { width, height } = this.props;
    const singleWidth = width / this.verticalCount;
    const singleHeight = height / this.horizontalCount;

    this.ctx.strokeStyle = "#ebe1e1";
    // 竖线
    for (let i = 0; i < this.verticalCount; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * singleWidth, 0);
      this.ctx.lineTo(i * singleWidth, height);
      this.ctx.stroke();
    }
    // 横线
    for (let i = 0; i < this.horizontalCount; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * singleHeight);
      this.ctx.lineTo(width, i * singleHeight);
      this.ctx.stroke();
    }
  };

  render() {
    return (
      <canvas
        id="canvasBg"
        ref={this.canvas$}
        width={this.props.width}
        height={this.props.height}
        onMouseMove={this.onMouseMove}
      >
        您的浏览器不支持画图
      </canvas>
    );
  }
}

export default CanvasBackground;
