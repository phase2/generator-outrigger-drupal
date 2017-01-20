'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

var options = {},
  tokens = {};

var webImage = function(webserver, majorVersion) {
  var image = {
    apache: majorVersion == '8.x' ? 'phase2/apache-php:php70' : 'phase2/apache-php:php56',
    nginx: 'phase2/nginx16-php55'
  };
  return image[webserver];
};

var buildImage = function(majorVersion) {
  return majorVersion == '8.x' ? 'phase2/devtools-build:php70' : 'phase2/devtools-build:php56';
};

var cacheImage = function(service, majorVersion) {
  var image = {
    memcache: 'phase2/memcache',
    redis: 'phase2/redis'
  };

  return image[service] || service;
};

var virtualHost = function(env, namespace) {
  namespace = env ? '-' + namespace : namespace;
  if (!env) {
    env = '';
  }

  return env + namespace + '.' + options['ciHost'];
};

/**
 * Determine if a given environment has been enabled by name.
 *
 * This function should only be used after options parameter is initialized from prompts.
 */
var envActive = function(environment) {
  return options.environments.indexOf(environment) != -1;
}

module.exports = yeoman.Base.extend({
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

    options['ciHost'] = options['ciHost'] || 'ci2.p2devcloud.com';
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
      options.machineName = options.projectName.replace(/\-/g, '_');

      tokens = options;
      tokens.debugMode = 'true';
      tokens.environment = '';
      tokens.dockerComposeExt = '';
      tokens.pkg = require('../package.json');

      if (!tokens['gitRepoUrl']) {
        tokens['gitRepoUrl'] = 'git@bitbucket.org:phase2tech/' + options.projectName + '.git';
      }
      if (!tokens['flowdockApiKey']) {
        tokens['flowdockApiKey'] = '';
      }

      tokens.app = {
        image: webImage(options.webserver, options.drupalDistroVersion) || options.webImage,
      };

      tokens.cache = {
        image: cacheImage(options.cacheInternal, options.drupalDistroVersion),
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
        int: virtualHost('int', options.projectName),
        local: 'www.' + options.domain + '.vm',
        devcloud: virtualHost(false, options.projectName),
        master: options.ciHost
      };

      if (envActive('dev')) {
        tokens.host.dev = virtualHost('dev', options.projectName);
      }
      if (envActive('qa')) {
        tokens.host.qa = virtualHost('qa', options.projectName);
      }
      if (envActive('review')) {
        tokens.host.review = virtualHost('review', options.projectName);
      }

      tokens.buildImage = buildImage(options.drupalDistroVersion);

      done();
    }.bind(this));
  },

  writing: {
    dockerComposeLocal: function() {
      tokens.dockerComposeExt = '';
      tokens.cache.docker.extLink = "\n      - " + options.machineName + "_local_cache:cache";
      tokens.db.docker.extLink = options.machineName + "_local_db:db";

      this.fs.copyTpl(
        this.templatePath('docker/docker-compose.yml'),
        this.destinationPath('docker-compose.yml'),
        tokens
      );
      this.fs.copyTpl(
        this.templatePath('docker/build.yml'),
        this.destinationPath('build.yml'),
        tokens
      );
    },

    dockerComposeDevcloud: function() {
      tokens.dockerComposeExt = 'devcloud.';
      tokens.cache.docker.extLink = "\n      - " + options.machineName + "_${DOCKER_ENV}_cache:cache";
      tokens.db.docker.extLink = options.machineName + "_${DOCKER_ENV}_db:db";

      this.fs.copyTpl(
        this.templatePath('docker/docker-compose.devcloud.yml'),
        this.destinationPath('docker-compose.devcloud.yml'),
        tokens
      );
      this.fs.copyTpl(
        this.templatePath('docker/build.devcloud.yml'),
        this.destinationPath('build.devcloud.yml'),
        tokens
      );
    },

    contributing: function() {
      this.fs.copyTpl(
        this.templatePath('CONTRIBUTING.md'),
        this.destinationPath('CONTRIBUTING.md'),
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


    npmConfig: function() {
      var pkg = this.fs.readJSON('package.json');
      if (!pkg) {
        this.log(chalk.red('You must have a valid Grunt-Drupal-Tasks compatible codebase before running p2-env.'));
        this.log(chalk.yellow('Try running `yo p2` or `yo gadget` first!'));
        if (!options['force']) {
          this.env.error('Project not ready for p2-env processing.');
        }
      }
      pkg = pkg || {};

      if (!pkg['scripts']) {
        pkg.scripts = {};
      }

      // Add helper scripts. Unlike the scripts generated by Gadget, these are
      // meant to be used from the host machine.
      if (!pkg['scripts']['d']) {
        // Run `npm run d cli` or `npm run d -- cli ls src/themes`.
        pkg.scripts.d = 'docker-compose -f build.yml run';
      }

      if (!pkg['scripts']['logs']) {
        // Logs do not output to stdout, so are only discoverable in this obscure location.
        pkg.scripts.logs = 'docker exec -it '
          + options.machineName
          + '_local_www less +F /opt/rh/php55/root/var/log/php-fpm/error.log';
      }

      this.fs.writeJSON('package.json', pkg);
    },

    gruntConfig: function() {
      var gcfg = this.fs.readJSON('Gruntconfig.json');
      if (!gcfg) {
        this.log(chalk.red('You must have a valid Grunt-Drupal-Tasks compatible codebase before running p2-env.'));
        this.log(chalk.yellow('Try running `yo p2` or `yo gadget` first!'));
        if (!options['force']) {
          this.env.error('Project not ready for p2-env processing.');
        }
      }
      gcfg = gcfg || {}

      gcfg.domain = 'www.' + options.domain + '.vm';
      gcfg.alias = '@' + options.projectName;

      if (!gcfg.project) {
        gcfg.project = {};
      }
      gcfg.project.db = '/opt/backups/latest.sql.gz';

      // Backups configuration is introduced by p2-env.
      gcfg.project.backups = {
        url: 'http://' + virtualHost(false, 'backups') + '/' + options.projectName,
        env: 'int'
      };

      if (!gcfg.scripts) {
        gcfg.scripts = {};
      }

      if (!gcfg.scripts['pre-install']) {
        gcfg.scripts['pre-install'] = 'bash bin/pre-install.sh';
      }

      if (!gcfg.scripts['post-install']) {
        gcfg.scripts['post-install'] = 'bash bin/post-install.sh';
      }

      if (!gcfg.scripts['cache-clear']) {
        if (options.drupalDistroVersion == '8.x') {
          gcfg.scripts['cache-clear'] = '<%= config.drush.cmd %> <%= config.alias %> cache-rebuild';
        }
        else {
          gcfg.scripts['cache-clear'] = '<%= config.drush.cmd %> <%= config.alias %> cache-clear all';
        }
      }

      if (!gcfg.scripts['seed-users']) {
         gcfg.scripts['seed-users'] = 'bash bin/seed-users.sh';
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

      // Add local environment to facilitate testing.
      tokens.virtualHost = tokens.host.local;
      tokens.environment = 'local';
      tokens.dockerComposeExt = '';
      this.fs.copyTpl(
        this.templatePath('jenkins/jobs-optional/deploy-env'),
        this.destinationPath('env/jenkins/jobs/deploy-local'),
        tokens
      );

      if (tokens.host['dev']) {
        tokens.virtualHost = tokens.host.dev;
        tokens.environment = 'dev';
        tokens.dockerComposeExt = 'devcloud.';
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/deploy-env'),
          this.destinationPath('env/jenkins/jobs/deploy-dev'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/start-env'),
          this.destinationPath('env/jenkins/jobs/start-dev'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/stop-env'),
          this.destinationPath('env/jenkins/jobs/stop-dev'),
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

      if (tokens.host['qa']) {
        tokens.virtualHost = tokens.host.qa;
        tokens.environment = 'qa';
        tokens.dockerComposeExt = 'devcloud.';
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/deploy-env'),
          this.destinationPath('env/jenkins/jobs/deploy-qa'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/start-env'),
          this.destinationPath('env/jenkins/jobs/start-qa'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/stop-env'),
          this.destinationPath('env/jenkins/jobs/stop-qa'),
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

      if (tokens.host['review']) {
        tokens.virtualHost = tokens.host.review;
        tokens.environment = 'review';
        tokens.dockerComposeExt = 'devcloud.';
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/deploy-env'),
          this.destinationPath('env/jenkins/jobs/deploy-review'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/start-env'),
          this.destinationPath('env/jenkins/jobs/start-review'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/stop-env'),
          this.destinationPath('env/jenkins/jobs/stop-review'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/cron-env'),
          this.destinationPath('env/jenkins/jobs/cron-review'),
          tokens
        );
        this.fs.copyTpl(
          this.templatePath('jenkins/jobs-optional/password-reset-env'),
          this.destinationPath('env/jenkins/jobs/password-reset-review'),
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
    var done = this.async();
    var fs = require('fs');
    fs.access(this.destinationPath('bin/fix-perms.sh'), fs.X_OK, function(err) {
      if (err) {
        this.log(chalk.red('Please make your shell scripts executable: `chmod +x bin/*.sh`.'));
      }
      done();
    }.bind(this));

    if (!options['skipGoodbye']) {
      this.log(chalk.green('Your Docker-based Drupal site is ready to go. Remember, all your commands should be run inside a container!'));
      this.log(chalk.yellow('Please read TODOS.md for manual follow-up steps.'));
    }
  }
});
