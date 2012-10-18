/*
 * Styleguide
 * https://github.com/indieisaconcept/grunt-styleguide
 *
 * Copyright (c) 2012 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // ==================================
    // DEFAULTS
    // ==================================

    var fs = require('fs'),
        path = require('path'),
        helpers = require('grunt-lib-contrib').init(grunt),
        plugin = {};

    // TODO: ditch this when grunt v0.4 is released
    grunt.file.exists = grunt.file.exists || fs.existsSync || path.existsSync;

    // TODO: ditch this when grunt v0.4 is released
    grunt.util = grunt.util || grunt.utils;

    // ==================================
    // PLUGIN DEFAULTS
    // ==================================

    plugin = {

        preprocessors: {
            'sass': 'scss sass'
        },

        util: {

            // processor
            // Determine the CSS processor to use based on an array of files
            getPreprocessor: function(/* Array */ files) {

                var _ = grunt.util._,
                    extensions = [],
                    preprocessor;

                // collect all the possible extensions
                files.forEach(function (/* string */ file, /* number */ index) {

                    var ext = path.extname(file).split('.');

                    ext = ext[ext.length - 1];

                    if (ext.length > 0) {
                        extensions.push(ext);
                    }

                });

                // remove duplicates
                extensions = _.uniq(extensions);

                preprocessor = _.find(Object.keys(plugin.preprocessors), function (/* String */ key, /* number */ index) {

                    var value = plugin.preprocessors[key],
                        exts = value.split(/[,\s]+/),
                        matches = _.filter(extensions, function (/* String */ ext) {
                            return exts.indexOf(ext) !== -1;
                        });

                    return !_.isEmpty(matches);

                });

                return preprocessor;

            }

        }

    };

    // ==================================
    // TASK
    // ==================================

    grunt.registerMultiTask('styleguide', 'Generate CSS styleguides', function() {

        grunt.log.write(grunt.util.linefeed);

        var options = this.options && this.options() || helpers.options(this), // TODO: ditch this when grunt v0.4 is released
            framework = options.framework || 'styledocco',
            done = this.async();

        // initialize the framework
        framework = grunt.util._.isFunction(framework) ? framework : require('./lib/' + framework);
        framework = framework.init(grunt),

        // TODO: ditch this when grunt v0.4 is released
        this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

        grunt.verbose.writeflags(options, 'options');

        grunt.util.async.forEachSeries(this.files, function(file, next) {

            var files = grunt.file.expandFiles(file.src),

                styleguide = {

                    options: options,

                    files: {
                        file: file,
                        src: files.length > 0 && files || grunt.file.exists(file.src) && file.src,
                        dest: file.dest,
                        base: helpers.findBasePath(files)
                    }

                };

            // identify the preporcess to use
            styleguide.preprocessor = plugin.util.getPreprocessor(styleguide.files.src);

            if(grunt.util._.isEmpty(styleguide.files.src)) {
                grunt.fail.warn('Unable to generate styleguide; no valid source files were found.');
            }

            // framework:
            // All registered styleguides frameworks when initialized should return a function
            // which has the following argument signature.
            //
            // options:   configuration options for the styleguide framework
            // callback:  function to support async execution
            //
            //    framework({
            //
            //      preprocessor: 'less',
            //
            //      options: {
            //          // framework options
            //      },
            //
            //      files: {
            //          file: file
            //          src: ['path/to/files'],
            //          dest: ['path/to/destination'],
            //          base: ['base/path']
            //      }
            //
            //    }, function () {
            //
            //      // execute some command
            //      next()
            //
            //    });
            //

            framework(styleguide, function(error, result) {

                var msg = 'DEST: ' + styleguide.files.dest + '/index.html';

                if(!error) {
                    grunt.log.ok(msg);
                    next();
                } else {
                    grunt.log.error(error);
                    grunt.fail.warn('Styleguide generation failed');
                }

            });

        }, function() {
            done();
        });

    });

};
