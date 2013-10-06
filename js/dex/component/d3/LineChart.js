function LineChart(userConfig)
{
  var defaults =
  {
    'parent' : null,
    'id' : "LineChart",
    "class" : "LineChart",
    'csv' :
    {
      'header' : ["X", "Y"],
      'data' : [[0, 0], [1, 1], [2, 4], [3, 9], [4, 16]]
    },
    'width' : 600,
    'height' : 400,
    'xi' : 0,
    'yi' : [1],
    'xoffset' : 20,
    'yoffset' : 0,
    'pointColors' : d3.scale.category20(),
    'lineColors' : d3.scale.category20()
  };
  
  var config = dex.object.overlay(userConfig, defaults);

  defaults.xaxis = dex.config.xaxis(
  {
    'scale' : d3.scale.linear()
      .domain(d3.extent(config.csv.data, function(d) { return +d[config.xi]; }))
      .range([0, config.width]),
    //'label' : {
    //            'text' : "X",
    //            'x'    : config.width/2 - config.xoffset,
    //            'y'    : 10
    //          }
  });

  defaults.yaxis = dex.config.yaxis(
  {
    'scale' : d3.scale.linear().range([config.height, 0])
  });

  var chart = new DexComponent(userConfig, defaults);

  chart.render = function()
  {
    this.update();
  };

  chart.update = function()
  {
    var chart = this;
    var config = chart.config;
    var csv    = config.csv;
    var i;

    var xaxis = dex.config.configureAxis(config.xaxis);
    var yaxis = dex.config.configureAxis(config.yaxis);
//    var x = config.xaxis.scale()
//      .domain(d3.extent(csv.data, function(d) { return +d[config.xi]; }))
//      .range([0, config.width]);


    // Use a linear scale for x, map the value range to the pixel range.
    //var x = config.xaxis.scale().range([0, config.width]);
    //x.domain(d3.extent(csv.data, function(d) { return +d[config.xi]; }));
  
    // Use a linear scale for y, map the value range to the pixel range.
    //var y = config.yaxis.scale
    //  .domain(d3.extent(
    //    dex.matrix.flatten(dex.matrix.slice(csv.data, config.yi))))
    //  .range([config.height, 0]);
    var y = yaxis.scale()
      .domain(d3.extent(
        dex.matrix.flatten(dex.matrix.slice(csv.data, config.yi))))
      .range([config.height, 0]);
  
    // I hate this kind of stuff, but it's necessary to share
    // with mouseOver function.  There's probably a better way to do
    // it but I don't feel like blowing a couple hours figuring it out.
    chart.xaxis = xaxis;
    chart.yaxis = yaxis;
  
    // Create the x axis at the bottom.
    //var xAxis = d3.svg.axis()
    //  .scale(x)
    //  .orient(config.xaxis.orient);
  
    // Create the y axis to the left.
    //var yAxis = d3.svg.axis()
    //  .scale(y)
    //  .orient(config.yaxis.orient);
  
    var lines = [];
  
    for(i=0; i<config.yi.length; i++)
    {
      // Define a function to draw the line.
      var line = d3.svg.line()
        .x(function(d) { return xaxis.scale()(+d[config.xi]); })
        .y(function(d) { return yaxis.scale()(+d[config.yi[i]]); });
      lines.push(line);
    }
  
    // Append a graphics node to the parent, all drawing will be relative
    // to the supplied offsets.  This encapsulating transform simplifies
    // the offsets within the child nodes.
    //config.parent.select("#lineChartContainer").remove();
    var chartContainer = d3.select(config.parent).append("g")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr("transform", "translate(" + config.xoffset + "," + config.yoffset + ")");
  
    // Add an x-axis with label.
    var xaxisG = chartContainer.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + config.height + ")")
      .call(xaxis);
  
    // Add a y-axis.
    var yaxisG = chartContainer.append("g")
        .attr("class", "y axis")
        .call(yaxis);
  
    // Add the custom tick labels.
    chartContainer.selectAll(".y.axis text")
      .call(dex.config.configureLabel, config.yaxis.tick.label);
    chartContainer.selectAll(".x.axis text")
      .call(dex.config.configureLabel, config.xaxis.tick.label);
  
    // Add the Y Axis Label
    yaxisG.append("text")
      .attr("class", "label")
      .call(dex.config.configureLabel, config.yaxis.label)
      .text(config.yaxis.label.text);
      //.text(dex.array.slice(csv.header, config.yi).join(" "));
  
    xaxisG.append("text")
      .attr("class", "label")
      .call(dex.config.configureLabel, config.xaxis.label)
      .text(config.xaxis.label.text);
      //.text(dex.array.slice(csv.header, config.xaxis.label.text).join(" "));
  
    // Draw each of the lines.
    for (i=0; i<lines.length; i++)
    {
      chartContainer.append("path")
        .datum(csv.data)
        .attr("class", "line")
        .attr("d", lines[i])
        .style("stroke", config.lineColors(i));
    }
  
    // We handle mouseover with transparent rectangles.  This will calculate
    // the width of each rectangle.
    var rectalWidth = (csv.data.length > 1) ?
      xaxis.scale()(csv.data[1][config.xi]) - xaxis.scale()(csv.data[0][config.xi]) : 0;
  
    // Add the transparent rectangles for our mouseover events.
    chartContainer.selectAll("rect")
      .data(csv.data.map(function(d) { return d; }))
      .enter().append("rect")
      .attr("class", "overlay")
      .attr("transform", function(d,i) { return "translate(" + xaxis.scale()(d[config.xi]) + ",0)"; })
      .attr("opacity", 0.0)
      .attr("width", rectalWidth)
      .attr("height", config.height)
      .on("mouseover", function(d)
      {
         var chartEvent =
         {
         	 type: "mouseover",
           data: d
         };
         chart.mouseOverHandler(chartEvent);
         chart.notify(chartEvent);
      });
  };

    // REM: Fix this event handler.
  chart.mouseOverHandler = function(chartEvent)
  {
    var i;

    var xaxis = chart.xaxis;
    var yaxis = chart.yaxis;
    
    var config = chart.config;
    
    if (!config)
    {
      return;
    }

    //console.log("CHART CONFIG:");
    //console.dir(config);

    //console.log("CHART EVENT:");
    //console.dir(chartEvent);
    var chartContainer = d3.select("#" + config.id);

    //console.log(chart.config["id"]);
    //console.log("CHART CONTAINER:");
    //console.dir(chartContainer);
    //console.log("Chart Container: " + typeof chart);
    //console.dir(chart);
    // Remove any old circles.
    chartContainer.selectAll("circle").remove();
    chartContainer.selectAll("#circleLabel").remove();

    // Draw a small red circle over the mouseover point.
    for (i=0; i<config.yi.length; i++)
    {
      //console.log("I: " + i);
      var circle = chartContainer.append("circle")
        .attr("fill", config.pointColors(i))
        .attr("r", 4)
        .attr("cx", xaxis.scale()(chartEvent.data[config.xi]))
        .attr("cy", yaxis.scale()(chartEvent.data[config.yi[i]]));
    
      chartContainer.append("text")
        .attr("id", "circleLabel")
        .attr("x", xaxis.scale()(chartEvent.data[config.xi]))
        .attr("y", yaxis.scale()(chartEvent.data[config.yi[i]]) - 10)
        .attr("dy", ".35m")
        .style("font-size", 14)
        .attr("text-anchor", "top")
        .attr("fill", "black")
        .text(function(d) { return chartEvent.data[config.yi[i]];});
    }
  };

  return chart;
}
