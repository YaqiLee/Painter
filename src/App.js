import React from "react";
import { connect } from "react-redux";
import { Subject } from "rxjs";
import "./App.scss";
import Palette from "./Palette";
import { CHANGE_CANVAS_RECT } from "./redux/action";
import Toolbar from "./Toolbar";

class App extends React.Component {
  state = {
    height: 0,
    width: 0,
  };

  downSubject = new Subject();
  cancelSubject = new Subject();

  initContext(ctx) {
    this.ctx = ctx;
  }

  componentDidMount() {
    let { clientHeight, clientWidth } = document.body;
    this.setState({ height: clientHeight, width: clientWidth });
    this.props.changeCanvas(clientWidth, clientHeight);
  }

  render() {
    return (
      <main>
        <Toolbar download={this.downSubject} cancel={this.cancelSubject} />
        <Palette
          download={this.downSubject}
          cancel={this.cancelSubject}
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
