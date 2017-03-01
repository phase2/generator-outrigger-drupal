'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

var options = {},
  tokens = {};

module.exports = Generator.extend({
  initializing: function() {
    this.pkg = require('../../package.json');
    // Have Yeoman greet the user.
    if (!this.options.skipWelcome) {
      this.log(yosay(
        'Welcome to the phantastic ' + chalk.cyan('Phase2 Jenkins') + ' generator!'
      ));
    }

    options = _.assign({
      skipWelcome: true,
      skipGoodbye: true
    }, this.options);

    options['ciHost'] = options['ciHost'] || 'ci2.p2devcloud.com';
  },

  prompting: function() {
    var prompts = require('../lib/prompts');
    prompts = _.filter(prompts, function (item) {
      return _.isUndefined(options[item.name]);
    });

    return this.prompt(prompts).then(function (props) {
      options = _.assign(options, props);
      options.machineName = options.projectName.replace(/\-/g, '_');
      tokens = require('../lib/tokens')(options);
    }.bind(this));

    tokens = tokens || require('../lib/tokens')(options);
  },

  writing: {
    dockerCompose: function() {
      this.fs.copyTpl(
        this.templatePath('jenkins.yml'),
        this.destinationPath('jenkins.yml'),
        tokens
      );
    },

    jenkinsConfig: function() {
      this.fs.copyTpl(
        this.templatePath('config.xml'),
        this.destinationPath('env/jenkins/config.xml'),
        tokens
      );
    },

    jenkinsCoreJobs: function() {
      this.fs.copyTpl(
        this.templatePath('jobs'),
        this.destinationPath('env/jenkins/jobs'),
        tokens
      );
    },

    jenkinsEnvJobs: function() {
      var hosts = tokens.host;
      // Integration environment is for CI and other scheduled tasks.
      delete hosts['int'];
      // Master environment is used for Project Jenkins.
      delete hosts['master'];
      // devcloud is the base domain from which more complete devcloud VIRTUAL
      // HOST URLs are constructed.
      delete hosts['devcloud'];

      _.forEach(hosts, function(value, key) {
        tokens.virtualHost = tokens.host[key];
        tokens.environment = key;
        if (key == 'local') {
          tokens.dockerComposeExt = '';
        }
        else {
          tokens.dockerComposeExt = 'devcloud.';
        }

        this.fs.copyTpl(
          this.templatePath('jobs-optional/deploy-env'),
          this.destinationPath('env/jenkins/jobs/deploy-' + key),
          tokens
        );

        this.fs.copyTpl(
          this.templatePath('jobs-optional/start-env'),
          this.destinationPath('env/jenkins/jobs/start-' + key),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jobs-optional/stop-env'),
          this.destinationPath('env/jenkins/jobs/stop-' + key),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jobs-optional/cron-env'),
          this.destinationPath('env/jenkins/jobs/cron-' + key),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jobs-optional/password-reset-env'),
          this.destinationPath('env/jenkins/jobs/password-reset-' + key),
          tokens
        );
      }.bind(this));
    }
  },

  end: function() {
    if (!options['skipGoodbye']) {
      this.log(chalk.green('Your project Jenkins has been configured for use.'));
      this.log(chalk.green('Run with `docker-compose -f jenkins.yml run jenkins`'));
      this.log(chalk.yellow('Jenkins will not remember changes via the Admin UI.'));
      this.log(chalk.yellow('Be sure to commit configuration to the codebase in env/jenkins.'));
    }
  }
});
