dex.config = {};

/**
 * This routine will expand hiearchically delimited names such as
 * foo.bar into a structure { foo : { bar : value}}.  It will delete
 * the hierarchical name and overwrite the value into the proper
 * location leaving any previous object properties undisturbed.
 *
 * @param {Object} config The configuration which we will expand.
 *
 */
dex.config.expand = function (config) {
  var name,
    ci,
    expanded;

  // We have nothing, return nothing.
  if (!config) {
    return config;
  }

  // Make a clone of the previous configuration.
  expanded = dex.object.clone(config);

  // Iterate over the property names.
  for (name in config) {
    // If this is our property the process it, otherwise ignore.
    if (config.hasOwnProperty(name)) {
      // The property name is non-null.
      if (name) {
        // Determine character index.
        ci = name.indexOf('.');
      }
      else {
        // Default to -1
        ci = -1;
      }

      // if Character index is > -1, we have a hierarchical name.
      // Otherwise do nothing, copying was already handled in the
      // cloning activity.
      if (ci > -1) {
        // Set it...
        dex.object.setHierarchical(expanded, name,
          dex.object.clone(expanded[name]), '.');
        // Delete the old name.
        delete expanded[name];
      }
    }
  }

  //dex.console.log("CONFIG", config, "EXPANDED", expanded);
  return expanded;
};

dex.config.expandAndOverlay = function (top, bottom) {
  return dex.object.overlay(dex.config.expand(top), dex.config.expand(bottom));
}

dex.config.font = function (custom) {
  var config =
  {
    'size': 18,
    'family': 'sans-serif',
    'style': 'normal',
    'variant': 'normal',
    'weight': 'normal'
  };

  return (custom) ? dex.object.overlay(custom, config) : config;
};

dex.config.configureFont = function (node, config) {
  return node
    .attr("font-family", dex.config.optionValue(config.family))
    .attr("font-weight", dex.config.optionValue(config.weight))
    .attr("font-style", dex.config.optionValue(config.style))
    .style("font-size", dex.config.optionValue(config.size));
};

