import { brush, BrushShape } from "../common/config";
import { UPDATE_CLIENT } from "./action";

type Action = { type: string; payload: any };

const initialState = {
  width: 500,
  height: 500,
};

function reducer(state = initialState, { type, payload }: Action) {
  switch (type) {
    case UPDATE_CLIENT:
      return Object.assign({}, state, { ...payload });
    default:
      return state;
  }
}

export default reducer;
