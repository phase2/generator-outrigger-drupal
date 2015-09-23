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
    options = this.options;
  },

  prompting: function () {
    var done = this.async();
    var prompts = [];

    if (!options.themeName) {
      prompts.push({
        type: 'input',
        name: 'themeName',
        message: 'What would you like to name the theme?',
        default: ''
      });
    }

    this.prompt(prompts, function (props) {
      options = _.assign(options, props);
      options.themePath = 'src/themes/' + options.themeName;

      done();
    }.bind(this));
  },

  writing: function () {
    this.composeWith('gadget', {
      options: {
        skipWelcome: true,
        themeName: options.themeName,
        themePath: options.themePath,
        themeScripts: {
          "compile-theme": "npm run compile",
          "validate": "npm run test"
        }
      }
    });

    this.composeWith('pattern-lab-starter', {
      options: {
        skipWelcome: true,
        themeName: options.themeName,
        themePath: options.themePath
      }
    });
  },

  install: function () {
//    this.installDependencies({
//      skipInstall: this.options['skip-install']
//    });
  }
});
