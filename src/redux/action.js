export const CHANGE_WEIGHT = "CHANGE_WEIGHT";
export const CHANGE_COLOR = "CHANGE_COLOR";
export const CHANGE_CANVAS_RECT = "CHANGE_CANVAS_RECT";

// 笔粗细
export const changeWeight = (lineWidth) => {
  return {
    type: CHANGE_WEIGHT,
    payload: lineWidth
  }
}
export const changeColor = (color) => {
  return {
    type: CHANGE_COLOR,
    payload: color
  }
}
/**
 * 
 * @param {canvasWidth, canvasHeight} prop 
 */
export const changeCanvasRect = (prop) => {
  console.log(prop);
  return {
    type: CHANGE_CANVAS_RECT,
    payload: prop
  }
}