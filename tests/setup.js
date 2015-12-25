var Fixture = require('./fixtures'),
    path = require('path'),
    util = require('util');

/**
 * Global test common library.
 *
 * @type {Object}
 */
var TestCommon = {};

/**
 * Common fixture.
 *
 * @type {Fixture}
 */
TestCommon.fixture = Fixture;

/**
 * Project require. Requires from source first, if fails fall back to normal requrie.
 *
 * @param  {!String} file
 * @return {?T}
 */
TestCommon.require = function (file) {
  var result = null;

  try {
    result = require(path.join(this.root, 'source', file));
  } catch (e) {
    result = require(file);
  }

  return result;
};

/**
 * Project root path.
 *
 * @type {String}
 */
TestCommon.root = path.join(__dirname, '..');

global.TestCommon = TestCommon;
