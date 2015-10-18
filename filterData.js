'use strict';

module.exports = function (data, filters) {
  return data.filter(function (group) {
    return !filters || filters.every(
      function(filter) {
        return group.path.indexOf(filter) > -1;
      });
  });
};