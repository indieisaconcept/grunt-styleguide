/*
 * styleguide
 * https://github.com/indieisaconcept/grunt-styleguide/tasks/lib/styledocco
 *
 * Copyright (c) 2012 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

'use strict';

module.exports = {

    init: function (grunt) {

        var kss = require('kss'),
            path = require('path'),
            base = path.dirname(require.resolve('kss')),
            wrench = require('wrench'),
            tempDir = 'tmp/styleguide/template/kss';

        return function (styleguide, done) {

            var files = styleguide.files,
                options = styleguide.options,
                template = styleguide.template,
                missingTemplate = false,
                defaultTemplate = base + '/lib/template',
                argv = {},
                msg = [];

            // set preprocessor options
            if (/(css|less)/.test(styleguide.preprocessor)) {
                argv[styleguide.preprocessor] = grunt.file.isPathAbsolute(files.file.src) ? files.file.src : files.src[0];
            }

            options.templateDirectory = template.src.length !== 0 && template.src || defaultTemplate;
            options.sourceDirectory = files.base;
            options.destinationDirectory = files.dest;

            missingTemplate = !(options.templateDirectory && grunt.file.exists(options.templateDirectory) || false);

            if (options.templateDirectory === defaultTemplate) {
                grunt.log.write('Default KSS template in use ' + defaultTemplate + grunt.util.linefeed + grunt.util.linefeed);
            }

            // if we dont have a template generate one
            // and then let the user know
            if (missingTemplate) {

                grunt.file.mkdir(tempDir);
                wrench.copyDirSyncRecursive(base + '/lib/template', tempDir);

                msg = 'A set of templates have been generated in ' + tempDir + '. Copy them to a suitable directory and update "template.src" in your gruntfile to continue.';
                msg = msg + grunt.util.linefeed;
                grunt.fail.warn(msg);

            } else {

                grunt.file.mkdir(files.dest);
                kss.generate(options, argv, function () {
                    grunt.log.write(grunt.util.linefeed);
                    done();
                });

            }

        };

    }

};
