"use strict";

var path = require('path');

module.exports = {
  entry: "./graph.js",
  output: {
    path: path.join(__dirname, 'build'),
    filename: "graph.js"
  }
};