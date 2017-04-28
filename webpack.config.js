'use strict';

let BabiliPlugin = require("babili-webpack-plugin");
let path = require('path');

module.exports = {
  entry:{
    fu: './src/index.ts'
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /.tsx?$/,
      exclude: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'bower_components')
      ],
      use: {
        loader: 'awesome-typescript-loader',
        options: {}
      }
    }]
  },
  plugins: [
  //  new BabiliPlugin()
  ],
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],
    extensions: ['.ts', 'tsx', '.json', '.js', '.jsx', '.css']
  },
  devtool: 'source-map'
};