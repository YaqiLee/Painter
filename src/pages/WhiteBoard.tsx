import React from "react";
import { CanvasContext } from "../common/config";
import Pencil from "../common/Pencil";

class WhiteBoard extends React.Component {
  ctx!: CanvasRenderingContext2D;
  pencil: Pencil | null = null;
  canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: any) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
  }

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.current as HTMLCanvasElement;
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.pencil = new Pencil(this.ctx);
    this.pencil.drawCircle({ x: 100, y: 100, r: 20 });
    this.pencil.drawRect({ x: 200, y: 200, width: 200, height: 200 });
  }

  render() {
    return (
      <>
        {/* <WhiteBoardBack/> */}
        <canvas ref={this.canvasRef} width="500" height="500">
          您的浏览器版本不支持
        </canvas>
      </>
    );
  }
}

export default WhiteBoard;
