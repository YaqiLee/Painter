import { brush } from "../common/config";
import {
  CHANGE_WEIGHT,
  CHANGE_COLOR,
  CHANGE_CANVAS_RECT,
  CHANGE_BRUSH,
} from "./action";

const initialState = {
  lineWidth: 2,
  color: "#000000",
  brush: brush.curve,
  canvas: {
    width: 0,
    height: 0,
  },
};

export default function reducer(state = initialState, action: any) {
  switch (action.type) {
    case CHANGE_WEIGHT:
      return Object.assign({}, state, { lineWidth: action.payload });
    case CHANGE_COLOR:
      return Object.assign({}, state, { color: action.payload });
    case CHANGE_CANVAS_RECT:
      const canvas = Object.assign(state.canvas, action.payload);
      return Object.assign({}, state, canvas);
    case CHANGE_BRUSH:
      return Object.assign({}, state, { brush: action.payload });
    default:
      return state;
  }
}
