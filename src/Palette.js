import React from "react";
import { connect } from "react-redux";
import { race } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
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
    // 是否已存在选区
    this.hasSelect = false;
    this.paint = null;
    this.ctx = null;
    // 用到的键
    this.useKeys = [KEY.SHIFT];
    this.isMove = false; // 是否移动状态
    this.moveData = []; // [移动之前的数据， 移动中的数据]
    this.keyCode = null; // 当前按住的快捷键, 不支持双组
    this.points = {
      mx: 0, // 当前位置，随鼠标位置变化
      my: 0,
      cx: 0, // 当前点击位置
      cy: 0,
      x: 0, // 画图起始点
      y: 0,
      endX: 0, // 画图结束点
      endY: 0,
    };

    this.state = {
      canDraw: false,
    };

    this.canvas$ = React.createRef();
  }

  get canvasObj() {
    return this.canvas$.current;
  }

  // 选区范围内
  withinSelectScope(px, py) {
    if (this.props.brush != brush.select) {
      return false;
    }

    const { x, y, endX, endY } = this.points;

    return x < endX
      ? this.isSelectScope(x, y, endX, endY, px, py)
      : this.isSelectScope(endX, endY, x, y, px, py);
  }

  isSelectScope(sx, sy, ex, ey, cx, cy) {
    return cx >= sx && cy >= sy && cx <= ex && cy <= ey;
  }

  onMouseDown = ({ pageX, pageY }) => {
    // 鼠标当前开始点的位置
    this.points.cx = pageX;
    this.points.cy = pageY;
    // 移动中的位置
    this.points.mx = pageX;
    this.points.my = pageY;
    // 计算是否在选取范围内
    if (
      this.props.brush === brush.select &&
      this.hasSelect &&
      !this.withinSelectScope(pageX, pageY)
    ) {
      this.hasSelect = false;
      this.props.cancel.next();
      return;
    }

    if (
      this.props.brush === brush.select &&
      this.hasSelect &&
      this.withinSelectScope(pageX, pageY)
    ) {
      this.isMove = true;
      const { x, y, endX, endY } = this.points;
      this.moveData[0] = this.imgdata;
      // 到这里imgdata就变成了选区的数据了
      this.selectRectData = this.getImageData(
        x + 1,
        y + 1,
        endX - x - 2,
        endY - y - 2
      );
      // 清空原来选区位置的数据
      this.onKeyDelete();
      return;
    }

    this.setState({ canDraw: true });
    // 记录开始点的位置
    this.points.x = pageX;
    this.points.y = pageY;

    this.getImageData();
    this.initBrushSetting(this.keyCode);
    this.historys.length <= 0 && this.historys.push(this.imgdata);
  };

  onMouseUp = ({ pageX, pageY }) => {
    // 记录结束点的位置, 起始点总是小于结束点
    if (pageX < this.points.x) {
      this.points.endX = this.points.x;
      this.points.endY = this.points.y;
      this.points.x = pageX;
      this.points.y = pageY;
    } else {
      this.points.endX = pageX;
      this.points.endY = pageY;
    }

    this.setState({ canDraw: false });
    this.getImageData();
    // 清空完成函数
    this.finishShape = null;
    this.historys.push(this.imgdata);
    if (this.isMove) {
      this.isMove = false;
      this.moveData[1] = null;
    }
  };

  onMouseMove = ({ pageX, pageY }) => {
    this.onDrawBefore(pageX, pageY);

    if (!this.state.canDraw) {
      return false;
    }

    this.draw(pageX, pageY, this.points);

    this.points.mx = pageX;
    this.points.my = pageY;
  };

  onMouseLeave = (e) => {
    this.setState({ canDraw: false });
    e.stopPropagation();
  };
  // 鼠标移动事件操作函数
  onDrawBefore(px, py) {
    const { x, y, cx, cy } = this.points;
    if (this.isMove) {
      this.canvasObj.style.cursor = "move";
      // TODO：移动结束之后需要清空
      if (!this.moveData[1]) {
        this.getImageData();
        this.moveData[1] = this.imgdata;
      }
      this.putImageData(0, 0, this.moveData[1]);
      const { width, height } = this.selectRectData;
      this.ctx.clearRect(x + px - cx, y + py - cy, width, height);
      // 放到当前鼠标移动位置
      this.putImageData(x + px - cx, y + py - cy, this.selectRectData);
    } else {
      this.canvasObj.style.cursor = "inherit";
    }
  }

  // 画笔设置，不在执行中判断，提高画笔效率
  initBrushSetting(key) {
    // 当前画笔类型
    let brusht = this.props.brush;
    // 矩形
    let rects = [brush.oRect, brush.rect];
    // 圆形
    let circles = [brush.circle, brush.oCircle];

    this.keyCode = key;

    if (brush.select == brusht) {
      this.hasSelect = true;
      this.draw = this.drawSelectScope;
      return;
    }

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
      console.log(this.draw);
      return;
    }

    if (circles.includes(brusht)) {
      this.draw =
        key === KEY.SHIFT ? this.drawBrushCircle : this.drawBrushEllipse;
      return;
    }
  }

  drawSelectScope(pageX, pageY, { x, y }) {
    const options = { brush: this.props.brush, lineWidth: 1, color: "#000" };
    // 设置虚线[实线长度，虚线长度]
    this.ctx.save();
    this.ctx.setLineDash([1, 3]);
    this.drawBrushRect(pageX, pageY, this.points, options);
    this.ctx.restore();
  }

  drawBrushLine(pageX, pageY, { x, y }) {
    this.initDraw();
    this.drawLine(x, y, pageX, pageY);
  }
  // 曲线
  drawBrushCurve(pageX, pageY, { mx, my }) {
    this.drawLine(mx, my, pageX, pageY);
  }
  // 圆形
  drawBrushCircle(pageX, pageY, { x, y }) {
    this.initDraw();
    this.drawCircle(x, y, Math.abs(pageX - x));
  }
  // 矩形
  drawBrushRect(pageX, pageY, { x, y }, props) {
    const width = pageX - x;
    const height = pageY - y;

    this.initDraw();
    this.drawRect(x, y, width, isNaN(pageY) ? width : height, props);
  }
  // 正方形
  drawBrushSquare(pageX, pageY, { x, y }) {
    this.drawBrushRect(Math.max(pageX, pageY), "null", { x, y });
  }
  // 椭圆
  drawBrushEllipse(pageX, pageY, { x, y }) {
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
        map(() => this.historys.pop()),
        // 过滤掉无效值
        filter((data) => typeof data !== "undefined"),
        // 如果取出的是当前画布数据，需要再取一次
        map((d) => (d === this.imgdata ? this.historys.pop() : d)),
        // 过滤掉无效值
        filter((data) => typeof data !== "undefined"),
        tap((data) => (this.imgdata = data)),
        tap((data) => this.ctx.putImageData(data, 0, 0))
      )
      .subscribe();

    this.props.clear.subscribe(() => {
      // 清空画布
      this.initCanvas();
    });

    this.props.keyup.subscribe(({ keyCode }) => {
      if (keyCode === KEY.SHIFT) {
        this.initBrushSetting(-1);
      }
    });

    this.props.keydown.subscribe(({ keyCode }) => {
      if (keyCode === KEY.DELETE) {
        this.onKeyDelete();
        return;
      }
      if (keyCode === KEY.SHIFT) {
        this.initBrushSetting(keyCode);
        return;
      }
    });
  }

  onKeyDelete() {
    // 画笔是选区时
    if (this.props.brush == brush.select) {
      const { x, y, endX, endY } = this.points;
      // 反向
      this.clearRect(x - 1, y - 1, endX - x + 2, endY - y + 2);
      // 不在选区
      this.hasSelect = false;
      this.getImageData();
      this.historys.push(this.imgdata);
    }
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
