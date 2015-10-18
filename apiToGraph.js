'use strict';

var educationNodes = require('./educationNodes'),
  codes = educationNodes.codes,
  priority = educationNodes.priority;

function getCode(stage, index) {
  switch (stage + index) {
    case 'X2':
    case 'X3':
    case 'X4':
      return 'Z';
    case '43':
      return 'F';
    case '23':
      return 'T';
    default:
      return stage;
  }
}

module.exports = function (data, stageFilter) {
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

  var modifiedData = Object.keys(data)
    .reduce(function (r, n) {

      var key = n.replace('S', '');
      if (key.indexOf('2') === 1) {
        key = key.split('')[0] + key.substring(2);
      }

      if (data[n] > 0) {
        r[key] = (r[key] || 0) + data[n];
      }

      return r;
    }, {});

  var result = {};
  for (var key in modifiedData) {
    var value = modifiedData[key];

    // Zero and -1 don't need processing

    var results = key.split('')
      .reduce(function (path, stage, index) {
        path.push(getCode(stage, index));

        if (index === 2 && key.length === 4) {
          path.push(getCode(stage, 3));
        }

        return path;
      }, [])
      .reduce(function (edges, stage, index, path) {
        if (index && (!stageFilter || path.indexOf(stageFilter) > -1)) {
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
