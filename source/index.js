var ModuleStream = require('./external-helpers-module-stream'),
    Injector = require('./module-injector'),
    utility = require('./utility');

/**
 * @param {ModuleInjector} injector
 */
var BabelifyExternalHelpers = function (injector) {
  if (utility.isNullOrUndefined(injector)) {
    throw 'a compile time module injector must be defined.';
  }

  this._injector = injector;
};

/**
 * Default factory options.
 *
 * @type {Object}
 */
BabelifyExternalHelpers.defaults = {
  name: 'babel/external-helpers'
};

/**
 * BabelifyExternalHelpers factory.
 *
 * @param  {!Browserify} browserify
 * @param  {!Object} options
 * @return {!BabelifyExternalHelpers}
 */
BabelifyExternalHelpers.create = function (browserify, options) {
  options = utility.extend(BabelifyExternalHelpers.defaults, options);

  var source = new ModuleStream(browserify),
      injector = new Injector(browserify, options.name, source);

  return new BabelifyExternalHelpers(injector);
};

/**
 * Browserify compatible plugin.
 *
 * @param  {!Browserify} browserify
 * @param  {!Object} options
 */
BabelifyExternalHelpers.plugin = function (browserify, options) {
  BabelifyExternalHelpers.create(browserify, options).apply();
};

/**
 * Applies plugin.
 */
BabelifyExternalHelpers.prototype.apply = function () {
  this._injector.apply();
};

module.exports = BabelifyExternalHelpers;
