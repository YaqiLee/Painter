import React from "react";
import { connect } from "react-redux";
import "./App.scss";
import Palette from "./Palette";
import { CHANGE_CANVAS_RECT } from "./redux/action";
import Toolbar from "./Toolbar";

function App(props) {
  let { clientHeight, clientWidth } = document.body;
  props.changeCanvas(clientWidth, clientHeight);
  return (
    <main>
      <Toolbar />
      <Palette clientHeight={clientHeight} clientWidth={clientWidth} />
    </main>
  );
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
