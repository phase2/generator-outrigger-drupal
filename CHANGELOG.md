## v3.4.0 (July 18, 2017)

* Added display_errors by default in Drupal settings.common.php.
  In non-CLI environments further enable HTML errors.
* Removed unneeded `--unsafe-perm` flag from npm operations as Build container now applies that via environment variable.
* Fixed Jenkins CI job using the wrong docker-compose configuration.

### Project Plumbing

* Updated Chalk to v2.0.1
* Update .mailmap

## v3.3.1 (June 23, 2017)

* Fixed Jenkins ci job was not properly setting the environment name.
* Fixed drush dispatch to "local" composer-installed Drush is no longer necessary, and in some cases causing duplicate command execution.

## v3.3.0 (June 16 2017)

* Added PHPUnit build service container to facilitate running tests.
* Fixed Jenkins not using outrigger docker image or naming.
* Fixed Unison volume override and standardize on code volumes have no final slash.
* Fixed templating error in build.yml/build.devcloud.yml
* Fixed `rig project run:all-stop` script was totally broken.

### Project Plumbing

* Added README badges to show off our hot stuff.
* Added Greenkeeper dependency update automation.
* Added Travis test automation for all branches and pull requests.
* Updated project version in README installation notes.

## v3.2.0 (June 8 2017)

### Major Changes

#### Support for New Rig Project Commands

