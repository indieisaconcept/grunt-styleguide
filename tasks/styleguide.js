/*
 * Styleguide
 * https://github.com/indieisaconcept/grunt-styleguide
 *
 * Copyright (c) 2012 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

    'use strict';

    // ==================================
    // DEFAULTS
    // ==================================

    var fs = require('fs'),
        path = require('path'),
        helper = require('./helper').init(grunt),
        plugin = {},
        _ = grunt.util._;
        
    // ==================================
    // PLUGIN DEFAULTS
    // ==================================

    plugin = {

        preprocessors: {
            'sass': 'scss sass',
            'less': 'less',
            'stylus': 'styl style',
            'css': 'css'
        },

        util: {

            // Based on handy compile function in
            // https://github.com/gruntjs/grunt-contrib-compass/blob/master/tasks/compass.js#

            compile: function(args, options, cb) {

                args = !_.isArray(args) ? [args] : args;
                args = options && args.concat(helper.optsToArgs(options)) || args;

                var child = grunt.util.spawn({
                    cmd:"node",
                    args:args
                }, function (error, result, code) {
                    cb(error);
                });

                child.stdout.pipe(process.stdout);
                child.stderr.pipe(process.stderr);

            },

            get: {

                paths: function (/* Array, Object */ collection, /* String */ base) {

                    var resources = {};

                    if (_.isObject(collection) && !_.isArray(collection)) {
                        return collection;
                    }

                    collection.forEach(function (/* String */ item) {

                        if (grunt.file.exists(item)) {

                            var extension = path.extname(item).replace('.', ''),
                                location = path.relative(base, item);

                            location = location + '?v=' + fs.statSync(item).mtime.getTime();

                            resources[extension] = resources[extension] || [];
                            resources[extension].push({
                                url: location,
                                path: item
                            });

                        }

                    });

                    return resources;

                },

                // framework
                framework: function (/* String */ name) {

                    var framework;

                    try {
                        framework = require('./lib/' + name);
                        framework = framework.init(grunt);
                    } catch(err) {
                        grunt.fail.warn(err + '\n' + 'See https://github.com/indieisaconcept/grunt-styleguide');
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

        var styleguide = this.options(),
            async = grunt.util.async,
            done = this.async(),
            generator,
            framework,
            files = this.files;

        framework = styleguide.framework || {
            name: 'styledocco'
        };

        // initialize the framework passed
        generator = grunt.util._.isFunction(framework) ? framework : plugin.util.get.framework(framework.name);

        async.series({

            template: function (callback) {

                var resources = {};

                // rationalize templates object and add backwards
                // compatibility for options.include

                styleguide.template = styleguide.template || {};
                styleguide.template.include = styleguide.template.include || styleguide.include || [];

                // expand files for includes and template sources
                ['src', 'include'].forEach(function (/* String */ key) {

                    var pathExists = false,
                        filePath = styleguide.template[key];

                    if (filePath) {

                        filePath = (!_.isArray(filePath) ? [filePath] : filePath).filter(function (/* String */ file) {
                            return _.isString(file) && grunt.file.exists(file);
                        });

                        styleguide.template[key] = _.isEmpty(filePath) ? [] : grunt.file.expand(filePath);

                    } else {
                        styleguide.template[key] = [];
                    }

                });

                callback();

            },

            styleguide: function (callback) {

                var template = styleguide.template;

                // rationalized framework options
                styleguide.options = framework.options || {};

                grunt.verbose.writeflags(styleguide, 'options');

                async.forEachSeries(files, function(file, next) {

                    var files = file.src.length && file.src || file.orig.src;

                    // normalize file paths if located outside
                    // of pwd

                    files = files.map(function (file) {
                        return grunt.file.isPathInCwd(file) ? file : path.relative(process.cwd(), file);
                    });

                    // rationalize file object

                    styleguide.files = {

                        file: file,
                        src: files.length > 0 && files,
                        dest: file.dest,
                        base: helper.findBasePath(files) || './'

                    };

                    // make include paths relative
                    template.include = plugin.util.get.paths(template.include, file.dest);

                    // identify the preprocessor to use
                    styleguide.preprocessor = plugin.util.get.preprocessor(files);

                    if(_.isEmpty(styleguide.files.src)) {
                        grunt.fail.warn('Unable to generate styleguide; no valid source files were found.');
                    }

                    generator(styleguide, plugin.util.compile, function(error) {

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
                    callback();
                });

            }

        }, function () {
            done();
        });

    });

};
