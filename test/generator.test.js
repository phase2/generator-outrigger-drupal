'use strict';

var assert = require('yeoman-assert');
var fs = require('fs');
var os = require('os');
var path = require('path');
var test = require('yeoman-test');
var xml = require('xml2js').parseString;
var yaml = require('js-yaml');
var _ = require('lodash');

var files = require('./files.data.js');

var schema = {
  assertYaml: function(filepath) {
    try {
      var doc = yaml.safeLoad(fs.readFileSync(filepath, 'utf8'));
      assert.ok(true);
    }
    catch (e) {
      assert.ok(false, JSON.stringify(e));
    }
  },
  assertJson: function(filepath) {
    try {
      var doc = require(path.join(appDir, filepath));
      assert.ok(true);
    }
    catch (e) {
      assert.ok(false, JSON.stringify(e));
      console.log(e);
    }
  },
  assertXml: function(filepath) {
    try {
      var doc = xml(fs.readFileSync(filepath, 'utf8'), function(err, result) {
        if (!err) {
          assert.ok(true);
        }
        else {
          assert.ok(false, JSON.stringify(err));
        }
      });
    }
    catch (e) {
      assert.ok(false, JSON.stringify(e));
    }
  }
};

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

var describeJson = function() {
  var items = files.json;

  return function() {
    Object.keys(items).forEach(function(filepath) {
      it('should have a valid "' + items[filepath] + '"', function() {
        schema.assertJson(filepath);
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
    describe('for Jenkins', function() {
      Object.keys(items).forEach(function(filepath) {
        it('should have a valid ' + items[filepath], function() {
          schema.assertXml(filepath);
        });
      });
    });
  };
}

var appDir = path.join(os.tmpdir(), './temp-test');
console.log('Tests will be generated in "' + appDir + '"');

describe('p2-env:app', function() {

  describe('minimal configuration', function() {
    before(function(done) {
      test.run(path.join(__dirname, '../app'))
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

    it('should have a minimal set of files', function() {
      assert.file(files.minimum);
    });

    it('should not include the extended files added with more opt-ins', function() {
      assert.noFile(files.extended);
    });

    describe('provides have valid JSON files', describeJson());
    describe('provides have valid XML files', describeXml());

    describe('Docker', function() {
      describe('has YAML configuration', describeYaml());
      describe('Operational Services - Local', function() {
        var manifest;

        before(function() {
          manifest = yaml.safeLoad(fs.readFileSync('docker-compose.yml', 'utf8'));
        });

        it('should include a database', function() {
          assert.ok(manifest['db'] && manifest['db']['image']);
        });
        it('should include an application server', function() {
          assert.ok(manifest['www'] && manifest['www']['image']);
        });
        it('should use apache-php:php70 with Drupal 8', function() {
          assert.ok(manifest['www']['image'] == 'phase2/apache-php:php70');
        });
        it('should not have a cache service', function() {
          assert.ok(!manifest['cache']);
        });
        it('should not have a proxy service', function() {
          assert.ok(!manifest['proxy']);
        });
        it('should not have a mail service', function() {
          assert.ok(!manifest['mail']);
        });
      });
    });
  });

  describe('extended configuration', function() {
    before(function(done) {
      test.run(path.join(__dirname, '../app'))
        .inDir(appDir)
        .withPrompts({
          cacheInternal: 'memcache',
          drupalDistroVersion: '8.x',
          // This could be excluded, but would get the temp base directory.
          domain: 'drupal8',
          environments: [ 'dev', 'qa', 'review' ],
          mailhog: true,
          projectName: 'drupal8',
          proxyCache: 'varnish',
          webserver: 'apache'
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

    describe('provides valid JSON files', describeJson());
    describe('provides valid XML files', describeXml(true));

    describe('Docker', function() {
      describe('has YAML configuration', describeYaml());
      describe('Operational Services - Local', function() {
        var manifest;

        before(function() {
          manifest = yaml.safeLoad(fs.readFileSync('docker-compose.yml', 'utf8'));
        });

        describe('Core Services', function() {
          it('should include a database', function() {
            assert.ok(manifest['db'] && manifest['db']['image']);
          });
          it('should include an application server', function() {
            assert.ok(manifest['www'] && manifest['www']['image']);
          });
          it('should include an intenral caching service', function() {
            assert.ok(manifest['cache'] && manifest['cache']['image']);
          });
          it('should include a reverse-proxy cache', function() {
            assert.ok(manifest['proxy'] && manifest['proxy']['image']);
          });
          it('should include a mail-handling services', function() {
            assert.ok(manifest['mail'] && manifest['mail']['image']);
          });
        });
        describe('Docker Images', function() {
          it('should use apache-php with Drupal 8', function() {
            assert.ok(manifest['www']['image'] == 'phase2/apache-php:php70');
          });
          it('should use memcache for internal caching', function() {
            assert.ok(manifest['cache'] && manifest['cache']['image'] == 'phase2/memcache');
          });
          it('should use Varnish for reverse-proxy caching', function() {
            assert.ok(manifest['proxy'] && manifest['proxy']['image'] == 'phase2/varnish:4.0');
          });
        });
      });

      describe('Operational Services - Dev Cloud', function() {
        var manifest;

        before(function() {
          manifest = yaml.safeLoad(fs.readFileSync('docker-compose.devcloud.yml', 'utf8'));
        });

        describe('Core Services', function() {
          it('should include a database', function() {
            assert.ok(manifest['db']);
          });
          it('should include an application server', function() {
            assert.ok(manifest['www']);
          });
          it('should include an intenral caching service', function() {
            assert.ok(manifest['cache']);
          });
          it('should include a reverse-proxy cache', function() {
            assert.ok(manifest['proxy']);
          });
          it('should include a mail-handling services', function() {
            assert.ok(manifest['mail']);
          });
        });

        describe('Docker Images', function() {
          it('should extend from docker-compose.yml for cache container', function() {
            assert.ok(manifest['cache']['extends']['file'] === 'docker-compose.yml');
          });
          it('should extend from docker-compose.yml for db container', function() {
            assert.ok(manifest['db']['extends']['file'] === 'docker-compose.yml');
          });
          it('should use apache-php:php70 with Drupal 8', function() {
            assert.ok(manifest['www']['image'] == 'phase2/apache-php:php70');
          });
          it('should use Varnish for reverse-proxy caching', function() {
            assert.ok(manifest['proxy']['image'] == 'phase2/varnish:4.0');
          });
        });
      });
    });
  });
});
