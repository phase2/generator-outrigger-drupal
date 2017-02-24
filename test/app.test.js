'use strict';

var assert = require('yeoman-assert');
var os = require('os');
var path = require('path');
var test = require('yeoman-test');

var appDir = path.join(os.tmpdir(), './temp-test-app');
console.log('Tests will be generated in "' + appDir + '"');

var originalTestDirectory;
// The default behavior of the test.run() is to wipe the directory
// targeted for the generator run. Normally a good thing for clean
// results, but the goal here is to test our custom --replay functionality.
//
// A better solution would be to inject the .yo-rc.json file in the clean
// directory, but that seems like it would require about as much hackiness.
var swapTestDirectory = function(on) {
  if (on) {
    originalTestDirectory = test.testDirectory;
    test.testDirectory = function(dir, cb) {
      if (!dir) {
        throw new Error('Missing directory');
      }
      dir = path.resolve(dir);
      process.chdir(dir);
      cb();
    };
  }
  else if (originalTestDirectory) {
    test.testDirectory = originalTestDirectory;
  }
}

var gdtFiles = [
  '.editorconfig',
  '.eslintignore',
  '.eslintrc',
  '.gitignore',
  'Gruntconfig.json',
  'Gruntfile.js',
  'composer.json',
  'package.json',
  'phpmd.xml',
  'src/modules/.gitkeep',
  'test/behat.yml',
  'test/features/example.feature'
];

describe('p2:app w/ Gadget', function () {
  before(function (done) {
    test.run(path.join(__dirname, '../generators/app'))
      .inDir(appDir)
      .withOptions({
        'skip-install': true,
        projectName: 'drupal8',
        projectDescription: 'test drupal8 project',
        drupalDistro: 'drupal',
        drupalDistroVersion: '8.x',
        usePLS: false,
        useENV: false,
        offline: true,
        force: true
      })
      .on('end', done);
  });

  it('creates a README based on just Gadget usage', function() {
    assert.file([
      'README.md'
    ]);
  });

  it('creates standard Gadget-generated files', function() {
    assert.file(gdtFiles);
  });

  it('creates the .yo-rc.json to facilitate replay', function() {
    assert.file([
      '.yo-rc.json'
    ]);
  });
});

describe('p2:app --replay', function () {
  var originalTestDirectory = test.testDirectory;

  before(function (done) {
    swapTestDirectory(true);
    test.run(path.join(__dirname, '../generators/app'))
      .inDir(appDir)
      .withOptions({
        replay: true,
        // The lack of this option trips up the test.
        drupalDistroVersion: '8.x',
        offline: true,
        force: true
      })
      .on('end', done);
  });

  after(function() {
    swapTestDirectory(false);
  });

  it('creates a README based on just Gadget usage', function() {
    assert.file([
      'README.md'
    ]);
  });

  it('creates standard Gadget-generated files', function() {
    assert.file(gdtFiles);
  });

  it('creates the .yo-rc.json to facilitate replay', function() {
    assert.file([
      '.yo-rc.json'
    ]);
  });

  it ('uses projectName based on previously stored option', function() {
    var pkg = require(path.resolve(appDir, 'package.json'));
    var yoRC = require(path.resolve(appDir, '.yo-rc.json'));
    assert.equal(pkg.name, yoRC['generator-p2']['project-name']);
  });
});

describe('p2:app w/ Gadget + p2:environment', function () {
  before(function (done) {
    test.run(path.join(__dirname, '../generators/app'))
      .inDir(appDir)
      .withOptions({
        'skip-install': true,
        projectName: 'drupal8-p2env',
        projectDescription: 'test drupal8 project',
        drupalDistro: 'drupal',
        drupalDistroVersion: '8.x',
        usePLS: false,
        useENV: true,
        webserver: 'apache',
        cacheInternal: 'database',
        proxyCache: 'none',
        environments: [],
        offline: true,
	      domain: 'drupal8-p2env',
        force: true
      })
      .on('end', done);
  });

  it('creates a README based on just Gadget usage', function() {
    assert.file([
      'README.md'
    ]);
  });

  it('creates standard Gadget-generated files', function() {
    assert.file(gdtFiles);
  });

  it('creates Docker configuration files', function() {
    assert.file([
      'docker-compose.yml',
    ]);
  });

});
