import { brush } from "./config";

test("笔刷类型不要改变", () => {
  expect(brush).toMatchSnapshot();
})