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

    if (!options.projectName) {
      prompts.push({
        name: 'projectName',
        message: 'Machine name of project?',
        default: _.last(this.env.cwd.split('/')), // parent folder
        validate: function (input) {
          return (input.search(' ') === -1) ? true : 'No spaces allowed.';
        }
      });
    }

    if (!options.projectDescription) {
      prompts.push({
        name: 'projectDescription',
        message: 'Description of project?'
      });
    }

    if (!options.backEnd) {
      var backEndChoices = [];
      backEndChoices.push({'name': 'Drupal 8', 'value': '8.x'});
      backEndChoices.push({'name': 'Drupal 7', 'value': '7.x'});
      prompts.push({
        name: 'backEnd',
        message: 'What Back End to use?',
        type: 'list',
        choices: backEndChoices
      })
    }

    if (!options.frontEnd) {
      var frontEndChoices = [];
      frontEndChoices.push({'name': 'Pattern Lab Starter', 'value': 'patternLabStarter'});
      frontEndChoices.push({'name': 'None', 'value': false});
      prompts.push({
        name: 'frontEnd',
        message: 'What Front End to use?',
        type: 'list',
        choices: frontEndChoices
      })
    }

    if (!options.themeName) {
      prompts.push({
        name: 'themeName',
        message: 'What would you like to name the theme?',
        default: '',
        when: function (answers) {
          return answers.frontEnd !== false;
        }
      });
    }

    this.prompt(prompts, function (props) {
      options = _.assign(options, props);
      options.themePath = 'src/themes/' + options.themeName;
      //_.forEach(options, function (value, key) {
      //  this.config.set(key, value);
      //}, this);
      done();
    }.bind(this));

  },

  writing: function () {
    this.composeWith('gadget', {
      options: _.assign(options, {
        themeScripts: {
          "compile-theme": "npm run compile",
          "validate": "npm run test"
        }
      })
    });

    if (options.frontEnd === 'patternLabStarter') {
      this.composeWith('pattern-lab-starter', { options: options });
    }
  },

  install: function () {
//    this.installDependencies({
//      skipInstall: this.options['skip-install']
//    });
  }
});
