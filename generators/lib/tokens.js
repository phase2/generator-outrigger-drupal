'use strict';

var _ = require('lodash');
var docker = require('./docker')();

module.exports = function(options) {
  var util = require('./util')(options);

  var tokens = options;
  tokens.debugMode = 'true';
  tokens.environment = '';
  tokens.dockerComposeExt = '';
  tokens.pkg = require('../../package.json');

  if (!tokens['gitRepoUrl']) {
    tokens['gitRepoUrl'] = 'git@bitbucket.org:phase2tech/' + options.projectName + '.git';
  }
  if (!tokens['flowdockApiKey']) {
    tokens['flowdockApiKey'] = '';
  }

  tokens.app = {
    image: docker.webImage(options.webserver, options.drupalDistroVersion) || options.webImage,
  };

  tokens.cache = {
    image: docker.cacheImage(options.cacheInternal, options.drupalDistroVersion),
    service: options.cacheInternal,
    external: options.cacheInternal != 'database',
    docker: {
      link: "\n      - cache"
    }
  };

  tokens.db = {
    docker: {}
  };

  tokens.proxy = {
    image: 'phase2/varnish',
    service: 'varnish',
    exists: options['proxyCache'] && options.proxyCache != 'none',
  }

  tokens.mail = {
    image: 'mailhog/mailhog',
    service: 'mail',
    exists: options['mailhog'],
    docker: {
      link: "\n      - mail"
    }
  }

  tokens.host = {
    int: util.virtualHost('int', options.projectName),
    local: 'www.' + options.domain + '.vm',
    devcloud: util.virtualHost(false, options.projectName),
    master: options.ciHost
  };

  if (util.envActive('dev')) {
    tokens.host.dev = util.virtualHost('dev', options.projectName);
  }
  if (util.envActive('qa')) {
    tokens.host.qa = util.virtualHost('qa', options.projectName);
  }
  if (util.envActive('review')) {
    tokens.host.review = util.virtualHost('review', options.projectName);
  }

  tokens.buildImage = docker.buildImage(options.drupalDistroVersion);

  return tokens;
};
