import React from "react";
import { connect } from "react-redux";
import { race } from "rxjs";
import {
  combineAll,
  debounceTime,
  filter,
  map,
  merge,
  switchMap,
  tap,
} from "rxjs/operators";
import CanvasBackground from "./CanvasBackground";
import "./Palette.scss";
import { brush, KEY } from "./utils/config";
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
    // 用到的键
    this.useKeys = [KEY.SHIFT];

    this.state = {
      prevDot: { x: null, y: null },
      canDraw: false,
      key: -1,
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
    this.initBrushSetting();
    this.historys.length <= 0 && this.historys.push(this.imgdata);
  };

  onMouseUp = (e) => {
    this.setState({ canDraw: false, prevDot: { x: null, y: null } });
    this.getImageData();
    // 清空完成函数
    this.finishShape = null;
    this.historys.push(this.imgdata);
  };

  onMouseMove = ({ pageX, pageY }) => {
    if (!this.state.canDraw) {
      return false;
    }

    let { x, y } = this.state.prevDot;

    this.draw(x, y, pageX, pageY);
  };

  onMouseLeave = (e) => {
    this.setState({ canDraw: false });
    e.stopPropagation();
  };

  // 画笔设置，不在执行中判断，提高画笔效率
  initBrushSetting(key = -1) {
    // 当前画笔类型
    let brusht = this.props.brush;
    // 矩形
    let rects = [brush.oRect, brush.rect];
    // 圆形
    let circles = [brush.circle, brush.oCircle];

    if (brush.curve == brusht) {
      this.draw = key === KEY.SHIFT ? this.drawBrushLine : this.drawBrushCurve;
      return;
    }

    if (brush.line == brusht) {
      this.draw = this.drawBrushLine;
      return;
    }

    if (rects.includes(brusht)) {
      // TODO: 这里少一个方形
      this.draw = key === KEY.SHIFT ? this.drawBrushSquare : this.drawBrushRect;
      return;
    }

    if (circles.includes(brusht)) {
      this.draw =
        key === KEY.SHIFT ? this.drawBrushCircle : this.drawBrushEllipse;
      return;
    }
  }

  drawBrushLine(x, y, pageX, pageY) {
    this.initDraw();
    this.drawLine(x, y, pageX, pageY);
  }
  // 曲线
  drawBrushCurve(x, y, pageX, pageY) {
    this.drawLine(x, y, pageX, pageY);
    // 线段连续
    this.setState({ prevDot: { x: pageX, y: pageY } });
  }
  // 圆形
  drawBrushCircle(x, y, pageX, pageY) {
    this.initDraw();
    this.drawCircle(x, y, Math.abs(pageX - x));
  }
  // 矩形
  drawBrushRect(x, y, pageX, pageY) {
    const width = pageX - x;
    const height = pageY - y;

    this.initDraw();
    this.drawRect(x, y, width, isNaN(pageY) ? width : height);
  }
  // 正方形
  drawBrushSquare(x, y, pageX, pageY) {
    this.drawBrushRect(x, y, Math.max(pageX, pageY));
  }
  // 椭圆
  drawBrushEllipse(x, y, pageX, pageY) {
    this.initDraw();
    this.drawEllipse(x, y, Math.abs(pageX - x), Math.abs(pageY - y));
  }

  componentDidMount() {
    this.ctx = this.canvas$.current.getContext("2d");

    // 下载
    this.props.download.subscribe((element) => {
      const url = this.canvasObj.toDataURL();
      // 需要 a 标签设置 download="download"
      element.setAttribute("href", url);
    });
    // switchmap 与 map 返回值不一样， switchMap会发布一个新的订阅
    this.props.cancel
      .pipe(
        debounceTime(200),
        map(() => this.historys.pop()),
        // 过滤掉无效值
        filter((data) => typeof data !== "undefined"),
        // 如果取出的是当前画布数据，需要再取一次
        map((d) => (d === this.imgdata ? this.historys.pop() : d)),
        tap((data) => (this.imgdata = data)),
        tap((data) => this.ctx.putImageData(data, 0, 0))
      )
      .subscribe();

    this.props.clear.subscribe(() => {
      // 清空画布
      this.initCanvas();
    });
    // 按键按下和抬起执行相同的动作，race 一个成功即可
    race(this.props.keyup, this.props.keydown)
      .pipe(filter((d) => this.useKeys.includes(d)))
      .subscribe((key) => this.initBrushSetting(key));
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
