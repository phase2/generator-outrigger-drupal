# Outrigger Drupal

> Yeoman generator that weaves together Outrigger with other best-in-class tools for your Drupal project.

[![npm version](https://badge.fury.io/js/generator-outrigger-drupal.svg)](https://www.npmjs.com/package/generator-outrigger-drupal)
[![Travis CI status](https://travis-ci.org/phase2/generator-outrigger-drupal.png?branch=master)](https://travis-ci.org/phase2/generator-outrigger-drupal)
[![Greenkeeper badge](https://badges.greenkeeper.io/phase2/generator-outrigger-drupal.svg)](https://greenkeeper.io/)

**This project is mostly generic, but has some remaining pieces related to Phase2-specific development environment hosting.**

This is an umbrella [Yeoman](http://yeoman.io/) generator that asks questions,
then passes the answers to multiple "child" generators that handle their own
aspect of project scaffolding. As the name implies, this generator focuses on Outrigger practices, where some of the other generators in use are focused on broader industry best practices.

## Installation & Usage

### Using Docker

Docker-based usage is available as of v3.0.0. It is the recommended approach as
updates tend to be less prone to complication.

```bash
git clone git@github.com:phase2/generator-outrigger-drupal.git
cd generator-outrigger-drupal
git checkout v3.3.0
docker-compose run --rm cli npm install
mkdir ~/path/to/empty/directory
YO_PROJECT_DIRECTORY=~/path/to/empty/directory docker-compose run --rm yo outrigger-drupal
```

### Using npm

```bash
npm install -g generator-outrigger-drupal
mkdir ~/path/to/empty/directory
cd ~/path/to/empty/directory
yo outrigger-drupal
```

### Command-line Options

* **`--replay`**: Re-run the generator against an existing project, using previously
entered answers.
* **`--use-master`**: Will make a point of leveraging the master version of
grunt-drupal-tasks.
* **`--skip-install`**: Will skip running `npm install` at the end of the
generation process. (Applied by default when you opt-in for the
Docker-based Outrigger Environment.)

## Answering Yeoman Prompts

### First-time Usage

Once Yeoman has been started, you will be prompted to answer six to a dozen
questions about your project. These questions are used by the generator to
select templates, create variables for use in the templates, and further execute
any code or customizations on top of the templated scaffolding.

> ***Please read the output at the end of the generator run, it has instructions
on next steps.***

### Running on a Generated Project

When you use this to generate a project, all your answers are recorded by Yeoman
in a .yo-rc.json file at the root of your repository. As long as you commit this
to the codebase, from then if you run the generator targeting that directory it
will use the previous answers as the defaults to every prompt. For even faster
usage, you can run `yo outrigger-drupal --replay` and it will automatically run
the generator without stopping to ask old questions.

If you run the generator, it will overwrite files. That's the idea in this case,
as your goal is to cherrypick good new stuff the generator provides into your
project. Run `git add -p .` to view each change one chunk at a time, and decide
if it makes sense to discard or keep. Feel free to ask for help.

The extensive [CHANGELOG](./CHANGELOG.md) notes are intended to help guide this process.

### Retrofitting an Existing Project

If you have an existing project and want to retrofit it to use the scaffolding
and tools this generator provides, there is no magical solution.

1. Create a new empty project, answer the prompts to align as closely as
possible with your current projects practices and the goals you have in using
the generator.
2. Copy all the pieces of your codebase into the new structure, including your
.git directory.
3. Adjust your scripts to the new structure, and adjust the generated
configuration and scripts to the parts of your codebase that are not changing.

## Next Steps

Read the generated TODOS.md file. Remove things as you work through mastering
and running your vanilla Drupal system for the first time.

If you are not using the Docker-based development environment, you can get your
codebase built by running `grunt`. From there you are on your own.

If you are using the Docker-based development environment, run `./bin/start.sh`
and your site will be built and a new site installed.

## Child Generators

### Backend Build Process, Testing, & Task Runner

[Grunt Drupal Tasks](https://github.com/phase2/grunt-drupal-tasks) manages backend
development, continuous integration, and overall project tooling for the Drupal
application.

A best practice setup of GDT with a few extra goodies are provided by
Yo Outrigger Drupal's use of [Generator Gadget](https://github.com/phase2/generator-gadget)
to produce the top-level Drupal application scaffolding.

### Component-driven Frontend

[Pattern Lab Starter]([Pattern Lab Starter](http://git.io/p2pls)) is used to
provide an optional Drupal theme with Pattern Lab for collaborative,
design-driven development.

This is set up by [Generator PLS](https://github.com/phase2/generator-pattern-lab-starter).

Grunt Drupal Tasks manages theme compilation via the [Theme Scripts of GDT](https://phase2.github.io/grunt-drupal-tasks/30_FRONTEND/)
so a full site compile can happen by running the project's default build task: `grunt`.

### Docker-based Development Environment

We integrate with Outrigger (now http://outrigger.sh) to provide a quick,
consistent, container-based, local development environment that can also be used
on Phase2's centralized Outrigger hosting to provide integration, testing, and
other environments.

This uses a sub-generator of generator-outrigger-drupal which can be separately executed as `yo outrigger-drupal:environment`.

#### Feature Breakdown

* `docker-compose.yml` which provides Docker configuration for the "operational"
services needed to run your Drupal site locally.
    * Default support for Apache and MariaDB containers, with optional support
    for Redis or Memcache, Varnish, and Mailhog
    * Supports Outrigger's DNSDock-based DNS service for nice URLs.
    * Supports nginx-proxy for Outrigger Hosting nice URLs.
* `build.yml` which provides tailored use of the Outrigger Build container.
    * Persists command-line history on a per project/per environment basis.
    * Persists build tool cache for Drush, Behat/Gherkin, Drupal Console, npm,
    composer, yarn, bower, fontconfig, and any other tool which uses ~/.cache.
    * Defines easy-access use of grunt, drush, drupal console, and composer.
    * Defines a "CLI" service to open a standing BASH session with the build
    container.
* Default settings.php configuration that sets up Drupal environment
configuration the "Docker way" to work out-of-the-box.
* Default Drush configuration for slim database exports and a nice project alias.
* Use Grunt Drupal Tasks via Docker, using minor configuration adjustments.
* Provides a range of shell scripts to run builds, verify aspects of the system,
create default users, and more.

### Project-specific CI & Environment Management

If you liked the Docker-based environments, you can also use our Docker-based
Jenkins instance to manage your central test environments, complete with default
jobs so you can start continuous integration with zero further configuration.

This uses a sub-generator of generator-outrigger-drupal which can be separately executed as `yo outrigger-drupal:jenkins`.

### Feature Breakdown

* Jenkins 1.x CI server pre-configured with various jobs:
    * CI job polling your git repo to run tests.
    * "dev-support" job to produce nightly database dumps of a fresh site install.
    * Optional Environment lifecycle management jobs for Development, QA, and Review
    environments, including: start/stop containers, deploy code, reset admin user password
    * Test jobs to confirm the system is working.
* Workspace details persisted in volume mounts inside repo:jenkins/env/workspace.
