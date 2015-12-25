var util = require('util'),
    xtend = require('xtend');

/**
 * Copies all properties from all provided objects into one.
 *
 * @param {...Object} parents
 */
var extend = xtend;

/**
 * Extends a class.
 *
 * @param {!Function} constructor
 * @param (!Function) super
 */
var inherits = util.inherits;

/**
 * Determines if a value is a string, and its not empty.
 *
 * @param  {!T} value
 * @return {!Boolean}
 */
var isNonEmptyString = function (value) {
  return isString(value) && value.trim().length > 0;
};

/**
 * Determines if a value is null or undefined.
 *
 * @param  {!T} value
 * @return {!Boolean}
 */
var isNullOrUndefined = util.isNullOrUndefined;

/**
 * Determines if a value is a string.
 *
 * @param  {!T} value
 * @return {!Boolean}
 */
var isString = util.isString;

module.exports = {
  extend: extend,
  inherits: inherits,
  isNonEmptyString: isNonEmptyString,
  isNullOrUndefined: isNullOrUndefined,
  isString: isString
};
