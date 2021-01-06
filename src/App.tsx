import React, { KeyboardEvent } from "react";
import WhiteBoard from "./pages/WhiteBoard";
import "./App.scss";
import { connect } from "react-redux";
import { Subject } from "rxjs";

class App extends React.Component<any> {
  state = {
    width: 0,
    height: 0,
  };

  keydownSub = new Subject<any>();
  keyupSub = new Subject<any>();

  componentDidMount() {
    let { clientHeight, clientWidth } = document.body;
    const params = { width: clientWidth, height: clientHeight };
    this.props.changeClient(params);
    this.setState(params);
    document.addEventListener("keydown", (e) => this.keydownSub.next(e));
    document.addEventListener("keyup", (e) => this.keyupSub.next(e));
  }

  render() {
    return (
      <WhiteBoard
        width={this.state.width}
        height={this.state.height}
        keydown={this.keydownSub}
        keyup={this.keyupSub}
      />
    );
  }
}

export default connect(null, (dispatch) => {
  return {
    changeClient: (type: string, value: number) => {
      dispatch({
        type: type,
        payload: value,
      });
    },
  };
})(App);
