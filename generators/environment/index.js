'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

var dockerComposeLink = require('../lib/util').dockerComposeLink;
var drupalStableRelease = require('generator-gadget/generators/lib/drupalProjectVersion').latestReleaseStable;
var createVersionFromRange = require('../lib/util').createVersionFromRange;

var env;
var options = {},
  tokens = {};

module.exports = Generator.extend({
  initializing: function () {
    this.pkg = require('../../package.json');
    // Have Yeoman greet the user.
    if (!this.options.skipWelcome) {
      this.log(yosay(
        'Welcome to the tubular ' + chalk.cyan('Outrigger Environment') + ' generator!'
      ));
    }

    options = _.assign({
      skipWelcome: true
    }, this.options);
  },

  prompting: function() {
    var prompts = require('../lib/prompts');
    prompts = _.filter(prompts, function (item) {
      return _.isUndefined(options[item.name]);
    });
    return this.prompt(prompts).then(function (props) {
      // Maintain backwards compatbility on --replay for projects that do not
      // have a hosting prompt saved.
      if (!props.hosting) {
        props.hosting = 'outrigger';
      }
      options = _.assign(options, props);
      options.machineName = options.projectName.replace(/\-/g, '_');
    }.bind(this));

  },

  // The default priority fires after configuring, which means we can now rely
  // on the presence of other composed generators to have completed configuring
  // steps.
  default: {
    optionSetup: function() {
      var composer = this.fs.readJSON('composer.json');
      // Fake a default core version range as a fallback if we do not have
      // composer data that has a core version. Or if the environment generator
      // is run in a project directory that lacks a composer.json.
      var coreVersionRange = '^' + options.drupalDistroVersion;
      if (composer && composer.require && composer.require['drupal/core']) {
        coreVersionRange = composer.require['drupal/core'];
      }

      // Fallback version if we are stymied from computing a better version number.
      options.drupalCoreRelease = '0.0.0';
      // At this point we have a complete composer.json. If a distro has specific
      // changes to make to the drupal/core version, they will be in place and
      // can be relied on as a data source.
      if (_.isString(coreVersionRange)) {
        options.drupalCoreRelease = createVersionFromRange(coreVersionRange);
      }
      // If the composer.json did not have a version string and we are "online",
      // we can pull the latest stable Drupal release for our major version.
      else if (!options.offline) {
        var done = this.async();
        drupalStableRelease('drupal', options.drupalDistroVersion, done,
          function(err, version, done) {
            if (err) {
              this.log.error(err);
              return done(err);
            }
            options.drupalCoreRelease = version;
            done();
          }.bind(this)
        );
      }
    },

    tokenSetup: function() {
      tokens = require('../lib/tokens')(options);
      env = require('../lib/env')(options);
    }

  },

  writing: {
    dockerComposeLocal: function() {
      tokens.dockerComposeExt = '';
      tokens.cache.docker.extLink = dockerComposeLink(options.machineName + '_${DOCKER_ENV:-local}_cache:cache');
      tokens.db.docker.extLink = options.machineName + '_${DOCKER_ENV:-local}_db:db';

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
      tokens.cache.docker.extLink = dockerComposeLink(options.machineName + "_${DOCKER_ENV}_cache:cache");
      tokens.db.docker.extLink = options.machineName + "_${DOCKER_ENV}_db:db";

      this.fs.copyTpl(
        this.templatePath('docker/build.devcloud.yml'),
        this.destinationPath('build.devcloud.yml'),
        tokens
      );
    },

    docs: function() {
      this.fs.copyTpl(
        this.templatePath('docs/CONTRIBUTING.md'),
        this.destinationPath('CONTRIBUTING.md'),
        tokens
      );

      if (!options['skip-readme']) {
        // Inject our new README section.
        this.fs.copyTpl(
          this.templatePath('docs/README.md'),
          this.destinationPath('DOCKER.md'),
          tokens
        );
      }

      this.fs.copyTpl(
        this.templatePath('docs/TODOS.md'),
        this.destinationPath('TODOS.md'),
        tokens
      );

      this.fs.copyTpl(
        this.templatePath('docs/TODOS.md'),
        this.destinationPath('TODOS.md'),
        tokens
      );

      this.fs.copyTpl(
        this.templatePath('docs/OUTRIGGER.md'),
        this.destinationPath('docs/OUTRIGGER.md'),
        tokens
      );

      this.fs.copyTpl(
        this.templatePath('docs/DEVCLOUD.md'),
        this.destinationPath('docs/DEVCLOUD.md'),
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
        this.log(chalk.red('You must have a valid Grunt-Drupal-Tasks compatible codebase before running outrigger-drupal:environment.'));
        this.log(chalk.yellow('Try running `yo outrigger-drupal` or `yo gadget` first!'));
        if (!options['force']) {
          this.env.error('Project not ready for outrigger-drupal:environment processing.');
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
        pkg.scripts.logs = 'docker-compose logs -ft --tail=10';
      }

      this.fs.writeJSON('package.json', pkg);
    },

    gruntConfig: function() {
      var gcfg = this.fs.readJSON('Gruntconfig.json');
      if (!gcfg) {
        this.log(chalk.red('You must have a valid Grunt-Drupal-Tasks compatible codebase before running outrigger-drupal:environment.'));
        this.log(chalk.yellow('Try running `yo outrigger-drupal` or `yo gadget` first!'));
        if (!options['force']) {
          this.env.error('Project not ready for outrigger-drupal:environment processing.');
        }
      }
      gcfg = gcfg || {}

      gcfg.domain = 'www.' + options.domain + '.vm';
      gcfg.alias = '@' + options.projectName;

      if (!gcfg.project) {
        gcfg.project = {};
      }
      gcfg.project.db = '/opt/backups/latest.sql.gz';

      // Backups configuration is introduced by outrigger-drupal:environment
      gcfg.project.backups = {
        url: 'http://' + env.virtualHost(false, 'backups') + '/' + options.projectName,
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

    gitignore: function() {
      this.fs.copyTpl(
        this.templatePath('gitignore'),
        this.destinationPath('env/.gitignore'),
        tokens
      );
    },

    jenkins: function() {
      this.composeWith(require.resolve('../jenkins'), options);
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
