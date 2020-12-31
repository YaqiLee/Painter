import { brush } from "../config";

test("笔刷类型变动", () => {
  expect(brush).toMatchSnapshot();
})