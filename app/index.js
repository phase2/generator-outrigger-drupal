'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

var options = {},
  tokens = {};

var webImage = function(webserver, majorVersion) {
  var webImage = {
    apache: majorVersion == '8.x' ? 'phase2/apache24php70' : 'phase2/apache24php55',
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
      options.machineName = options.projectName.replace('-', '_');

      tokens = {
        debugMode: 'true',
        projectName: options.projectName,
        webImage: webImage(options.webserver, options.drupalDistroVersion) || options.webImage,
        hostINT: 'int.' + options.machineName + '.ci.p2devcloud.com',
        hostDEV: 'dev.' + options.machineName + '.ci.p2devcloud.com',
        hostQA: 'qa.' + options.machineName + '.ci.p2devcloud.com',
        hostMS: options.machineName + '.ci.p2devcloud.com',
        cacheExternal: options.cacheInternal != 'database',
        cacheLink: "\n    - cache",
        cacheExtLink: "\n    - " + options.projectName + "_local_cache:cache",
        dbExtLink: options.projectName + "_local_db:db",
        machineName: options.machineName,
        domain: options.domain,
        environment: '',
        dockerComposeExt: '',
      };

      done();
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

    dockerComposeINT: function() {
      tokens.virtualHost = tokens.hostINT;
      tokens.environment = 'int';
      tokens.dockerComposeExt = 'int.';
      tokens.cacheExtLink = "\n    - " + options.projectName + "_int_cache:cache";
      tokens.dbExtLink = options.projectName + "_int_db:db";

      this.fs.copyTpl(
        this.templatePath('docker/docker-compose.inherit.yml'),
        this.destinationPath('docker-compose.int.yml'),
        tokens
      );
      this.fs.copyTpl(
        this.templatePath('docker/build.yml'),
        this.destinationPath('build.int.yml'),
        tokens
      );
    },

    dockerComposeQA: function() {
      if (options.environments.indexOf('qa') != -1) {
        tokens.virtualHost = tokens.hostQA;
        tokens.environment = 'qa';
        tokens.dockerComposeExt = 'qa.';
        tokens.cacheExtLink = "\n    - " + options.projectName + "_qa_cache:cache";
        tokens.dbExtLink = options.projectName + "_qa_db:db";

        this.fs.copyTpl(
          this.templatePath('docker/docker-compose.inherit.yml'),
          this.destinationPath('docker-compose.qa.yml'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('docker/build.yml'),
          this.destinationPath('build.qa.yml'),
          tokens
        );
      }
    },

    dockerComposeDEV: function() {
      if (options.environments.indexOf('dev') != -1) {
        tokens.virtualHost = tokens.hostDEV;
        tokens.environment = 'dev';
        tokens.dockerComposeExt = 'dev.';
        tokens.cacheExtLink = "\n    - " + options.projectName + "_dev_cache:cache";
        tokens.dbExtLink = options.projectName + "_dev_db:db";

        this.fs.copyTpl(
          this.templatePath('docker/docker-compose.inherit.yml'),
          this.destinationPath('docker-compose.dev.yml'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('docker/build.yml'),
          this.destinationPath('build.dev.yml'),
          tokens
        );
      }
    },

    dockerComposeMS: function() {
      if (options.environments.indexOf('ms') != -1) {
        tokens.virtualHost = tokens.hostMS;
        tokens.environment = 'ms';
        tokens.dockerComposeExt = 'ms.';
        tokens.cacheExtLink = "\n    - " + options.projectName + "_ms_cache:cache";
        tokens.dbExtLink = options.projectName + "_ms_db:db";

        this.fs.copyTpl(
          this.templatePath('docker/docker-compose.inherit.yml'),
          this.destinationPath('docker-compose.ms.yml'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('docker/build.yml'),
          this.destinationPath('build.ms.yml'),
          tokens
        );
      }
    },

    dockerComposeBuild: function() {
      tokens.dockerComposeExt = '';
      tokens.environment = 'local';
      tokens.cacheExtLink = "\n    - " + options.projectName + "_local_cache:cache";
      tokens.dbExtLink = options.projectName + "_local_db:db";

      this.fs.copyTpl(
        this.templatePath('docker/build.yml'),
        this.destinationPath('build.yml'),
        tokens
      );
    },

    readme: function() {
      if (!options['skip-readme']) {
        // Inject our new README section.
        this.fs.copyTpl(
          this.templatePath('README.md'),
          this.destinationPath('DOCKER.md'),
          tokens
        );
      }
    },

    todos: function() {
      this.fs.copyTpl(
        this.templatePath('TODOS.md'),
        this.destinationPath('TODOS.md'),
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
      // @todo ensure this begins after Gruntconfig is initialized by gadget.
      var gcfg = this.fs.readJSON('Gruntconfig.json');
      if (!gcfg) {
        this.log(chalk.red('You must have a valid Grunt-Drupal-Tasks compatible codebase before running p2-env.'));
        this.log(chalk.yellow('Try running `yo p2` or `yo gadget` first!'));
        this.env.error('Project not ready for p2-env processing.');
      }

      gcfg.domain = 'www.' + options.domain + '.vm';
      gcfg.alias = '@' + options.projectName;

      if (!gcfg.project) {
        gcfg.project = {};
      }
      gcfg.project.db = '/opt/backups/latest.sql.gz';

      // Backups configuration is introduced by p2-env.
      gcfg.project.backups = {
        url: 'http://backups.ci.p2devcloud.com/' + options.projectName,
        env: 'int'
      };

      if (!gcfg.scripts) {
        gcfg.scripts = {};
      }

      if (!gcfg.scripts['pre-install']) {
        gcfg.scripts['pre-install'] = 'bash bin/pre-install.sh';
      }

      if (!gcfg.scripts['cache-clear']) {
        if (options.drupalDistroVersion == '8.x') {
          gcfg.scripts['cache-clear'] = '<%= config.drush.cmd %> <%= config.alias %> cache-rebuild';
        }
        else {
          gcfg.scripts['cache-clear'] = '<%= config.drush.cmd %> <%= config.alias %> cache-clear all';
        }
      }

      // Lack of a useENV option means it was not invoked by a parent generator.
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
        this.templatePath('drupal/' + name),
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
      this.fs.copy(
        this.templatePath('grunt'),
        this.destinationPath('bin/grunt')
      );
    },

    jenkins: function() {
      this.fs.copyTpl(
        this.templatePath('jenkins/jenkins.yml'),
        this.destinationPath('jenkins.yml'),
        tokens
      );
      this.fs.copyTpl(
        this.templatePath('jenkins/config.xml'),
        this.destinationPath('env/jenkins/config.xml'),
        tokens
      );
      this.fs.copyTpl(
        this.templatePath('jenkins/jobs'),
        this.destinationPath('env/jenkins/jobs'),
        tokens
      );
      this.fs.copyTpl(
        this.templatePath('jenkins/JENKINS.md'),
        this.destinationPath('JENKINS.md'),
        tokens
      );

      if (options.environments.indexOf('dev') != -1) {
        tokens.virtualHost = tokens.hostDEV;
        tokens.environment = 'dev';
        tokens.dockerComposeExt = 'dev.';
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/deploy-env'),
          this.destinationPath('env/jenkins/jobs/deploy-dev'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/cron-env'),
          this.destinationPath('env/jenkins/jobs/cron-dev'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/password-reset-env'),
          this.destinationPath('env/jenkins/jobs/password-reset-dev'),
          tokens
        );
      }

      if (options.environments.indexOf('qa') != -1) {
        tokens.virtualHost = tokens.hostQA;
        tokens.environment = 'qa';
        tokens.dockerComposeExt = 'qa.';
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/deploy-env'),
          this.destinationPath('env/jenkins/jobs/deploy-qa'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/cron-env'),
          this.destinationPath('env/jenkins/jobs/cron-qa'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/password-reset-env'),
          this.destinationPath('env/jenkins/jobs/password-reset-qa'),
          tokens
        );
      }

      if (options.environments.indexOf('ms') != -1) {
        tokens.virtualHost = tokens.hostMS;
        tokens.environment = 'ms';
        tokens.dockerComposeExt = 'ms.';
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/deploy-env'),
          this.destinationPath('env/jenkins/jobs/deploy-ms'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/cron-env'),
          this.destinationPath('env/jenkins/jobs/cron-ms'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/password-reset-env'),
          this.destinationPath('env/jenkins/jobs/password-reset-ms'),
          tokens
        );
      }
    },

    gitignore: function() {
      this.fs.copyTpl(
        this.templatePath('gitignore'),
        this.destinationPath('env/.gitignore'),
        tokens
      );
    }
  },

  end: function() {
    if (!options['skipGoodbye']) {
      this.log(chalk.green('Your Docker-based Drupal site is ready to go. Remember, all your commands should be run inside a container!'));
      this.log(chalk.yellow('Please read TODOS.md for manual follow-up steps.'));
    }
  }
});
