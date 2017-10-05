'use strict';

var _ = require('lodash');
var platforms = require('./platforms');
var docker = require('./docker');


var prompts = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Machine-name of your project?',
    // Name of the parent directory.
    default: _.last(process.cwd().split('/')),
    validate: function (input) {
      return (input.search(' ') === -1) ? true : 'No spaces allowed.';
    }
  },
  {
    type: 'list',
    name: 'drupalDistroVersion',
    message: 'Choose your Drupal version:',
    choices: [
      '7.x',
      '8.x'
    ],
    default: '7.x'
  },
  {
    type: 'list',
    name: 'hosting',
    message: 'Choose your hosting platform:',
    choices: function(answers) {
      return platforms.toPromptOptions(answers);
    },
    default: 'outrigger'
  },
  {
    type: 'list',
    name: 'webserver',
    message: 'Choose your webserver:',
    choices: function (answers) {
      var options = docker.imageOptions(answers.hosting || 'outrigger', 'www');
      options.push('custom');
      return options;
    }
  },
  {
    name: 'webImage',
    message: 'Specify an override of the webserver Docker image (default is an example, not necessarily the image used.):',
    default: 'outrigger/apache-php:php70',
    when: function(answers) {
      return answers.webserver == 'custom';
    },
    validate: function(input) {
      if (!_.isString(input) || input.length == 0 || input.search(' ') !== -1) {
        return 'A valid docker image identifier is required.';
      }

      return true;
    }
  },
  {
    type: 'list',
    name: 'cacheInternal',
    message: 'Choose a cache backend:',
    choices: function(answers) {
      var options = docker.imageOptions(answers.hosting || 'outrigger', 'cache');
      options.push({value: 'database', name: 'Database'});
      return options;
    },
    default: function (answers) {
      if (answers.drupalDistroVersion == '8.x') {
        return 'database';
      }
      return 'memcache';
    }

  },
  {
    type: 'list',
    name: 'proxyCache',
    message: 'Choose a proxy cache:',
    choices: function(answers) {
      var options = docker.imageOptions(answers.hosting, 'proxy');
      options.push('none');
      return options;
    },
    when: function (answers) {
      return docker.hasService(answers.hosting, 'proxy');
    },
    default: 'none'
  },
  {
    type: 'list',
    name: 'mail',
    message: 'Choose an email handling approach:',
    choices: function(answers) {
      var options = docker.imageOptions(answers.hosting, 'mail');
      options.push('none');
      return options;
    },
    when: function (answers) {
      return docker.hasService(answers.hosting, 'mail');
    },
    default: 'none'
  },
  {
    type: 'input',
    name: 'domain',
    message: 'Domain for local development (www.<domain>.vm):',
    default: function(answers) {
      return answers['projectName'].replace(/_|\s/, '-')
    },
    validate: function (input) {
      return input.match(/_|\s|[A-Z]/) == undefined ? true : 'Please use a value qualified for use as a domain name. No spaces, underscores, or capital letters allowed.';
    }
  },
  {
    type: 'input',
    name: 'gitRepoUrl',
    message: 'URL to the Git Repo for checkout by Jenkins and other tools:',
    default: function(answers) {
      var gitBaseUrl = platforms.load()[answers.hosting || 'outrigger'].tools.git.baseUrl;
      return gitBaseUrl + answers.projectName + '.git';
    }
  },

];

module.exports = prompts;
