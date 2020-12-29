import React from "react";
import { connect } from "react-redux";
import { Subject } from "rxjs";
import "./App.scss";
import Palette from "./Palette";
import { CHANGE_CANVAS_RECT } from "./redux/action";
import Toolbar from "./Toolbar";

class App extends React.Component {
  state = { height: 0, width: 0 };

  // 下载
  downSubject = new Subject();
  // 撤销
  cancelSubject = new Subject();
  // 清空
  clearSubject = new Subject();
  // 鼠标按键事件
  keydownSubject = new Subject();
  keyupSubject = new Subject();
  // 选区
  selectSubject = new Subject();

  commonProps = {
    clear: this.clearSubject,
    keyup: this.keyupSubject,
    keydown: this.keydownSubject,
    download: this.downSubject,
    cancel: this.cancelSubject,
    select: this.selectSubject,
  };

  componentDidMount() {
    let { clientHeight, clientWidth } = document.body;
    this.setState({ height: clientHeight, width: clientWidth });
    this.props.changeCanvas(clientWidth, clientHeight);
    // document事件只在这里注册一次,防止重复
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyup);
  }

  onKeyup = () => {
    this.keyupSubject.next(-1);
  };

  onKeyDown = (e) => {
    this.keydownSubject.next(e.keyCode);
  };

  render() {
    return (
      <main>
        <Toolbar {...this.commonProps} />
        <Palette
          {...this.commonProps}
          clientHeight={this.state.height}
          clientWidth={this.state.width}
        />
      </main>
    );
  }
}

export default connect(null, (dispatch) => {
  return {
    changeCanvas: (width, height) => {
      dispatch({
        type: CHANGE_CANVAS_RECT,
        payload: { width, height },
      });
    },
  };
})(App);
