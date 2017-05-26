var jenkins = require('./jenkins.files.js');

module.exports = {
  minimum: [
    'bin/db-export.sh',
    'bin/features-health.sh',
    'bin/fix-perms.sh',
    'bin/framework.sh',
    'bin/pre-install.sh',
    'bin/seed-users.sh',
    'bin/start.sh',
    'bin/update-scanner.sh',
    'build.yml',
    'build.devcloud.yml',
    'CONTRIBUTING.md',
    'DOCKER.md',
    'docker-compose.yml',
    'env/build/etc/drush/drushrc.php',
    'env/build/etc/drush/aliases.drushrc.php',
    'Gruntconfig.json',
    'package.json',
    'src/sites/settings.common.php',
    'TODOS.md'
  ],
  extended: [],
  minimumJenkins: jenkins.minimum,
  extendedJenkins: jenkins.extended,
  json: {
    'Gruntconfig.json': 'Gruntconfig.json',
    'package.json': 'package.json'
  },
  yaml: {
    'docker-compose.yml': 'docker-compose.yml',
    'build.yml': 'build.yml',
    'build.devcloud.yml': 'build.devcloud.yml'
  }
};
