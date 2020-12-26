import React from "react";
import { connect } from "react-redux";
import Pencil from "./utils/pencil";

@connect((state) => {
  return {
    color: state.color,
    lineWidth: state.lineWidth,
    canvas: state.canvas
  };
})
class Palette extends Pencil {
  constructor(props) {
    super(props);

    this.paint = null;
    this.ctx = null;

    this.state = {
      prevDot: { x: null, y: null },
      canDraw: false,
      width: props.clientWidth,
      height: props.clientHeight,
    };

    this.canvas$ = React.createRef();
  }

  onClick = () => {};

  onMouseDown = ({ pageX, pageY }) => {
    this.setState({ canDraw: true });
    this.setState({ prevDot: { x: pageX, y: pageY } });
  };

  onMouseUp = (e) => {
    this.setState({
      canDraw: false,
      prevDot: {
        x: null,
        y: null,
      },
    });
    this.getImageData()
  };

  onMouseMove = ({ pageX, pageY }) => {
    if (!this.state.canDraw) {
      return false;
    }

    let { x, y } = this.state.prevDot;

    // this.drawLine(x, y, pageX, pageY);
    this.drawRect(x, y, pageX - x, pageY - y);

    // this.setState({ prevDot: { x: pageX, y: pageY } });
  };

  componentDidMount() {
    this.ctx = this.canvas$.current.getContext("2d");
  }

  render() {
    return (
      <>
        <canvas
          ref={this.canvas$}
          width={this.state.width}
          height={this.state.height}
          onClick={this.onClick}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onMouseDown={this.onMouseDown}
        >
          您的浏览器不支持画图
        </canvas>
      </>
    );
  }
}

export default Palette;
