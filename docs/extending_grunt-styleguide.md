# Extending grunt-styleguide

**grunt-styleguide** is bundled with a default styleguide framework or frameworks to allow easy generation of styleguides. It is possible to add support for additional frameworks by passing a framework plugin via the "framework" task option.

Framework plugins should be written in the following manner.

```
module.exports = {

	init: function (grunt) {
	
		// defaults
		var framework = require('some/framework');
	
		return function (styleguide, done) {
		
			framework(options, function (result) {
			
				done(true|false);
			
			})
		
		}
	
	}

}
```

A framework plugin when initialized should return a function which supports the following argument signature.

## Defaults 

<table>
  <tr>
    <th>Argument</th><th>Type</th><th>Default</th><th>Description</th>
  </tr><tr>
    <td>styleguide</td>
    <td>Object</td>
    <td>{}</td>
    <td>Styleguide framework options</td>
  </tr></tr>
    <td>done</td><td>Function</td>
    <td>this.asnyc()</td>
    <td>Pass the async task handler grunt provides to the framework plugin</td>
  </tr>
</table>

### styleguide object

<table>
  <tr>
    <th>Argument</th><th>Type</th><th>Default</th><th>Description</th>
  </tr><tr>
    <td>name</td>
    <td>String</td>
    <td>'Styleguide'</td>
    <td>Styleguide name </td>
  </tr><tr>
    <td>preprocessor</td><td>String</td><td>
    	undefined
    </td>
    <td>CSS preprocessor to use if needed</td>
  </tr><tr>
    <td>options</td>
    <td>Object</td>
    <td>{}</td>
    <td>Styleguide framework options</td>
  </tr><tr>
    <td>files</td><td>Object</td><td>
    	{}
    </td>
    <td>Rationalized object containing, file, src, dest and base keys which detail file specific items.</td>
  </tr>
</table>

**grunt-styleguide** will pass a rationalize `files` object describing the files you wish to process. These values should be mapped to the equivalent arguments provided by the framework.

### Usage Example
Guides will be created for css/scss located within the **core** and **plugins** directory and output them to the appropriate destination specified.

The framework to use is explictly stated as either a name or function.

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