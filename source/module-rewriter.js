var babel = require('babel-core'),
    babelify = require('babelify'),
    through = require('through2'),
    utility = require('./utility');

/**
 * Generates a module source string from a set of required helpers.
 *
 * @param  {!Array<String>} helpers
 * @return {!String}
 */
var generateModule = function (helpers) {
  var externalHelpers = babel.buildExternalHelpers(helpers),
      lines = [
        'var global = self = {};',
        babel.buildExternalHelpers(helpers),
        'module.exports = self.babelHelpers;'
      ];

  return lines.join(' ');
};

/**
 * Babel helper module rewriter.
 *
 * This plugin hooks into browserify and then calculates the external runtime
 * helpers required. After the calculation is complete, the helper source is
 * generated and exported into a module defined by name.
 *
 * @param {!Browserify} browserify
 * @param {!String} name
 */
var ModuleRewriter = function (browserify, name) {
  if (utility.isNullOrUndefined(browserify)) {
    throw 'browserify must be defined.';
  }

  if (!utility.isNonEmptyString(name)) {
    throw 'name must be defined.';
  }

  this._browserify = browserify;
  this._helpers = {};
  this._name = name;
};

/**
 * Apply hooks.
 */
ModuleRewriter.prototype.apply = function () {
  this._bindPipeline();
  this._bindTransform();
};

/**
 * Binds the current browserify pipeline if not already bound.
 *
 * @return {!ModuleRewriter}
 */
ModuleRewriter.prototype._bindPipeline = function () {
  var self = this;

  if (typeof this._helperRewriter === 'undefined') {
    this._moduleRewriter = through.obj(function (row, enc, next) {
      if (row.id === self._name) {
        row.source = generateModule(Object.keys(self._helpers));
      }

      this.push(row);
      next();
    });

    this._browserify.pipeline.get('emit-deps').push(this._moduleRewriter);
  }

  return this;
};

/**
 * Binds the current browserify transform events if not already bound.
 *
 * @return {!ModuleRewriter}
 */
ModuleRewriter.prototype._bindTransform = function () {
  var self = this;

  if (typeof this._onTransform === 'undefined') {
    this._onTransform = function (transform) {
      if (transform instanceof babelify) {
        transform.once('babelify', function (result) {
          var usedHelpers = result.metadata.usedHelpers || [];

          usedHelpers.forEach(function (helper) {
            self._helpers[helper] = true;
          });
        });
      }
    };

    this._browserify.on('transform', this._onTransform);
  }

  return this;
};

module.exports = ModuleRewriter;
