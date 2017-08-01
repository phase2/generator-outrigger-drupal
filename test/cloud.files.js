module.exports = {
  minimum: [
    'build.devcloud.yml',
    'env/jenkins/config.xml',
    'env/jenkins/jobs/ci/config.xml',
    'env/jenkins/jobs/deploy-local/config.xml',
    'env/jenkins/jobs/dev-support/config.xml',
    'env/jenkins/jobs/jenkins-test-default/config.xml',
    'env/jenkins/jobs/jenkins-test-docker/config.xml',
    'env/jenkins/jobs/jenkins-test-fail/config.xml',
    'jenkins.yml',
    'docs/DEVCLOUD.md'
  ],
  extended: [
    'env/jenkins/jobs/cron-dev/config.xml',
    'env/jenkins/jobs/cron-qa/config.xml',
    'env/jenkins/jobs/cron-review/config.xml',
    'env/jenkins/jobs/deploy-dev/config.xml',
    'env/jenkins/jobs/deploy-qa/config.xml',
    'env/jenkins/jobs/deploy-review/config.xml',
    'env/jenkins/jobs/password-reset-dev/config.xml',
    'env/jenkins/jobs/password-reset-qa/config.xml',
    'env/jenkins/jobs/password-reset-review/config.xml',
  ],
  minimumXml: {
    'env/jenkins/config.xml': 'main configuration',
    'env/jenkins/jobs/ci/config.xml': '"ci" job configuration',
    'env/jenkins/jobs/deploy-local/config.xml': '"deploy-local" job configuration',
    'env/jenkins/jobs/dev-support/config.xml': '"dev-support" job configuration',
    'env/jenkins/jobs/jenkins-test-default/config.xml': '"jenkins-test-default" job configuration',
    'env/jenkins/jobs/jenkins-test-docker/config.xml': '"jenkins-test-docker" job configuration',
    'env/jenkins/jobs/jenkins-test-fail/config.xml': '"jenkins-test-fail" job configuration'
  },
  extendedXml: {
    'env/jenkins/jobs/deploy-qa/config.xml': '"deploy-qa" job configuration',
    'env/jenkins/jobs/start-qa/config.xml': '"start-qa" job configuration',
    'env/jenkins/jobs/stop-qa/config.xml': '"stop-qa" job configuration',
    'env/jenkins/jobs/deploy-dev/config.xml': '"deploy-dev" job configuration',
    'env/jenkins/jobs/start-dev/config.xml': '"start-dev" job configuration',
    'env/jenkins/jobs/stop-dev/config.xml': '"stop-dev" job configuration',
    'env/jenkins/jobs/deploy-review/config.xml': '"deploy-review" job configuration',
    'env/jenkins/jobs/start-review/config.xml': '"start-review" job configuration',
    'env/jenkins/jobs/stop-review/config.xml': '"stop-review" job configuration',
  },
  yaml: {
    'jenkins.yml': 'jenkins.yml',
    'build.devcloud.yml': 'build.devcloud.yml'
  }
};
