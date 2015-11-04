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
        virtualHost: options.projectName + '.ci.p2devcloud.com',
        machineName: options.projectName.replace('-', '_'),
        domain: options.domain,
      };

      var prompts = [{
        type: 'input',
        name: 'domain',
        message: 'Domain for local development?',
        default: options.projectName
      }];
      this.prompt(prompts, function (props) {
        options = _.assign(options, props);
        tokens.domain = options.domain;
        done();
      }.bind(this));
    }.bind(this));
  },

  writing: {
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
      if (!options['skip-readme']) {
        var self = this;

        // Inject our new README section.
        this.fs.copyTpl(
          this.templatePath('README.md'),
          this.destinationPath('DOCKER.md'),
          tokens
        );
      }
    },

    drushConfig: function() {
      this.fs.copyTpl(
        this.templatePath('drush'),
        this.destinationPath('env/build/etc/drush'),
        tokens
      );
    },

    gruntConfig: function() {
      // @todo ensure this begins after Gruntconfig is initialized by gadget.
      var gcfg = this.fs.readJSON('Gruntconfig.json');
      if (!gcfg.buildPaths) {
        gcfg.buildPaths = {};
      }
      gcfg.buildPaths.html = '/var/www/html';

      if (!options['useENV']) {
        if (!gcfg.generated) {
          gcfg.generated = { name: 'hand-crafted', version: '0.0.0' };
        }
        if (!gcfg.generated.modified) {
          gcfg.generated.modified = [];
        }

        var index = _.findIndex(gcfg.generated.modified, function(item) {
          return item.name == this.pkg.name;
        }.bind(this));
        var item = {name: this.pkg.name, version: this.pkg.version};
        if (index == -1) {
          gcfg.generated.modified.push(item);
        }
        else {
          gcfg.generated.modified[index] = item;
        }
      }

      this.fs.writeJSON('Gruntconfig.json', gcfg);
    },

    drupalSettings: function() {
      var name = 'settings.common.php';
      this.fs.copyTpl(
        this.templatePath('drupal/7.x/' + name),
        this.destinationPath('src/sites/' + name),
        tokens
      );
    },

    bin: function() {
      this.fs.copyTpl(
        this.templatePath('bin'),
        this.destinationPath('bin'),
        tokens
      );
    }
  },

  end: function() {
    var name = 'settings.common.php';
    this.log('Please include src/sites/' + name + ' at the end of your site settings.php file.');
    this.log("'==> require __DIR__ . '/../" + name + "'");
    if (tokens.cacheInternal) {
      this.log('Add the memcache module to your makefile! https://www.drupal.org/project/memcache');
    }
  }
});
