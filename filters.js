'use strict';

module.exports = function (loadGraph, refreshGraph) {
  var config = require('./config'),
  educationNodes = require('./educationNodes');

  var filters = {},
    nodeFilters = {},
    selectFilters = {
      gender: 'Gender',
      ethnicity: 'Ethnicity',
      poverty: 'Poverty',
      lep: 'English Proficiency',
      meet_math: 'Math',
      meet_read: 'Reading',
      hs_name: 'High School',
      district: 'School District'
    }, radioFilters = {};

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

  var filterFragment = document.createDocumentFragment(),
    // radios = Object.keys(radioFilters),
    selects = Object.keys(selectFilters);

  // radios.forEach(addApiRadio);

  selects.forEach(function(s) {
    addSelectFilter(apiCb, s, selectFilters[s]);
  });

  educationNodes.filterGroups.forEach(function (g) {
    addSelectFilter(refreshCb, g.id, g.name);
  });

  document.getElementById('filters').appendChild(filterFragment);

  // radios.map(function (filter) {
  //   callApi(filter, function (filterOptions) {
  //     for (var key in filterOptions) {
  //       addRadioOption(filter, filterOptions[key], key, apiCb(filter));
  //     }
  //   });
  // });

  selects.map(function (filter) {
    callApi(filter, function (filterOptions) {
      for (var key in filterOptions) {
        addOption(filter, filterOptions[key], key);
      }
    });
  });

  educationNodes.filterGroups.forEach(function(group) {
    group.codes.map(function (key) {
      addOption(group.id, educationNodes.codes[key], key, refreshCb());
    });
  });

  function callApi(filter, cb) {
    var url = config.url + '/meta/' + filter + '/?format=json';
    d3.json(url, function (filterOptions) {
      cb(filterOptions);
    });
  }

  function refreshCb() {
    return function(e) {
      var value = e.target.value;
      nodeFilters[e.target.name] = value.toLowerCase() === 'all' ? '' : value;
      filtersModule.nodeFilters = Object.keys(nodeFilters)
        .map(function (i) { 
          return nodeFilters[i]; 
        })
        .filter(function (v) {
          return v !== '';
        });

      refreshGraph();
    };
  }

  function apiCb(filter) {
    return function(e) {
      var value = e.target.value;
      filters[e.target.name] = value.toLowerCase() === 'all' ? '' : value;
      loadGraph();
    };
  }

  // function addApiRadio(filter) {
  //   addRadio(apiCb, {
  //     id: filter,
  //     name: radioFilters[filter]
  //   });
  // }

  // function addRadio(cb, radio) {
  //   var div = document.createElement('div');
  //   div.id = radio.id;
  //   div.className = 'tabs';

  //   var input = addRadioOption(radio.id, 'All', 'all', cb(radio.id), div);
  //   input.checked = true;

  //   var container = document.createElement('div');
  //   container.className = 'filter-container';
  //   var label = document.createElement('label');
  //   label.appendChild(document.createTextNode(radio.name));
  //   container.appendChild(label);
  //   container.appendChild(div);

  //   filterFragment.appendChild(container);
  // }

  // function addRadioOption(filter, text, value, cb, parent) {
  //   if (!parent) parent = document.getElementById(filter);
  //   var input = document.createElement('input');
  //   input.type = 'radio';
  //   input.name = filter;
  //   input.value = value;
  //   input.id = filter + '-' + value;

  //   input.addEventListener('change', cb);
    
  //   var div = document.createElement('div');
  //   div.className = 'tab';

  //   var label = document.createElement('label');
  //   label.appendChild(document.createTextNode(text));
  //   div.appendChild(input);
  //   label.htmlFor = filter + '-' + value;
  //   div.appendChild(label);

  //   parent.appendChild(div);

  //   return input;
  // }

  function addSelectFilter(cb, filter, text) {
    var select = document.createElement('select'),
      nofilter = document.createElement('option'),
      nofilterText = 'All';

    select.id = filter;
    select.name = filter;
    nofilter.appendChild(document.createTextNode(nofilterText));
    select.appendChild(nofilter);

    select.addEventListener('change', cb(filter));

    var div = document.createElement('div');
    div.className = 'filter-container';

    var label = document.createElement('label');
    label.appendChild(document.createTextNode(text));
    div.appendChild(label);
    div.appendChild(select);

    filterFragment.appendChild(div);
  }

  function addOption(filter, text, value){
    var option = document.createElement('option');
    option.appendChild(document.createTextNode(text));
    document.getElementById(filter).appendChild(option);
    option.value = value;
  }

  return filtersModule;
};
