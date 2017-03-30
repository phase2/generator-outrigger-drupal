'use strict';

var assert = require('yeoman-assert');
var _ = require('lodash');

describe('Library Unit Tests', function() {

  describe('util.dockerComposeLink', function() {
    it('should provide 6 spaces of indentation', function() {
      var link = require('../generators/lib/util').dockerComposeLink('test');
      // 6 spaces plus 1 newline.
      assert.equal(_.split(link, '-')[0].length, 7, 'A docker-compose link should be indented 6 spaces.');
    });
  });

  describe('util.createSemVerFromSimpleRange', function() {
    var create;
    before(function() {
      create = require('../generators/lib/util').createVersionFromRange;
    });

    it('should expand a single-digit version range', function() {
      assert.equal(create('^8'), '8.0.0', 'A single digit major version should convert to X.0.0 release.');
    });
    it('should expand a 2-digit version range', function() {
      assert.equal(create('~8.1'), '8.1.0', 'A double digit version should convert to X.Y.0 release.');
    });
    it('should expand a 3-digit version range', function() {
      assert.equal(create('>=8.1.0'), '8.1.0', 'Convert a numeric version directly without range modifiers.');
    });
    it('should discard ".x" range indicators', function() {
      assert.equal(create('8.1.x'), '8.1.0', 'Convert the "x" of a range to a 0.');
    });
  });

  describe('docker.normalizeVersion', function() {
    it('should remove pre-release suffix', function() {
      var version = require('../generators/lib/docker').normalizeVersion('8.3.1-beta31');
      assert.equal(version, '8.3.1', 'The normalized version does not have a pre-release suffix.');
    });
  });

});
