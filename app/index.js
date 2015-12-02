'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var options = {};

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the fantabulous ' + chalk.red('Phase2') + ' generator! ' + this.pkg.version
    ));
    options = _.assign({
      skipWelcome: true
    }, this.options);
  },

  prompting: function () {
    var addBehaviors = function() {
      if (options['themeName']) {
        options.themePath = 'src/themes/' + options.themeName;
      }
      options['skip-readme'] = true;
      // If using Docker-based environment defer running install locally.
      if (options['useENV']) {
        options['skip-install'] = true;
      }
    }

    if (options['replay']) {
      options = _.assign(options, this.config.getAll());
      // Ensure the drupalDistro plugin is loaded for this value when sidestepping
      // the prompt filter.
      if (options.hasOwnProperty('drupalDistro') && typeof options.drupalDistro === 'string') {
        var distros = require('generator-gadget/app/distros');
        options.drupalDistro = distros[options.drupalDistro];
      }
      addBehaviors();
    }
    else {
      var done = this.async();
      var prompts = [];

      var gadgetPrompts = require('generator-gadget/lib/prompts.js');
      gadgetPrompts.forEach(function (item) {
        if (_.isUndefined(options[item])) {
          item.default = this.config.get(item.name) || item.default;
          prompts.push(item);
        }
      }.bind(this));

      prompts.push({
        name: 'useENV',
        type: 'confirm',
        message: 'Use Phase2 DevTools/Docker Environment?'
      });
      var envPrompts = require('generator-p2-env/lib/prompts.js');
      envPrompts.forEach(function (item) {
        if (_.isUndefined(options[item])) {
          var validate = item.when;
          item.when = function(answers) {
            return answers['useENV'] && (!_.isFunction(validate) || validate(answers));
          };
          item.default = this.config.get(item.name) || item.default;

          prompts.push(item);
        }
      }.bind(this));

      prompts.push({
        name: 'usePLS',
        type: 'confirm',
        message: 'Use Pattern Lab Starter?'
      });
      var plPrompts = require('generator-pattern-lab-starter/app/prompts.js');
      plPrompts.forEach(function (item) {
        if (_.isUndefined(options[item])) {
          var validate = item.when;
          item.when = function(answers) {
            return answers['usePLS'] && (!_.isFunction(validate) || validate(answers));
          };
          item.default = this.config.get(item.name) || item.default;

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
      prompts = _.uniq(prompts, 'name');

      this.prompt(prompts, function (props) {
        options = _.assign(options, props);
        // The complete distro includes callbacks that break when serialized to a file.
        props.drupalDistro = props.drupalDistro.id;
        this.config.set(props);
        addBehaviors();
        done();
      }.bind(this));
    }
  },

  writing: {
    gadget: function () {
      var gadgetOptions = {}
      if (options['usePLS']) {
        gadgetOptions.themeScripts = {
          "compile-theme": "npm run compile",
          "validate": "npm run test"
        };
      }

      this.composeWith('gadget', {
        options: _.assign(options, gadgetOptions)
      },
      {
        local: require.resolve('generator-gadget')
      });
    },
    env: function() {
      if (options['useENV']) {
        this.composeWith('p2-env', { options: options }, {
          local: require.resolve('generator-p2-env')
        });
      }
    },
    pls: function() {
      if (options['usePLS']) {
        this.composeWith('pattern-lab-starter', { options: options }, {
          local: require.resolve('generator-pattern-lab-starter')
        });
      }
    },

    readme: function() {
      if (options['useENV']) {
        var tokens = require('generator-gadget/lib/util').tokens(options);
        // Yeoman's dependencies cannot handle dynamic partial includes.
        // This is not currently used.
        tokens.gadgetPath = path.resolve(require.resolve('generator-gadget'), 'app/templates/README.md');
        tokens = _.merge(options, tokens);

        this.fs.copyTpl(
          this.templatePath('README.md'),
          this.destinationPath('README.md'),
          tokens
        );
      }
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
