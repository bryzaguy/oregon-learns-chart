'use strict';

function nodeIndicesByCode(nodes) {
  return nodes.reduce(function (r, n, i) {
    r[n.code] = i;
    return r;
  }, {})
}

function mapToEdges(data) {
  var edgesMap = data.reduce(function (edges, item) {
    var path = item.path,
      value = item.value;

    for (var i = 1; i < path.length; i++) {
      var sourceCode = path[i - 1],
        targetCode = path[i],
        key = sourceCode + targetCode;

      edges[key] = edges[key] || {
        sourceCode: sourceCode,
        targetCode: targetCode,
        value: 0
      };

      edges[key].value = edges[key].value + value;
    }

    return edges;
  }, {});

  return Object.keys(edgesMap)
    .map(function (key) {
      return edgesMap[key];
    });
}

module.exports = function (data, nodes) {  
  var codeIndeces = nodeIndicesByCode(nodes);

  var edges = mapToEdges(data);

  return edges.map(function (edge) {
    edge.source = codeIndeces[edge.sourceCode];
    edge.target = codeIndeces[edge.targetCode];
    return edge;
  });
};