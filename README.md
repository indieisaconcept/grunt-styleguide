# grunt-styleguide [![build status](https://secure.travis-ci.org/indieisaconcept/grunt-styleguide.png)](http://travis-ci.org/indieisaconcept/grunt-styleguide) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/indieisaconcept/grunt-styleguide/trend.png)](https://bitdeli.com/free "Bitdeli Badge") [![Views in the last 24 hours](https://sourcegraph.com/api/repos/github.com/indieisaconcept/grunt-styleguide/counters/views-24h.png)](https://sourcegraph.com/github.com/indieisaconcept/grunt-styleguide)

[![NPM](https://nodei.co/npm/grunt-styleguide.png?downloads=true&stars=true)](https://nodei.co/npm/grunt-styleguide/)

> Universal CSS styleguide generator for grunt. Easily integrate Styledocco or KSS styleguide generation into your development workflow.

## Frameworks

[styledocco]: http://jacobrask.github.com/styledocco/
[kss-node]: https://github.com/hughsk/kss-node
[jss-styles]: https://github.com/jesseditson/jss
[extending grunt-styleguide]: /grunt-styleguide/blob/jss/docs/extending_grunt-styleguide.md

### Supported

<table>
  <tr>
    <th>Framework</th>
    <th>Preprocessor</th>
	<th>Templates</th>
  </tr><tr>
    <td><a href="http://jacobrask.github.com/styledocco/">styledocco</a></td>
    <td>Less, Sass</td>
    <td>Default template provided by styledocco is used</td>
  </tr><tr>
    <td><a href="https://github.com/hughsk/kss-node">kss-node</a></td>
    <td>Less</td>
    <td>Custom templates can be used</td>
  </tr>
</table>

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install grunt-styleguide --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-styleguide');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt-docs/blob/master/Getting-started.md
[package.json]: https://npmjs.org/doc/json.html

## The "styleguide" task

### Overview
In your project's Gruntfile, add a section named `styleguide` to the data object passed into `grunt.initConfig()`.

```
grunt.initConfig({

  styleguide: {

    options: {
      // global options
    },

    your_target: {

    	options: {
    		// task options
    	},

	    files: {
	        // files to process
	    }

    }

  }

})
```
An example configuration can be viewed [here](https://gist.github.com/3932026)

#### Options

By default **grunt-styleguide** will attempt to rationalize options for each of the styleguide frameworks supported depending upon the features available to the framework in use.

##### Defaults

<table>
  <tr>
    <th>Key</th>
    <th>Type</th>
    <th>Default</th>
	<th>Required</th>
    <th>Description</th>
  </tr><tr>
    <td>framework</td>
    <td>String, object, function (*)</td>
    <td>styledocco</td>
    <td>No</td>
    <td>Details about the styleguide framework</td>
  </tr><tr>
    <td>name</td>
    <td>String</td>
	<td>undefined</td>
    <td>No</td>
    <td>Title of the styleguide</td>
  </tr><tr>
    <td>template</td>
    <td>Object</td>
	<td>Template bundled with framework</td>
    <td>No</td>
    <td>Details of the templetes to use for rendering if supported</td>
  </tr><tr>
    <td>files</td>
    <td>Object, String, Array</td>
    <td>undefined</td>
    <td>Yes</td>
    <td>Details of the templetes to use for rendering if supported</td>
  </tr>
</table>

> \* See [extending grunt-styleguide]()

#### Framework Options

Should you wish to pass additional options which are supported by a framework then these can be passed as an options as part of the framework object.

```
styleguide: {

	dist: {

		options: {

			framework: {
				name: 'framework_name',
				options: {
					'somearg': 'somevalue',
					'someflag: true
				}
			}

		},

		files: {
			'path/to/dest': 'path/to/source'
		}

	}

}
```

#### Template Options

Depending upon the framework, it may be possible to also pass templates to use for rending a styleguide.

```
styleguide: {

	dist: {

		options: {

			template: {
				src: 'path/to/templates',
				include: ['path/of/resources/to/include']
			}

		},

		files: {
			'path/to/dest': 'path/to/source'
		}

	}

}
```

<table>
  <tr>
    <th>Key</th>
    <th>Type</th>
	<th>Required</th>
    <th>Description</th>
  </tr><tr>
    <td>src</td>
    <td>String</td>
    <td>No</td>
    <td>Location of the template to use</td>
  </tr><tr>
    <td>include</td>
    <td>String, Array</td>
    <td>No</td>
    <td>Title of the styleguide</td>
  </tr>
</table>

Depending upon the framework you wish to use example templates can be found in:

`node_modules/grunt-styleguide/templates/<framwork.name>/templates`

A generic template is provide also:

`node_modules/grunt-styleguide/templates/generic`

Copy these to a location which is part of your project and modify your gruntfile to support your individual requirements.


#### CSS Preprocessors

By default **grunt-styleguide** will determine the CSS preprocessor to use by evaluating the selected source files. This value will be passed as an option to framework and if supported will be used by it.

### Usage Examples

#### Default Options
In this example a styleguide will be generated using the default generator, `styledocco`. Guides will be created for css/scss located within the **core** and **plugins** directory and output them to the appropriate destination specified.

```
grunt.initConfig({

  styleguide: {

  	dist: {

	    files: {
	      'docs/core': 'stylesheets/sass/core/*.scss',
	      'docs/plugins': 'stylesheets/sass/plugins/*.scss'
	    }

  	}

  }

});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][].

## Release History

- 0.2.15

	- Dependencies updates ( @shinnn )
	- Move helper out of tasks directory to avoid "No tasks were registered or unregistered." warning ( @princed )
	- Config example error fixes ( @levito  )

- 0.2.14

    - Lock version of styledocco ( @jreading )

- 0.2.13

    - Relativize absolute paths
    - Rewrite findBasePath function ( @mikedingjan )
    - Update Grunt getting started docs url ( @iamblue )
    - It's Sass, not SASS ( @kaelig )

- 0.2.12

    - Cleanup release history
    - Use inherited version of LESS ( @pokornyr )
    - Small documentation typo ( @simonwjackson )

- 0.2.11 | Updated styledocco dependency (#16)
- 0.2.10 | KSS fix (#15)
- 0.2.9  | Simplify styledocco plugin

- 0.2.8

    - Updated styledocco dependencies
    - Added Stylus

- 0.2.7 | Cumulative fixes (Issues #18, #14, #11) [ sorry for the delay ]
- 0.2.6 | Minor code tweaks to resolve some user issues
- 0.2.5 | Node.js ~0.10.0 compatibility
- 0.2.4 | Pass local less path to styledocco
- 0.2.3 | Styleguide nolonger uses custom node-kss fork (includes nolonger supported for KSS beware)
- 0.2.2 | Grunt 0.4.0 support (~0.3.0 no longer supported)
- 0.2.1 | Minor bug fix

- 0.2.0

    - Revised documentation
    - Revised options structure
    - Introduced template options
    - Introduced node-kss

- 0.1.1

    - Travis support
    - Grunt compatibility tweaks

- 0.1.0 | Initial Release
