dex.array = {};

////
//
// dex.array : This module provides routines dealing with arrays.
//
////

/**
 * 
 * Take a slice of an array.
 * 
 * @method dex.array.slice
 * @param
 */
dex.array.slice = function(array, rowRange, optLen)
{
	var slice = [];
  var range;
  var i;
  
  // Numeric.
  // Array.
  // Object.  Numeric with start and end.
  if (arguments.length < 2)
  {
  	return array;
  }
  else if (arguments.length == 2)
  {
  	if (Array.isArray(rowRange))
  	{
  		range = rowRange;
  	}
  	else
  	{
  		range = dex.range(rowRange, array.length - rowRange);
  	}
  }
  else if (arguments.length > 2)
  {
    if (Array.isArray(rowRange))
    {
  	  range = rowRange;
    }
    else
    {
  	  range = dex.range(rowRange, optLen);
    }
  }

	for (i = 0; i<range.length; i++)
	{
		slice.push(array[range[i]]);
	}

	return slice;
};

dex.array.unique = function(array)
{
  var uniqueMap =
  {
  };
  var unique = [];
  var i, l;
  
  for (i = 0, l = array.length; i < l; i+=1)
  {
    if (uniqueMap.hasOwnProperty(array[i]))
    {
      continue;
    }
    unique.push(array[i]);
    uniqueMap[array[i]] = 1;
  }
  return unique;
};


dex.array.extent = function(array, indices)
{
	var values = getArrayValues(array, indices);
	var max = Math.max.apply(null, values);
	var min = Math.min.apply(null, values);
	console.log("EXTENT:");
	console.dir(values);
	console.dir([min, max]);
	return [ min, max ];
};

dex.array.difference = function(a1, a2)
{
	var i, j;
  var a = [], diff = [];
  for (i = 0; i < a1.length; i++)
  {
  	a[a1[i]] = true;
  }
  for (i = 0; i < a2.length; i++)
  {
    if (a[a2[i]])
    {
      delete a[a2[i]];
    }
    else
    {
    	a[a2[i]] = true;
    }
  }
  for (j in a)
  {
    diff.push(j);
  }
  return diff;

};

dex.array.selectiveJoin = function(array, rows, delimiter)
{
	var delim = ':::';
	var key = "";
	if (arguments.length >= 3)
  {
  	delim = delimiter;
  }
  else if (arguments.length === 2)
  {
    return dex.array.slice(array, rows).join(delimiter);
  }
  throw "Invalid arguments.";
};