dex.config.tick = function (custom) {
  var config =
  {
    'count': 5,
    //'tickValues'  : null,
    'subdivide': 3,
    'size': {
      'major': 5,
      'minor': 3,
      'end': 5
    },
    'padding': 5,
    'format': d3.format(",d"),
    'label': this.label()
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.xaxis = function (custom) {
  var config =
  {
    'scale': d3.scale.linear(),
    'orient': "bottom",
    'tick': this.tick(),
    'label': this.label()
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.yaxis = function (custom) {
  var config =
  {
    'scale': d3.scale.linear(),
    'orient': 'left',
    'tick': this.tick(),
    'label': this.label({'transform': 'rotate(-90)'})
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.stroke = function (custom) {
  var defaults =
  {
    'width': 1,
    'color': "black",
    'opacity': 1,
    'dasharray': ''
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.optionValue = function (option) {
  return function (d, i) {
    if (dex.object.isFunction(option)) {
      return option(d, i);
    }
    else {
      return option;
    }
  };
}

dex.config.configureStroke = function (node, config) {
  dex.config.setStyle(node, 'stroke-width', config.width);
  dex.config.setStyle(node, 'stroke', config.color);
  dex.config.setStyle(node, 'stroke-opacity', config.opacity);
  dex.config.setStyle(node, 'stroke-dasharray', config.dasharray);

  return node;
};

dex.config.fill = function (custom) {
  var defaults =
  {
    'fillColor': "blue",
    'fillOpacity': 1
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.configureFill = function (node, config) {
  dex.console.log("configureFill", node, config);
  dex.config.setAttr(node, 'fill', config.fillColor);
  dex.config.setAttr(node, 'fill-opacity', config.fillOpacity)
    .style("fill-opacity", config.fillOpacity);
  return node;
};

dex.config.link = function (custom) {
  var defaults =
  {
    'fill': this.fill(),
    'stroke': this.stroke(),
    'transform' : ''
    //'d' : null
  };

  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.configureLink = function (node, config) {
  dex.config.configureStroke(node, config.stroke);
  dex.config.configureFill(node, config.fill);
  dex.config.setAttr(node, 'transform', config.transform);
  dex.config.setAttr(node, 'd', config.d);
  dex.console.log("LINK", "NODE", node, "CONFIG", config);

  return node;
}

dex.config.rectangle = function (custom) {
  var config =
  {
    'width': 50,
    'height': 50,
    'x': 0,
    'y': 0,
    'rx': 0,
    'ry': 0,
    'stroke': dex.config.stroke(),
    'opacity': 1,
    'color': d3.scale.category20()
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.configureRectangle = function (node, config) {
  dex.config.setAttr(node, 'width', config.width);
  dex.config.setAttr(node, 'height', config.height);
  dex.config.setAttr(node, 'x', config.x);
  dex.config.setAttr(node, 'y', config.y);
  dex.config.setAttr(node, 'rx', config.rx);
  dex.config.setAttr(node, 'ry', config.ry);
  dex.config.setAttr(node, 'opacity', config.opacity);
  dex.config.setAttr(node, 'fill', config.color);

  return node.call(dex.config.configureStroke, config.stroke);
};

dex.config.line = function (custom) {
  var defaults =
  {
    'start': dex.config.point(),
    'end': dex.config.point(),
    'stroke': dex.config.stroke()
  };
  var config = dex.config.expandAndOverlay(custom, defaults);
  return config;
};

dex.config.configureLine = function (node, config) {

  dex.config.setAttr(node, 'x1', config.start.x);
  dex.config.setAttr(node, 'y1', config.start.y);
  dex.config.setAttr(node, 'x2', config.end.x);
  dex.config.setAttr(node, 'y2', config.end.y);
  dex.config.configureStroke(node, config.stroke);

  return node;
};

dex.config.setAttr = function (node, name, value) {
  if (typeof value != 'undefined') {
    //dex.console.log("Set Attr: '" + name + "'='" + value + "'");
    node.attr(name, dex.config.optionValue(value));
  }
  else
  {
    //dex.console.log("Undefined Attr: '" + name + "'='" + value + "'");
  }
  return node;
}

dex.config.setStyle = function (node, name, value) {
  if (typeof value !== 'undefined') {
    //dex.console.log("Set Style: '" + name + "'='" + dex.config.optionValue(value) + "'");
    node.style(name, dex.config.optionValue(value));
  }
  else
  {
    //dex.console.log("Undefined Style: '" + name + "'='" + value + "'");
  }
  return node;
}

dex.config.point = function (custom) {
  var config =
  {
    'x': 0,
    'y': 0
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.configurePoint = function (node, config) {
  return node
    .attr('x', config.center.cx)
    .attr('y', config.center.cy);
};

dex.config.circle = function (custom) {
  var config =
  {
    'center': dex.config.point(),
    'radius': 10,
    'style': {
      'stroke': dex.config.stroke(),
      'color': d3.scale.category20(),
      'opacity': 1.0
    }
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

// Configures: opacity, color, stroke.
dex.config.configureShapeStyle = function (node, config) {
  return node
    .call(dex.config.configureStroke, config.stroke)
    .attr('opacity', config.opacity)
    .style('fill', config.color);
};

dex.config.configureCircle = function (node, config) {
  return node
    .call(dex.config.configureShapeStyle, config.style)
    .attr('r', config.radius)
    .attr('cx', config.center.x)
    .attr('cy', config.center.y);
};

dex.config.label = function (custom) {
  var config =
  {
    'x': 0,
    'y': 0,
    'transform': "",
    'dy': ".71em",
    'font': this.font(),
    'text': '',
    'anchor': 'end',
    'color': 'black'
    //'textLength': null,
    //'lengthAdjust': null,
    //'writingMode': null,
    //'glyphOrientationVertical': null
  };
  if (custom) {
    config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.configureLabel = function (node, config, text) {
  //console.dir(node);

  dex.config.setAttr(node, "x", config.x);
  dex.config.setAttr(node, "y", config.y);
  dex.config.setAttr(node, "transform", config.transform);
  dex.config.setAttr(node, "dy", config.dy);
  node.call(dex.config.configureFont, config.font);
  dex.config.setStyle(node, "text-anchor", config.anchor);
  dex.config.setAttr(node, "fill", config.color);
  dex.config.setStyle(node, "fill-opacity", config.opacity);
  dex.config.setStyle(node, "textLength", config.textLength);
  dex.config.setStyle(node, "lengthAdjust", config.lengthAdjust);
  dex.config.setStyle(node, "writing-mode", config.writingMode);
  dex.config.setStyle(node, "glyph-orientation-vertical", config.glyphOrientationVertical);

  if (typeof config.text != 'undefined') {
    node.text(dex.config.optionValue(config.text));
  }

  return node;
};

dex.config.configureAxis = function (config) {
  var axis = d3.svg.axis()
    .ticks(config.tick.count)
    .tickSubdivide(config.tick.subdivide)
    .tickSize(config.tick.size.major, config.tick.size.minor,
      config.tick.size.end)
    .tickPadding(config.tick.padding);

  // REM: Horrible way of doing this.  Need a function which
  // is more generic and smarter to short circuit stuff like
  // this.  But...for now it does what I want.
  if (!dex.object.isFunction(config.tick.format)) {
    axis.tickFormat(config.tick.format);
  }

  axis
    .orient(config.orient)
    .scale(config.scale);

  //axis.scale = config.scale;
  return axis;
};