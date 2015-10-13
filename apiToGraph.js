'use strict';

var codes = {
    B: "Bachelor+",
    A: "Associate",
    C: "Certificate",
    F: "2nd 4 Year",
    4: "1st 4 Year",
    T: "2nd 2 Year",
    2: "1st 2 Year",
    G: "Graduated",
    D: "HS Diploma",
    X: "Did not graduate",
    Z: "No achievements",
    H: "Highschool",
  },
  priority = ['B', 'A', 'C', 'F', '4', 'T', '2', 'G', 'D', 'X', 'Z', 'H'];

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

module.exports = function (data) {
  var graph = {
    nodes: Object.keys(codes)
      .map(function (code) {
        return {
          code: code,
          name: codes[code],
          priority: priority.indexOf(code)
        };
      }),
    links: []
  };

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
        if (index) {
          var lastStage = path[index - 1];
          var edgeKey = lastStage + stage;
          edges[edgeKey] = (edges[edgeKey] || 0) + value;
        }

        return edges;
      }, result);
  }

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
