import React, { MouseEvent } from "react";
import { BrushShape } from "../common/config";
import Pencil from "../common/Pencil";
import Toolbar from "./Toolbar";
import "./WhiteBoard.scss";
import { Points } from "../common/model";

interface propTypes {
  width: number;
  height: number;
}

class WhiteBoard extends React.Component<propTypes> {
  points: Points = {
    sx: 0, // 鼠标按下的位置
    sy: 0,
    mx: 0, // 移动中的位置
    my: 0,
    ex: 0, // 鼠标抬起的位置
    ey: 0,
    px: 0, // 鼠标上一个位置
    py: 0,
  };
  hasSelect: boolean = false;
  // 是否开始画
  canDraw: boolean = false;
  ctx!: CanvasRenderingContext2D;
  pencil!: Pencil;
  draw = (px: number, py: number, {}: any) => {};
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvasData: any = [];
  historys: ImageData[] = []; // 保存历史数据

  constructor(props: any) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
  }

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.current as HTMLCanvasElement;
  }
  // 撤销
  onCancel = () => {
    let history = this.historys.pop();
    const imageData = this.canvasData[1];

    while (history && history == imageData) {
      history = this.historys.pop();
    }

    if (history) {
      this.ctx.putImageData(history, 0, 0);
      this.historys.push(history);
    }
  };

  onCancelSelect = (x: number, y: number) => {
    if (this.hasSelect && !this.withinSelectScope(x, y)) {
      this.hasSelect = false;
      this.onCancel();
      return true;
    }
    return false;
  };

  onDownload = ({ currentTarget }: any) => {
    const url = this.canvas.toDataURL();
    currentTarget.setAttribute("href", url);
  };

  onBrushChange = (brushProps: any = {}) => {
    // 笔刷更新
    this.pencil.setOptions(brushProps);
  };

  componentDidMount() {
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.pencil = new Pencil(this.ctx);
  }

  onMouseUp = ({ pageX, pageY }: MouseEvent<any>) => {
    this.canDraw = false;
    const { sx, sy } = this.points;
    // 使开始点永远是小于结束点
    if (pageX < sx) {
      this.points.sx = pageX;
      this.points.sy = pageY;
      this.points.ex = sx;
      this.points.ey = sy;
    } else {
      this.points.ex = pageX;
      this.points.ey = pageY;
    }
    this.saveHistory();
  };

  onMouseDown = ({ pageX, pageY }: MouseEvent<any>) => {
    this.onCancelSelect(pageX, pageY);

    this.initBrushSetting(pageX, pageY);

    this.points.sx = pageX;
    this.points.sy = pageY;
    this.points.px = pageX;
    this.points.py = pageY;

    this.canDraw = true;
    this.canvasData[0] = this.getCanvasData();
    this.historys.length <= 0 && this.historys.push(this.canvasData[0]);
  };

  onMouseMove = ({ pageX, pageY }: MouseEvent<any>) => {
    this.canvas.style.cursor = "auto";
    if (this.canDraw === false) return;
    // 记录当前移动点的位置
    this.points.mx = pageX;
    this.points.my = pageY;
    // 开始画
    this.draw(pageX, pageY, this.points);
    // 画完之后保存上一个点位置信息
    this.points.px = this.points.mx;
    this.points.py = this.points.my;
  };

  onMouseLeave = () => {
    this.canDraw = false;
  };

  onMoveSelect = () => {};

  initBrushSetting(pageX: number, pageY: number) {
    const { brush } = this.pencil.options;

    if (brush == BrushShape.curve) {
      this.draw = this.drawCurve;
      return;
    }
    if (brush == BrushShape.select) {
      this.draw = this.drawSelect;
      return;
    }

    if (brush == BrushShape.line) {
      this.draw = this.drawLine;
      return;
    }

    if (brush == BrushShape.rect) {
      this.draw = this.drawRect;
      return;
    }

    if (brush == BrushShape.circle) {
      this.draw = this.drawCircle;
      return;
    }

    this.draw = this.drawLine;
  }

  saveHistory() {
    const { sx, sy, ex, ey } = this.points;
    // 没有移动不保存历史
    if(ex === sx  && ey === sy) {
      return ;
    }
    console.log("save history");
    
    this.canvasData[1] = this.getCanvasData();
    this.historys.push(this.canvasData[1]);
    console.log(this.historys.length);
    
  }

  getCanvasData(x = 0, y = 0, { width, height } = this.props) {
    return this.ctx.getImageData(x, y, width, height);
  }

  drawCircle(pageX: number, pageY: number, { sx, sy }: Points) {
    const [x, y] = [sx, sy];
    const r = Math.abs(pageX - x);
    this.restoreCanvas();
    this.pencil.drawCircle({ x, y, r });
  }

  drawCurve(xEnd: number, yEnd: number, { px, py }: any) {
    const [x, y] = [px, py];
    this.pencil.drawLine({ x, y, xEnd, yEnd });
  }

  drawLine(xEnd: number, yEnd: number, { sx, sy }: any) {
    const [x, y] = [sx, sy];
    this.restoreCanvas();
    this.pencil.drawLine({ x, y, xEnd, yEnd });
  }

  drawSelect(pageX: number, pageY: number, { sx, sy }: Points) {
    this.ctx.save();
    this.ctx.setLineDash([2, 3]);
    this.drawRect(pageX - 2, pageY - 2, { sx, sy });
    this.hasSelect = true;
    this.ctx.restore();
  }

  drawRect(pageX: number, pageY: number, { sx, sy }: any) {
    const [x, y] = [sx, sy];
    const width = pageX - x;
    const height = pageY - y;
    this.restoreCanvas();
    this.pencil.drawRect({ x, y, width, height });
  }
  // 清空画布，填上之前的数据
  restoreCanvas() {
    this.pencil.clear(0, 0, this.props.width, this.props.height);
    this.ctx.putImageData(this.canvasData[0], 0, 0);
  }
  // 是否在选区范围内
  withinSelectScope = (x: number, y: number) => {
    const { brush } = this.pencil.options;
    if (!this.hasSelect || brush != BrushShape.select) {
      return false;
    }
    const { sx, sy, ex, ey } = this.points;

    return x >= sx && x <= ex && y >= sy && y <= ey;
  };

  render() {
    return (
      <>
        {/* <WhiteBoardBack/> */}
        <Toolbar
          brushChange={this.onBrushChange}
          onCancel={this.onCancel}
          download={this.onDownload}
        />
        <canvas
          ref={this.canvasRef}
          {...this.props}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}
        >
          您的浏览器版本不支持
        </canvas>
      </>
    );
  }
}

export default WhiteBoard;
