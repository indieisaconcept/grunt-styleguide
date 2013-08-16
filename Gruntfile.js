/*
 * Styleguide
 * https://github.com/indieisaconcept/grunt-styleguide
 *
 * Copyright (c) 2012 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

    'use strict';

    // Project configuration.
    grunt.initConfig({

        jshint: {

            options: {
                jshintrc: '.jshintrc'
            },

            all_files: ['Gruntfile.js', 'tasks/**/*.js', '<%= nodeunit.tests %>']

        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            test: ['tmp', '.sass-cache']
        },

        release: {

            options: {
                bump: true,
                add: false,
                commit: false,
                tag: false,
                push: false,
                pushTags: false,
                npm: false
            }

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
                        include: ['templates/kss/public/prettify.js']
                    }

                },

                files: {
                    'tmp/styledocco/docs/bootstrap/less': 'test/fixtures/bootstrap/**/*.less',
                    'tmp/styledocco/docs/bootstrap/sass': 'test/fixtures/bootstrap/**/*.{scss,sass}'
                }

            },

            kss: {

                options: {

                    framework: {
                        name: 'kss'
                    },

                    name: 'Style Guide',

                    template: {
                        src: {}
                    }

                },

                files: {
                    'tmp/kss/docs/less': 'test/fixtures/bootstrap/less/main.less'
                }

            }

        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', 'clean styleguide nodeunit'.split(' '));

    // By default, lint and run all tests.
    grunt.registerTask('default', 'jshint test'.split(' '));

};