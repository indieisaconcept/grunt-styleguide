# grunt-styleguide

> Universal styleguide generator

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```
npm install grunt-styleguide --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```
grunt.loadNpmTasks('grunt-styleguide');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html

## The "styleguide" task

### Overview
In your project's Gruntfile, add a section named `styleguide` to the data object passed into `grunt.initConfig()`.

```
grunt.initConfig({

  styleguide: {
  
    // Task-specific options go here.
    options: {
      framework: 'styledocco'
    },
    
    your_target: {
    	
    	// Target-specific options go here.
	    options: {
	        name: 'Style Guide',
	        preprocessor: 'sass --compass',
	        include: ['plugin.css', 'app.js']
	    },
	
	    files: {
	        'docs': 'stylesheets/sass/*.scss'                  
	    }
      
    }
    
  }
  
})
```

#### Options

**grunt-styleguide** supports two levels of options, "task" which apply to all targets and those that can also be overriden on a target by target basis which are options specific to the styleguide framework in use.

#### Task Defaults

<table>
  <tr>
    <th>Key</th><th>Type</th><th>Default</th><th>Description</th>
  </tr>
  <tr>
    <td>framework</td><td>String or function (*)</td><td>styledocco</td><td>Used to specify which framework to use for the styleguide generation</td>
  </tr>
</table>

> \* See extending grunt-styleguide 

#### Framework Options
Framework options are used to pass the appropriate arguments to a styleguide generator. These options have a 1:1 mapping to the frameworks available options.

Future versions of **grunt-styleguide** will rationalize these options for all frameworks.

##### Currently Supported

[styledocco]: http://jacobrask.github.com/styledocco/
[node-kss]: https://github.com/hughsk/kss-node
[kss]: http://warpspire.com/kss/
[kss-standalone]: https://github.com/tmanderson/kss-standalone

##### styledocco

<table>
  <tr>
    <th>Key</th><th>Type</th><th>Default</th><th>Description</th>
  </tr>
  <tr>
    <td>name</td><td>String</td><td>package.json name || 'Styleguide'</td><td>Name to use for the styleguide</td>
  </tr><tr>
    <td>preprocessor</td><td>String</td><td>N/A</td><td>Specify the CSS preprocess to use for styleguide generation</td>
  </tr></tr><tr>
    <td>include</td><td>Array</td><td>N/A</td><td>Additional CSS/JS to incluce in the generated styleguide output</td>
  </tr>
</table>

For more details on the supported options for **styledocco** can be found [styledocco][].

##### Planned

- [node-kss][] (v0.2.0)
- [kss][] via [kss-standalone][] (v0.2.0)

#### Extending grunt-styleguide

**grunt-styleguide** is bundled with a default styleguide framework or frameworks to allow easy generation of styleguides. It is possible to add support for additional frameworks by passing a framework plugin via the "framework" task option.

Framework plugins should be written in the following manner.

```
module.exports = {

	init: function (grunt) {
	
		// defaults
		var framework = require('some/framework');
	
		return function (options, callback) {
		
			framework(options, function () {
			
				callback();
			
			})
		
		}
	
	}

}
```

A framework plugin when initialized should return a function which supports the following argument signature.

<table>
  <tr>
    <th>Argument</th><th>Type</th><th>Default</th><th>Description</th>
  </tr>
  <tr>
    <td>files</td><td>Object</td><td>
    	{}
    </td>
    <td>Rationalized object containing, src, dest and base keys which detail file specific items.</td>
  </tr><tr>
    <td>options</td>
    <td>Object</td>
    <td>{}</td>
    <td>Styleguide framework options</td>
  </tr></tr><tr>
    <td>callback</td><td>Function</td>
    <td>this.asnyc()</td>
    <td>Pass the async task handler grunt provides to the styleguide framework plugin</td>
  </tr>
</table>

**grunt-styleguide** will pass a rationalize and `files` object describinthe files you wish to process. These values should be mapped to the equivalent provided by the framework.

### Usage Examples

#### Default Options
In this example a styleguide will be generated using the default generator, `styledocco`. Guides will be created for css/scss located within the **core** and **plugins** directory and output them to the appropriate destination specified.

```
grunt.initConfig({

  styleguide: {
  
  	dist: {
  	
	    files: {
	      'docs/core': 'stylesheets/sass/core/*.scss',    
	      'docs/plugins': 'stylesheets/sass/plugins/*.scss',
	    }  	
  	
  	}
 
  }
  
});
```

#### External grunt-styleguide Plugin

This example is similiar to the above except that the framework to use is explictly stated as either a name or function to be used.

```
grunt.initConfig({

  styleguide: {
  	
  	// global framework override
  	options: {
  		framework: 'someother-framework'
  	}
  
  	dist: {
  	
	    files: {
	      'docs/core': 'stylesheets/sass/core/*.scss',    
	      'docs/plugins': 'stylesheets/sass/plugins/*.scss',
	    }  	
  	
  	}
  	
  	dist: {
  		
  		// target based framework override
  		options: {
  			framework: require('someother-framework')
  		},
  	
	    files: {
	      'docs/core': 'stylesheets/sass/core/*.scss',    
	      'docs/plugins': 'stylesheets/sass/plugins/*.scss',
	    }  	
  	
  	}  	
 
  }
  
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][].

## Release History

### 0.1.0

+ Initial Release
