'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the fantabulous ' + chalk.red('Phase2') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'themeName',
      message: 'What would you like to name the theme?',
      default: ''
    }];

    this.prompt(prompts, function (props) {
      this.themeName = props.themeName;
      this.themePath = 'src/themes/' + this.themeName;

      this.composeWith('gadget', { options: {
        skipWelcome: true,
        themeName: this.themeName,
        themePath: this.themePath,
        themeScripts: {
          "compile-theme": "npm run compile"
        }
      }});

      this.composeWith('pattern-lab-starter', { options: {
        skipWelcome: true,
        themeName: this.themeName,
        themePath: this.themePath
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
