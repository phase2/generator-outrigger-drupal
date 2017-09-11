var url = require('url');

var prompts = [
  {
    type: 'input',
    name: 'cloudHost',
    message: 'Outrigger Cloud base URL for your project (Ask for this!): ',
    validate: function (input) {
      if (!input) return 'You must specify a valid domain such as "ci.p2devcloud.com". If you do not have this information, abort and retry answering "No" to Cloud Hosting.';
      if (input.search(' ') !== -1) return 'No spaces allowed.';
      if (input.search('_') !== -1) return 'No underscores allowed.';
      return true;
    },
    filter: function (input) {
      parsed = url.parse(input);
      return parsed.host || parsed.href;
    }
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
        name: 'QA - Regularly scheduled deployments for manual testing.',
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
    name: 'flowdockApiKey',
    message: 'API key for the project flow (found in your account under API Tokens), leave blank to skip:',
  }
]

module.exports = prompts;
