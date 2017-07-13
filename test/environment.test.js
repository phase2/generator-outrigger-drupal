'use strict';

var assert = require('yeoman-assert');
var fs = require('fs');
var os = require('os');
var path = require('path');
var test = require('yeoman-test');
var yaml = require('js-yaml');
var _ = require('lodash');

var files = require('./environment.files');
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

var describeJson = function(appDir) {
  var items = files.json;

  return function() {
    Object.keys(items).forEach(function(filepath) {
      it('should have a valid "' + items[filepath] + '"', function() {
        schema.assertJson(appDir, filepath);
      });
    });
  };
};


describe('outrigger-drupal:environment', function() {
  var appDir = path.join(os.tmpdir(), './temp-test-environment');
  console.log('Environment tests will be generated in "' + appDir + '"');

  describe.only('minimal configuration', function() {
    before(function(done) {
      test.run(path.join(__dirname, '../generators/environment'))
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
        .on('error', function(err) { console.error(err); })
        .on('end', done);
    });

    it('should have a minimal set of files', function() {
      assert.file(files.minimum);
    });

    it('should not include the extended files added with more opt-ins', function() {
      assert.noFile(files.extended);
    });

    describe('provides have valid JSON files', describeJson(appDir));

    describe('Docker', function() {
      describe('has YAML configuration', describeYaml());
      describe('Operational Services - Local', function() {
        var manifest;

        before(function() {
          manifest = yaml.safeLoad(fs.readFileSync('docker-compose.yml', 'utf8'));
        });

        it('should include a database', function() {
          assert.ok(manifest['services']['db'] && manifest['services']['db']['image']);
        });
        it('should include an application server', function() {
          assert.ok(manifest['services']['www'] && manifest['services']['www']['image']);
        });
        it('should use apache-php:php70 with Drupal 8', function() {
          assert.ok(manifest['services']['www']['image'] == 'outrigger/apache-php:php70');
        });
        it('should use mariadb:10.1 with Drupal 8', function() {
          assert.ok(manifest['services']['db']['image'] == 'outrigger/mariadb:10.1');
        });
        it('should not have a cache service', function() {
          assert.ok(!manifest['services']['cache']);
        });
        it('should not have a proxy service', function() {
          assert.ok(!manifest['services']['proxy']);
        });
        it('should not have a mail service', function() {
          assert.ok(!manifest['services']['mail']);
        });
      });
    });
  });

  describe('extended configuration', function() {
    before(function(done) {
      test.run(path.join(__dirname, '../generators/environment'))
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

    it('should include the minimal set of files', function() {
      assert.file(files.minimum);
    });

    it('should have additional files beyond minimal', function() {
      assert.file(files.extended);
    });

    describe('provides valid JSON files', describeJson(appDir));

    describe('Docker', function() {
      describe('has YAML configuration', describeYaml());
      describe('CLI Services - Local', function() {
        var manifest;

        before(function() {
          manifest = yaml.safeLoad(fs.readFileSync('build.yml', 'utf8'));
        });

        it('should use the PHP7 build container with Drupal 8', function() {
          assert.ok(manifest['services']['base']['image'] == 'outrigger/build:php70');
        });

      });
      describe('Operational Services - Local', function() {
        var manifest;

        before(function() {
          manifest = yaml.safeLoad(fs.readFileSync('docker-compose.yml', 'utf8'));
        });

        describe('Core Services', function() {
          it('should include a database', function() {
            assert.ok(manifest['services']['db'] && manifest['services']['db']['image']);
          });
          it('should include an application server', function() {
            assert.ok(manifest['services']['www'] && manifest['services']['www']['image']);
          });
          it('should include an internal caching service', function() {
            assert.ok(manifest['services']['cache'] && manifest['services']['cache']['image']);
          });
          it('should include a reverse-proxy cache', function() {
            assert.ok(manifest['services']['proxy'] && manifest['services']['proxy']['image']);
          });
          it('should include a mail-handling services', function() {
            assert.ok(manifest['services']['mail'] && manifest['services']['mail']['image']);
          });
        });
        describe('Docker Images', function() {
          it('should use apache-php with Drupal 8', function() {
            assert.ok(manifest['services']['www']['image'] == 'outrigger/apache-php:php70');
          });
          it('should use mariadb with Drupal 8', function() {
            assert.ok(manifest['services']['db']['image'] == 'outrigger/mariadb:10.1');
          });
          it('should use memcache for internal caching', function() {
            assert.ok(manifest['services']['cache'] && manifest['services']['cache']['image'] == 'outrigger/memcache');
          });
          it('should use Varnish for reverse-proxy caching', function() {
            assert.ok(manifest['services']['proxy'] && manifest['services']['proxy']['image'] == 'outrigger/varnish:4.0');
          });
        });
      });
    });
  });

  describe('minimal configuration - Acquia', function() {
    before(function(done) {
      test.run(path.join(__dirname, '../generators/environment'))
        .inDir(appDir)
        .withPrompts({
          projectName: 'drupal8',
          drupalDistroVersion: '8.x',
          hosting: 'acquia',
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

    it('should have a minimal set of files', function() {
      assert.file(files.minimum);
    });
  });
});
