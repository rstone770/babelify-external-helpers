var babel = require('babel-core'),
    Readable = require('stream').Readable,
    utility = require('./utility');

/**
 * Generates a module source string from a set of required helpers.
 *
 * @param  {!Array<String>} helpers
 * @return {!String}
 */
var generateModule = function (helpers) {
  var lines = [
        'var global = {};',
        babel.buildExternalHelpers(helpers),
        'module.exports = global.babelHelpers;'
      ];

  return lines.join(' ');
};

/**
 * An empty module source stream.
 *
 * @extends {Readable}
 */
var ExternalHelpersModuleStream = function () {
  Readable.call(this);
};

utility.inherits(ExternalHelpersModuleStream, Readable);

/**
 * Readable abstract method implementation.
 */
ExternalHelpersModuleStream.prototype._read = function () {
  this.push(generateModule());
  this.push(null);
};

module.exports = ExternalHelpersModuleStream;
