'use strict';

var assert = require('yeoman-assert');
var fs = require('fs');
var path = require('path');
var xml = require('xml2js').parseString;
var yaml = require('js-yaml');

module.exports = {
  assertYaml: function(filepath) {
    try {
      var doc = yaml.safeLoad(fs.readFileSync(filepath, 'utf8'));
      assert.ok(true);
    }
    catch (e) {
      assert.ok(false, JSON.stringify(e));
    }
  },
  assertJson: function(appDir, filepath) {
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
