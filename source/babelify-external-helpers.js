import { buildExternalHelpers } from 'babel-core';
import babelify from 'babelify';
import { obj as stream } from 'through2';

/**
 * This module always gets included with each build. It is later patched with gathered helpers.
 * 
 * @type {string}
 */
const markerModule = require.resolve('./external-helpers');

/**
 * Generates source for external helper module.
 * 
 * @param {string[]} requiredHelpers
 * @returns {string}
 */
const generatesBabelHelpersModule = (requiredHelpers) => `${buildExternalHelpers(requiredHelpers, 'var')} module.exports = babelHelpers;`;

/**
 * Wraps source code with babelHelpers injection wrapper.
 * 
 * @param {string} module
 * @param {string} source
 * @returns {string}
 */
const requireBabelHelpers = (module, source) => `(function (babelHelpers) {\n${source}\n}) (require('${module}'))`;

/**
 * Returns an array of used helpers from babelify result.
 * 
 * @param {object} result
 * @returns {string[]}
 */
const getHelpersUsed = (result) => result.metadata.usedHelpers || [];

/**
 * Default options that are merged with the plugin.
 */
const defaultOptions = {
  name: 'babelify-runtime'
};

/**
 * Listens for babelify transform results that require external helpers and emits them into the
 * provided onHelpersRequired callback.
 * 
 * @param {function} onHelpersRequired
 * @returns {function}
 */
const gatherRequiredHelpers = (onHelpersRequired) => (transform) => {
  if (transform instanceof babelify) {
    transform.once('babelify', (result, file) => {
      const usedHelpers = getHelpersUsed(result);
      
      if (usedHelpers.length > 0) {
        onHelpersRequired(file, usedHelpers)
      }
    });
  }
};

/**
 * Babel plugin entry point.
 * 
 * @param {Browserify} b
 * @param {object=} opts
 */
export default (b, opts) => {
  const options = { ...defaultOptions, ...opts },
        name = options.name;

  if (typeof name !== 'string') {
    throw new TypeError('opts.name must be a string.');
  }

  const requiredHelpers = { $keys: [] },
        modulesToWrap = {};

  const wrapModules = function(chunk, encoding, next) {
    if (modulesToWrap[chunk.file]) {
      this.push({ ...chunk, source: requireBabelHelpers(name, chunk.source) });
    } else {
      this.push(chunk);
    }

    next();
  };

  const onHelpersRequired = (file, helpers) => {
    modulesToWrap[file] = true;
    helpers.forEach((helper) => {
      if (!requiredHelpers[helper]) {
        requiredHelpers[helper] = true;
        requiredHelpers.$keys.push(helper);
      }
    });    
  };

  const writeBabelHelpers = function(chunk, encoding, next) {
    if (chunk.id === name) {
      this.push({ ...chunk, source: generatesBabelHelpersModule(requiredHelpers.$keys) });
    } else {
      this.push(chunk);
    }

    next();
  };

  b.require(markerModule, { expose: name });
  b.on('transform', gatherRequiredHelpers(onHelpersRequired));
  b.pipeline.get('deps').push(stream(wrapModules));
  b.pipeline.get('emit-deps').push(stream(writeBabelHelpers));
};
