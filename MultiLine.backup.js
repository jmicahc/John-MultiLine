//This script implements the following features:
//  1. Names of countries must appear next to the lines as in Multi-Series Line Chart.
//  
//  2. Each line should be interpolated using "basis" or some other interpolation
//     mechanism appropriate to the data (Reference [3]). (1 point)
//
//  3. Color associated with each of the six lines must be different (
//     d3.scale.category10 to definie color scale. (1 point)
//
//  4. Thin greid line (as shown in line graph of Apple's stock prices shown
//     at the end of the assignmnent document). This can be achieved by creating sytle
//     sheet assiciated with grids, creating new functions GridXaxis, gridYAxis, and
//     then calling these functions with appropriate parameters. (2 points)
//
//  5. Add transition to the lines as shown in the class for line graph oif Apple
//     Stock prices and as described in Reference[4] below. (2 points).
//
//
//Resource (references):
//  1. BarBraph.css, .html, .css, .js
//  2. Line Chart by Mike Bostock: http://bl.ocks.org/mbostock/3883245
//  3. Multi-Series Line Chart by Mike Bostock: bl.ocks.org/mbostock/3884955
//  4. Notes on Animating Line Charts with D3: http://big-elephants.com/2014-06/unrolling-line-charts-d3js/
//
//Implementation Priority Queue:
//  1. Implement 1 line of data file.
//    a. Create a line drawing of gdp data.
//    b. Apply to first row of MultiLine data. (transpose if necessary)
//  2. Extend implementation to all lines of data.
//
//


// Search "D3 Margin Convention" on Google to understand margins.
var margin = {top: 10, right: 40, bottom: 150, left: 50},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    

// Define SVG. "g" means group SVG elements together.
// Confused about SVG still, see Chapter 3. 
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Define X and Y scale. Taken from BarGraph.js.
var xScale = d3.scale.ordinal()
  .range([0,width], 0.1);


var yScale = d3.scale.linear()
  .range([height, 0]);



var color = d3.scale.category10();


//  Define X and Y axis. Taken from BarGraph.js.
var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom")

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("left")
  .ticks(5, "$")

//taken from: http://bl.ocks.org/mbostock/3884955
var line = d3.svg.line()
  .interpolate("basis")
  .x(function(d) { return d.year; })
  .y(function(d) { return d.energy; });


var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("EPC_2000_2010_new.csv", function(error, data) {

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Country"; }));

  data.forEach(function(d) {
    d.year = d.Country;
    console.log(d.year);
  });


  var test1 = 1;

  var countries = color.domain().map(function (name) {
    console.log("hello world");
    return {
      name: name,
      values: data.map(function(d) {
        return { year: d.year, energy: +d[name] };
      })
    };
  });

  var test2 = 2;

  console.log("testing 1");

  xScale.domain(d3.extent(data, function(d) { return d.year; }));

  yScale.domain([
      d3.min(countries, function(c) { return d3.min(c.values, function(v) { return v.energy; }); }),
      d3.max(countries, function(c) { return d3.max(c.values, function(v) { return v.energy; }); })
  ]);
  console.log("testing 1b");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  console.log("testing 1c");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .style("text-anchor", "end")

  console.log("testing 2");

  var country = svg.selectAll(".country")
    .data(countries)
    .enter().append("g")
    .attr("class", "Country");

  console.log("testing 3");

  country.append("path")
    .attr("class", "line")
    .attr("d", function(d) { return line(d.values); })
    .style("stroke", function(d) { return color(d.name); });

  console.log("testing 4");

  country.append("text")
    .datum(function(d) { return {name: d.name, value: d.values[d.values.length -1]}; })
    .attr("transform", function(d) { return "translate(" + xScale(d.value.year) + "," + yScale(d.value.energy) + ")"; })
    .attr("x", 3)
    .attr("dy", ".35em") // what is this?
    .text(function(d) { return d.name; });

  console.log("testing 5");
});

var test3 = 3;
