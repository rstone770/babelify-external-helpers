var babelify = require('babelify'),
    browserify = require('browserify'),
    expect = require('chai').expect,
    util = require('util');

describe('babel-external-helpers', function () {
  this.timeout(10000);

  /**
   * Common test fixtures.
   *
   * @type {Fixture}
   */
  var fixture = TestCommon.fixture;

  /**
   * BabelifyExternalHelpers browserify plugin.
   *
   * @return {Function}
   */
  var plugin = TestCommon.require('index.js');

  /**
   * Asserts that a browserify bundler produces expected result.
   *
   * @param  {!String} expected
   * @param  {!Function}   bundler  [description]
   * @param  {?Function} done     [description]
   */
  var assertBundlerProduces = function (expected, bundler, done) {
    bundler.bundle(function (error, buffer) {
      expect(error).to.equal(null);
      expect(buffer.toString()).to.equal(expected);

      if (done) {
        done();
      }
    });
  };

  /**
   * Creates a configured browserify bundler.
   *
   * @param  {!String} file
   * @param  {Array=} presets
   * @param  {Array=} plugins
   * @return {!Browserify}
   */
  var createBundler = function (file, presets, plugins) {
    return browserify(file)
      .transform(babelify, {
        presets: presets || [],
        plugins: plugins || []
      });
  };

  /**
   * Creates an idealy configured browserify bundler.
   *
   * @param  {!String} file
   * @return {!Browserify}
   */
  var createIdealBundler = function (file) {
    return createBundler(file, ['es2015'], ['external-helpers-2']);
  };

  it('should include external helpers as a module within the bundle.', function (done) {
    var source = fixture.path('source/defaults/foo.es6'),
        expected = fixture.read('bin/defaults'),
        bundler = createIdealBundler(source).plugin(plugin);

    assertBundlerProduces(expected, bundler, done);
  });

  it('should name the helper module based on name option.', function (done) {
    var source = fixture.path('source/named.es6'),
        expected = fixture.read('bin/named'),
        bundler = createIdealBundler(source).plugin(plugin, {name: 'mittens'});

    assertBundlerProduces(expected, bundler, done);
  });

  it('should not overwrite defined babelHelpers.', function (done) {
    var source = fixture.path('source/defined.es6'),
        expected = fixture.read('bin/defined'),
        bundler = createIdealBundler(source).plugin(plugin);

    assertBundlerProduces(expected, bundler, done);
  });
});
