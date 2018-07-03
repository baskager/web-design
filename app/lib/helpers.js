"use strict";

exports.if = function(conditional, options) {
  if (options.hash.compare == options.hash.compareWith) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};
