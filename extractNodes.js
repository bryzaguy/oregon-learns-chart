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

module.exports = function (groups) {
  var nodes = groups.reduce(function (r, group) {
      return r.concat(group.path);
    }, []);

  var unique = uniqueValues(nodes);

  return unique.map(function (code) {
      return {
        code: code,
        name: codes[code],
        priority: priority.indexOf(code)
      };
    });
};