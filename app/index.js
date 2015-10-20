'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

var options = {},
  tokens = {};

var webImage = function(webserver) {
  var webImage = {
    apache: 'phase2/apache24php55',
    nginx: 'phase2/nginx16-php55'
  };
  return webImage[webserver];
};

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
    // Have Yeoman greet the user.
    if (!this.options.skipWelcome) {
      this.log(yosay(
        'Welcome to the tubular ' + chalk.cyan('Phase2 Docker') + ' generator!'
      ));
    }

    options = _.assign({
      skipWelcome: true
    }, this.options);
  },

  prompting: function() {
    var done = this.async();
    var prompts = [];

    var prompts = require('../lib/prompts');
    prompts = _.filter(prompts, function (item) {
      return _.isUndefined(options[item.name]);
    });

    this.prompt(prompts, function (props) {
      options = _.assign(options, props);

      tokens = {
        debugMode: 'true',
        projectName: options.projectName,
        webImage: webImage(options.webserver) || options.webImage,
        cacheInternal: options.cacheInternal != 'database',
        cacheLink: "\n    - cache",
        virtualHost: options.projectName + '.ci.p2devcloud.com'
      };

      done();
    }.bind(this));
  },

  dockerComposeDefault: function() {
    this.fs.copyTpl(
      this.templatePath('docker/docker-compose.yml'),
      this.destinationPath('docker-compose.yml'),
      tokens
    );
  },

  dockerComposeInt: function() {
    this.fs.copyTpl(
      this.templatePath('docker/docker-compose.inherit.yml'),
      this.destinationPath('docker-compose.int.yml'),
      tokens
    );
  },

  dockerComposeBuild: function() {
    this.fs.copyTpl(
      this.templatePath('docker/build.yml'),
      this.destinationPath('build.yml'),
      tokens
    );
  },

  readmeAppend: function() {
    var self = this;

    // Inject a partial include to the already generated README.
    // Our infrastructure section uses the standard template system.
    require('./partial').append(
      self,
      this.destinationPath('README.md'),
      this.destinationPath('README.md'),
      this.templatePath('docker/dockerUsage.md')
    );

    // Inject our new README section.
    this.fs.copyTpl(
      this.destinationPath('README.md'),
      this.destinationPath('README.md'),
      tokens
    );
  },

  drushConfig: function() {
    this.fs.copyTpl(
      this.templatePath('drush'),
      this.destinationPath('env/build/etc/drush'),
      tokens
    );
  },

  gruntConfig: function() {
    var gcfg = this.fs.readJSON('Gruntconfig.json');
    if (!gcfg.buildPaths) {
      gcfg.buildPaths = {};
    }
    gcfg.buildPaths.html = '/var/www/html';

    if (!gcfg.generated) {
      gcfg.generated = { name: 'hand-crafted', version: '0.0.0' };
    }
    if (!gcfg.generated.modified) {
      gcfg.generated.modified = [];
    }
    gcfg.generated.modified.push({name: this.pkg.name, version: this.pkg.version});
    this.fs.writeJSON('Gruntconfig.json', gcfg);
  },

  gruntDockerConfig: function() {
    this.fs.copy(
      this.templatePath('grunt'),
      this.destinationPath('bin/grunt')
    );
  },

  drupalSettings: function() {
    var name = 'override.settings.php';
    this.fs.copyTpl(
      this.templatePath('drupal/override.settings.php'),
      this.destinationPath('src/sites/' + name),
      tokens
    );

    this.log('Please include src/sites/' + name + ' at the end of your site settings.php file.');
    this.log("'==> require __DIR__ . '/../override.settings.php'");
    if (tokens.cacheInternal) {
      this.log('Add the memcache module to your makefile! https://www.drupal.org/project/memcache');
    }
  }
});
