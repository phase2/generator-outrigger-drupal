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
    'CONTRIBUTING.md',
    'DOCKER.md',
    'docker-compose.yml',
    'docker-compose.override.yml',
    'env/build/etc/drush/drushrc.php',
    'env/build/etc/drush/aliases.drushrc.php',
    'Gruntconfig.json',
    '.outrigger.yml',
    'package.json',
    'src/sites/settings.common.php',
    'TODOS.md'
  ],
  extended: [],
  json: {
    'Gruntconfig.json': 'Gruntconfig.json',
    'package.json': 'package.json'
  },
  yaml: {
    'docker-compose.yml': 'docker-compose.yml',
    'docker-compose.override.yml': 'docker-compose.override.yml',
    'build.yml': 'build.yml',
    '.outrigger.yml': '.outrigger.yml'
  }
};
