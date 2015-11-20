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
      'Welcome to the fantabulous ' + chalk.red('Phase2') + ' generator!'
    ));
    options = _.assign({
      skipWelcome: true
    }, this.options);
  },

  prompting: function () {
    var done = this.async();
    var prompts = [];

    var gadgetPrompts = require('generator-gadget/lib/prompts.js');
    gadgetPrompts.forEach(function (item) {
      if (_.isUndefined(options[item])) {
        prompts.push(item);
      }
    });

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
        }
        prompts.push(item);
      }
    });

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
        }
        prompts.push(item);
      }
    });

    // Minimally necessary prompt as a fallback if the other generators drop it.
    if (_.isUndefined(options.projectName)) {
      prompts.push({
        name: 'projectName',
        message: 'Machine name of project?',
        default: _.last(this.env.cwd.split('/')), // parent folder
        validate: function (input) {
          return (input.search(' ') === -1) ? true : 'No spaces allowed.';
        }
      });
    }

    // ensuring we only ask questions with the same `name` value once; earlier questions take priority
    prompts = _.uniq(prompts, 'name');

    this.prompt(prompts, function (props) {
      options = _.assign(options, props);
      options.themePath = 'src/themes/' + options.themeName;
      options['skip-readme'] = true;
      done();
    }.bind(this));

  },

  writing: {
    gadget: function () {
      this.composeWith('gadget', {
        options: _.assign(options, {
          themeScripts: {
            "compile-theme": "npm run compile",
            "validate": "npm run test"
          }
        })
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
