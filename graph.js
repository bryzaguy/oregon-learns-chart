'use strict';

var d3 = require('d3'),
  filters = require('./filters')(updateGraph, refreshGraph),
  config = require('./config'),
  transformData = require('./transformData'),
  apiToGraph = require('./apiToGraph'),
  filterData = require('./filterData');

d3.sankey = require('./sankey');

var margin = {
    top: 1,
    right: 1,
    bottom: 6,
    left: 1
  },
  data;

var formatNumber = d3.format(",.0f"),
  format = function (d) {
    return formatNumber(d) + " students";
  },
  color = d3.scale.category20();

loadGraph(drawGraph);

function loadGraph(cb) {
  d3.json(config.url + '?format=json' + filters.query(), function(response) {
    data = response;
    cb();
  });
}

function updateGraph() {
  loadGraph(refreshGraph);
}

function refreshGraph() {
  var node = document.getElementById('chart'),
    width = node.offsetWidth - margin.left - margin.right,
    height = node.offsetHeight - margin.top - margin.bottom;

  var chart = d3.select(node);
  var svg = chart.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);


  svg.select("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .size([width, height]);

  var path = sankey.link();

  var transformed = transformData(data);
  var filtered = filterData(transformed, filters.nodeFilters);
  var sum = filtered.reduce(function (r, n) {
      return r + n.value;
    }, 0);

  document.getElementById('scale').innerText = sum;

  var graph = apiToGraph(filtered);
  
  sankey
    .nodes(graph.nodes)
    .links(graph.links)
    .layout(32);

  var link = svg.select("#svg-link-paths")
    .selectAll(".link")
    .data(graph.links);

  link
    .attr("d", path)
    .style("stroke-width", function (d) {
      return Math.max(1, d.dy);
    })
    .sort(function (a, b) {
      return a.dy - b.dy;
    });
  
  link.select("title")
    .text(function (d) {
      return d.source.name + " → " + d.target.name + "\n" + format(d.value);
    });

  link.enter().append("path")
    .attr("class", "link")
    .attr("d", path)
    .style("stroke-width", function (d) {
      return Math.max(1, d.dy);
    })
    .sort(function (a, b) {
      return a.dy - b.dy;
    })
    .append("title")
    .text(function (d) {
      return d.source.name + " → " + d.target.name + "\n" + format(d.value);
    });


  link.exit().remove();

  var node = svg.select("#svg-nodes")
    .selectAll(".node")
    .data(graph.nodes);

  node
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

  node.select("rect")
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
    .select("title")
    .text(function (d) {
      return d.name + "\n" + format(d.value);
    });

  node.select("text")
    .transition()
    .duration(300)
    .ease('cubic-in-out')
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

  var newNode = node.enter().append("g")
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

  newNode.append("rect")
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

  newNode.append("text")
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

  node.exit().remove();

  function dragmove(d) {
    d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
    sankey.relayout();
    link.attr("d", path);
  }
}

function drawGraph() {
  var node = document.getElementById('chart'),
    width = node.offsetWidth - margin.left - margin.right,
    height = node.offsetHeight - margin.top - margin.bottom;

  var chart = d3.select(node);
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

  var transformed = transformData(data);
  var filtered = filterData(transformed, filters.nodeFilters);
  var sum = filtered.reduce(function (r, n) {
      return r + n.value;
    }, 0);

  document.getElementById('scale').innerText = sum;
  
  var graph = apiToGraph(filtered);
  
  sankey
    .nodes(graph.nodes)
    .links(graph.links)
    .layout(32);

  var link = svg.append("g").attr("id", "svg-link-paths").selectAll(".link")
    .data(graph.links)
    .enter().append("path")
    .attr("class", "link")
    .attr("d", path)
    .style("stroke-width", function (d) {
      return Math.max(1, d.dy);
    })
    .sort(function (a, b) {
      return a.dy - b.dy;
    });

  link.append("title")
    .text(function (d) {
      return d.source.name + " → " + d.target.name + "\n" + format(d.value);
    });

  var node = svg.append("g").attr("id", "svg-nodes").selectAll(".node")
    .data(graph.nodes)
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
}
