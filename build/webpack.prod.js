const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  bail: true,
  mode: "production",
  devtool: "source-map", // 可以在生产环境中启用source-map, 可以追踪源码
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "common"
    }
  },
  stats: {
    assets: true
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ]
});