As of [rig 1.3.0](https://github.com/phase2/rig/releases/tag/1.3.0),
there is a new facility in the rig CLI to support project-specific operations.

If you opt-in to Docker environment configuration, a default .outrigger.yml
configuration file will be created. This will include various script operations
that are considered best practices for routine use.

The available scripts can be viewed from inside your generated project with
`rig project`. Read more about this in the
[Outrigger Documentation on Project Configuration](http://docs.outrigger.sh/project-setup/project-configuration/).

Amongst other things, this replaces the previous, direct use of bin/start.sh
when setting up a project with `rig project setup`. The start.sh script still
exists but in the future will be broken up into smaller pieces.

**We discourage running start.sh on a regular basis, as there are more specific
commands, many of them facilitated in rig project, that will help solve daily
development tasks.**

#### Environment Configuration

* Add a docker-compose.override.yml which will be applied automatically for local use.
  This contains development-only adjustments to the docker-compose configuration.
  On DevCloud you might skip this by running docker-compose.yml explicitly:
  `docker-compose -f docker-compose.yml up -d`. Currently the only change is for
  Unison support.
* Added out-of-box support for Unison-based filesystem sync of codebase. **This has
  dramatic performance wins.** Anyone running projects on Linux will not see an
  improvement, and for now might safely skip the docker-compose.override.yml file.

### Other Changes

* Upgrade docker-compose.yml from schema v2.1 to schema v3.1. This will help projects
  with future deployment via docker swarm.
* Further "branding" cleanups from the namechange.
* Improvements in generated documentation.

## v3.1.0 (June 5 2017)

* Changed name to generator-outrigger-drupal
* Relocated to Github: https://github.com/phase2/generator-outrigger-drupal

## v3.0.1 (June 5 2017)

* Missed a couple minor bugfixes.

## v3.0.0 (June 5 2017) "The Unification"

### Major Changes

#### New Command for Theme Support in Build Container

Added build container to run gulp in the primary theme when PLS is used.

Usage: `docker-compose -f build.yml run --rm theme`. By default this runs gulp
without parameters, the equivalent of `npm run start`.

View PL at http://theme.<project>.vm/pattern-lab/public

Contribution by **Tanner** & **CJ**

#### Merged generator-p2-env into generator-p2

New combined project contains the "master generator" as well as the environment
and infrastructure focused pieces of the generator stack.

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

## v2.3.0 (February 2017)

Various bugfixes and miscellaneous environment enhancements.

* Bumped version of [generator-p2-env from v1.2.0 to v1.3.0](https://bitbucket.org/phase2tech/generator-p2-env/src/master/CHANGELOG.md)
* Bumped version of [generator-gadget from v1.0.0-rc1 to v1.0.0](https://github.com/phase2/generator-gadget/releases/tag/v1.0.0)
* Fixed redundant prompts not being streamlined.

### generator-p2-env changes

This release was originally meant to be a bugfix release, but many great things
happened that postponed release.

#### BASH History

Persist BASH history in the build container across runs for a given project and
environment.

This is in conjunction with a change to the build container, make sure to run
`docker pull phase2/devtools-build:php<Your Version>` first.

#### Jenkins Overhaul

Split Jenkins into its own sub-generator which can be separately used as
`yo p2-env:jenkins`. Further Jenkins-related changes:

* Update Jenkins image to pull `latest` instead of the version released
  alongside support for Docker 1.9. Recommend you pin your Jenkins image!
* Streamlined Jenkins jobs to use docker-compose environment variables instead
  of the more verbose command-line flags. (COMPOSE_PROJECT_NAME and COMPOSE_FILE
  instead of using the -f and -p flags all the time.)
* Do not re-run the seed-users script on update deploys.
* Added `drush cron` to the tasks that are run after site install or database
  update on Jenkins deploy jobs.

#### Other Changes

* Explicitly declare that projects use Node 4 in build container.
  This facilitates backwards compatibility if the build container switches to
  Node 6 by default.
* Explicitly declare that Xdebug is disabled in build container to clarify
  that it can be enabled.
* Shift docker-compose.yml and build.yml to use DOCKER_ENV environment variable
  instead of hard-coding a local environment. This is a stepping stone to:
    * Easily operate multiple local environment for the same project.
    * Potential elimination of the separate build.devcloud.yml and
      docker-compose.devcloud.yml files.
* Fixed networking with docker-compose schema v2
* Fixed more edge cases with permissions on Drupal files directory.
* Fixed `bin/start.sh` would use empty DOCKER_ENV instead of defaulting to
  `local` if you explicitly set your $DOCKER_ENV to an empty string.

## v2.2.0 (January 2017)

This release stabilizes some emergent bugs around Docker usage and composer builds with Drupal 8.

* Bumped version of [generator-p2-env to v1.2.0](https://bitbucket.org/phase2tech/generator-p2-env/src/master/CHANGELOG.md)
* Bumped version of [generator-gadget to v1.0.0-rc1](https://github.com/phase2/generator-gadget/releases/tag/v1.0.0-rc1)

### generator-p2-env changes

* Add build container support for Drupal Console (must include as a project
  composer dependency.) Use with `docker-compose -f build.yml run --rm drupal`.
* Now using docker-compose manifest schema v2.1
* Switched to use new DNSdock label configuration instead of environment
  variable configuration in docker-compose manifests.
* Fixed `latest` not found for build container. (Drupal 7 now standardized on
  PHP 5.6 and Drupal 8 on PHP 7.0)
* Streamlined `bin/start.sh` script
    * Added `--rm` to more docker-compose commands in bin/start.sh to avoid
      dangling containers.
    * Using more of docker-compose tool's environment variables to minimize the
      number of option flags needed. (e.g., COMPOSE_FILE, COMPOSE_PROJECT_NAME)
    * Fixed site URI output at the end of execution.

## v2.1.0 (July 2016)

* Bumped version of [generator-p2-env to v1.1.0](https://bitbucket.org/phase2tech/generator-p2-env/src/master/CHANGELOG.md)
* Pinned version of [generator-gadget to v0.5.0](https://github.com/phase2/generator-gadget/releases/tag/v0.5.0)
* Pinned version of [generator-pattern-lab-starter to v2.0.0](https://github.com/phase2/generator-pattern-lab-starter)

### generator-p2-env changes (v1.1.0)

* Added Docker container start and stop jobs for all environments.
* Added rebuild script to run `bin/start.sh with --update` for greater clarity
  on already setup development environments.
* Added more Drupal 8 cache tables to default Drush excludes.

### generator-p2-env changes (v1.0.0)

#### Major Features

##### Doctor.sh in the House

There is now `bin/doctor.sh` to check on project setup. If your project is not
working, please run it to confirm easily checked problems are not the issue.
Parts of this might later move into Grunt Drupal Tasks.

##### Operational vs. Base Build Container

All build containers previously extended from `base`, a parent container that
sets up common environment variables, volume mounts, and other behaviors.
A new `operational` service definition is now the direct parent of the
functional containers.

This allows projects to define new build services that extend from `operational`
 when they need the use of backing services like the database, or extend from
`base` when they do not. This allows pure filesystem or build operations to be
run without the additional overhead.

#### Compatibility Breaks

* `base` build container no longer has dependency on backing services like
  database or memcache. This means it also cannot run commands accessing those
  services.
* New Drupal 7 projects or updates via the `--replay` will now use PHP 5.6.
  This can be manually changed.

#### Release Notes

##### Features

* Easily create new build services that do or do not use the Drupal backing services.
* Added `npm run d` as a convenient shorthand to run `docker-compose -f build.yml run`
  in your local environment (not inside container). Use commands like `npm run d cli`
  to start a "bash" session in the build container.
* Added `npm run logs` to watch a live stream of PHP logs, containing Drupal syslog
  if that module is active. This log is not included in the `docker logs` output.
* Boosted default PHP max_execution_time to 60 seconds.
* Added output of Drupal site URL to `bin/start.sh` output.
* Added `bin/doctor.sh` to automate checks on project setup.
* Switched to new [Docker image naming for Apache/PHP and Varnish containers](https://hub.docker.com/r/phase2/apache-php/).
* Updated Drupal 7 projects to use PHP 5.6.

## v2.0.0 (April 2016)

* Bumped version of [generator-p2-env to v0.3.0](https://bitbucket.org/phase2tech/generator-p2-env/src/master/CHANGELOG.md)
* Added test coverage

### generator-p2-env changes

This release represents a significant amount of R&D pursued as part of field-use
of the Yo P2 generator suite. After some shakedown and some light structuring
changes, this is likely close to a 1.0 release.

#### Major Features

##### Exception Handling with Bash Traps

Jenkins jobs and the `bin/start.sh` script now use signal traps to catch errors or
interruptions of any kind. When that happens the script stops execution and the
Docker containers are taken down. You can suppress errors on a line-by-line basis
in many grunt commands with the `--force` flag, or in Bash by simply appending
`|| true` to the end of the line. This fixes the problem of Jenkins reporting
false success.

##### Simplification of docker-compose Configuration Files

Docker Compose is a utility that bridges complex configuration manifests to the
Docker client for management of Docker containers. Previously, we needed two
files per environment: one for operating services, the other for build targets.

Now there are two sets of these files (leaving aside the one for Jenkins):

* `docker-compose.yml` and `build.yml` for local development
* `docker-compose.devcloud.yml` and `build.devcloud.yml` for environments hosted in Dev Cloud.

(The dependency on Dev Cloud is one of filesystem conventions, it is not tied
to Phase2 infrastructure specifically.)

Running docker-compose commands locally is unchanged. However, on ci.p2devcloud.com,
it has a significant change.

> ###### No Longer
>
> ```
> docker-compose -f build.qa.yml -p project_qa run drush cache-clear all
> ```

> ###### Instead
>
> ```
> DOCKER_ENV=qa docker-compose -f build.devcloud.yml -p project_qa run drush cache-clear all
> ```

**This allows us to spin up new environments on Dev Cloud as easily as creating a new Jenkins job.**

In the course of this change, the docker-compose files were also adjusted to have more inline
documentation and intra-file inheritance. This allows much easier management of consistent volume
mounts, environment variables, and other pieces of configuration used in common.

##### `bin/start.sh` a More Robust Tool

This script is used in all Jenkins deployment and CI jobs to manage container
setup, build process, and site installation in a consistent manner. It is also
the recommended approach to start up a project locally for the first time, or
when a clean reset is needed.

The `bin/start.sh` script has got command-line options now, including:

* `--update` to skip installation
* `--no-validate` to skip static analysis in build
* `--noop` to simulate script execution
* `--help` learn what else it can do!

#### Compatibility Breaks

* docker-compose commands on Dev Cloud are changed, see long description above.
* Rename `ms` environment to `review` for clarity.
* Convert URLs to the form qa-project.ci.p2devcloud.com for easier DNS & SSL management
* Default new projects to use the ci2.p2devcloud.com host. Use `--ciHost=ci.p2devcloud.com`
  to keep using the original.
* Project-specific Drush volume mount is now placed inside the container at `/root/.drush`
* Drop support for environment variable `DEVTOOLS_PRIVATE_KEY`. SSH keys are now
  only injected into the Jenkins container with volume mounts. If your local
  `id_rsa` key does not private the necessary access for local Jenkins use, temporarily
  edit the `jenkins.yml` file. In the future this might be parameterized
  (see [Docker Compose #2441](https://github.com/docker/compose/issues/2441))

#### Release Notes

##### Features

* Jenkins deploy jobs now have an option to run update instead of reinstall.
* start.sh now takes real options and has usage output.
* Make better use of error handling to halt and clean up after errors in jobs.
* Add volume mounts to persist tool caches across build runs.
* Added optional MailHog service to capture Drupal email and facilitate testing.
  **See generated `TODOS.md`, this feature requires manual action per project.**
* Streamline docker-compose manifests, `*.devcloud.yml` instead of one per environment.
* Break Jenkins home into views by environment with primary for key shortcuts.
* Add jenkins-test-fail job to check on Jenkins error handling.
* Added deploy-local job for local testing of Jenkins
* Added the colorization library from _devtools_vm past, began light use.
* Automated test coverage, 45 assertions and counting.
* Generated documentation improvements

##### Bugs

* Stop clobbering registry-rebuild command which is provided by the devtools-build container
* Stop risky use of nginx-proxy reserved `VIRTUAL_HOST` environment variable in build containers.
* Fixed generator `--replay` run if `flowdockApiKey` and `gitRepoUrl` are not set.
* Replace each instance of hyphen with underscore to generate machine name.
* Make shell scripts executable by default and remove explicit bash shelling to execute.
* Use underscores in lieu of hyphens in all docker-centric identifiers.
