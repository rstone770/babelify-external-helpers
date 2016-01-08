var insert = require('insert-module-globals'),
    utility = require('./utility');

/**
 * Hanging identifier resolver.
 *
 * @param  {Options=} options
 * @return {!Function(string)}
 */
var inserter = function (options) {
  var transform = function (file) {
    return insert(file, options || {});
  };

  return transform;
};

/**
 * Babel external helper module injector.
 *
 * This object will configure browserify to accept a streaming source and then
 * resolve any relevant compile time bindings to the built module. The module
 * can later by referenced by name later down the browserify pipeline and modified
 * further.
 *
 * @param {!Browserify} browserify
 * @param {!String} name
 * @param {!Readable} source
 */
var ModuleInjector = function (browserify, name, source) {
  if (utility.isNullOrUndefined(browserify)) {
    throw 'browserify must be defined.';
  }

  if (!utility.isNonEmptyString(name)) {
    throw 'name must be defined.';
  }

  if (utility.isNullOrUndefined(source)) {
    throw 'source must be defined.';
  }

  this._browserify = browserify;
  this._name = name;
  this._source = source;
  this._hasModule = false;
  this._hasResolver = false;
};

/**
 * Applies hooks.
 */
ModuleInjector.prototype.apply = function () {
  this._injectModule();
  this._addResolver();
};

/**
 * Adds the compile time module resolver.
 */
ModuleInjector.prototype._addResolver = function () {
  var self = this;

  if (this._hasResolver === false) {
    this._browserify.transform(this._createResolver(), {global: true});
  }

  this._hasResolver = true;
};

/**
 * Creates a resolver transform that can resolve hanging module identifiers.
 *
 * @return {!Function(string)}
 */
ModuleInjector.prototype._createResolver = function () {
  var babelHelpers = 'require("' + this._name + '")';

  return inserter({
    vars: {
      babelHelpers: function () {
        return babelHelpers;
      }
    }
  });
};

/**
 * Injects the compile time module into the browserify pipeline.
 */
ModuleInjector.prototype._injectModule = function () {
  if (this._hasModule === false) {
    this._browserify.require(this._source, {file: this._name, expose: this._name});
    this._browserify.exclude(this._name);
  }

  this._hasModule = true;
};

module.exports = ModuleInjector;
