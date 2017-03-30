'use strict';

var _ = require('lodash');
var semver = require('semver');

/**
 * Fix version numbers to exclude pre-release versions.
 *
 * Pre-release versions are handled a bit defensively by semver implementations.
 * We want to match environment requirements to any version, which tends to
 * match what will be the stable equivalent without any regard for whether
 * something is a pre-release.
 */
function normalizeVersion(version) {
  return _.split(version, '-')[0];
}

/**
 * Selects a Docker Image based on the criteria.
 *
 * @param string platformId
 *   The ID of the platform for our selection.
 * @param string
 *   Service The specific Docker service we are selecting for.
 * @param String selection
 *   The answer to any prompt on the selection, e.g., "apache"
 * @param string application
 *   Allows selecting what kind of application this will serve. E.g., Drupal.
 * @param string version
 *   The version of the application to be supported.
 *
 * @return string|undefined
 *   The Docker image version or undefined if one could not be found.
 */
function selectImage(platformId, service, selection, application, version) {
  var platform = require('./platforms').load()[platformId];

  if (!platform.docker[service] || !platform.docker[service][selection]) {
    return undefined;
  }

  var selected = platform.docker[service][selection]['options'];
  if (_.isEmpty(selected)) {
    return undefined;
  }

  // If no application is specified or found we fallback to default handling.
  if (!application || !selected[application]) {
    application = 'default';
  }

  if (_.isString(selected[application])) {
    return selected[application];
  }

  // At this position we have confirmed we are interacting with an object which
  // by convention is keyed on version ranges. This means the version parameter
  // is now required.
  if (version) {
    version = normalizeVersion(version);
    if (!semver.valid(version)) {
      return undefined;
    }
  }
  else {
    return undefined;
  }

  // From the top down, look for the first semver match of our version with the
  // designated range.
  return _.find(selected[application], function(value, range) {
    return semver.satisfies(version, range);
  });
}

function imageOptions(platformId, service) {
  var definition = require('./platforms').load()[platformId].docker[service];
  return _.map(definition, function(item, key) {
    var option = { "value": key, "name": item.label};
    if (item.short) {
      option.short = item.short;
    }
    return option;
  })
}

function hasService(platformId, service) {
  return !_.isEmpty(require('./platforms').load()[platformId].docker[service]);
}

module.exports = {
  selectImage: selectImage,
  imageOptions: imageOptions,
  hasService: hasService,
  normalizeVersion: normalizeVersion
}
