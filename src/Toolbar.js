import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { CHANGE_BRUSH, CHANGE_COLOR, CHANGE_WEIGHT } from "./redux/action";
import "./toolbar.scss";
import { brush } from "./utils/config";
import CurveLine from "./components/CurveLine";

const Line = styled.div`
  ${(props) => {
    return `
      width: 50%;
      height: ${props.weight}px;
      max-height: 30px;
      background-color: ${props.color};
    `;
  }}
`;
const baseShapeTpl = (props) => `
  width: 20px;
  height: 20px;
  border: ${props.weight}px solid ${props.color};
  display: inline-block;
  vertical-align: text-top;
  background: ${props.fill ? props.color : "transparent"};
`;

const Rect = styled.div`
  ${(props) => baseShapeTpl(props)}
`;

const Circle = styled.div`
  ${(props) => {
    return `
      ${baseShapeTpl(props)}
      border-radius: 50%;
    `;
  }}}
`;

@connect(
  (state) => {
    return {
      color: state.color,
      brush: state.brush,
      lineWidth: state.lineWidth,
    };
  },
  (dispatch) => {
    return {
      changeColor: (color) => {
        dispatch({
          type: CHANGE_COLOR,
          payload: color,
        });
      },
      changeWeight: (weight) => {
        dispatch({
          type: CHANGE_WEIGHT,
          payload: weight,
        });
      },
      changeBrush: (brushType) => {
        dispatch({
          type: CHANGE_BRUSH,
          payload: brushType,
        });
      },
    };
  }
)
class Toolbar extends React.Component {
  constructor(props) {
    super(props);
  }
  // 激活状态class值
  ACTIVE_CLASS = "active";

  state = {
    weight: 1,
    selectIndex: -1,
    selectCateIndex: -1,
  };

  brushs = [
    {
      custom: "true",
      brush: brush.curve,
      child: CurveLine,
    },
    {
      brush: brush.line,
      child: Line,
    },
    {
      brush: brush.oRect,
      child: Rect,
    },
    {
      brush: brush.rect,
      fill: "true",
      child: Rect,
    },
    {
      brush: brush.oCircle,
      child: Circle,
    },
    {
      brush: brush.circle,
      fill: "true",
      child: Circle,
    },
  ];

  onChangeColor = (e) => {
    this.props.changeColor(e.target.value);
  };

  onSelect = (e) => {
    const i = e.currentTarget.getAttribute("data-index");
    e.preventDefault();
    this.setState({ selectIndex: i });
  };

  onCancelSelect = () => {
    this.setState({ selectIndex: -1 });
  };
  // 笔粗细
  onSelectGor = (e, index, weight) => {
    this.setState({ selectCateIndex: index, weight });
    this.props.changeWeight(weight);
    e.stopPropagation();
  };

  onSelectShape = (e) => {
    const brush = e.currentTarget.getAttribute("data-brush");
    this.props.changeBrush(brush);
    e.stopPropagation();
  };

  // 下载图片
  onDownload = (e) => {
    this.props.download.next(e.currentTarget);
    e.stopPropagation();
  };

  onCancel = (e) => {
    this.onSelect(e);
    this.props.cancel.next();
  };

  // 不用保持激活状态的组件
  dynamicChild = () => {
    
  }

  render() {
    return (
      <div className="toolbar">
        <ul>
          <li
            data-index="1"
            onClick={this.onSelect}
            className={this.state.selectIndex == 1 ? this.ACTIVE_CLASS : ""}
          >
            <div className="item">画笔</div>
            <div className="item-categories">
              <div onClick={(e) => e.stopPropagation()}>
                <input
                  type="color"
                  value={this.props.color}
                  onChange={this.onChangeColor}
                />
              </div>
              {[2, 5].map((it, i) => {
                return (
                  <div
                    key={"sub-" + i}
                    onClick={(e) => this.onSelectGor(e, i, it)}
                    className={
                      this.state.selectCateIndex == i ? this.ACTIVE_CLASS : ""
                    }
                  >
                    <Line color={this.props.color} weight={it} />
                  </div>
                );
              })}
            </div>
          </li>
          <li
            data-index="2"
            onClick={this.onSelect}
            className={this.state.selectIndex == 2 ? this.ACTIVE_CLASS : ""}
          >
            <div className="item">形状</div>
            <div className="item-categories">
              {this.brushs.map((b, i) => {
                return (
                  <div
                    key={i}
                    data-brush={b.brush}
                    onClick={this.onSelectShape}
                    className={
                      this.props.brush == b.brush ? this.ACTIVE_CLASS : ""
                    }
                  >
                    {
                      <b.child
                        fill={b.fill}
                        color={this.props.color}
                        weight={this.state.weight}
                      />
                    }
                  </div>
                );
              })}
            </div>
          </li>
          <li
            data-index="3"
            onClick={this.onSelect}
            className={this.state.selectIndex == 3 ? this.ACTIVE_CLASS : ""}
          >
            <div className="item">工具</div>
            <div className="item-categories">
              <div>
                <a href="" onClick={this.onDownload} download="download">
                  下载
                </a>
              </div>
              <div>显示背景</div>
            </div>
          </li>
          <li
            data-index="4"
            onMouseDown={this.onCancel}
            onMouseUp={this.onCancelSelect}
            className={this.state.selectIndex == 4 ? this.ACTIVE_CLASS : ""}
          >
            <div className="item">撤销</div>
            <div className="item-categories"></div>
          </li>
        </ul>
      </div>
    );
  }
}

export default Toolbar;
