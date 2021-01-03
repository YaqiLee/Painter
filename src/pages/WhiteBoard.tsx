import React, { MouseEvent } from "react";
import Pencil from "../common/Pencil";
import Toolbar from "./Toolbar";
import "./WhiteBoard.scss";

type propTypes = {
  width: number;
  height: number;
};

class WhiteBoard extends React.Component<propTypes> {
  points = {
    sx: 0, // 鼠标按下的位置
    sy: 0,
    mx: 0, // 移动中的位置
    my: 0,
    ex: 0, // 鼠标抬起的位置
    ey: 0,
    px: 0, // 鼠标上一个位置
    py: 0,
  };

  ctx!: CanvasRenderingContext2D;
  pencil!: Pencil;
  drawFunc = (params: any) => {};
  canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: any) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
  }

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.current as HTMLCanvasElement;
  }

  onBrushChange = (brushProps: any = {}) => {
    // 笔刷更新
    if (typeof brushProps.brush == "string" && brushProps.brush) {
      this.drawFunc = this.pencil.getDrawFunc(brushProps);
    }
    this.pencil.setOptions(brushProps);
  };

  componentDidMount() {
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.pencil = new Pencil(this.ctx);
    this.drawFunc = this.pencil.getDrawFunc();
    this.drawFunc({ x: 100, y: 100, r: 20 });
  }

  onMouseUp = ({ pageX, pageY }: MouseEvent<any>) => {
    this.points.ex = pageX;
    this.points.ey = pageY;
  };

  onMouseDown = ({ pageX, pageY }: MouseEvent<any>) => {
    this.points.sx = pageX;
    this.points.sy = pageY;
  };

  onMouseMove = ({ pageX, pageY }: MouseEvent<any>) => {
    this.points.px = this.points.mx;
    this.points.py = this.points.my;

    this.points.mx = pageX;
    this.points.my = pageY;

  };

  render() {
    return (
      <>
        {/* <WhiteBoardBack/> */}
        <Toolbar brushChange={this.onBrushChange} />
        <canvas
          ref={this.canvasRef}
          {...this.props}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
        >
          您的浏览器版本不支持
        </canvas>
      </>
    );
  }
}

export default WhiteBoard;
