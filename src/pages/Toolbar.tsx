import React, { ChangeEvent, MouseEvent, SyntheticEvent } from "react";
import Line from "../components/Line";
import "./Toolbar.scss";

type propTypes = {
  brushChange: (props: any) => void;
};

class Toolbar extends React.Component<propTypes> {
  state = {
    color: "#000",
    select: -1,
    selectChild: "",
  };

  ActiveClass = "active";

  constructor(props: any) {
    super(props);
  }

  onChangeColor = ({ target }: { target: HTMLInputElement }) => {
    const value = { color: target.value };
    this.setState(value);
    this.props.brushChange(value);
  };

  onClickParent = ({ currentTarget }: any) => {
    const i = currentTarget.getAttribute("data-index");
    const current = this.state.select;

    this.setState({ select: current === i ? -1 : i });
  };

  onClickChild = ({ currentTarget }: any) => {
    const i = currentTarget.getAttribute("data-index");
    const current = this.state.selectChild;

    this.setState({ selectChild: current === i ? "" : i });
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
                    onClick={this.onClickChild}
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
        </ul>
      </div>
    );
  }
}

export default Toolbar;
