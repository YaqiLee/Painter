import React from "react";
import { connect } from "react-redux";
import {
  debounceTime,
  map
} from "rxjs/operators";
import CanvasBackground from "./CanvasBackground";
import "./Palette.scss";
import { brush } from "./utils/config";
import Pencil from "./utils/pencil";
@connect((state) => {
  return {
    color: state.color,
    lineWidth: state.lineWidth,
    canvas: state.canvas,
    brush: state.brush,
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
    };

    this.canvas$ = React.createRef();
  }

  get canvasObj() {
    return this.canvas$.current;
  }

  onMouseDown = ({ pageX, pageY }) => {
    this.setState({ canDraw: true });
    this.setState({ prevDot: { x: pageX, y: pageY } });

    this.getImageData();

    if (this.historys.length <= 0) {
      this.historys.push(this.imgdata);
    }
  };

  onMouseUp = (e) => {
    this.setState({
      canDraw: false,
      prevDot: {
        x: null,
        y: null,
      },
    });
    this.getImageData();
    // 清空完成函数
    this.finishShape = null;
    this.historys.push(this.imgdata);
  };

  onMouseMove = (e) => {
    if (!this.state.canDraw) {
      return false;
    }
    this.startDraw(e);
  };

  onMouseLeave = (e) => {
    this.setState({ canDraw: false });
    e.stopPropagation();
  };

  startDraw({ pageX, pageY }) {
    let brusht = this.props.brush;
    let { x, y } = this.state.prevDot;
    let rects = [brush.oRect, brush.rect];
    let circles = [brush.circle, brush.oCircle];

    if (brush.curve == brusht) {
      this.drawLine(x, y, pageX, pageY);
      // 线段连续
      this.setState({ prevDot: { x: pageX, y: pageY } });
    } else if (brush.line == brusht) {
      this.initDraw();
      this.drawLine(x, y, pageX, pageY);
    } else if (rects.includes(brusht)) {
      this.initDraw();
      this.drawRect(x, y, pageX - x, pageY - y);
    } else if (circles.includes(brusht)) {
      this.initDraw();
      this.drawCircle(x, y, Math.abs(pageX - x));
    }
  }

  componentDidMount() {
    this.ctx = this.canvas$.current.getContext("2d");

    // 下载监听
    this.props.download.subscribe((element) => {
      const url = this.canvasObj.toDataURL();
      element.setAttribute("href", url);
    });

    this.props.cancel
      .pipe(
        debounceTime(200),
        map(() => this.historys.pop())
      )
      .subscribe((img) => {
        if (typeof img == "undefined") return;
        if (img === this.imgdata) {
          img = this.historys.pop();
        }
        this.imgdata = img;
        this.ctx.putImageData(img, 0, 0);
      });
    
      this.props.clear.subscribe(() => {
        this.initCanvas();
      })
  }

  componentWillUnmount() {
    this.props.download.unsubscribe();
    this.props.cancel.unsubscribe();
  }

  render() {
    const { clientWidth, clientHeight } = this.props;
    return (
      <>
        <CanvasBackground width={clientWidth} height={clientHeight} />
        <canvas
          id="canvas"
          ref={this.canvas$}
          width={clientWidth}
          height={clientHeight}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onMouseDown={this.onMouseDown}
          onMouseLeave={this.onMouseLeave}
        >
          您的浏览器不支持画图
        </canvas>
      </>
    );
  }
}

export default Palette;
