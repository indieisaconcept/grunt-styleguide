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
        plugin = {},
        _;

    // TODO: ditch this when grunt v0.4 is released
    grunt.file.exists = grunt.file.exists || fs.existsSync || path.existsSync;
    grunt.util = grunt.util || grunt.utils;

    _ = grunt.util._,

    // ==================================
    // PLUGIN DEFAULTS
    // ==================================

    plugin = {

        preprocessors: {
            'sass': 'scss sass',
            'less': 'less'
        },

        util: {

            get: {

                // framework
                framework: function (/* String */ name) {

                    var framework;

                    try {
                        framework = require('./lib/' + name);
                        framework = framework.init(grunt);
                    } catch(err) {
                        grunt.fail.warn('Unsupported styleguide framework, see https://github.com/indieisaconcept/grunt-styleguide');
                    }

                    return framework;

                },

                // processor
                // Determine the CSS processor to use based on an array of files
                preprocessor: function(/* Array */ files) {

                    var preprocessor;

                    if (_.isEmpty(files)) {
                        return preprocessor;
                    }

                    // collect all the possible extensions
                    // and remove duplicates
                    files = _.chain(files).map(function (/* string */ file) {

                        var ext = path.extname(file).split('.');

                        return ext[ext.length - 1];

                    }).uniq().value();

                    preprocessor = _.find(Object.keys(plugin.preprocessors), function (/* String */ key) {

                        var value = plugin.preprocessors[key],
                            exts = value.split(/[,\s]+/),

                            matches = _.filter(files, function (/* String */ ext) {
                                return exts.indexOf(ext) !== -1;
                            });

                        return !_.isEmpty(matches);

                    });

                    return preprocessor;

                }

            }

        }

    };

    // ==================================
    // TASK
    // ==================================

    grunt.registerMultiTask('styleguide', 'Generate CSS styleguides', function() {

        grunt.log.write(grunt.util.linefeed);

        var styleguide = this.options && this.options() || helpers.options(this), // TODO: ditch this when grunt v0.4 is released
            done = this.async(),
            generator,
            framework;

        framework = styleguide.framework || {
            name: 'styledocco'
        };

        // initialize the framework passed
        generator = grunt.util._.isFunction(framework) ? framework : plugin.util.get.framework(framework.name);

        // rationalize templates object and add backwards
        // compatibility for options.include

        styleguide.template = styleguide.template || {};
        styleguide.template.include = styleguide.template.include || styleguide.include || [];

        // expand files for includes and template sources
        ['src', 'include'].forEach(function (/* String */ key) {
            if (styleguide.template[key]) {
                styleguide.template[key] = grunt.file.expandFiles(styleguide.template[key]);
            } else {
                styleguide.template[key] = [];
            }
        });

        // rationalized framework options
        styleguide.options = framework.options || {};

        // TODO: ditch this when grunt v0.4 is released
        this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

        grunt.verbose.writeflags(styleguide, 'options');

        grunt.util.async.forEachSeries(this.files, function(file, next) {

            var files = grunt.file.expandFiles(file.src);

            // rationalize file object

            styleguide.files = {

                file: file,
                src: files.length > 0 && files || grunt.file.exists(file.src) && file.src,
                dest: file.dest,
                base: helpers.findBasePath(files)

            };

            // identify the preporcess to use
            styleguide.preprocessor = plugin.util.get.preprocessor(files);

            if(grunt.util._.isEmpty(styleguide.files.src)) {
                grunt.fail.warn('Unable to generate styleguide; no valid source files were found.');
            }

            generator(styleguide, function(error) {

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
