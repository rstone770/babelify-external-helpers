var Readable = require('stream').Readable,
    utility = require('./utility');

/**
 * An empty module source stream.
 *
 * @extends {Readable}
 */
var EmptyModuleStream = function () {
  Readable.call(this);
};

utility.inherits(EmptyModuleStream, Readable);

/**
 * Readable abstract method implementation.
 */
EmptyModuleStream.prototype._read = function () {
  this.push('module.exports = {};');
  this.push(null);
};

module.exports = EmptyModuleStream;
