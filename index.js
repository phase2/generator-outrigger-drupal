'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

var options = {};

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

    // This is copied from generator-gadget so p2-docker can run standalone.
    if (_.isUndefined(options.projectName)) {
      prompts.push({
        type: 'input',
        name: 'projectName',
        message: 'Machine-name of your project?',
        // Name of the parent directory.
        default: _.last(process.cwd().split('/')),
        validate: function (input) {
          return (input.search(' ') === -1) ? true : 'No spaces allowed.';
        }
      });
    }

    this.prompt(prompts, function (props) {
      options = _.assign(options, props);
      done();
    }.bind(this));
  },

  dockerComposeDefault: function() {
    var webImage = {
      apache: 'phase2/apache24php55',
      nginx: 'phase2/nginx16-php55'
    }

    var tokens = {
      debugMode: 'true',
      projectName: options.projectName,
      webImage: webImage[options.webserver] || options.webImage
    };

    this.fs.copyTpl(
      this.templatePath('docker-compose.yml'),
      this.destinationPath('docker-compose.yml'),
      tokens
    );
  },

  dockerComposeInt: function() {
    var tokens = {
      debugMode: 'true',
      projectName: options.projectName,
      virtualHost: options.projectName + '.ci.p2devcloud.com'
    };

    this.fs.copyTpl(
      this.templatePath('docker-compose.inherit.yml'),
      this.destinationPath('docker-compose.int.yml'),
      tokens
    );
  },

  dockerComposeBuild: function() {
    this.fs.copyTpl(
      this.templatePath('build.yml'),
      this.destinationPath('build.yml')
    );
  },

  readmeAppend: function() {
    var dockerUsagePath = this.templatePath('dockerUsage.md');

    // Inject a partial include to the already generated README.
    // Our infrastructure section uses the standard template system.
    this.fs.copy(
      this.destinationPath('README.md'),
      this.destinationPath('README.md'),
      {
        process: function(contents) {
          return contents + '\n' + '<% include ' + dockerUsagePath + ' %>';
        }
      }
    );

    // Inject our new README section.
    this.fs.copyTpl(
      this.destinationPath('README.md'),
      this.destinationPath('README.md'),
      {
        projectName: options.projectName
      }
    );
  }
});
