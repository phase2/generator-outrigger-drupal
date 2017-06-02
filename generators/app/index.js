'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var options = {};

module.exports = Generator.extend({
  initializing: function () {
    this.pkg = require('../../package.json');
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the fantabulous ' + chalk.red('Phase2') + ' generator! ' + this.pkg.version
    ));
    options = _.assign({
      skipWelcome: true,
      skipGoodbye: true
    }, this.options);
  },

  prompting: function () {
    if (options['replay']) {
      options = _.assign(options, this.config.getAll());
      // Backwards compatibility for mail handling prompt config.
      if (!options.mail) {
        options.mail = options.mailhog ? 'mailhog' : 'none';
      }
    }

    // Ensure the drupalDistro plugin is loaded for this value when sidestepping
    // the prompt filter.
    if (options.hasOwnProperty('drupalDistro') && typeof options.drupalDistro === 'string') {
      var distros = require('generator-gadget/generators/lib/distros');
      options.drupalDistro = distros[options.drupalDistro];
    }

    var prompts = [];
    var gadgetPrompts = require('generator-gadget/generators/lib/prompts');
    gadgetPrompts.forEach(function (item) {
      if (_.isUndefined(options[item.name])) {
        item.default = this.config.get(item.name) || item.default;
        prompts.push(item);
      }
    }.bind(this));

    if (_.isUndefined(options['useENV'])) {
      prompts.push({
        name: 'useENV',
        type: 'confirm',
        message: 'Use Phase2 DevTools/Docker Environment?'
      });
    }
    var envPrompts = require('../lib/prompts.js');
    envPrompts.forEach(function (item) {
      if (_.isUndefined(options[item.name])) {
        var validate = item.when;
        item.when = function(answers) {
          return answers['useENV'] && (!_.isFunction(validate) || validate(answers));
        };
        item.default = this.config.get(item.name) || item.default;

        prompts.push(item);
      }
    }.bind(this));

    if (_.isUndefined(options['usePLS'])) {
      prompts.push({
        name: 'usePLS',
        type: 'confirm',
        message: 'Use Pattern Lab Starter?'
      });
    }

    var plPrompts = require('generator-pattern-lab-starter/generators/app/prompts.js');
    plPrompts.forEach(function (item) {
      if (_.isUndefined(options[item.name])) {
        var validate = item.when;
        item.when = function(answers) {
          return answers['usePLS'] && (!_.isFunction(validate) || validate(answers));
        };
        item.default = this.config.get(item.name) || item.default;

        // These two need special-case defaulting.
        // @todo themePath emergent from generator-gadget usage.
        if (item.name == 'themePath') {
          item.default = 'src/themes';
        }

        prompts.push(item);
      }
    }.bind(this));

    // Minimally necessary prompt as a fallback if the other generators drop it.
    if (_.isUndefined(options.projectName)) {
      prompts.push({
        name: 'projectName',
        message: 'Machine name of project?',
        default: this.config.get('projectName') || _.last(this.env.cwd.split('/')), // parent folder
        validate: function (input) {
          return (input.search(' ') === -1) ? true : 'No spaces allowed.';
        }
      });
    }

    // ensuring we only ask questions with the same `name` value once; earlier questions take priority
    prompts = _.uniqBy(prompts, 'name');
    return this.prompt(prompts).then(function (props) {
      options = _.assign(options, props);
      // The complete distro includes callbacks that break when serialized to a file.
      options.drupalDistro = options.drupalDistro.id;
      // use the default themeName generator-pattern-lab-starter will use since it
      // is not currently prompting for one in favor of just a themePath
      if (!options['themeName']) {
        options.themeName = 'patternlab';
      }

      var store = options;
      delete store['env'];
      delete store['resolved'];
      this.config.set(store);

      options['skip-readme'] = true;
      // If using Docker-based environment defer running install locally.
      if (options['useENV']) {
        // Suppress dependency install as part of dependency run.
        // --skip-install is used by this project and gadget.
        // --installDeps is the reverse and used by generator-pattern-lab-starter.
        options['skip-install'] = true;
        options['installDeps'] = false;
      }
      if (options['usePLS']) {
        // @todo remove when theme name prompting is explicitly in
        // generator-pattern-lab-starter. We need it here so the environment
        // generator can set up theme wiring. This is the hard-coded name.
        options['themeName'] = 'patternlab';
      }
    }.bind(this));
  },

  writing: {
    gadget: function () {
      var gadgetOptions = {}
      if (options['usePLS']) {
        gadgetOptions.themeScripts = {
          "compile-theme": "npm run setup --unsafe-perm && npm run compile --unsafe-perm",
          "validate": "npm run test --unsafe-perm"
        };
      }
      this.composeWith(require.resolve('generator-gadget'), _.assign(options, gadgetOptions));
    },

    env: function() {
      if (options['useENV']) {
        this.composeWith(require.resolve('../environment'), options);
      }
    },

    pls: function() {
      if (options['usePLS']) {
        this.composeWith(require.resolve('generator-pattern-lab-starter'), options);
      }
    },

    readme: function() {
      var tokens = require('../lib/tokens')(options);
      tokens.useENV = options['useENV'];
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        tokens
      );
    }

  },

  install: function () {
    if (!options['skip-install']) {
      this.npmInstall();
    }
  },

  end: function() {
    var version = {
      gadget: require('generator-gadget/package.json').version,
      env: require('generator-p2/package.json').version,
      pls: require('generator-pattern-lab-starter/package.json').version,
    }

    this.log(yosay('Yo P2 has completed generation of your Drupal project.'));
    this.log('Primary scaffolding created by ' + chalk.red('generator-gadget v' + version.gadget) + '.');
    this.log('Check out your new READMEs to get oriented.');
    if (options['useENV']) {
      this.log('You have chosen a ' + chalk.bold('Docker-based development environment') + ' created by ' + chalk.red('generator-p2:environment v' + version.env) + '.');
      this.log(chalk.yellow('All tools and application code should be run via the Docker containers.'));
      this.log(chalk.green('A handy TODOS.md checklist has been created for your next steps.'));
      this.log('Want to see a running Drupal site without opening a text editor? Run ' + chalk.bold('bash bin/start.sh') + ' now.');
    }
    if (options['usePLS']) {
      this.log('You have created a new theme ' + chalk.green(options.themeName) + ' at ' + chalk.red(options.themePath) + ' with ' + chalk.red('generator-pattern-lab-starter v' + version.pls) + '.');
    }
  }

});
