/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    content: './src/content.ts',
    popup: './src/popup.ts',
    background: './src/background.ts'
  },
  watch: true,
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/js'),
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: path.resolve(__dirname, "node_modules"),
      options: {
        transpileOnly: true
      }
    }]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve("buffer"),
      stream: require.resolve("stream-browserify"),
    }
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};
