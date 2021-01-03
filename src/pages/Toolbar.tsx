import React, { ChangeEvent, MouseEvent, SyntheticEvent } from "react";
import { brush, BrushShape } from "../common/config";
import CurveLine from "../components/CurveLine";
import Line from "../components/Line";
import { Circle, Rect } from "../components/Shape";
import "./Toolbar.scss";

type propTypes = {
  brushChange: (props: any) => void;
};

class Toolbar extends React.Component<propTypes> {
  state = {
    color: "#000000",
    select: -1,
    selectChild: "",
    weight: 1,
    brush: "",
  };

  ActiveClass = "active";

  brushs = [
    {
      key: "b_1",
      brush: BrushShape.curve,
      child: CurveLine,
    },
    {
      key: "b_2",
      brush: BrushShape.line,
      child: Line,
    },
    {
      key: "b_3",
      brush: BrushShape.rect,
      child: Rect,
    },
    {
      key: "b_4",
      brush: BrushShape.rect,
      fill: "true",
      child: Rect,
    },
    {
      key: "b_5",
      brush: BrushShape.circle,
      child: Circle,
    },
    {
      key: "b_6",
      brush: BrushShape.circle,
      fill: "true",
      child: Circle,
    },
  ];

  constructor(props: any) {
    super(props);
  }

  onChangeColor = ({ target }: { target: HTMLInputElement }) => {
    const value = { color: target.value };
    this.setState(value);
    this.props.brushChange(value);
  };

  onClickShape = ({ key, brush, fill = false }: any) => {
    const current = this.state.selectChild;

    if (current === key) {
      brush = null;
      key = -1;
    }
    this.setState({ selectChild: key, brush });
    this.props.brushChange({ brush: brush, fill });
  };

  onClickParent = ({ currentTarget }: any) => {
    const i = currentTarget.getAttribute("data-index");
    const current = this.state.select;

    this.setState({ select: current === i ? -1 : i });
  };

  onClickWeight = ({ currentTarget }: any) => {
    const i = currentTarget.getAttribute("data-index");
    const weight = currentTarget.getAttribute("data-weight");
    const current = this.state.selectChild;

    this.props.brushChange({ lineWidth: weight })
    this.setState({ selectChild: current === i ? "" : i, weight });
  };

  render() {
    return (
      <div className="toolbar">
        <ul>
          <li className={this.state.select == 1 ? this.ActiveClass : ""}>
            <div data-index="1" className="item" onClick={this.onClickParent}>
              画笔
            </div>
            <div className="item-categories">
              <div onClick={(e) => e.stopPropagation()}>
                <input
                  type="color"
                  value={this.state.color}
                  onChange={this.onChangeColor}
                />
              </div>
              {[1, 2, 5].map((w, i) => {
                return (
                  <div
                    key={i}
                    data-index={`c_${i}`}
                    data-weight={w}
                    onClick={this.onClickWeight}
                    className={
                      this.state.selectChild == `c_${i}` ? this.ActiveClass : ""
                    }
                  >
                    <Line weight={w} color={this.state.color} />
                  </div>
                );
              })}
            </div>
          </li>
          <li className={this.state.select == 2 ? this.ActiveClass : ""}>
            <div data-index="2" className="item" onClick={this.onClickParent}>
              形状
            </div>
            <div className="item-categories">
              {this.brushs.map((b: any, i: number) => {
                return (
                  <div
                    key={b.key}
                    data-index={b.key}
                    data-brush={b.brush}
                    onClick={() => this.onClickShape(b)}
                    className={
                      this.state.selectChild == b.key ? this.ActiveClass : ""
                    }
                  >
                    {
                      <b.child
                        weight={this.state.weight}
                        color={this.state.color}
                        fill={b.fill}
                      />
                    }
                  </div>
                );
              })}
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default Toolbar;
