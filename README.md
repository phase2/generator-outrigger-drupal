# Yo P2! – the Phase2 Site Generator

> Yeoman generator that weaves together multiple generators, tools, and Phase2
best practices to kick off Drupal projects in style.

This is an umbrella [Yeoman](http://yeoman.io/) generator that asks questions,
then passes the answers to multiple "child" generators that handle their own
aspect of the scaffolding. As the name implies, this generator focuses on Phase2
practices, where some of the other generators in use are focused on broader industry
best practices.

## Installation


Look up the latest tagged version by doing:
```
git clone git@bitbucket.org:phase2tech/generator-p2.git
cd generator-p2.git
git describe HEAD 
```

Install the npm module and replace `{version}` below with the tag
```bash
npm install --global git+ssh://bitbucket.org/phase2tech/generator-p2.git#{version}
```

## Run the Generator

> If you have trouble getting the generator to run, or updating the generator,
check out the [CONTRIBUTING.md](./CONTRIBUTING.md) guide for the instructions on
how to use Docker to run the generator.

Make an empty folder, and initiate the generator:

```bash
yo p2
```

Once all questions are answered a complete code scaffolding will be created.
Generate a working codebase with another one-liner:

```bash
grunt
```

> **Note that if you opted-in to create a Docker-based environment you will have
alternate instructions, you will not be running grunt.**

> ***Please read the output at the end of the generator run, it has instructions
on next steps.***

### Command-line Options

* **`--replay`**: Re-run the generator against an existing project, using previously
entered answers.
* **`--use-master`**: Will make a point of leveraging the master version of
grunt-drupal-tasks.
* **`--skip-install`**: Will skip running `npm install` at the end of the
generation process. (Applied by default when you opt-in for the
Docker-based Phase2 Environment.)

## Features

### Backend Build Process, Testing, & Task Runner

[Grunt Drupal Tasks](https://github.com/phase2/grunt-drupal-tasks) manages backend
development, continuous integration, and overall project tooling for the Drupal
application.

A best practice setup of GDT with a few extra goodies are provided by Yo P2's
use of [Generator Gadget](https://github.com/phase2/generator-gadget) to produce
the top-level Drupal application scaffolding.

### Best Practices Frontend

[Pattern Lab Starter]([Pattern Lab Starter](http://git.io/p2pls)) is used to
provide an optional Drupal theme with Pattern Lab for collaborative,
design-driven development.

This is set up by [Generator PLS](https://github.com/phase2/generator-pattern-lab-starter).

Grunt Drupal Tasks manages theme compilation via the [Theme Scripts of GDT](https://phase2.github.io/grunt-drupal-tasks/30_FRONTEND/)
so a full site compile can happen by running the project's default build task: `grunt`.

### Docker-based Development Environment

We integrate with Phase2 DevTools (now http://outrigger.sh) to provide a quick,
consistent, container-based local development environment that can also be used
on Phase2's centralized docker hosts to provide testing and review environments.

This uses a sub-generator of generator-p2 which can be separately executed as
`yo p2:environment`.

### Project-specific CI & Environment Management

If you liked the Docker-based environments, you can also use our Docker-based
Jenkins instance to manage your central test environments, complete with default
jobs so you can start continuous integration with zero further configuration.

This uses a sub-generator of generator-p2 which can be separately executed as
`yo p2:jenkins`.