function BarChart(userConfig)
{
  
  var chart = new DexComponent(userConfig,
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
    'yaxis'            : dex.config.yaxis({ 'scale' : d3.scale.linear() }),
    'xaxis'            : dex.config.xaxis({ 'scale' : d3.scale.ordinal() })
  });

  var xes = dex.matrix.slice(chart.attr('csv').data, [0]).map(function(d) {return d[0]});

  dex.console.log("X VALUES", xes);

  if (!chart.attr('xaxis'))
  {
    // Linear axis
    if (dex.csv.isColumnNumeric(chart.attr('csv'), chart.attr('xi')))
    {
      dex.console.log("NUMERIC X AXIS");
      dex.console.log("DOMAIN: ", d3.csv.getColumn(0).slice(0));
      chart.attr('xaxis', dex.config.xaxis(
      {
        'scale' : d3.scale.linear().domain([1, 2, 3])
      }));
    }
    // Ordinal axis
    else
    {
      dex.console.log("ORDINAL X AXIS");
      chart.attr('xaxis', dex.config.xaxis(
      {
        'scale' : d3.scale.ordinal()
                   .domain(d3.range(chart.attr('csv').data))
                   .rangeBands([0, chart.attr('width')], .1)
      }));
    }
  }
  else
  {
    //chart.attr('xaxis').tickValues(xes.map(function(d) { console.log(d);return d[0]; }));
    console.log("SETTING X DOMAIN TO: ")
    console.dir(xes);
    chart.attr('xaxis').scale.domain(xes).rangeBands([0, chart.attr('width')], .1);
  }

  chart.attr('yaxis').scale.range([chart.attr('height'), 0]);

  chart.render = function()
  {
    this.update();
  };

  chart.update = function()
  {
    var chart = this;
    var config = chart.config;

/*
    if (config.debug)
    {
      console.log("===== Barchart Configuration =====");
      console.dir(config);
    }
*/

  // X domain across groups.
//  var x = d3.scale.ordinal()
//    .domain(d3.range(config.csv.data.length))
//    .rangeBands([0, config.width], .1);

//  var x = config.xaxis.scale
//    .domain(d3.range(config.csv.data.length))
//    .rangeBands([0, config.width], .1);

  // X domain within groups.

//  var x1 = d3.scale.ordinal()
//    .domain(d3.range(config.yi.length))
//    .rangeBands([0, x.rangeBand()]);

  // Y domain.
//  var y = d3.scale.linear()
//    .range([config.height, 0]);

  var xaxis = dex.config.configureAxis(config.xaxis);
  var yaxis = dex.config.configureAxis(config.yaxis);
//    .scale(y);

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
  //x.domain(data.map(function(d) { return d[config.xi]; }));
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
  console.dir(yextent);
  yaxis.scale().domain(yextent);

  // X Axis
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

  //console.log("SCALE(" + data[1][config.xi] + ")=" + chart.attr('xaxis').scale(data[1][config.xi]));
  //console.dir(chart.attr('xaxis').scale);
  var barWidth = chart.attr('xaxis').scale(data[1][config.xi]) - chart.attr('xaxis').scale(data[0][config.xi]);
  dex.console.log("BAR WIDTH: " + barWidth);
  chartContainer.selectAll(".bar")
      .data(barData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { console.dir(d);
         return xaxis.scale(d[0]) })//+ config.xaxis.scale(d[3]); })
      .style("fill", function(d) { return config.color(d[3]);})
      .attr("width", barWidth)
      .attr("y", function(d) { return yaxis.scale(d[1]); })
      .attr("height", function(d)
      {
        //console.log("yaxis.scale(" + d[1] + ")=" + yaxis.scale(d[1]));
        //console.dir(yaxis.scale(d[1]));
        return config.height - yaxis.scale(d[1]);
      });

  //chartContainer.select(".x").selectAll("text").remove();

  // Add Text Labels
  /*
  chartContainer.selectAll(".label")
    .data(barData)
    .enter().append("text")
    .each(function(d)
    {
      dex.console.log("MYDIR", d);
      d3.select(this).call(dex.config.configureLabel, config.xaxis.tick.label)
      .attr("x", function(d)
        { return x(d[0]) + x1(d[3]) + config.xaxis.tick.label.x; })
      .attr("y", config.height + config.xaxis.tick.padding)
      //.attr("y", function(d) { return y(d[1]); })
      .text(function(d) { return "f"; });
    });
    */
};

  return chart;
}