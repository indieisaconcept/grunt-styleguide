'use stict';

var path = require('path');

module.exports = {

    init: function(grunt) {

        var helper = {};

        // note grunt-lib-contrib has been deprecated. Since this is the only method in use,
        // it has just been ported over from version 0.6.1.
        // http://github.com/gruntjs/grunt-lib-contrib

        helper.optsToArgs = function(options) {

            var args = [];

            Object.keys(options).forEach(function(flag) {
                var val = options[flag];

                flag = flag.replace(/[A-Z]/g, function(match) {
                    return '-' + match.toLowerCase();
                });

                if (val === true) {
                    args.push('--' + flag);
                }

                if (grunt.util._.isString(val)) {
                    args.push('--' + flag, val);
                }

                if (grunt.util._.isNumber(val)) {
                    args.push('--' + flag, '' + val);
                }

                if (grunt.util._.isArray(val)) {
                    val.forEach(function(arrVal) {
                        args.push('--' + flag, arrVal);
                    });
                }
            });

            return args;

        };

        // ==========================================================================================
        // findBasePath override (original not working when folders in a tree have the same name)
        // ==========================================================================================

        helper.findBasePath = function( /* Array */ paths) {

            if (typeof paths === 'string' && paths.length >= 1) {
                return grunt.util._(path.normalize(paths)).trim(path.sep);
            }

            paths = grunt.util._.map(paths, function(file) {
                var sections = [];
                while ((file = path.dirname(file)) !== '.') {
                    sections.push(file);
                }
                return sections;
            });

            paths = grunt.util._.intersection.apply(this, paths);
            return paths[0] || '';

        };

        // Return the new helper!
        return helper;

    }

};
