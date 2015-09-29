'use strict';

var d3 = require('d3');
d3.sankey = require('./sankey');

var url = 'http://chrisv-cs-test.apigee.net/sankey';

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
  if (typeof filters[filter] === 'function') {
    return;
  }

  d3.json(url + '/meta/' + filter + '/?format=json', function (filterOptions) {
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

var margin = {
    top: 1,
    right: 1,
    bottom: 6,
    left: 1
  },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),
  format = function (d) {
    return formatNumber(d) + " TWh";
  },
  color = d3.scale.category20();

var chart = d3.select("#chart");

var svg = chart.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var sankey = d3.sankey()
  .nodeWidth(15)
  .nodePadding(10)
  .size([width, height]);

var path = sankey.link();

var codes = {
  H: "Highschool",
  G: "Graduated",
  X: "Dropped out",
  Z: "No achievements",
  2: "2 Year 1st enrollment",
  T: "2 Year 2nd enrollment",
  4: "4 Year 1st enrollment",
  F: "4 Year 2nd enrollment",
  C: "Certificate",
  B: "Bachelor+",
  A: "Associate",
  D: "HS Diploma"
};

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

drawGraph();

function drawGraph() {
  d3.json(url + '?format=json' + filters.query(), function (data) {
    var energy = {
      nodes: Object.keys(codes)
        .map(function (code) {
          return {
            code: code,
            name: codes[code]
          };
        }),
      links: []
    };

    var result = {};
    for (var key in data) {
      var value = data[key];

      if (data[key] < 0) {
        continue;
      }

      var results = key.split('')
        .reduce(function (path, stage, index) {
          path.push(getCode(stage, index));

          if (index === 2 && key.length === 4) {
            path.push(getCode(stage, 3));
          }

          return path;
        }, [])
        .reduce(function (edges, stage, index, path) {
          if (index) {
            var lastStage = path[index - 1];
            var edgeKey = lastStage + stage;
            edges[edgeKey] = (edges[edgeKey] || 0) + value;
          }

          return edges;
        }, result);
    }

    var codeIndeces = energy.nodes
      .reduce(function (r, n, i) {
        r[n.code] = i;
        return r;
      }, {});

    for (var key in result) {
      var edge = {
        value: result[key]
      };

      edge.source = codeIndeces[key.split('')[0]];
      edge.target = codeIndeces[key.split('')[1]];

      energy.links.push(edge);
    }

    sankey
      .nodes(energy.nodes)
      .links(energy.links)
      .layout(32);

    var link = svg.append("g").selectAll(".link")
      .data(energy.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function (d) {
        return Math.max(1, d.dy);
      })
      .sort(function (a, b) {
        return b.dy - a.dy;
      });

    link.append("title")
      .text(function (d) {
        return d.source.name + " → " + d.target.name + "\n" + format(d.value);
      });

    var node = svg.append("g").selectAll(".node")
      .data(energy.nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .call(d3.behavior.drag()
        .origin(function (d) {
          return d;
        })
        .on("dragstart", function () {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove));

    node.append("rect")
      .attr("height", function (d) {
        return d.dy;
      })
      .attr("width", sankey.nodeWidth())
      .style("fill", function (d) {
        return d.color = color(d.name.replace(/ .*/, ""));
      })
      .style("stroke", function (d) {
        return d3.rgb(d.color).darker(2);
      })
      .append("title")
      .text(function (d) {
        return d.name + "\n" + format(d.value);
      });

    node.append("text")
      .attr("x", -6)
      .attr("y", function (d) {
        return d.dy / 2;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function (d) {
        return d.name;
      })
      .filter(function (d) {
        return d.x < width / 2;
      })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

    function dragmove(d) {
      d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
      sankey.relayout();
      link.attr("d", path);
    }
  });
}
