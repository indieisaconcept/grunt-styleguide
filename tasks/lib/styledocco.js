/*
 * styleguide
 * https://github.com/indieisaconcept/grunt-styleguide/tasks/lib/styledocco
 *
 * Copyright (c) 2012 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    styledocco = path.dirname(require.resolve('styledocco')),
    depBase = path.dirname(styledocco);

module.exports = {

    init: function (grunt) {

        var processors = {
                'sass': 'sass --compass',
                'less': depBase + '/.bin/lessc',
                'stylus': depBase + '/.bin/stylus'
            },

            _ = grunt.util._,

            args = [styledocco + '/bin/styledocco'];

        return function (styleguide, compile, done) {

            var files = styleguide.files,
                options = styleguide.framework && styleguide.framework.options || {},
                preprocessor = !options.preprocessor ? styleguide.preprocessor && processors[styleguide.preprocessor] : options.preprocessor;

            // default styledocco options
            options.name = styleguide.name;
            options.out = files.dest;

            options.include = _.chain(styleguide.template.include).map(function (/* Object */ item) {
                return _.pluck(item, 'path');
            }).flatten().value();

            // specify processor if needed
            if (preprocessor) {
                options.preprocessor = preprocessor;
            }

            compile(args.concat([files.base]), options, done);

        };

    }

};
