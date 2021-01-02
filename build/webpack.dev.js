const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",

  devtool: "inline-source-map",
  cache: false,

  devServer: {
    port: 4600
  },
});
