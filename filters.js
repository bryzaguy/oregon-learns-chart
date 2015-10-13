'use strict';

var config = require('./config');

var filters = {
  gender: '',
  ethnicity: '',
  poverty: '',
  lep: '',
  meet_math: '',
  meet_read: '',
  district: ''
};

Object.keys(filters).forEach(function (filter) {

  d3.json(config.url + '/meta/' + filter + '/?format=json', function (filterOptions) {
    var select = document.createElement('select'),
      nofilterText = 'No filter';

    var nofilter = document.createElement('option');
    nofilter.appendChild(document.createTextNode(nofilterText));
    select.appendChild(nofilter);

    for (var key in filterOptions) {
      var option = document.createElement('option');
      option.appendChild(document.createTextNode(filterOptions[key]));
      select.appendChild(option);
      option.value = key;
    }

    select.addEventListener('change', function (e) {
      var value = e.target.value;
      filters[filter] = value === nofilterText ? '' : value;
      filters.drawGraph();
    });

    var label = document.createElement('label');
    label.appendChild(document.createTextNode(filter));
    label.appendChild(select);
    document.getElementById('filters').appendChild(label);
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
