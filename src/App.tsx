import React from "react";
import WhiteBoard from "./pages/WhiteBoard";
import "./App.scss";
import { connect } from "react-redux";

class App extends React.Component<any> {
  state = {
    width: 0,
    height: 0,
  };

  componentDidMount() {
    let { clientHeight, clientWidth } = document.body;
    const params = { width: clientWidth, height: clientHeight };
    this.props.changeClient(params);
    this.setState(params);
  }

  render() {
    return <WhiteBoard width={this.state.width} height={this.state.height} />;
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
