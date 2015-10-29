'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var plPrompts = require('generator-pattern-lab-starter/app/prompts.js');
var gadgetPrompts = require('generator-gadget/lib/prompts.js');
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

    gadgetPrompts.forEach(function (item) {
      if (_.isUndefined(options[item])) {
        prompts.push(item);
      }
    });

    plPrompts.forEach(function (item) {
      if (_.isUndefined(options[item])) {
        prompts.push(item);
      }
    });

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

    //if (_.isUndefined(options.projectDescription)) {
    //  prompts.push({
    //    name: 'projectDescription',
    //    message: 'Description of project?'
    //  });
    //}

    //if (_.isUndefined(options.frontEnd)) {
    //  var frontEndChoices = [];
    //  frontEndChoices.push({'name': 'Pattern Lab Starter', 'value': 'patternLabStarter'});
    //  frontEndChoices.push({'name': 'None', 'value': false});
    //  prompts.push({
    //    name: 'frontEnd',
    //    message: 'What Front End to use?',
    //    type: 'list',
    //    choices: frontEndChoices
    //  })
    //}

    //if (_.isUndefined(options.themeName)) {
    //  prompts.push({
    //    name: 'themeName',
    //    message: 'What would you like to name the theme?',
    //    default: '',
    //    when: function (answers) {
    //      return answers.frontEnd !== false;
    //    }
    //  });
    //}

    // ensuring we only ask questions with the same `name` value once; earlier questions take priority
    prompts = _.uniq(prompts, 'name');

    this.prompt(prompts, function (props) {
      options = _.assign(options, props);
      options.themePath = 'src/themes/' + options.themeName;
      done();
    }.bind(this));

  },

  writing: function () {
    this.composeWith('gadget', {
      options: _.assign(options, {
        "use-master": true,
        themeScripts: {
          "compile-theme": "npm run compile",
          "validate": "npm run test"
        }
      })
    },
    {
      local: require.resolve('generator-gadget')
    });

    this.composeWith('pattern-lab-starter', { options: options }, {
      local: require.resolve('generator-pattern-lab-starter')
    });
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
