'use strict';

var educationNodes = require('./educationNodes'),
  transformData = require('./transformData'),
  codes = educationNodes.codes,
  priority = educationNodes.priority;

module.exports = function (data) {
  var graph = {
    nodes: [],
    links: []
  }, graphNodes = Object.keys(codes)
    .map(function (code) {
      return {
        code: code,
        name: codes[code],
        priority: priority.indexOf(code)
      };
    });

  var result = {};
  for (var point in data) {
    var value = data[point].value;

    data[point].path.reduce(
      function (edges, stage, index, path) {
        if (index) {
          var lastStage = path[index - 1];
          var edgeKey = lastStage + stage;
          edges[edgeKey] = (edges[edgeKey] || 0) + value;
        }

        return edges;
      }, result);
  }

  graph.nodes = graphNodes.filter(function(_, i) {
    return graph.links.some(function (l) {
      return l.target === i || l.source === i;
    });
  });

  var includedPaths = Object.keys(
      Object.keys(result)
        .reduce(function(r, n) {
          var p = n.split('');
          r[p[0]] = true;
          r[p[1]] = true;
          return r;
        }, {})
    );

  graph.nodes = graphNodes.filter(function (n) {
    return includedPaths.indexOf(n.code) > -1;
  });

  var codeIndeces = graph.nodes
    .reduce(function (r, n, i) {
      r[n.code] = i;
      return r;
    }, {});

  for (var key in result) {
    var edge = {
      value: result[key]
    };

    edge.source = codeIndeces[key.split('')[0]];
    edge.target = codeIndeces[key.split('')[1]];

    graph.links.push(edge);
  }

  return graph;
}
