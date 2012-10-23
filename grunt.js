/*
 * Styleguide
 * https://github.com/indieisaconcept/grunt-styleguide
 *
 * Copyright (c) 2012 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        lint: {
            all: ['Gruntfile.js', 'tasks/**/*.js', '<%= nodeunit.tests %>', ],
        },

        jshint: {
            options: {
            curly: true,
            eqeqeq: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            sub: true,
            undef: true,
            boss: true,
            eqnull: true,
            node: true,
            es5: true
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            test: ['tmp', '.sass-cache']
        },

        // Configuration to be run (and then tested).
        styleguide: {

            styledocco: {

                options: {

                    framework: {
                        name: 'styledocco'
                    },

                    name: 'Style Guide',

                    template: {
                        include: ['plugin.css', 'app.js']
                    }

                },

                files: {
                    'tmp/styledocco/docs/bootstrap/less': 'test/fixtures/styledocco/docs/bootstrap/**/*.less',
                    'tmp/styledocco/docs/bootstrap/sass': 'test/fixtures/styledocco/docs/bootstrap/**/*.{scss,sass}'
                },

            },

            jss: {

                options: {

                    framework: {
                        name: 'jss'
                    },

                    name: 'Style Guide',

                    template: {

                        src: ['test/fixtures/jss/docs/templates/views/**/*'],
                        include: ['test/fixtures/jss/templates/public/**/*'],

                        // mapping for template items
                        mapping: {
                            'layout': 'layouts_default',
                            'styleguide': 'partials_styleguide_block'
                        }

                    }

                },

                files: {
                    'tmp/jss/docs/css': 'test/fixtures/jss/docs/templates/public/**/*.css',
                },

            },

            kss: {

                options: {

                    framework: {
                        name: 'kss'
                    },

                    name: 'Style Guide',

                    template: {

                        src: 'test/ftures/kss/template',

                    }

                },

                files: {
                    'tmp/kss/docs/css': 'test/fixtures/kss/docs/**/*.less',
                },

            }

        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.renameTask('test', 'nodeunit');
    grunt.registerTask('test', 'clean styleguide nodeunit');

    // By default, lint and run all tests.
    grunt.registerTask('default', 'lint test');

};
