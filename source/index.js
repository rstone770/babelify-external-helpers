var EmptyModule = require('./empty-module-stream'),
    Injector = require('./module-injector'),
    Rewriter = require('./module-rewriter'),
    utility = require('./utility');

/**
 * @param {ModuleInjector} injector
 * @param {ModuleRewriter} rewriter
 */
var BabelifyExternalHelpers = function (injector, rewriter) {
  if (utility.isNullOrUndefined(injector)) {
    throw 'a compile time module injector must be defined.';
  }

  if (utility.isNullOrUndefined(rewriter)) {
    throw 'a compile time module rewriter must be defined.';
  }

  this._injector = injector;
  this._rewriter = rewriter;
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
  var name = utility.extend(BabelifyExternalHelpers.defaults, options).name,
      source = new EmptyModule(browserify),
      injector = new Injector(browserify, name, source),
      rewriter = new Rewriter(browserify, name);

  return new BabelifyExternalHelpers(injector, rewriter);
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
  this._rewriter.apply();
};

module.exports = BabelifyExternalHelpers.plugin;
