'use strict';

var _ = require('lodash');

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
    name: 'webserver',
    message: 'Choose your webserver:',
    choices: [
      'apache',
      'custom'
    ],
    default: 'apache'
  },
  {
    name: 'webImage',
    message: 'Specify your webserver Docker image:',
    default: 'phase2/apache24php55',
    when: function(answers) {
      return answers.webserver == 'custom';
    },
    validate: function(input) {
      if (_.isString(input)) {
        return true;
      }

      return 'A validate docker image identifier is required.';
    }
  },
  {
    type: 'list',
    name: 'cacheInternal',
    message: 'Choose a cache backend:',
    default: 'memcache',
    choices: [
      'memcache',
      'redis',
      'database'
    ]
  },
  {
    type: 'list',
    name: 'proxyCache',
    message: 'Choose a proxy cache:',
    default: 'none',
    choices: [
      'none',
      'varnish'
    ]
  },
  {
    type: 'confirm',
    name: 'mailhog',
    message: 'Use MailHog for email testing?',
    default: false
  },
  {
    type: 'confirm',
    name: 'pl',
    message: 'Use Pattern Lab for the theme?',
    default: false
  },
  {
    type: 'checkbox',
    name: 'environments',
    message: 'Select default standing environments:',
    default: [
      'dev',
      'qa',
      'review'
    ],
    choices: [
      {
        value: 'dev',
        name: 'Development - Automatically updates when PRs are merged.',
        short: 'Development'
      },
      {
        value: 'qa',
        name: 'QA - Regularly scheduled deployments for manual Phase2 testing.',
        short: 'QA'
      },
      {
        value: 'review',
        name: 'Review - Milestone review sandbox for client use.',
        short: 'Review'
      }
    ]
  },
  {
    type: 'input',
    name: 'domain',
    message: 'Domain for local development (www.<domain>.vm):',
    default: _.last(process.cwd().split('/')).replace(/_|\s/, '-'),
    validate: function (input) {
      return input.match(/_|\s/) == undefined ? true : 'Please use a value qualified for use as a domain name. No spaces or underscores allowed.';
    }
  },
  {
    type: 'input',
    name: 'gitRepoUrl',
    message: 'URL to the Git Repo for checkout by Jenkins and other tools:',
    default: function(answers) {
      return 'git@bitbucket.org:phase2tech/' + answers.projectName + '.git';
    }
  },
  {
    type: 'input',
    name: 'flowdockApiKey',
    message: 'API key for the project flow (found in your account under API Tokens), leave blank to skip:',
  }
];

module.exports = prompts;
