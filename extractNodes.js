'use strict';

var educationNodes = require('./educationNodes'),
  codes = educationNodes.codes,
  priority = educationNodes.priority;

function uniqueValues(data) {
  var o = data.reduce(function(r, v) {
    r[v] = true;
    return r;
  }, {});

  return Object.keys(o);
}

module.exports = function (paths) {
  var nodes = paths.reduce(function (r, path) {
      return r.concat(path)
    }, []);

  return uniqueValues(nodes).map(function (code) {
      return {
        code: code,
        name: codes[code],
        priority: priority.indexOf(code)
      };
    });
};