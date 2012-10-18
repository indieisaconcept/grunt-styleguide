'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var getEvidence = function (/* String */ framework, /* String */ preprocessor) {

  // setup default options for use by tests
  var options = {
      docs: framework + '/docs/bootstrap',
      file: '*components-buttons.html'
    },

    path = options.docs + '/' + preprocessor + '/',

    evidence = {
      actual: grunt.file.read(grunt.file.findup('tmp/' + path, options.file)),
      expected: grunt.file.read(grunt.file.findup('test/expected/' + path, options.file)),
      description: 'should generate styleguide for ${preprocessor} correctly.'.replace('${framework}', framework).replace('${preprocessor}', preprocessor)
    };

  return evidence;

};

exports.styleguide = {

  setUp: function(done) {

    // setup here if necessary
    done();

  },

  // test cases for each supported styleguide framework
  framework: {

    styledocco: {

      sass: function(test) {

        var evidence = getEvidence('styledocco','sass');

        test.expect(1);
        test.equal(evidence.actual, evidence.expected, evidence.description);
        test.done();

      },

      less: function(test) {

        var evidence = getEvidence('styledocco','less');

        test.expect(1);
        test.equal(evidence.actual, evidence.expected, evidence.description);
        test.done();

      }  

    }

  }

};
