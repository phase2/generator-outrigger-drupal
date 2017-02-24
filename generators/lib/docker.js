'use strict';

var _ = require('lodash');

module.exports = function() {
  var module = {};

  function webImage(webserver, majorVersion) {
    var image = {
      apache: majorVersion == '8.x' ? 'phase2/apache-php:php70' : 'phase2/apache-php:php56',
      nginx: 'phase2/nginx16-php55'
    };
    return image[webserver];
  };

  function buildImage(majorVersion) {
    return majorVersion == '8.x' ? 'phase2/devtools-build:php70' : 'phase2/devtools-build:php56';
  };

  function cacheImage(service, majorVersion) {
    var image = {
      memcache: 'phase2/memcache',
      redis: 'phase2/redis'
    };

    return image[service] || service;
  };

  module.webImage = webImage;
  module.buildImage = buildImage;
  module.cacheImage = cacheImage;

  return module;
}
