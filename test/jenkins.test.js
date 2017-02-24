'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var _ = require('lodash');
var assert = require('yeoman-assert');
var test = require('yeoman-test');
var files = require('./jenkins.files');
var schema = require('./schema-assert');

var describeYaml = function() {
  var items = files.yaml;

  return function() {
    Object.keys(items).forEach(function(filepath) {
      it('should have a valid "' + items[filepath] + '"', function() {
        schema.assertYaml(filepath);
      });
    });
  };
};

var describeXml = function(extended) {
  var items = files.minimumXml;
  if (extended) {
    items = _.assign(items, files.extendedXml);
  }

  return function() {
    Object.keys(items).forEach(function(filepath) {
      it('should have a valid ' + items[filepath], function() {
        schema.assertXml(filepath);
      });
    });
  };
}

describe('p2:jenkins', function() {
  var appDir = path.join(os.tmpdir(), './temp-test-jenkins');
  console.log('Jenkins tests will be generated in "' + appDir + '"');

  describe('minimal configuration', function() {
    before(function(done) {
      test.run(path.join(__dirname, '../generators/jenkins'))
        .inDir(appDir)
        .withPrompts({
          cacheInternal: 'database',
          drupalDistroVersion: '8.x',
          // This could be excluded, but would get the temp base directory.
          domain: 'drupal8',
          environments: [],
          projectName: 'drupal8',
          proxyCache: 'none',
          webserver: 'apache'
        })
        .withOptions({
          'skip-install': true,
          force: true
        })
        .on('end', done);
    });

    describe('provides have valid XML files', describeXml());
    describe('Docker', function() {
      describe('has YAML configuration', describeYaml());
    });
  });

  describe('extended configuration', function() {
    before(function(done) {
      test.run(path.join(__dirname, '../generators/jenkins'))
        .inDir(appDir)
        .withPrompts({
          drupalDistroVersion: '8.x',
          // This could be excluded, but would get the temp base directory.
          domain: 'drupal8',
          environments: [ 'dev', 'qa', 'review' ],
          projectName: 'drupal8',
        })
        .withOptions({
          'skip-install': true,
          force: true
        })
        .on('end', done);
    });

    describe('provides valid XML files', describeXml(true));

    describe('Docker', function() {
      describe('has YAML configuration', describeYaml());
    });
  });
});
