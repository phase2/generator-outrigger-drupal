'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function requireDirectory(file_path) {
  var items = {}
  file_path = path.resolve(file_path);

  fs.readdirSync(file_path).forEach(function (directory) {
    var item_path = path.join(file_path, directory);
    if (fs.statSync(item_path).isDirectory()) {
      items[directory] = require(item_path);
    }
  });

  return items;
}

/**
 * Generate the docker-compose link entry with the correct amount of indenting.
 */
function dockerComposeLink(service) {
  return "\n      - " + service;
}

/**
 * Generate a semver version from a simple semver range.
 *
 * For example, ^8.2 should be converted to "8.2.0".
 *
 * This is very touchy, but guarantees we have some version variation of what
 * a composer update might install, given it's usually as simple as "^8.3".
 */
function createVersionFromRange(range) {
  var regex = /\d+(\.\d+)?(\.\d+)?/;
  var version = range.match(regex);
  if (!version) {
    return '0.0.0';
  }
  version = version[0];

  var parts = _.split(version, '.');
  if (parts.length == 1) {
    return version + '.0.0';
  }
  else if (parts.length == 2) {
    return version + '.0';
  }

  return version;
}

module.exports = {
  requireDirectory: requireDirectory,
  dockerComposeLink: dockerComposeLink,
  createVersionFromRange: createVersionFromRange
};
