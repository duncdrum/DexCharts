# Introduction

DexCharts is a library which provides highly interactive, configurable, and interoperable HTML5 reusable charts.

* A variety of reusable charts and charting components to choose from.
* A framework for interconnecting these charts via listeners.

## Live Examples

There are many examples bundled with DexCharts.  Click on any of the following links to check them out.

* [Bar Chart 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/BarChart1.html)
* [Bar Chart 2](http://dexvis.com/dexcharts/dist/2013.11.14/examples/BarChart2.html)
* [Bar Chart 3](http://dexvis.com/dexcharts/dist/2013.11.14/examples/BarChart3.html)
* [Chord Chart 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/Chord1.html)
* [Chord Chart 2](http://dexvis.com/dexcharts/dist/2013.11.14/examples/Chord2.html)
* [Dendrogram 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/Dendrogram1.html)
* [Dendrogram 2](http://dexvis.com/dexcharts/dist/2013.11.14/examples/Dendrogram2.html)
* [Dendrogram 3](http://dexvis.com/dexcharts/dist/2013.11.14/examples/Dendrogram3.html)
* [HeatMap 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/HeatMap1.html)
* [Horizontal Legend 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/HorizontalLegend1.html)
* [Legend 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/Legends1.html)
* [Line Chart 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/LineChart1.html)
* [Line Chart 2](http://dexvis.com/dexcharts/dist/2013.11.14/examples/LineChart2.html)
* [Line Chart 3](http://dexvis.com/dexcharts/dist/2013.11.14/examples/LineChart3.html)
* [Line Chart 4](http://dexvis.com/dexcharts/dist/2013.11.14/examples/LineChart4.html)
* [Parallel Coordinates 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/ParallelCoordinates1.html)
* [Parallel Coordinates 2](http://dexvis.com/dexcharts/dist/2013.11.14/examples/ParallelCoordinates2.html)
* [Parallel Coordinates 3](http://dexvis.com/dexcharts/dist/2013.11.14/examples/ParallelCoordinates3.html)
* [Parallel Coordinates 4](http://dexvis.com/dexcharts/dist/2013.11.14/examples/ParallelCoordinates4.html)
* [Pie Chart 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/PieChart1.html)
* [Pie Chart 2](http://dexvis.com/dexcharts/dist/2013.11.14/examples/PieChart2.html)
* [Pie Chart 3](http://dexvis.com/dexcharts/dist/2013.11.14/examples/PieChart3.html)
* [Sankey 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/Sankey1.html)
* [Sankey 2](http://dexvis.com/dexcharts/dist/2013.11.14/examples/Sankey2.html)
* [Sankey 3](http://dexvis.com/dexcharts/dist/2013.11.14/examples/Sankey3.html)
* [Sankey 4](http://dexvis.com/dexcharts/dist/2013.11.14/examples/Sankey4.html)
* [Sankey 5](http://dexvis.com/dexcharts/dist/2013.11.14/examples/Sankey5.html)
* [Sankey 6](http://dexvis.com/dexcharts/dist/2013.11.14/examples/Sankey6.html)
* [Sankey 7](http://dexvis.com/dexcharts/dist/2013.11.14/examples/Sankey7.html)
* [Sankey 8](http://dexvis.com/dexcharts/dist/2013.11.14/examples/Sankey8.html)
* [Sankey 9](http://dexvis.com/dexcharts/dist/2013.11.14/examples/Sankey9.html)
* [Scatter Plot 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/ScatterPlot1.html)
* [Scatter Plot 2](http://dexvis.com/dexcharts/dist/2013.11.14/examples/ScatterPlot2.html)
* [3D Scatter Plot 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/ScatterPlot3D1.html)
* [3D Scatter Plot 2](http://dexvis.com/dexcharts/dist/2013.11.14/examples/ScatterPlot3D2.html)
* [3D Scatter Plot 3](http://dexvis.com/dexcharts/dist/2013.11.14/examples/ScatterPlot3D3.html)
* [Scatter Plot Matrix](http://dexvis.com/dexcharts/dist/2013.11.14/examples/ScatterPlotMatrix1.html)
* [State Map 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/StateMap1.html)
* [State Map 2](http://dexvis.com/dexcharts/dist/2013.11.14/examples/StateMap2.html)
* [UI Controls 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/UI1.html)
* [UI Controls 2](http://dexvis.com/dexcharts/dist/2013.11.14/examples/UI2.html)
* [UI Controls 3](http://dexvis.com/dexcharts/dist/2013.11.14/examples/UI3.html)
* [UI Controls 4](http://dexvis.com/dexcharts/dist/2013.11.14/examples/UI4.html)
* [US County Map 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/USCountyMap1.html)
* [Vertical Legend 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/VerticalLegend1.html)
* [World Country Map 1](http://dexvis.com/dexcharts/dist/2013.11.14/examples/WorldCountryMap1.html)

## Usage

_**Step 1: Include D3**_

Make sure your HTML5 asset includes D3 like so:

```javascript
<script src="http://d3js.org/d3.v3.js"></script>
```

_**Step 2: Include DexCharts core**_

Now include the core DexCharts Javascript like so:

```javascript
<script src="../dex.js"></script>
```

_**Step 3: Include the specific components you will need:**_

Some components such as maps are quite large, so I decided that components should be required as needed instead of in one massive kitchen sink Javascript library.  Here, I am including a Bar Chart and a Horizontal Legend.

```javascript
<script src="../js/dex/component/d3/BarChart.js"></script>
<script src="../js/dex/component/d3/HorizontalLegend.js"></script>
```

_**Step 4: Include D3**_

Create one or more SVG containers for your charts::

Via html:

Or you can do it via html like this:

```html
<svg id="MyChart" width="1000" height="1000"></svg>
```

Or you can create the SVG in JavaScript code:

```javascript
var svg = d3.select("body").append("svg")
  .attr("id", "MyChart")
  .attr("width", 1000)
  .attr("height", 800)
  .append("g")
  .attr("transform", "translate(40,20)");
```

_**Step 5: Instantiate a chart**_

Next, we must configure and instantiate a chart.

```javascript
var mychart = new BarChart(
  {
    'parent' : '#MyChart',
    'csv'    :
    {
      'header' : [ "SALESMAN", "AGE", "SALES"],
      'data'   : [["BOB", 23, 1000], ["SUE", 32, 2000], ["PAT", 44, 3000]]
    }
  }
);
```

_**Step 6:**_

Render the chart.

```javascript
mychart.render();
```

### What else?

_**We can reconfigure and update our chart in one line.**_

This will change the simple bar chart to a grouped bar chart which will have columns for both AGE and SALES.

```javascript
mychart.attr("yi", [1, 2]).update();
```

_**We can create new charts from old charts.**_

Here we create a new chart called myotherchart from mychart.  It will inherit all parameters from the original.  Of course, this makes no sense, so we change the x/y offsets to display at a different location on the screen.

In two lines we are creating another permutation of a chart and rendering it!

```javascript
var myotherchart = new BarChart(mychart);
myotherchart.attr("yoffset", 400).render();
```

_**We can combine charts and tell them to listen to other another.**_

Here, we're telling our parallel coordinates chart (pcChart), to listen to our USStateMap named "map" when it generates a "selectState" event.  Data is passed through an object called chartEvent.

In this particular example, we're removing the old parallel lines chart, adding the selected state data to the data list, then updating the chart.  A live example of this visualization [US State Map wired to Parallel Coordinates](http://dexvis.com/vis/blog/2013/mar/reusable6/html/ParallelCoordinates3.html):

```javascript
map.addListener("selectState", pcChart, function(chartEvent)
  {
    if (stateMap[chartEvent.state] != null)
  	{
  	  d3.selectAll("#ParChart").remove();
  	  selectedStates[chartEvent.state] = true;

  	  var pcData = []
  	  
  	  for (var state in selectedStates)
  	  {
  	  	pcData.push(stateMap[state]);
  	  }
	  pcChart
	    .attr("normalize", pcData.length <= 1)
	    .attr("csv.data", pcData)
	    .attr("height", 200)
	    .update();
  	}
  });
```

# Configuration

