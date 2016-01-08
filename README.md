# External Babel Helper Packager [![Build Status](https://travis-ci.org/rstone770/babelify-external-helpers.svg?branch=master)](https://travis-ci.org/rstone770/babelify-external-helpers)

A [Browserify](http://browserify.org/) plugin that when used in conjunction with [Babelify](https://github.com/babel/babelify) will package and include babel runtime helpers in your bundle.

### What?

When building [Babel](https://github.com/babel/babel) projects so that they are compatible with current javascript standards, babel will have to fill in missing features and or add supporting functionality into your code as it is being transpiled. By default, babel will just inline. The issue arises when using Browserify to build a project with multiple files. As each file is transpiled, helper and feature code is continuously inlined. This leads to enormous amount of duplication.

If only there was a way to factor out the duplications... Luckily you can opt to use the [external-helpers-2](https://github.com/babel/babel/tree/master/packages/babel-plugin-external-helpers) plugin. This plugin will replace all helpers with a reference to a babelHelpers namespace. While this is better for duplication, we now have other issues. We must now find a way to resolve the new babelHelpers references in our code. A possible and obvious solution would be to concat the babelHelpers to the end of the bundle and expose the babelHelpers variable globally, which isn't ideal. Another solution would be to include ```babel-core``` or some other library as babelHelpers in every file in your project. Again, this isn't ideal.

This plugin resolves these issues by creating a helper module that gets bundled along with the rest of your project. All bundle helper references are then directed to this module with internal requires. This removes the need for concats, globals, shims, ect... It just works and works transparently.

## Installation
```bash
npm install babelify-external-helpers babelify --save-dev
```

__NOTE__: babelify is not bundled with the plugin and must be installed.

## Usage
You can use this plugin either through the cli or directly in node.

__NOTE__: Be aware that in order for this plugin to behave correctly, you will need to install and use the ```external-helpers-2``` babel plugin. If the ```external-helpers-2``` plugin is not installed, a helper module will still be generated and written to the bundle. It is assumed that if you are using this plugin, you opted for external helpers.
### Command Line
```bash
browserify index.es6 -t [babelify --presets [es2015] --plugins [external-helpers-2] --sourceType module] -p [ babelify-external-helpers ]
```

### Programmatic
```javascript
var browserify = require('browserify'),
    babelify = require('babelify'),
    helpers = require('babelify-external-helpers');

browserify('source/index.es6')
  .transform(babelify, {
    plugins: ['external-helpers-2'],
    presets: ['es2015']
  })
  .plugin(helpers)
  .bundle();
```

## Configuration
You can configure the plugin in all the usual ways.

### Command Line
```bash
browserify ... -p [babelify-external-helpers --name helpers]
```

### Programmatic
```javascript
browserify().plugin('babel-external-helpers', {name: 'helpers'});
```

### Options
The annotated code below describes each options as well as displays its default.

```javascript
browserify().plugin('babelify-external-helpers', {

  /**
   * The name used for the generated helper module.
   *
   * @type {String}
   */
  name: 'babel/external-helpers'
});
```

## Notes
This plugin has only been tested with the ```es2015``` preset with  the ```external-helpers-2``` plugin. The other presets and plugins should work but if there are issues, please create an issue or submit a pull request.

Currently, all runtime helpers are included when bundling and will add about 6kb to the bundle when minimized and a negligible amount when gzipped.

## License
[MIT](LICENSE)
