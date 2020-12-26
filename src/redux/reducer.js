import { CHANGE_WEIGHT, CHANGE_COLOR, CHANGE_CANVAS_RECT } from "./action";

const initialState = {
  lineWidth: 2,
  color: "#000000",
  canvas: {
    width: 0,
    height: 0,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_WEIGHT:
      return Object.assign({}, state, { lineWidth: action.payload });
    case CHANGE_COLOR:
      return Object.assign({}, state, { color: action.payload });
    case CHANGE_CANVAS_RECT:
      return Object.assign({}, state, Object.assign(state.canvas, action.payload));

    default:
      return state;
  }
}
