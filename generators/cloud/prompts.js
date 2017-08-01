var prompts = [
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
