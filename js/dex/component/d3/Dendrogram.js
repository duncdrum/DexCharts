Dendrogram.prototype = new DexComponent();
Dendrogram.constructor = Dendrogram;

function Dendrogram(userConfig)
{
  DexComponent.call(this, userConfig,
  {
  	// The parent container of this chart.
    'parent'           : null,
    // Set these when you need to CSS style components independently.
    'id'               : 'Dendrogram',
    'class'            : 'Dendrogram',
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
    'xoffset'          : 20,
    'yoffset'          : 0,
    'rootName'         : "ROOT",
    "rootCategory"     : "ROOT",
    'color'            : d3.scale.category20(),
    'empty'            :
    {
    'color' : "green",
    'size'  : 4
    },
    'notEmpty' :
    {
    'color' : 'red',
    'size'  : 8
    },
  	'label'       :
   	{
   		'x'         : 0,
   		'y'         : -50,
   		'rotate'    : -90,
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
    //'emptyColor'       : "#fff",
    //'hasChildrenColor' : "lightsteelblue"
  });

  this.chart = this;
}

Dendrogram.prototype.render = function()
{
  this.update();
};

Dendrogram.prototype.update = function()
{
  var chart = this.chart;
  var config = this.config;
  var csv = config.csv; 
  var json;
  
  if (config.debug)
  {
    console.log("===== Dendrogram Configuration =====");
    console.dir(config);
  }
  
  var i = 0, root;

  var tree = d3.layout.tree()
    .size([config.height, config.width]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

  var chartContainer = config.parent.append("g")
    .attr("transform", "translate(" + config.xoffset + "," + config.yoffset + ")");

  json =
  {
    "name" : config.rootName,
    "category" : config.rootCategory,
    "children" : dex.csv.toHierarchicalJson(csv)
  }; 

  //dex.console.log("Dendogram JSON", json);

  root = json;
  root.x0 = config.height / 2;
  root.y0 = 0;

  function toggleAll(d)
  {
    if (d.children)
    {
      d.children.forEach(toggleAll);
      toggle(d);
    }
    else if (d.kids)
    {
      d.kids.forEach(toggleAll);
      toggle(d);
    }
  }

  // Initialize the display to show a few nodes.
  //root.kids.forEach(toggleAll);

  root = json;
  update(root);

  function update(source)
  {
    var duration = d3.event && d3.event.altKey ? 5000 : 500;

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse();

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = chartContainer.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", function(d) { toggle(d); update(d); });

    nodeEnter.append("svg:circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? config.notEmpty.color : config.empty.color; });

    nodeEnter
      .append("text")
        .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
        .attr("y", config.label.y)
        .attr("dy", config.label.dy)
        .attr("fill", config.label.color)
        .style("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .attr("font-family", config.label.font.family)
        .attr("font-weight", config.label.font.weight)
        .attr("font-style", config.label.font.style)
        .style("font-size", config.label.font.size)
        .text(config.label.text)
        .style("fill-opacity", 1e-6);;

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
      .attr("r", function(d) { return d._children ? config.notEmpty.size : config.empty.size;})
      .style("fill", function(d) { return d._children ? config.notEmpty.color : config.empty.color; });

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

    nodeExit.select("circle")
      .attr("r", 1e-6);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    // Update the links…
    var link = chartContainer.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Toggle children.
  function toggle(d)
  {
    if (d.children)
    {
      d._children = d.children;
      d.children = null;
    }
    else
    {
      d.children = d._children;
      d._children = null;
    }
  }
};
