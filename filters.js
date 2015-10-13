'use strict';

var config = require('./config');

var filters = {
  gender: '',
  ethnicity: '',
  poverty: '',
  lep: '',
  meet_math: '',
  meet_read: '',
  district: '',
  query: function () {
    var params = [];
    for (var key in this) {
      if (typeof this[key] !== 'function' && this[key]) {
        params.push('&' + key + '=' + this[key]);
      }
    }
    return params.join();
  }
};

Object.keys(filters).forEach(function (filter) {
  if (filter === 'query') {
    return;
  }

  //filters
  d3.json(config.url + '/meta/' + filter + '/?format=json', function (filterOptions) {
    var select = document.createElement('select');

    var nofilter = document.createElement('option');
    nofilter.appendChild(document.createTextNode('No filter'));
    select.appendChild(nofilter);

    for (var key in filterOptions) {
      var option = document.createElement('option');
      option.appendChild(document.createTextNode(filterOptions[key]));
      select.appendChild(option);
      option.value = key;
    }

    select.addEventListener('change', function (e) {
      filters[filter] = e.target.value;
      drawGraph();
    });

    var label = document.createElement('label');
    label.appendChild(document.createTextNode(filter));
    label.appendChild(select);
    document.getElementById('filters').appendChild(label);
  });
});

module.exports = filters;
