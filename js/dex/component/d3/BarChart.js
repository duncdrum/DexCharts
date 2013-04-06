BarChart.prototype = new DexComponent();
BarChart.constructor = BarChart;

function BarChart(userConfig)
{
  DexComponent.call(this, userConfig,
  {
    // The parent container of this chart.
    'parent'           : null,
    // Set these when you need to CSS style components independently.
    'id'               : 'BarChart',
    'class'            : 'BarChart',
    // Our data...
    'csv'              :
    {
      // Give folks without data something to look at anyhow.
      'header'         : [ "X", "Y" ],
      'data'           : [[0,0],[1,1],[2,4],[3,9],[4,16]]
    },
    // width and height of our bar chart.
    'width'            : 600,
    'height'           : 400,
    // The x an y indexes to chart.
    'xi'               : 0,
    'yi'               : [1],
    'xoffset'          : 20,
    'yoffset'          : 0,
    'color'            : d3.scale.category20(),
    xmin               : null,
    ymin               : null,
    'xaxis'  : dex.config.xaxis(),
    'yaxis' : dex.config.yaxis()
  });

  this.chart = this;
}

BarChart.prototype.render = function()
{
  this.update();
};

BarChart.prototype.update = function()
{
   var chart = this.chart;
  var config = this.config;

  if (config.debug)
  {
    console.log("===== Barchart Configuration =====");
    console.dir(config);
  }

  // X domain across groups.
  var x = d3.scale.ordinal()
    .domain(d3.range(config.csv.data.length))
    .rangeBands([0, config.width], .1);

  // X domain within groups.
  var x1 = d3.scale.ordinal()
    .domain(d3.range(config.yi.length))
    .rangeBands([0, x.rangeBand()]);

  // Y domain.
  var y = d3.scale.linear()
    .range([config.height, 0]);

  var xaxis = dex.config.configureAxis(config.xaxis)
    .scale(x);
  var yaxis = dex.config.configureAxis(config.yaxis)
    .scale(y);
    
  var chartContainer = config.parent.append("g")
    .attr("id", config["id"])
    .attr("class", config["class"])
    .attr("transform", "translate(" + config.xoffset + "," + config.yoffset + ")");

  var data = config.csv.data;

  // Translate all of the y data columns to numerics.
  data.forEach(function(d)
  {
    config.yi.forEach(function(c)
    {
      d[c] = +d[c];
    });
  });

  var yextent = dex.matrix.extent(data, config.yi);
  x.domain(data.map(function(d) { return d[config.xi]; }));
  //y.domain([0, d3.max(data, function(d) { return d[1]; })]);

  if (config.ymin != null)
  {
    yextent[0] = config.ymin;
  }
  if (config.ymax != null)
  {
    yextent[1] = config.ymax;
  }

  // Establish the domain of the y axis.
  y.domain(yextent);

  // X Axis
  chartContainer.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + config.height + ")")
      .call(xaxis)
    .append("text")
      .call(dex.config.configureLabel, config.xaxis.label)
      .text(config.xaxis.label.text);

  // Y Axis
  chartContainer.append("g")
      .attr("class", "y axis")
      .call(yaxis)
    .append("text")
      .call(dex.config.configureLabel, config.yaxis.label)
      .text(config.yaxis.label.text);

  var barData = dex.matrix.combine(
        dex.matrix.slice(data, [config.xi]),
        dex.matrix.slice(data, config.yi)
     );

  chartContainer.selectAll(".bar")
      .data(barData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { //console.dir(d);
         return x(d[0]) + x1(d[3]); })
      .style("fill", function(d) { console.log(d[3]); return config.color(d[3]);})
      .attr("width", x.rangeBand()/config.yi.length)
      .attr("y", function(d) { console.log("Y:" + d); return y(d[1]); })
      .attr("height", function(d) { return config.height - y(d[1]); });

  // Add Text Labels
  chartContainer.selectAll(".label")
    .data(barData)
    .enter().append("text")
    .call(dex.config.configureLabel, config.xaxis.tick.label)
    .attr("x", function(d)
    { return x(d[0]) + x1(d[3]) + config.xaxis.tick.label.x; })
    .attr("y", config.height + config.xaxis.tick.padding)
    //.attr("y", function(d) { return y(d[1]); })
    .text(function(d) { dex.console.log("TEXTD: ", d); return config.csv.header[d[3]]; });
};
