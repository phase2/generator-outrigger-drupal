# Generator: P2 Environment

> Generate P2 environment configuration for your new or existing Drupal project
with Yeoman.

This project generates usable default Docker and environment configurations for
your [Grunt Drupal Tasks](https://github.com/phase2/grunt-drupal-tasks)-based
Drupal project.

For best results, please use the [Yo P2! generator](https://bitbucket.org/phase2tech/generator-p2).

## Installation
For standalone installation, install directly from bitbucket. An installation of `Yo P2` will not use this.

```
npm install -g git+ssh://bitbucket.org/phase2tech/generator-p2-env.git#master
```

## Run the Generator

```
yo p2-env
```

## Features

### Docker Defaults

* `docker-compose.yml` file for local development.
* `build.yml` for running development operations on your Drupal site.
* `docker-compose.devcloud.yml` and `build.devcloud.yml` for Phase2 Dev Cloud hosted environments.
    * Optional Development, QA, and Review environment configuration in addition to Integration.
* Infrastructure provisioning with built-in support for:
    * MariaDB, Memcache, Redis, Varnish4, Mailhog, Apache, & PHP.
* Generates a DOCKER.md describing how to use these, from `yo p2` it is appended to the main README.

### Drupal Settings & Installation

* Generated `src/sites/settings.common.php` provides
out-of-box installable Drupal configuration.
* `grunt install` tailored to run generated `bin/pre-install.sh`, which enforces cache clearing and site settings.php generation.

### Drush Configuration

* Default site alias based on project name.
* Project-specific drushrc.php set up for lean database dumps.
* Modify or add Drush commands at `env/build/etc/drush`.

### Grunt Drupal Tasks Integration

* All `bin/grunt/*.js` files will be loaded as grunt plugins.
* `grunt install` can install a new site without further configuration, and will load a DB if made availabe at `/opt/backups/latest`.
* Docker environments look for the docroot in build/html, the default configuration for grunt builds.

### Utility Scripts

* Check for module updates
* Review health of Features-based modules
* Generate default user accounts
* Manage database exports

### Project-specific Jenkins

* Fire up the project Jenkins locally or via a Docker hosting server.
* Ready-to-go with key Jenkins plugins out of the box.
* Default jobs to get started out of the box.
    * CI for all feature branches
    * Nightly `dev-support` job to check for module updates and produce a clean database for Developer use.
    * `deploy-dev` job keeping the Development environment up-to-date with all merged code.
    * `deploy-qa` and `deploy-review` jobs to manage the QA and Review environments.
    * Development, Review, and QA "cron" jobs.
    * Behat testing, Static Analysis, and Features health checks on all deployment jobs.
    * Create a new environment by duplicating any `deploy-*` job.

## F.A.Q.

### Why does this project exist?

You might wonder why this project exists when [generator-gadget](https://github.com/phase2/generator-gadget) is available. This project complements generator-gadget's general best practices, with Phase2's own best practices.

From `generator-p2-env` we can roll out development environment assumptions and then build tools and time-savers on top.

### Can I re-run the generator?

All the generators can be re-run on your codebase (and we may automate how that functions in the future). Re-run `yo p2-env` when you want to update the practices initially cooked into your project as our usage of Docker, Jenkins, and other tools evolves. **This will overwrite files you *will have changed* in the course of your project build.**
