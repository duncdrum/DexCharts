/**
 *
 * @param userConfig A user supplied configuration object which will override the defaults.
 * @returns {DexComponent} Returns the BarChart object.
 * @constructor
 *
 */
function BarChart(userConfig) {
  var defaults =
  {
    // The parent container of this chart.
    'parent': null,
    // Set these when you need to CSS style components independently.
    'id': 'BarChart',
    'class': 'BarChart',
    // Our data...
    'csv': {
      // Give folks without data something to look at anyhow.
      'header': [ "X", "Y" ],
      'data': [
        [0, 0],
        [1, 1],
        [2, 4],
        [3, 9],
        [4, 16]
      ]
    },
    'ymin' : null,
    'xmin' : null,
    // width and height of our bar chart.
    'width': 600,
    'height': 400,
    // The x an y indexes to chart.
    'xi': 0,
    'yi': [1],
    'transform': 'translate(100 100)',
    'color': d3.scale.category20(),
    bars: {
      'mouseover': dex.config.rectangle({
        'stroke': {'width': 2, 'color' : "red"}}),
      'mouseout': dex.config.rectangle()
    }
  };

  var config = dex.object.overlay(dex.config.expand(userConfig), dex.config.expand(defaults));

  //console.log("CDOMAIN: ");
  //console.dir(config.csv.data.map(function (r) { return r[0]; }));

  // Things defined in terms of the defaults:
  defaults.xaxis = dex.config.xaxis(
    {
      'scale': d3.scale.ordinal()
        .domain(config.csv.data.map(function (r) {
          return r[0];
        }))
        .rangeRoundBands([0, config.width], .1),
      'label': {
        'text': config.csv.header[config.xi],
        'x': config.width / 2,
        'y': 10
      }
    });

  defaults.yaxis = dex.config.yaxis(
    {
      'scale': d3.scale.linear().range([config.height, 0]),
      'label': { 'text': "Y", 'x': (-config.height / 2), 'y': -50 }
    });

  defaults.bars.mouseover.x = function (d) {
    return defaults.xaxis.scale(d[0])
  };
  defaults.bars.mouseover.y = function (d) {
    return defaults.yaxis.scale(d[1])
  };
  defaults.bars.mouseover.width =
    defaults.xaxis.scale(config.csv.data[1][config.xi]) - defaults.xaxis.scale(config.csv.data[0][config.xi]);
  defaults.bars.mouseover.height = function (d) {
    return config.height - defaults.yaxis.scale(d[1]);
  };
  defaults.bars.mouseover.color = function (d) {
    return config.color(d[3]);
  };

  defaults.bars.mouseout.x = function (d) {
    return defaults.xaxis.scale(d[0])
  };
  defaults.bars.mouseout.y = function (d) {
    return defaults.yaxis.scale(d[1])
  };
  defaults.bars.mouseout.width =
    defaults.xaxis.scale(config.csv.data[1][config.xi]) - defaults.xaxis.scale(config.csv.data[0][config.xi]);
  defaults.bars.mouseout.height = function (d) {
    return config.height - defaults.yaxis.scale(d[1]);
  };
  defaults.bars.mouseout.color = function (d) {
    return config.color(d[3]);
  };

  var chart = new DexComponent(userConfig, defaults);

  var data = config.csv.data;

  // Translate all of the y data columns to numerics.
  data.forEach(function (d) {
    config.yi.forEach(function (c) {
      d[c] = +d[c];
    });
  });

  var yextent = dex.matrix.extent(data, config.yi);

  if (chart.config.ymin != null) {
    yextent[0] = chart.config.ymin;
  }
  if (chart.config.ymax != null) {
    yextent[1] = chart.config.ymax;
  }

  //console.log("YEXTENT:" + yextent);
  chart.config.yaxis.scale.domain(yextent);

  chart.render = function () {
    this.update();
  };

  chart.update = function () {
    var chart = this;
    var config = chart.config;

    //console.dir("XAXIS--");
    //console.dir(config.xaxis);
    var xaxis = dex.config.configureAxis(config.xaxis);
    var yaxis = dex.config.configureAxis(config.yaxis);

    var chartContainer = d3.select(config.parent).append("g")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr("transform", config.transform);

    var data = config.csv.data;

    // Translate all of the y data columns to numerics.
    data.forEach(function (d) {
      config.yi.forEach(function (c) {
        d[c] = +d[c];
      });
    });

    var yextent = dex.matrix.extent(data, config.yi);

    if (chart.config.ymin != null) {
      yextent[0] = chart.config.ymin;
    }
    if (chart.config.ymax != null) {
      yextent[1] = chart.config.ymax;
    }

    // Establish the domain of the y axis.
    yaxis.scale().domain(yextent);

    // X Axis
    chartContainer.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + config.height + ")")
      .call(xaxis);

    chartContainer.selectAll(".xaxis").selectAll("text")
      .each(function (d) {
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
      .call(dex.config.configureLabel, config.yaxis.label);

    chartContainer.select(".yaxis").append("text")
      .call(dex.config.configureLabel, config.yaxis.label);

    var barData = dex.matrix.combine(
      dex.matrix.slice(data, [config.xi]),
      dex.matrix.slice(data, config.yi)
    );

    //dex.console.log("CSV DATA", csv);
    //dex.console.log("BAR DATA", barData);

    chartContainer.selectAll(".bar")
      .data(barData)
      .enter().append("rect")
      .call(dex.config.configureRectangle, config.bars.mouseout)
      .on("mouseover", function () {
        d3.select(this).call(dex.config.configureRectangle, config.bars.mouseover)
      })
      .on("mouseout", function () {
        d3.select(this).call(dex.config.configureRectangle, config.bars.mouseout)
      });
  };

  return chart;
}