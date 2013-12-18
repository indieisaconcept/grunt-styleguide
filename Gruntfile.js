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

        task: {

            fixtures: 'test/fixtures',
            tmp: 'tmp'

        },

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
                    '<%= task.tmp %>/styledocco/docs/bootstrap/less': '<%= task.fixtures %>/styledocco/docs/bootstrap/**/*.less',
                    '<%= task.tmp %>/styledocco/docs/bootstrap/sass': '<%= task.fixtures %>/styledocco/docs/bootstrap/**/*.{scss,sass}'
                }

            },

            kss: {

                options: {

                    framework: {
                        name: 'kss'
                    },

                    name: 'Style Guide',

                    template: {
                        src: 'kss'
                        // include: ['templates/kss/public/prettify.js'] - includes deprecated
                    }

                },

                files: {
                    '<%= task.tmp %>/kss/docs/less': '<%= task.fixtures %>/generic/docs/styles.less'
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
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', 'clean styleguide nodeunit'.split(' '));

    // By default, lint and run all tests.
    grunt.registerTask('default', 'jshint test'.split(' '));

};