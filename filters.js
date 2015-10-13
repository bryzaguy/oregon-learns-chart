'use strict';

var config = require('./config');

var filters = {
  gender: '',
  ethnicity: '',
  poverty: '',
  lep: '',
  meet_math: '',
  meet_read: '',
  hs_name: '',
  district: ''
};

var filterNames = Object.keys(filters),
  labels = document.createDocumentFragment();

filterNames.forEach(function (filter) {
  var select = document.createElement('select'),
    nofilter = document.createElement('option'),
    nofilterText = 'No filter';

  select.id = filter;
  nofilter.appendChild(document.createTextNode(nofilterText));
  select.appendChild(nofilter);

  select.addEventListener('change', function (e) {
    var value = e.target.value;
    filters[filter] = value === nofilterText ? '' : value;
    filters.drawGraph();
  });

  var label = document.createElement('label');
  label.appendChild(document.createTextNode(filter));
  label.appendChild(select);
  labels.appendChild(label);
});

document.getElementById('filters').appendChild(labels);

Object.keys(filters).map(function (filter) {
  d3.json(config.url + '/meta/' + filter + '/?format=json', function (filterOptions) {
    for (var key in filterOptions) {
      var option = document.createElement('option');
      option.appendChild(document.createTextNode(filterOptions[key]));
      document.getElementById(filter).appendChild(option);
      option.value = key;
    }
  });
});

filters.query = function () {
  var params = [];
  for (var key in this) {
    if (typeof this[key] !== 'function' && this[key]) {
      params.push('&' + key + '=' + this[key]);
    }
  }
  return params.join('');
}

module.exports = filters;
