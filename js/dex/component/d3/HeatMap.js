HeatMap.prototype = new DexComponent();
HeatMap.constructor = HeatMap;

function HeatMap(userConfig)
{
  DexComponent.call(this, userConfig,
  {
  	// The parent container of this chart.
    'parent'           : null,
    // Set these when you need to CSS style components independently.
    'id'               : 'HeatMap',
    'class'            : 'HeatMap',
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
    'yi'               : 1,
    'hi'               : 2,
    'xoffset'          : 50,
    'yoffset'          : 0,
    'color'            : d3.scale.category20(),
    'heatScale'        : d3.scale.linear().range(["white", "red"]),
    'xaxis' :
    {
    	'scale'       : d3.time.scale(),
    	'orient'      : "bottom",
    	'ticks'       : 5,
    	//'tickValues'  : null,
    	'tickSubdivide' : 1,
    	'tickSize'      :
    	{
    		'major' : 5,
    		'minor' : 3,
    		'end'   : 5
    	},
    	'tickPadding'   : 5,
    	'tickFormat'    : d3.time.format("%d %MM"),
    	
    	'label' :
    	{
    		'x'         : 500,
    		'y'         : -6,
    		'transform' : "",
    		'dy'        : ".71em",
    		'font'      :
    		{
    			'size'    : 18,
    			'family'  : 'sans-serif',
    			'style'   : 'normal',
    			'variant' : 'normal',
    			'weight'  : 'normal'
    		},
    		'text'      : 'X Axis',
    		'anchor'    : 'end',
    		'color'     : 'black'
    	}
    },
    'yaxis' :
    {
    	'scale'       : d3.scale.linear(),
    	'orient'      : 'left',
    	'ticks'       : 10,
    	//'tickValues'  : null,
    	'tickSubdivide' : 1,
    	'tickSize'      :
    	{
    		'major' : 5,
    		'minor' : 3,
    		'end'   : 5
    	},
    	'tickPadding'   : 5,
    	'tickFormat'    : d3.format(",d"),
    	
    	'label' :
    	{
    		'x'         : 300,
    		'y'         : 6,
    		'transform' : "rotate(-90)",
    		'dy'        : ".71em",
    		'font'      :
    		{
    			'size'    : 18,
    			'family'  : 'sans-serif',
    			'style'   : 'normal',
    			'variant' : 'normal',
    			'weight'  : 'normal'
    		},
    		'text'      : 'Y Axis',
    		'anchor'    : 'end',
    		'color'     : 'black'
     }
    },
    'rect' :
    {
    	'stroke' :
    	{
    		'color'   : 'black',
    		'width'   : 1,
    		'opacity' : .5
    	}
    }
  });

  this.chart = this;
}

HeatMap.prototype.render = function()
{
  this.update();
};

