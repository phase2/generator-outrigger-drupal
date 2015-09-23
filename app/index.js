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
    options = _.assign(this.config, this.options);
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
      //this.themeName = props.themeName;
      options.themePath = 'src/themes/' + options.themeName;

      this.composeWith('gadget', { options: {
        skipWelcome: true,
        themeName: options.themeName,
        themePath: options.themePath,
        themeScripts: {
          "compile-theme": "npm run compile",
          "validate": "npm run test"
        }
      }});

      this.composeWith('pattern-lab-starter', { options: {
        skipWelcome: true,
        themeName: options.themeName,
        themePath: options.themePath
      }});

      done();
    }.bind(this));
  },

  writing: {
/*
    app: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
*/
  },

  install: function () {
//    this.installDependencies({
//      skipInstall: this.options['skip-install']
//    });
  }
});
