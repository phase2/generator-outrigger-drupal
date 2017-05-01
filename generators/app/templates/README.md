# <%= title %>

> <%= description %>

<!-- Insert short paragraph describing the project's architecture and where to find more information. -->

<%= distroDescription %>

## About This Repository

This codebase is maintained in a minimal working repository containing custom code
and manifests of upstream dependencies. [Grunt-Drupal-Tasks](https://github.com/phase2/grunt-drupal-tasks)
(a Node.js tool based on the popular Grunt task-runner) is used for development
and operational management of the application code. A build process downloads and assembles all dependencies for deployment into the webserver.

<% if (useENV) { %><% include ../../environment/templates/docs/README.md %>
## Running without Docker<% } else { %>## Getting Started <% } %>

### Requirements

* [Node.js](https://nodejs.com) v4 via a [package manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager) or [standalone installer](http://nodejs.org/download/)
* [Grunt](https://gruntjs.org) (`npm install -g grunt-cli`)
* PHP 5.6
* [Composer](https://getcomposer.org/download) (e.g. `brew install composer`)

### Installation

* **`npm install`:** Retrieve build system dependencies.
* **`grunt`:** Validate and assemble functional Drupal codebase.
* **`drush si`:** From inside the Drupal docroot.

### Get Oriented

* To learn about available commands run `grunt help`.

## Scaffolded with Generators

Initial generation of this project's code structure was built with [Yo P2](https://bitbucket.org/phase2tech/generator-p2)
and related code-generation projects.

To refresh your project with our latest practices, update your local copy of this
tool, and run `yo p2 --replay --force`. Do not forgot to carefully inspect each
change for compatibility with your ongoing project before committing.

The `--replay` option pulls configuration values for the generator from *.yo-rc.json*,
where they can be reviewed or edited by experts at any time.
