# Generator: P2 Environment

> Generate P2 environment configuration for your new or existing Drupal project
with Yeoman.

This project generates usable default Docker and environment configurations for
your [Grunt-Drupal-Tasks](https://github.com/phase2/grunt-drupal-tasks)-based
Drupal project.

For best results, please use the [Yo P2! generator](https://bitbucket.org/phase2tech/generator-p2).

## Installation

```
npm install -g git+ssh://bitbucket.org/phase2tech/generator-p2-env.git#master
```

## Run the Generator

```
yo p2-env
```

## Features

* **Docker Defaults**
    * `docker-compose.yml` file for local development.
    * `docker-compose.int.yml` file for integration environments.
    * `build.yml` for running development operations on your Drupal site.
    * Support for MariaDB, optional Memcache, and choice of web images (Apache 2.4/PHP 5.5 or Custom)
     * Generates a DOCKER.md describing how to use these, from `yo p2` it is appended to the main README.
* **Drupal Settings Generation (Currently D7-only)**
    * `src/sites/settings.common.php` ships configuration for a single Drupal site.
    * Includes Database credentials, Memcache config, poormans cron suppression, and support for `src/sites/settings.local.php` overrides.
* **Drush Configuration**
    * Default Site Alias (named for project)
    * Global Drush commands in /etc/drush/commands
    * Global Drush aliases in /etc/drush.
    * Lean database dumps
    * (Revise or add configuration files by editing `env/build/etc/drush`)
* **Grunt-Drupal-Tasks integration**
    * All `bin/grunt/*.js` files will be loaded as grunt plugins.
    * `grunt install` will attempt to load the database created by `bin/db-export.sh` (The script that powers the Jenkin's db-export-nightly job.)
* **Project-specific Jenkins**
    * Fire up the project Jenkins locally or via a Docker hosting server.
    * Ready-to-go with key Jenkins plugins out of the box.
    * Default jobs to get started out of the box.
        * CI for all branches
        * Nightly database dumps

## F.A.Q.

### Why does this project exist?

You might wonder why this project exists when [generator-gadget](https://github.com/phase2/generator-gadget) is available. This project complements generator-gadget's general best practices, with Phase2's own best practices.

From generator-p2-env we can roll out development environment assumptions and then build tools and time-savers on top.

### Can I re-run the generator?

All the generator's can be re-run on your codebase (and we may automate how that functions in the future). Re-run `yo p2-env` when you want to update the practices initially cooked into your project as our usage of Docker, Jenkins, and other tools evolves. **This will overwrite files you will have changed in the course of your project build.**
