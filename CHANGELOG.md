## v3.0.0 (???) "The Unification"

### Major Changes

#### New Command for Theme Support in Build Container

Added build container to run gulp in the primary theme when PLS is used.

Usage: `docker-compose -f build.yml run --rm theme`. By default this runs gulp
without parameters, the equivalent of `npm run start`.

View PL at http://theme.<project>.vm/pattern-lab/public

Contribution by **Tanner** & **CJ**

#### Vary Environment Setup by Production Hosting Destination

Add hosting platform selection architecture with initial options:
  * Default (Outrigger/Dev Cloud)
  * Acquia Cloud

#### Drop docker-compose.devcloud.yml

While build.devcloud.yml is still with us, docker-compose.yml now has everything
needed for our "operational" services. On hosted environments you run as:

```bash
# Start up the operational services for the QA environment of <project>
DOCKER_ENV=qa docker-compose -p <project>_qa up -d
# Run the Build CLI for the QA environment of <project>
DOCKER_ENV=qa docker-compose -f build.devcloud.yml -p <project>_qa run --rm cli
```

#### Node Version Change

Switched to Node v6 by default instead of Node v4.

### Environment Changes

#### Things to Actively Use or Account For

* Fixed errors where Drupal Console, Drush, and Grunt run without a further flag
  or sub-command would error trying to process "bin/bash" as an argument.
  (Solution by **CJ**)
* Added `composer` as a top-level service in the build container configuration.
  Use with `docker-compose -f build.yml run --rm composer <args>`
* Switched Devtools mentions to Outrigger, including changing environment
  variables such as $DEVTOOLS_SSH_KEY to $OUTRIGGER_SSH_KEY
* Changed directory structure of volume mounts to always use `/data/<project>/<env>/`
  instead of `/data/<project>_<env>`. We hope this streamlines cleanup work.
* Add outrigger.project label to all containers, allowing commands such as:
  `docker ps --filter "label=outrigger.project=<projectName>" -a` to find all containers
  and `docker ps --filter "label=outrigger.project=<projectName>" -a -q | xargs docker stop`
  to halt all of them. This is more comprehensive than a single `docker-compose ps` call.

#### Things to Passively Benefit From

* Minimize build.devcloud.yml and docker-compose.devcloud.yml by making the baseline
  configuration a little more dynamic and using docker-compose "extends" as much
  as possible.
* Added permissions fix to `src/sites/default` directory to keep it write-able
  after a site install. This should prevent branch-switching permissions issues.
  (Remember: Fix permissions problems by running /var/www/bin/fix-perms.sh in container.)
* If running grunt inside docker, `grunt git-setup` will configure your git
  hooks to run via the docker build container.
* Switched to use the Outrigger Docker images. (This is a minimal change.)
* Added a persistent cache for Behat/Gherkin to the build container.
* Added clarifying terminal output about the un-usefulness of `--force` in
  the build process.
* Centrally suppress grunt-drupal-tasks desktop notifications for build container.
* Fixed log shortcut in package.json to use docker-compose logs.
  (A future release will remove this, as we do not encourage use of npm on local machine.)
* Fixed echo statement in start.sh executing and failing a stray grunt command.
* Added missing newlines from the end of several echo statements in start.sh
  (Contribution by *Dave Murray*)
* Default the domain prompt to the previously confirmed projectName, rather than the
  base of the current working directory (CWD).
* Remove vestigial bits of Phase2 from the environment prompts.

### Usage Features

* Run the generator via new Docker integration! This fixes the generator
  upgrading/dependency chaos that many developers run into.

### Technical Underbelly

* Merged generator-p2-env into generator-p2.
* Upgraded to Yeoman 1.x and fixed related technical debt.
* Added Longjohn for vastly easier asynchronous and templating troubleshooting.
* Further race condition squashing.

## v2.3.0 (Februrary 2017)

Various bugfixes and miscellaneous environment enhancements.

* Bumped version of [generator-p2-env from v1.2.0 to v1.3.0](https://bitbucket.org/phase2tech/generator-p2-env/src/master/CHANGELOG.md)
* Bumped version of [generator-gadget from v1.0.0-rc1 to v1.0.0](https://github.com/phase2/generator-gadget/releases/tag/v1.0.0)
* Fixed redundant prompts not being streamlined.

## v2.2.0 (January 2017)

This release stabilizes some emergent bugs around Docker usage and composer builds with Drupal 8.

* Bumped version of [generator-p2-env to v1.2.0](https://bitbucket.org/phase2tech/generator-p2-env/src/master/CHANGELOG.md)
* Bumped version of [generator-gadget to v1.0.0-rc1](https://github.com/phase2/generator-gadget/releases/tag/v1.0.0-rc1)

## v2.1.0 (July 2016)

* Bumped version of [generator-p2-env to v1.1.0](https://bitbucket.org/phase2tech/generator-p2-env/src/master/CHANGELOG.md)
* Pinned version of [generator-gadget to v0.5.0](https://github.com/phase2/generator-gadget/releases/tag/v0.5.0)
* Pinned version of [generator-pattern-lab-starter to v2.0.0](https://github.com/phase2/generator-pattern-lab-starter)

## v2.0.0 (April 2016)

* Bumped version of [generator-p2-env to v0.3.0](https://bitbucket.org/phase2tech/generator-p2-env/src/master/CHANGELOG.md)
* Added test coverage
