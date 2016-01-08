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
    type: 'checkbox',
    name: 'environments',
    message: 'Select default standing environments:',
    default: [
      'dev',
      'qa',
      'ms'
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
        value: 'ms',
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
  }
];

module.exports = prompts;
