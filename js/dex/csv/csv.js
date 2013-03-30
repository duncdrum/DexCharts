dex.csv =
{
};

dex.csv.csv = function(header, data)
{
  var csv =
  {
    "header" : header,
    "data" : data
  };

  return csv;
};

dex.csv.createMap = function(csv, keyIndex)
{
  var ri, ci, rowMap, map =
  {
  };

  for ( ri = 0; ri < csv.data.length; ri += 1)
  {
    if (csv.data[ri].length === csv.header.length)
    {
      rowMap =
      {
      };

      for ( ci = 0; ci < csv.header.length; ci += 1)
      {
        rowMap[csv.header[ci]] = csv.data[ri][ci];
      }
      map[csv.data[ri][keyIndex]] = rowMap;
    }
  }
  return map;
};

dex.csv.toJson = function(csv, rowIndex, columnIndex)
{
  var jsonData = [];
  var ri, ci, jsonRow;

  if (arguments.length >= 3)
  {
    jsonRow = {};
    jsonRow[csv.header[columnIndex]] = csv.data[rowIndex][columnIndex];
    return jsonRow;
  }
  else if (arguments.length == 2)
  {
    var jsonRow =
    {
    };
    for ( ci = 0; ci < csv.header.length; ci++)
    {
      jsonRow[csv.header[ci]] = csv.data[rowIndex][ci];
    }
    return jsonRow;
  }
  else if (arguments.length == 1)
  {
    for ( ri = 0; ri < csv.data.length; ri++)
    {
      var jsonRow =
      {
      };
      for ( ci = 0; ci < csv.header.length; ci++)
      {
        jsonRow[csv.header[ci]] = csv.data[ri][ci];
      }
      jsonData.push(jsonRow);
    }
  }
  return jsonData;
};

/**
 * Transforms:
 * csv =
 * {
 * 	 header : {C1,C2,C3},
 *   data   : [
 *     [A,B,C],
 *     [A,B,D]
 *   ]
 * }
 * into:
 * json =
 * {
 * 	"name"     : rootName,
 *  "category" : category,
 *  "children" :
 *  [
 *    "children" :
 *     [
 *       {
 *         "name"     : "A",
 *         "category" : "C1",
 *         "children" :
 *         [
 *           {
 * 	           "name" : "B",
 *             "category" : "C2",
 *             "children" :
 *             [
 *               {
 *                 "name"     : "C",
 *                 "category" : "C3",
 *                 "size"     : 1
 *               }
 *               {
 *                 "name"     : "D",
 *                 "category" : "C3",
 *                 "size"     : 1
 *               }
 *             ]
 *           }
 *         ]
 *       }
 *     ]
 *  ]
 * }
 *
 * @param {Object} csv
 */
dex.csv.toHierarchicalJson = function(csv)
{
  var connections = dex.csv.connections(csv);
  return getChildren(connections, 0);

  function getChildren(connections, depth)
  {
    //dex.console.log("connections:", connections, "depth="+depth);
    var kids = [], cname;

    if ( typeof connections === 'undefined')
    {
      return kids;
    }

    for (cname in connections)
    {
      //dex.console.log("CNAME", cname);
      if (connections.hasOwnProperty(cname))
      {
        kids.push(createChild(cname, csv.header[depth],
        	getChildren(connections[cname], depth + 1)));
      }
    }

    return kids;
  }
  
  function createChild(name, category, children)
  {
    var child =
    {
      "name" : name,
      "category" : category,
      "children" : children
    };
    return child;
  }

};

/**
 *
 * Transforms:
 * csv =
 * {
 * 	 header : {C1,C2,C3},
 *   data   : [
 *     [A,B,C],
 *     [A,B,D]
 *   ]
 * }
 * into:
 * connections =
 * { A:{B:{C:{},D:{}}}}
 *
 * @param {Object} csv
 *
 */
dex.csv.connections = function(csv)
{
  var connections =
  {
  };
  var ri;

  for ( ri = 0; ri < csv.data.length; ri++)
  {
    dex.object.connect(connections, csv.data[ri]);
  }

  //dex.console.log("connections:", connections);
  return connections;
};

dex.csv.createRowMap = function(csv, keyIndex)
{
  var map =
  {
  };
  var ri;

  for ( ri = 0; ri < csv.data.length; ri++)
  {
    if (csv.data[ri].length == csv.header.length)
    {
      map[csv.data[ri][keyIndex]] = csv.data[ri];
    }
  }
  return map;
};

dex.csv.getNumericColumnNames = function(csv)
{
  var possibleNumeric =
  {
  };
  var i, j, ri, ci;
  var numericColumns = [];

  for ( i = 0; i < csv.header.length; i++)
  {
    possibleNumeric[csv.header[i]] = true;
  }

  // Iterate thru the data, skip the header.
  for ( ri = 0; ri < csv.data.length; ri++)
  {
    for ( ci = 0; ci < csv.data[ri].length && ci < csv.header.length; ci++)
    {
      if (possibleNumeric[csv.header[ci]] && !dex.object.isNumeric(csv.data[ri][ci]))
      {
        possibleNumeric[csv.header[ci]] = false;
      }
    }
  }

  for ( ci = 0; ci < csv.header.length; ci++)
  {
    if (possibleNumeric[csv.header[ci]])
    {
      numericColumns.push(csv.header[ci]);
    }
  }

  return numericColumns;
};

dex.csv.getNumericIndices = function(csv)
{
  var possibleNumeric =
  {
  };
  var i, j;
  var numericIndices = [];

  for ( i = 0; i < csv.header.length; i++)
  {
    possibleNumeric[csv.header[i]] = true;
  }

  // Iterate thru the data, skip the header.
  for ( i = 1; i < csv.data.length; i++)
  {
    for ( j = 0; j < csv.data[i].length && j < csv.header.length; j++)
    {
      if (possibleNumeric[csv.header[j]] && !dex.object.isNumeric(csv.data[i][j]))
      {
        possibleNumeric[csv.header[j]] = false;
      }
    }
  }

  for ( i = 0; i < csv.header.length; i++)
  {
    if (possibleNumeric[csv.header[i]])
    {
      numericIndices.push(i);
    }
  }

  return numericIndices;
};

dex.csv.isColumnNumeric = function(csv, columnNum)
{
  var i;

  for ( i = 0; i < csv.data.length; i++)
  {
    if (!dex.object.isNumeric(csv.data[i][columnNum]))
    {
      return false;
    }
  }
  return true;
};

dex.csv.toMapArray = function(csv)
{
  var mapArray = [];
  var i, j;

  for ( i = 0; i < csv.data.length; i++)
  {
    var row =
    {
    };
    for ( j = 0; j < csv.header.length; j++)
    {
      row[csv.header[j]] = csv.data[i][j]
    }
    mapArray.push(row);
  }

  return mapArray;
};
