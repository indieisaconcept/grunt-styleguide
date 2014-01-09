module.exports = {

    init: function(grunt) {

        var helper = require('grunt-lib-contrib').init(grunt),
            path = require('path');

        // ==========================================================================================
        // findBasePath override (original not working when folders in a tree have the same name)
        // ==========================================================================================

        helper.findBasePath = function(/* Array */ paths) {

            if(typeof paths === 'string' && paths.length >= 1) {
                return grunt.util._(path.normalize(paths)).trim(path.sep);
            }

            paths = grunt.util._.map(paths, function(file) {
                var sections = [];
                while((file = path.dirname(file)) !== '.') {
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