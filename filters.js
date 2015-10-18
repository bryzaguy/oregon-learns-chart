'use strict';

module.exports = function (loadGraph, refreshGraph) {
  var config = require('./config'),
  educationNodes = require('./educationNodes');

  var filters = {},
    nodeFilters = [],
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

  var query = function () {
    var params = [];
      for (var key in filters) {
        if (filters[key]) {
          params.push('&' + key + '=' + filters[key]);
        }
      }
      return params.join('');
    },
    filtersModule = {
      query: query
    };

  var filterNames = Object.keys(filterLabels),
    labels = document.createDocumentFragment(),
    paths = document.createDocumentFragment();

  filterNames.forEach(addFilter);

  document.getElementById('filters').appendChild(labels);

  Object.keys(filterLabels).map(function (filter) {
    d3.json(config.url + '/meta/' + filter + '/?format=json', function (filterOptions) {
      for (var key in filterOptions) {
        addOption(filter, key, filterOptions[key]);
      }
    });
  });

  var priority = educationNodes.priority.concat([]);
  priority.reverse();
  for (var index in priority) {
    var code = priority[index];
    addCheckbox(educationNodes.codes[code], code);
  }

  document.getElementById('pathfilters').appendChild(paths);

  function addCheckbox(text, value) {
    var input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'path-filter';
    input.value = value;
    input.id = value;

    input.addEventListener('change', function () {
      var f = document.getElementsByClassName('path-filter'),
        inputs = Array.prototype.slice.call(f),
        pathFilters = [];

      for (var i in inputs) {
        if (inputs[i].checked) {
          pathFilters.push(inputs[i].value);
        }
      }

      filtersModule.pathFilters = pathFilters;
      refreshGraph();
    });

    var div = document.createElement('div');
    div.className = 'tab';

    var label = document.createElement('label');
    label.appendChild(document.createTextNode(text));
    div.appendChild(input);
    label.htmlFor = value;
    div.appendChild(label);

    paths.appendChild(div);
  }

  function addFilter(filter) {
    var select = document.createElement('select'),
      nofilter = document.createElement('option'),
      nofilterText = 'No filter';

    select.id = filter;
    nofilter.appendChild(document.createTextNode(nofilterText));
    select.appendChild(nofilter);

    select.addEventListener('change', function (e) {
      var value = e.target.value;
      filters[filter] = nofilterText == value ? '' : value;
      loadGraph();
    });

    var div = document.createElement('div');
    div.className = 'filter-container';

    var label = document.createElement('label');
    label.appendChild(document.createTextNode(filterLabels[filter]));
    div.appendChild(label);
    div.appendChild(select);

    labels.appendChild(div);
  }

  function addOption(filter, key, value){
    var option = document.createElement('option');
    option.appendChild(document.createTextNode(value));
    document.getElementById(filter).appendChild(option);
    option.value = key;
  }

  return filtersModule;
};
