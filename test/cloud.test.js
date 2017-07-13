'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var _ = require('lodash');
var assert = require('yeoman-assert');
var test = require('yeoman-test');
var files = require('./cloud.files');
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

describe('outrigger-drupal:cloud', function() {
  var appDir = path.join(os.tmpdir(), './temp-test-cloud');
  console.log('Cloud tests will be generated in "' + appDir + '"');

  describe('minimal configuration', function() {
    before(function(done) {
      test.run(path.join(__dirname, '../generators/cloud'))
        .inDir(appDir)
        .withPrompts({
          projectName: 'drupal8',
          drupalDistroVersion: '8.x',
          hosting: 'outrigger',
          webserver: 'apache',
          cacheInternal: 'database',
          proxyCache: 'none',
          mail: 'none',
          environments: [],
          domain: 'drupal8',
          gitRepoUrl: "git@bitbucket.org:phase2tech/drupal8.git",
          flowdockApiKey: ""
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
      test.run(path.join(__dirname, '../generators/cloud'))
        .inDir(appDir)
        .withPrompts({
          projectName: 'drupal8',
          drupalDistroVersion: '8.x',
          hosting: 'outrigger',
          webserver: 'apache',
          cacheInternal: 'memcache',
          proxyCache: 'varnish',
          mail: 'mailhog',
          environments: [ 'dev', 'qa', 'review' ],
          domain: 'drupal8',
          gitRepoUrl: "git@bitbucket.org:phase2tech/drupal8.git",
          flowdockApiKey: ""
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
