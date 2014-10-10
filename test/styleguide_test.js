'use strict';

var grunt  = require('grunt'),
    helper = require('../tasks/helper').init(grunt),

  getEvidence = function( /* String */ framework, /* String */ preprocessor, /* String */
    base, /* String */ file) {

    // setup default options for use by tests
    var options = {
        docs: framework + (base || '/docs/bootstrap/') + preprocessor,
        file: file || '*components-buttons.html'
      },

      path = options.docs + '/' + options.file,

      // grunt.file.findup: seems to be flakey in < 4.0

      evidence = {
        actual: (grunt.file.read(grunt.file.expand('tmp/' + path)[0]).replace(
          /(\r\n|\n|\r)/gm, '').replace(/\s+/g, '')).length,
        expected: (grunt.file.read(grunt.file.expand('test/expected/' + path)[0])
          .replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, '')).length,
        description: 'should generate a ${preprocessor} styleguide.'.replace(
          '${preprocessor}', preprocessor)
      };

    return evidence;

  };

exports.styleguide = {

  setUp: function(done) {

    // setup here if necessar
    done();

  },

  // test cases for each supported styleguide framework
  framework: {

    styledocco: {

      sass: function(test) {

        var evidence = getEvidence('styledocco', 'sass');

        test.expect(1);
        test.equal(evidence.actual, evidence.expected, evidence.description);
        test.done();

      },

      less: function(test) {

        var evidence = getEvidence('styledocco', 'less');

        test.expect(1);
        test.equal(evidence.actual, evidence.expected, evidence.description);
        test.done();

      }

    },

    kss: {

      less: function(test) {

        var evidence = getEvidence('kss', 'less', '/docs/',
          'section-1.html');

        test.expect(1);
        test.equal(evidence.actual, evidence.expected, evidence.description);
        test.done();

      }

    }

  },

  helpers: {

    // note grunt-lib-contrib has been deprecated. Since this is the only method in use,
    // the test has just been ported over from version 0.6.1.
    // http://github.com/gruntjs/grunt-lib-contrib

    optsToArgs: function(test) {

      test.expect(1);

      var fixture = {
            key: 'a',
            key2: 1,
            key3: true,
            key4: false,
            key5: ['a', 'b']
          },
          expected = ['--key', 'a', '--key2', '1', '--key3', '--key5', 'a', '--key5', 'b'].toString(),
          actual   = helper.optsToArgs(fixture).toString();

      test.equal(expected, actual, 'should convert object to array of CLI arguments');
      test.done();

    }

  }

};
