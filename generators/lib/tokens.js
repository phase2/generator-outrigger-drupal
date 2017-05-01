'use strict';

var _ = require('lodash');
var docker = require('./docker');
var platforms = require('./platforms');
var gadgetTokens = require('generator-gadget/generators/lib/util').tokens;
var dockerComposeLink = require('./util').dockerComposeLink;

/**
 * Produces tokens based on flagged options and prompt answers for p2:app or
 * other sub-generators. These tokens are used by the templating process.
 *
 * @todo move more of these pieces to the hosting platform sub-system.
 */
module.exports = function(options) {
  var env = require('./env')(options);

  var tokens = options;

  // This library is used by p2:environment and p2:jenkins directly, but those
  // do not use or depend on prompts from generator-gadget which are needed to
  // produce the gadget tokens.
  //
  // These tokens are not needed either.
  //
  // @todo Be smarter about generating tokens for different sub-generators.
  if (options.projectDescription) {
    tokens = _.assign(tokens, gadgetTokens(options));
  }
  tokens.debugMode = 'true';
  tokens.environment = '';
  tokens.dockerComposeExt = '';
  tokens.pkg = require('../../package.json');

  // The hosting option is used by environment and jenkins, but not by app.
  if (!options['hosting']) {
    return tokens;
  }

  if (!tokens['gitRepoUrl']) {
    var gitBaseUrl = platforms.load()[options.hosting].tools.git.baseUrl;
    var gitBaseUrl = 'git@bitbucket.org:phase2tech/';
    tokens['gitRepoUrl'] = gitBaseUrl + options.projectName + '.git';
  }
  if (!tokens['flowdockApiKey']) {
    tokens['flowdockApiKey'] = '';
  }

  var images = _.mapValues({
    app: { service: 'www', selection: options.webserver },
    cache: { service: 'cache', selection: options.cacheInternal },
    proxy: { service: 'proxy', selection: options.proxyCache },
    mail: { service: 'mail', selection: options.mail },
    db: { service: 'db', selection: 'mariadb' },
    build: { service: 'build', selection: 'default' }
  }, function(item) {
    return docker.selectImage(options.hosting, item.service, item.selection, 'drupal', options.drupalCoreRelease);
  });

  tokens.buildImage = images.build;

  tokens.app = {
    // If the webserver prompt selection is "custom" that will lead to the
    // retrieved image coming back as undefined. We will treat that case as
    // meaning to use the custom image.
    // @todo warn & crash if this ends up undefined.
    image: images.app || options.webImage,
  };

  tokens.cache = {
    image: images.cache,
    service: options.cacheInternal,
    external: options.cacheInternal != 'database',
    docker: {
      link: dockerComposeLink('cache')
    }
  };

  tokens.db = {
    image: images.db,
    docker: {}
  };

  tokens.proxy = {
    image: images.proxy,
    service: 'proxy',
    exists: options['proxyCache'] && options.proxyCache != 'none',
  }

  tokens.mail = {
    image: images.mail,
    service: 'mail',
    exists: options['mail'] && options.mail != 'none',
    docker: {
      link: dockerComposeLink('mail')
    }
  }

  tokens.host = {
    int: env.virtualHost('int', options.projectName),
    local: 'www.' + options.domain + '.vm',
    devcloud: env.virtualHost(false, options.projectName),
    master: options.ciHost
  };

  if (env.envActive('dev')) {
    tokens.host.dev = env.virtualHost('dev', options.projectName);
  }
  if (env.envActive('qa')) {
    tokens.host.qa = env.virtualHost('qa', options.projectName);
  }
  if (env.envActive('review')) {
    tokens.host.review = env.virtualHost('review', options.projectName);
  }

  return tokens;
};
