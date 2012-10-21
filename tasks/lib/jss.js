/*
 * styleguide
 * https://github.com/indieisaconcept/grunt-styleguide/tasks/lib/styledocco
 *
 * Copyright (c) 2012 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

'use strict';

module.exports = {

    init: function(grunt) {

        var helpers = require('grunt-lib-contrib').init(grunt),
            jss = require('jss-styles'),
            Mustache = require('mustache'),
            fs = require('fs'),
            path = require('path'),

            cache = {},

            _ = grunt.util._;

        return function(styleguide, done) {

            var files = styleguide.files,
                options = styleguide.options,
                sections = [];

            grunt.util.async.series({

                templates: function(callback) {

                    if(!cache.templates) {

                        cache.templates = {};

                        var files = grunt.file.expandFiles(options.template.src),
                            base = helpers.findBasePath(files);

                        grunt.util.async.forEachSeries(files, function(file, next) {

                            var filename = path.basename(file),
                                content = grunt.file.read(file),
                                namespace;

                            // setup template namespaces
                            namespace = path.dirname(file.replace(base + '/', '')).replace(/\./g, '');
                            namespace = namespace + (namespace.length > 0 ? '/' : '') + filename.replace(path.extname(filename), '');
                            namespace = namespace.split('/').join('_');

                            cache.templates[namespace] = content;

                            next();

                        }, function() {
                            callback();
                        });

                    } else {
                        callback();
                    }

                },

                files: function(callback) {

                    grunt.util.async.forEachSeries(files.src, function(file, next) {

                        jss.Parser.file(file, function( /* String */ filename, /* String */ block) {

                            if(filename && block) {

                                var baseName = path.basename(filename),
                                    section = new jss.Section(block, baseName);

                                sections.push({
                                    name: section.section(),
                                    detail: section
                                });

                            }

                            next();

                        });

                    }, function() {
                        callback();
                    });

                },

                styleguide: function(callback) {

                    var templates = cache.templates,
                        layout = templates.layouts_default,

                        // used for including external resources
                        includes = grunt.file.expandFiles(options.template.include),
                        dest = path.resolve(files.dest),
                        resources = {};

                    grunt.util.async.forEachSeries(includes, function(include, next) {

                        var extension = path.extname(include).replace('.', ''),
                            location = path.relative(dest, include);

                        resources[extension] = resources[extension] || [];
                        resources[extension].push(location + '?v=' + fs.statSync(include).mtime.getTime());

                        next();

                    }, function () {

                        var styleguide,
                            view;

                        view = {

                            styleguide: {

                                name: options.name,
                                sections: sections,
                                includes: resources,

                                helper: {

                                    'generate': function() {

                                        // based on https://github.com/jesseditson/jss/blob/master/example/app.js#L69-106

                                        return function(/* String */ text) {

                                            var lines = text.split('\n'),

                                                sectionNum = _.trim(lines.splice(0, 1)),
                                                example = lines.join('\n'),
                                                section,
                                                modifiers,
                                                data;

                                            section = _.filter(sections, function (section) {
                                                return section.name === sectionNum;
                                            })[0].detail;

                                            modifiers = section.modifiers();

                                            data = {

                                                styleguide: {

                                                    section: {

                                                        'name': section.section(),
                                                        'filename': section.filename,
                                                        'description': section.description(),
                                                        'modifiers': modifiers,
                                                        'example': example,

                                                    },

                                                    helper: {

                                                        'modifiers': function() {

                                                            return function(/* String */ text) {

                                                                var lines = text.split('\n'),
                                                                    args = lines.splice(0, 1).toString().split(',').map(function (/* String */ item) {
                                                                        return _.trim(item);
                                                                    }),
                                                                    body = lines.join('\n'),
                                                                    out = '';

                                                                _.forEach(modifiers, function (/* String */ modifier) {

                                                                    var html = example.split(args[0]).join(modifier[args[1]]());

                                                                    out += Mustache.render(body, {
                                                                        'example': html,
                                                                        'name': modifier.name
                                                                    });

                                                                });

                                                                return out;
                                                            };

                                                        }

                                                    }

                                                }

                                            };

                                            return Mustache.render(templates.partials_styleguide_block, data);

                                        };
                                    }

                                }
                            }
                        };

                        // render blocks
                        styleguide = Mustache.render(layout, view, templates);
                        callback(styleguide);

                    });

                }

            }, function(/* Object */ styleguide) {

                grunt.file.write(files.dest + '/index.html', styleguide);
                done();

            });

        };

    }

};
