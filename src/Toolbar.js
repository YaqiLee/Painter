import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { CHANGE_COLOR, CHANGE_WEIGHT } from "./redux/action";
import "./toolbar.scss";

const PencilWeight = styled.div`
  ${(props) => {
    return `::after {
      content: "";
      display: inline-block;
      width: 66%;
      height: ${props.weight}px;
      background-color: ${props.color};
    }`;
  }}
`;

const OReact = styled.div`
  ${(props) => {
    return `
    width: 20px;
    height: 20px;
    border: ${props.weight}px solid ${props.color};
    display: inline-block;
    vertical-align: text-top;
    `;
  }}
`;

@connect(
  (state) => {
    return {
      color: state.color,
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
    };
  }
)
class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weight: 1,
      selectIndex: -1,
      selectCateIndex: -1,
    };
  }

  onChangeColor = (e) => {
    this.props.changeColor(e.target.value);
  };

  onSelect = (e) => {
    const i = e.currentTarget.getAttribute("data-index");
    e.currentTarget.classList.toggle("active");
    e.preventDefault();
    this.setState({ selectIndex: i });
  };
  // 笔粗细
  onSelectGor = (e, index, weight) => {
    this.setState({ selectCateIndex: index, weight });
    this.props.changeWeight(weight);
    e.stopPropagation();
  };

  onSelectRect = (e) => {
    const index = e.currentTarget.getAttribute("data-index");
    this.setState({ selectCateIndex: index });
    e.stopPropagation();
  };

  render() {
    return (
      <div className="toolbar">
        <ul>
          <li
            data-index="1"
            onClick={this.onSelect}
            className={this.state.selectIndex == 1 ? "active" : ""}
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
                    key={i}
                    onClick={(e) => this.onSelectGor(e, i, it)}
                    className={this.state.selectCateIndex == i ? "active" : ""}
                  >
                    <PencilWeight color={this.props.color} weight={it} />
                  </div>
                );
              })}
            </div>
          </li>
          <li
            data-index="2"
            onClick={this.onSelect}
            className={this.state.selectIndex == 2 ? "active" : ""}
          >
            <div className="item">矩形</div>
            <div className="item-categories">
              <div
                data-index="rect-1"
                onClick={this.onSelectRect}
                className={
                  this.state.selectCateIndex == "rect-1" ? "active" : ""
                }
              >
                <OReact color={this.props.color} weight={this.state.weight} />
              </div>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default Toolbar;
