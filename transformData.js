'use strict';

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

function cleanup(data) {
  return Object.keys(data)
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
}

function map(data) {
  var paths = [];
  
  for (var key in data) {
    var result = key.split('')
      .reduce(function (path, stage, index) {
        path.push(getCode(stage, index));

        if (index === 2 && key.length === 4) {
          path.push(getCode(stage, 3));
        }

        return path;
      }, []);

    paths.push({
      value: data[key],
      path: result
    });
  }

  return paths;
}

module.exports = function transformData(data) {
  return map(cleanup(data));
};