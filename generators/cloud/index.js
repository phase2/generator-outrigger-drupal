'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

var dockerComposeLink = require('../lib/util').dockerComposeLink;

var options = {},
  tokens = {};

module.exports = Generator.extend({
  initializing: function() {
    this.pkg = require('../../package.json');
    // Have Yeoman greet the user.
    if (!this.options.skipWelcome) {
      this.log(yosay(
        'Welcome to the cumulative ' + chalk.cyan('Outrigger Cloud') + ' generator!'
      ));
    }

    options = _.assign({
      skipWelcome: true,
      skipGoodbye: true
    }, this.options);
  },

  prompting: function() {
    var prompts = require('../lib/prompts').concat(require('./prompts'));
    prompts = _.filter(prompts, function (item) {
      return _.isUndefined(options[item.name]);
    });

    return this.prompt(prompts).then(function (props) {
      options = _.assign(options, props);
    }.bind(this));
  },

  configuring: {
    optionSetup: function() {
      options.machineName = options.projectName.replace(/\-/g, '_');
    },
    tokenSetup: function() {
      tokens = require('../lib/tokens')(options);
    }
  },

  writing: {
    docs: function() {
      this.fs.copyTpl(
        this.templatePath('DEVCLOUD.md'),
        this.destinationPath('docs/DEVCLOUD.md'),
        tokens
      );
    },

    dockerCompose: function() {
      this.fs.copyTpl(
        this.templatePath('jenkins/jenkins.yml'),
        this.destinationPath('jenkins.yml'),
        tokens
      );

      tokens.dockerComposeExt = 'devcloud.';
      tokens.cache.docker.extLink = dockerComposeLink(options.machineName + "_${DOCKER_ENV:-local}_cache:cache");
      tokens.db.docker.extLink = options.machineName + "_${DOCKER_ENV:-local}_db:db";

      this.fs.copyTpl(
        this.templatePath('build.devcloud.yml'),
        this.destinationPath('build.devcloud.yml'),
        tokens
      );
    },

    jenkinsConfig: function() {
      this.fs.copyTpl(
        this.templatePath('jenkins/config.xml'),
        this.destinationPath('env/jenkins/config.xml'),
        tokens
      );
    },

    jenkinsCoreJobs: function() {
      this.fs.copyTpl(
        this.templatePath('jenkins/jobs'),
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
      tokens.ci = {host: hosts['devcloud']};
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
          this.templatePath('jenkins/jobs-optional/deploy-env'),
          this.destinationPath('env/jenkins/jobs/deploy-' + key),
          tokens
        );

        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/start-env'),
          this.destinationPath('env/jenkins/jobs/start-' + key),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/stop-env'),
          this.destinationPath('env/jenkins/jobs/stop-' + key),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/cron-env'),
          this.destinationPath('env/jenkins/jobs/cron-' + key),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/password-reset-env'),
          this.destinationPath('env/jenkins/jobs/password-reset-' + key),
          tokens
        );
      }.bind(this));
    }
  },

  end: function() {
    if (!options['skipGoodbye']) {
      this.log(chalk.green('Your project has been configured for Outrigger Cloud.'));
      this.log(chalk.green('This includes a ready-to-go docker-based Jenkins instance.'));
      this.log(chalk.green('Run with `docker-compose -f jenkins.yml run jenkins`'));
      this.log(chalk.yellow('Jenkins will not remember changes via the Admin UI.'));
      this.log(chalk.yellow('Be sure to commit configuration to the codebase in env/jenkins.'));
    }
  }
});
