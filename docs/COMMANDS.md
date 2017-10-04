# Commands

As of Outrigger Drupal v3.2, projects now have the use of `rig` as a local task
runner to manage operations that are run outside of containers.

# Essential Operations

Operation         | Description
------------------|------------
**rig project up** | Start up operational docker containers and filesystem sync.
**rig project stop** | Halt operational containers and filesystem sync.
**rig project build** | Run the end-to-end build process.
**rig project install** | Install the Drupal site.
**rig project update** | Update the Drupal database to match current code.

# Built-in Operations

## rig project sync

You can always use rig project sync to spin up the data sync, it has a dedicated
configuration section but its core behavior is directly managed by the rig tool.
For more on this, please read the [filesystem sync documentation](http://docs.outrigger.sh/project-setup/filesystem-sync/).

# Generated Operations

The generated operations in the outrigger.yml file are only a starting place for
projects, so the documentation on the default configurations for these operations
should not be taken as canonical.

## Managing Docker

These operations assist developers in the basic container management for local
productivity. There is plenty more to do using the various command-line tools,
but this set of daily use and example tasks will allow projects to automate
how to start and stop work sessions in the same way for their whole team, and
learn how to more easily build out more project-specific container wrangling.

### rig project run:up

> Start up operational docker containers and filesystem sync.

* **Alias:** `rig project up`

You will use this when starting to work on a given project since your
last "shutdown", be that of your local system, Docker (via `rig stop`), or
`rig project stop` to spin down the project.

### rig project run:stop

> Halt operational containers and filesystem sync.

* **Alias:** `rig project stop`

Use this to stop the current project from active resource use on
your machine. Useful to suspend a project's operations.

### rig project run:ps

> Get a list of all containers associated with this project. Unlike
`docker-compose ps`, this will include all containers even for different
configuration files.

Demonstrates more advanced options of the `docker ps` command,
including how to filter by the outrigger.project label to see all containers
regardless of docker-compose project, DOCKER_ENV environment, or operational
vs. build container.

### rig project run:all-stop

> Halt all containers associated with this project.

Demonstrates piping docker ps to the `xargs` utility to perform
an operation on each "queried" container. This demonstrates stopping, but it
could also be used to remove, healthcheck, or docker exec into each container.

## Managing Drupal

Most tasks of Drupal management are done more explicitly with services defined
for the project's build container in build.yml, or executed via the cli service
using Grunt, Composer, Drush, and Drupal Console.

### rig project run:build

> Run the end-to-end build process.

This task ensures all dependencies are installed, all source files are compiled
to executables (e.g., SASS => CSS), and all custom code is wired into the Drupal
application for development purposes.

* **Alias:** `rig project build`

### rig project run:install

> Install the Drupal site.

This is a simple convenience to running the `grunt install` command via the build
container. It also uses Drush to output the URL of the site.

Gruntconfig.json has a scripts property with two magically named scripts:

```
"pre-install": "bash bin/pre-install.sh",
"post-install": "bash bin/post-install.sh",
```

These are automatically called as before and after steps of every installation,
the scripts are generated and can be edited as needed for your project.

For example, pre-install.sh guarantees you have a src/sites/default/settings.php
file. post-install.sh fixes up the site permissions to preserve developer ability
to edit the settings file. These items are not defined as part of the rig
operation so these steps are also followed in remote test environments.

* **Alias:** `rig project install`

### rig project run:update

> Update the Drupal database to match current code.

This is a simple convenience to running `grunt update`, itself defined in the
Gruntconfig.json `update` operation so it can be easily chained to other steps.

* **Alias:** `rig project update`

### rig project run:theme

> Compile all theme assets, activate watch, and start up pattern-lab.

Run on its own, this is an alias for running `gulp` in the main theme directory.
Additional arguments passed to the command will be sent along as gulp arguments,
though as with any additional arguments for `rig project` it may need to be
wrapped in quotation marks.

* **Alias:** `rig project theme`

## "Server" Ops

These commands facilitate the "server administration" kinds of activities that
are still needed, but need to be done in a more docker-savvy way.

### rig project run:fix-permissions

> Fix permissions for Apache to run code and access files. (Automatically run as
part of rig project install.)

This task is surfaced as a rig project command to ensure it has high visibility,
file permissions errors can be tricky and there is already a script to be modified
to ensure a project has a single "source of truth" for how permissions should be set.

* **Alias:** `rig project fix-perms`

### rig project run:logs

> Stream the logs produced by your Docker project containers. To limit output add '--tail=20'.

Default Docker log-handling behavior (which Outrigger retains and Outrigger
images attempt to support) is to treat any output to stdout inside the container
as "log". Running docker logs against a container will output it, and
`docker-compose logs` will aggregate from all containers in the project.

There are still a few gaps in the log collection, for example Drupal Watchdog
logs are not yet swept up into this.

* **Alias:** `rig project logs`

## Developer Experience

### rig project run:run

> Run one of the build container services such as 'cli' or 'drush'.

This is a more memorable alias for commands such as:

```
docker-compose -f build.yml run --rm
```

and allows easier sharing of that shorthand in scripts and communications than
individual aliases. Be sure to keep it simple, as it should always be easy
to sidestep this with direct use of other docker commands for local aliases
or edge cases that demand more sophisticated command flags.

* **Alias:** `rig project run`

## Onboarding Operations

These are included to facilitate easily onboarding developers to a project.

It is not expected that these will be needed more than Day 0 except in unusual
situations, such as needing to completely rebuild the working environment.

### rig project run:welcome

> Codebase orientation.

This operation outputs a few bits of orienting text, and is a good place to drop
any Must Know information. This is more along the lines of a reminder, and should
not be the "canonical" location of any details.

* **Alias:** `rig project tour`

### rig project run:setup

> Run the end-to-end repository initialization and site install script.

First-time initialization of the project or rebuilds after broad environment failure.

It can be easy to treat this as a panacea for any problem, but doing so will take
more time to execute and prevents more meaningful troubleshooting so the problem
does not recur.

* **Alias:** `rig project setup`
