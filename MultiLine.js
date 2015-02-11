// Everything in this script is adaped from the excellent source:
//     http://bl.ocks.org/mbostock/3884955
// Unless otherwise stateod.

var xTicks = 11;
var yTicks = 5;

var margin = {top: 10, right: 80, bottom: 150, left: 50},
    width = 760 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

var xScale = d3.time.scale()
    .range([0, width]);

var yScale = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(xTicks);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(yTicks);

//Adapted from: http://www.d3noob.org/2013/01/adding-grid-lines-to-d3js-graph.html
var make_x_axis = function() {
  return d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(xTicks)
};
var make_y_axis = function() {
  return d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(yTicks);
};

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return xScale(d.year); })
    .y(function(d) { return yScale(d.energy); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//This csv function borrows heavily from Mike Bostock's
//example at: http://big-elephants.com/2014-06/unrolling-line-charts-d3js
d3.csv("EPC_2000_2010_new.csv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Country"; }));

  data.forEach(function(d) {
    d.year = d.Country;
  });

  var countries = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {year: d.year, energy: +d[name]};
      })
    };
  });


  // Define the xScale
  xScale.domain(d3.extent(data, function(d) { return d.year; }));

  yDomain = yScale.domain([
    d3.min(countries, function(c) { return d3.min(c.values, function(v) { return v.energy; }); }),
    d3.max(countries, function(c) { return d3.max(c.values, function(v) { return v.energy; }); })
  ]);

  svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_axis()
        .tickSize(-height, 0, 0)
        .tickFormat("")
    );
  svg.append("g")
    .attr("class", "grid")
    .call(make_y_axis()
        .tickSize(-width, 0, 0)
        .tickFormat("")
    );

  // Addapted from BarGraph.js provide in homework Assignment.
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("dx", "-.8em")
      .attr("dy", ".25em")
      .attr("transform", "rotate(-60)" )
      .style("text-anchor", "end")
      .attr("font-size", "10px");

  // Append attributes to the y axis element.
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -170)
    .attr("dy", "-3em")
    .style("text-anchor", "middle")
    .text("Energy Consumption per Capita in Million BTUs");

  // Select elements matching calss='country' and append a new g.
  var country = svg.selectAll(".country")
    .data(countries)
    .enter()
    .append("g")
    .attr("class", "country");
  
  
  // Append a path element to country selector and add a transition.
   country.append("path")
    .attr("class", "line")
    .style("stroke", function(d) { return color(d.name); })
    .transition()
    .duration(2000)
    .attrTween('d', function(d) { return pathTween(d.values) });

  //append text elements containing country names to country selection
  //and position them according to finial position of time series data set.
  country.append("text")
    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) { return "translate(" + xScale(d.value.year) + "," + yScale(d.value.energy) + ")"; })
    .attr("x",3)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });

   //Adapted from: http://big-elephants.com/2014-06/unrolling-line-charts-d3js/
  function pathTween(data) {
    var interpolate = d3.scale.linear()
      .domain([0,1])
      .range([1, data.length + 2]);

    return function(t) {
      var flooredX = Math.floor(interpolate(t));
      var weight = interpolate(t) - flooredX;
      var interpolatedLine = data.slice(0, flooredX);

      if (flooredX > 0 && flooredX < 11) {
        var weightedLineAverage = data[flooredX].year * weight + data[flooredX-1].year * (1-weight);
        interpolatedLine.push({"x":interpolate(t)-1, "y":weightedLineAverage});
      }
      return line(interpolatedLine);
    }
  }
});


