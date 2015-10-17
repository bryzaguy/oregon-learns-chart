'use strict';

module.exports = function (drawGraph) {
  var config = require('./config'),
    educationNodes = require('./educationNodes').codes;

  var filters = {},
    filterLabels = {
      gender: 'Gender',
      ethnicity: 'Ethnicity',
      poverty: 'Poverty',
      lep: 'Limited English Proficiency',
      meet_math: 'Meets Math Requirements',
      meet_read: 'Meets Reading Requirements',
      hs_name: 'High School',
      district: 'School District',
      education_event: 'Education Event'
    };

  var query = function () {
    var params = [];
      for (var key in filters) {
        if (filters[key] && key !== 'education_event') {
          params.push('&' + key + '=' + filters[key]);
        }
      }
      return params.join('');
    },
    filtersModule = {
      query: query,
      values: filters,
      drawGraph: function () {
        // To be replaced in graph.js
      }
    };

  var filterNames = Object.keys(filterLabels),
    labels = document.createDocumentFragment();

  // add econw selects
  filterNames.forEach(addFilter);

  // add education nodes select
  document.getElementById('filters').appendChild(labels);


  // add econw filter api meta values
  Object.keys(filterLabels).map(function (filter) {
    if (filter === 'education_event') {
      return;
    }

    d3.json(config.url + '/meta/' + filter + '/?format=json', function (filterOptions) {
      for (var key in filterOptions) {
        addOption(filter, key, filterOptions[key]);
      }
    });
  });

  // add education node filter values
  for (var nodeKey in educationNodes) {
    addOption('education_event', nodeKey, educationNodes[nodeKey]);
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
      drawGraph();
    });

    var label = document.createElement('label');
    label.appendChild(document.createTextNode(filterLabels[filter]));
    var div = document.createElement('div');
    div.className = 'filter-container';

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
