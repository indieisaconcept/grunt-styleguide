/*jshint node:true*/
/*
 * styleguide
 * https://github.com/indieisaconcept/grunt-styleguide/tasks/lib/kss
 *
 * Copyright (c) 2012 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

module.exports = {

    init: function (grunt) {

        'use strict';

        var kss = require('kss'),
            path = require('path'),
            base = path.dirname(require.resolve('kss')),
            wrench = require('wrench');

        return function (styleguide, done) {

            var files = styleguide.files,
                options = styleguide.options,

                // template defaults
                template = styleguide.template,
                kssTemplate = base + '/lib/template',
                defaultTemplate = path.resolve(__dirname + '../../../templates/kss'),
                missingTemplate = template.src ? false : !grunt.file.exists(defaultTemplate),

                argv = {},
                msg = [];

            // TEMPLATE SYNC - COPY KSS TEMPLATE TO STYLEGUIDE ROOT
            if (missingTemplate) {
                grunt.file.mkdir(defaultTemplate);
                wrench.copyDirSyncRecursive(base + '/lib/template', defaultTemplate);
            }

            // set preprocessor options
            if (/(css|less)/.test(styleguide.preprocessor)) {
                argv[styleguide.preprocessor] = grunt.file.isPathAbsolute(files.file.src) ? files.file.src : files.src[0];
            }

            options.templateDirectory = template.src.length !== 0 && template.src || defaultTemplate;
            options.sourceDirectory = files.base;
            options.destinationDirectory = files.dest;

            if (options.templateDirectory === defaultTemplate) {
                grunt.log.write('- Default KSS template in use ' + grunt.util.linefeed);
                grunt.log.write('- ' + defaultTemplate + grunt.util.linefeed);
                grunt.log.write('- Copy this to your project and update your gruntfile config should you wish to customise.' + grunt.util.linefeed + grunt.util.linefeed);
            }

            // if we dont have a template generate one
            // and then let the user know

            grunt.file.mkdir(files.dest);
            kss.generate(options, argv, function () {
                grunt.log.write(grunt.util.linefeed);
                done();
            });


        };

    }

};
