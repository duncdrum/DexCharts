function BarChart(userConfig)
{
  var defaults =
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
    'xmin'             : null,
    'ymin'             : null,
  };

  var config = dex.object.overlay(userConfig, defaults);

  //console.log("CDOMAIN: ");
  //console.dir(config.csv.data.map(function (r) { return r[0]; }));

  // Things defined in terms of the defaults:
  defaults.xaxis = dex.config.xaxis(
  {
    'scale' : d3.scale.ordinal()
      .domain(config.csv.data.map(function (r) { return r[0]; }))
      .rangeRoundBands([0, config.width], .1),
    'label' : {
                'text' : "X",
                'x'    : config.width/2 - config.xoffset,
                'y'    : 10
              }
  });

  defaults.yaxis = dex.config.yaxis(
  {
    'scale' : d3.scale.linear().range([config.height, 0])
  });

  var chart = new DexComponent(userConfig, defaults);

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

  if (chart.config.ymin != null)
  {
    yextent[0] = chart.config.ymin;
  }
  if (chart.config.ymax != null)
  {
    yextent[1] = chart.config.ymax;
  }

  console.log("YEXTENT:" + yextent);
  chart.config.yaxis.scale.domain(yextent);

  chart.render = function()
  {
    this.update();
  };

  chart.update = function()
  {
    var chart = this;
    var config = chart.config;

    console.dir("XAXIS--");
    console.dir(config.xaxis);
    var xaxis = dex.config.configureAxis(config.xaxis);
    var yaxis = dex.config.configureAxis(config.yaxis);

    var chartContainer = d3.select(config.parent).append("g")
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
  
    if (chart.config.ymin != null)
    {
      yextent[0] = chart.config.ymin;
    }
    if (chart.config.ymax != null)
    {
      yextent[1] = chart.config.ymax;
    }
  
    // Establish the domain of the y axis.
    console.dir(yextent);
    yaxis.scale().domain(yextent);

    chartContainer.select(".xaxis").append("text")
      .call(dex.config.configureLabel, config.xaxis.label);

    // X Axis
    console.log(config.height)
    chartContainer.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + config.height + ")")
        .call(xaxis);

    chartContainer.selectAll(".xaxis").selectAll("text")
      .each(function(d)
      {
        d3.select(this).call(dex.config.configureLabel,
          config.xaxis.tick.label);
      });
      
    chartContainer.select(".xaxis").append("text")
      .call(dex.config.configureLabel, config.xaxis.label);
      
    // Y Axis
    chartContainer.append("g")
        .attr("class", "yaxis")
        .call(yaxis)
      .append("text")
        .call(dex.config.configureLabel, config.yaxis.label)
        .text(config.yaxis.label.text);

    var barData = dex.matrix.combine(
          dex.matrix.slice(data, [config.xi]),
          dex.matrix.slice(data, config.yi)
       );

    console.dir(data);
    console.log("SCALE(" + data[1][config.xi] + ")=" + config.xaxis.scale(data[1][config.xi]));
    console.dir(config.xaxis.scale);

    var barWidth = xaxis.scale()(data[1][config.xi]) - xaxis.scale()(data[0][config.xi]);
    dex.console.log("BAR WIDTH: " + barWidth);
    
    chartContainer.selectAll(".bar")
      .data(barData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
          console.log("XBAR---");
          console.dir(d[0]);
          console.log(xaxis.scale()(d[0]));
         return xaxis.scale()(d[0]) })//+ config.xaxis.scale(d[3]); })
      .style("fill", function(d) { return config.color(d[3]);})
      .attr("width", barWidth)
      .attr("y", function(d) { return yaxis.scale()(d[1]); })
      .attr("height", function(d)
      {
        console.log("config.yaxis.scale(" + d[1] + ")=" + config.yaxis.scale(d[1]));
        console.dir(config.yaxis.scale(d[1]));
        return config.height - config.yaxis.scale(d[1]);
      });
  };

  return chart;
}