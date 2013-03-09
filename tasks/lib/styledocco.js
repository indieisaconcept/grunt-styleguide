/*
 * styleguide
 * https://github.com/indieisaconcept/grunt-styleguide/tasks/lib/styledocco
 *
 * Copyright (c) 2012 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    base = path.dirname(path.dirname(require.resolve('styledocco')));

module.exports = {

    init: function (grunt) {

        var styledocco = require('styledocco/cli'),

            // proecessor specific arguemnts
            processors = {
                'sass': 'sass --compass',
                'less': base + '/.bin/lessc'
            },

            _ = grunt.util._;

        return function (styleguide, compile, callback) {

            var files = styleguide.files,
                options = styleguide.framework && styleguide.framework.options || {},
                preprocessor = !options.preprocessor ? styleguide.preprocessor && processors[styleguide.preprocessor] : options.preprocessor;

            // default styledocco options
            options.name = styleguide.name;
            options.in = files.src;
            options.out = files.dest;
            options.basePath = files.base;

            options.include = _.chain(styleguide.template.include).map(function (/* Object */ item) {
                return _.pluck(item, 'path');
            }).flatten().value();

            // specify processor if needed
            if (preprocessor) {
                options.preprocessor = preprocessor;
            }

            styledocco(options);

            // [JB] HACKY
            // styledocco doesn't support callbacks but always generates
            // and index.html file upon completion so we can at least monitor for the
            // creation of this.

            (function isComplete() {

                if (!grunt.file.exists(files.dest + '/index.html')) {
                  setTimeout(isComplete, 0);
                } else {
                  callback();
                }

            }());

        };

    }

};
