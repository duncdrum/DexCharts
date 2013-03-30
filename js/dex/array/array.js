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
  	if (isArray(rowRange))
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
    if (isArray(rowRange))
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
