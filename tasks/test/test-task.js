var fs = require('fs'),
    mocha = require('gulp-mocha'),
    path = require('path'),
    RcLoader = require('rcloader'),
    util = require('util');

/**
 * Creates an exit handler.
 *
 * @param  {Number=} code
 * @return {!Function(Object)}
 */
var exit = function (code) {
  return function (error) {
    if (error) {
      console.error(error, {
        colors: true
      });
    }

    process.exit(code || 0);
  };
};

/**
 * Mocha runtime config loader.
 *
 * @param  {!String} path
 * @return {!Object}
 */
var rc = function (path) {
  var loader = new RcLoader('.mocharc');

  return loader.for(path);
};

/**
 * Register the testing task. Mocha configuration can be found in the .mocharc
 * in the root of the project.
 *
 * @param {!Gulp} gulp
 * @param {!Object} config
 */
var register = function (gulp, config) {
  var tests = path.join(config.paths.tests, '**/*-test.js'),
      mochaConfig = rc(config.paths.tests);

  gulp.task('test', function () {
    return gulp.src(tests)
      .pipe(mocha(mochaConfig))
      .once('error', exit(1));
  });
};

module.exports = register;
