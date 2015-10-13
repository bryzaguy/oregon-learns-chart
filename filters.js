'use strict';

var config = require('./config');

var filters = {},
  filterLabels = {
    gender: 'Gender',
    ethnicity: 'Ethnicity',
    poverty: 'Poverty',
    lep: 'Limited English Proficiency',
    meet_math: 'Meets Math Requirements',
    meet_read: 'Meets Reading Requirements',
    hs_name: 'High School',
    district: 'School District'
  };

var filterNames = Object.keys(filterLabels),
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
  label.appendChild(document.createTextNode(filterLabels[filter]));
  var div = document.createElement('div');
  div.className = 'filter-container';

  div.appendChild(label);
  div.appendChild(select);
  labels.appendChild(div);
});

document.getElementById('filters').appendChild(labels);

Object.keys(filterLabels).map(function (filter) {
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
