'use strict';

var _ = require('lodash');

module.exports = function(options) {
  var module = {};
  var host;

  function ciHost() {
    if (!host) {
      var defaultHost = 'ci.p2devcloud.com';
      if (Math.random() <= 0.5) {
        defaultHost = 'ci2.p2devcloud.com'
      }

      host = options['ciHost'] || defaultHost;
    }

    return host;
  }

  /**
   * Determine if a given environment has been enabled by name.
   *
   * This function should only be used after options parameter is initialized from prompts.
   */
  function envActive(environment) {
    return options.environments.indexOf(environment) != -1;
  }

  function virtualHost(env, namespace) {
    namespace = env ? '-' + namespace : namespace;
    if (!env) {
      env = '';
    }

    return env + namespace + '.' + ciHost();
  };

  module.envActive = envActive;
  module.virtualHost = virtualHost;
  module.ciHost = ciHost;

  return module;
};