HeatMap.prototype.update = function()
{
	// If we need to call super:
	//DexComponent.prototype.update.call(this);
 	var chart  = this.chart;
  var config = this.config;
  var csv    = config.csv;
  
  if (config.debug)
  {
    console.log("===== HeatMap Configuration =====");
    console.dir(config);
  }

  var chartContainer = config.parent.append("g")
    .attr("id", config["id"])
    .attr("class", config["class"])
    .attr("transform", "translate(" + config.xoffset + "," + config.yoffset + ")");

  var x    = config.xaxis.scale.range([0, config.width]),
      y    = config.yaxis.scale.range([config.height, 0]),
      heat = config.heatScale;

  // The size of the json in the CSV data file.
  // This could be inferred from the data if it weren't sparse.
  var xStep = 864e5, yStep = 100;

  //var json = dex.csv.toJson(csv);
  var data = csv.data;

  // Coerce the CSV data to the appropriate types.
  data.forEach(function(d)
  {
    d[config.x] = +d[config.xi]
    d[config.yi] = +d[config.yi];
    d[config.hi] = +d[config.hi];
  });

  // Compute the scale domains.
  x.domain(d3.extent(data, function(d) { return d[config.xi]; }));
  y.domain(d3.extent(data, function(d) { return d[config.yi]; }));
  heat.domain([0, d3.max(data, function(d) { return d[config.hi]; })]);

  // Extend the x- and y-domain to fit the last bucket.
  // For example, the y-bucket 3200 corresponds to values [3200, 3300].
  x.domain([x.domain()[0], +x.domain()[1] + xStep]);
  y.domain([y.domain()[0], y.domain()[1] + yStep]);

  // Display the tiles for each non-zero bucket.
  // See http://bl.ocks.org/3074470 for an alternative implementation.
  chartContainer.selectAll(".tile")
      .data(data)
    .enter().append("rect")
      .attr("class", "tile")
      .attr("x", function(d) { return x(d[config.xi]); })
      .attr("y", function(d) { return y(d[config.yi] + yStep); })
      .attr("width", x(xStep) - x(0))
      .attr("height",  y(0) - y(yStep))
      .style("fill", function(d) { return heat(d[config.hi]); })
      .style("stroke", config.rect.stroke.color)
      .style("stroke-opacity", config.rect.stroke.opacity)
      .style("stroke-width", config.rect.stroke.width)
      .on("mouseover", function(d)
      {
      	if (config.event && config.event.mouseover)
      	{
      		config.event.mouseover(d);
      	}
      	else
      	{
          dex.console.log("on.mouseover", d);
      	}
      });

  // Add a legend for the color values.
  var legend = svg.selectAll(".legend")
      .data(heat.ticks(6).slice(1).reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i)
        { return "translate(" + (config.width + config.xoffset + 10) +
            "," + (20 + i * 20) + ")"; });

  legend.append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", heat);

  legend.append("text")
      .attr("x", 26)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text(String);

  chartContainer.append("text")
      .attr("class", "label")
      .attr("x", config.width + 20)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text("Count");

  // Add an x-axis with label.
  chartContainer.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + config.height + ")")
      .call(d3.svg.axis()
      	.scale(config.xaxis.scale)
      	.ticks(config.xaxis.ticks)
      	.tickSubdivide(config.xaxis.tickSubdivide)
      	.tickSize(config.xaxis.tickSize.major, config.xaxis.tickSize.minor, config.xaxis.tickSize.end)
      	.tickPadding(config.xaxis.tickPadding)
      	.tickFormat(config.xaxis.tickFormat)
      	.orient(config.xaxis.orient))
    .append("text")
      .attr("class", "label")
      //.attr("x", config.width)
      //.attr("y", -6)
      .attr("x", config.xaxis.label.x)
      .attr("y", config.xaxis.label.y)
      .attr("text-anchor", config.xaxis.label.anchor)
      .attr("transform", config.xaxis.label.transform)
      .attr("font-family", config.xaxis.label.font.family)
      .attr("font-weight", config.xaxis.label.font.weight)
      .attr("font-style", config.xaxis.label.font.style)
      .style("font-size", config.xaxis.label.font.size)
      .text(config.xaxis.label.text);

  // Add a y-axis with label.
  chartContainer.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis()
       	.ticks(config.yaxis.ticks)
      	.tickSubdivide(config.yaxis.tickSubdivide)
      	.tickSize(config.yaxis.tickSize.major, config.yaxis.tickSize.minor, config.yaxis.tickSize.end)
      	.tickPadding(config.yaxis.tickPadding)
      	.tickFormat(config.yaxis.tickFormat)
        .scale(config.yaxis.scale)
        .orient(config.yaxis.orient))
    .append("text")
      .attr("class", "label")
      .attr("y", config.yaxis.label.y)
      .attr("dy", config.yaxis.label.dy)
      .attr("text-anchor", config.yaxis.label.anchor)
      .attr("transform", config.yaxis.label.transform)
      .attr("font-family", config.yaxis.label.font.family)
      .attr("font-weight", config.yaxis.label.font.weight)
      .attr("font-style", config.yaxis.label.font.style)
      .style("font-size", config.yaxis.label.font.size)
      .text(config.yaxis.label.text);
};
