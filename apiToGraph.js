'use strict';

var extractNodes = require('./extractNodes'),
  extractLinks = require('./extractEdges');

module.exports = function (data) {
  var nodes = extractNodes(data),
    graph = {
      nodes: nodes,
      links: extractLinks(data, nodes)
    };

  return graph;
}
