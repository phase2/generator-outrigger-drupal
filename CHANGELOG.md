# CHANGELOG

## N.N.N (Next Release)

### Major Features

#### Doctor.sh in the House

There is now `bin/doctor.sh` to check on project setup. If your project is not working, please run it to confirm easily checked problems are not the issue. Parts of this might later move into Grunt Drupal Tasks.

#### Operational vs. Base Build Container

All build containers previously extended from `base`, a parent container that sets up common environment variables, volume mounts, and other behaviors. A new `operational` service definition is now the direct parent of the functional containers.

This allows projects to define new build services that extend from `operational` when they need the use of backing services like the database, or extend from `base` when they do not. This allows pure filesystem or build operations to be run without the additional overhead.

### Compatibility Breaks

* `base` build container no longer has dependency on backing services like database or memcache. This means it also cannot run commands accessing those services.

### Release Notes

#### Features

* Added `npm run d` as a convenient shorthand to run `docker-compose -f build.yml run`
  in your local environment (not inside container). Use commands like `npm run d cli`
  to start a "bash" session in the build container.
* Added `npm run logs` to watch a live stream of PHP logs, containing Drupal syslog
  if that module is active. This log is not included in the `docker logs` output.
* Boosted default PHP max_execution_time to 60 seconds.
* Added output of Drupal site URL to `bin/start.sh` output.
* Added `bin/doctor.sh` to automate checks on project setup.

## 0.3.0 (April 2016)

This release represents a significant amount of R&D pursued as part of field-use
of the Yo P2 generator suite. After some shakedown and some light structuring
changes, this is likely close to a 1.0 release.

### Major Features

#### Exception Handling with Bash Traps

Jenkins jobs and the `bin/start.sh` script now use signal traps to catch errors or
interruptions of any kind. When that happens the script stops execution and the
Docker containers are taken down. You can suppress errors on a line-by-line basis
in many grunt commands with the `--force` flag, or in Bash by simply appending
`|| true` to the end of the line. This fixes the problem of Jenkins reporting
false success.

#### Simplification of docker-compose Configuration Files

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

> ##### No Longer
>
> ```
> docker-compose -f build.qa.yml -p project_qa run drush cache-clear all
> ```

> ##### Instead
>
> ```
> DOCKER_ENV=qa docker-compose -f build.devcloud.yml -p project_qa run drush cache-clear all
> ```

**This allows us to spin up new environments on Dev Cloud as easily as creating a new Jenkins job.**

In the course of this change, the docker-compose files were also adjusted to have more inline
documentation and intra-file inheritance. This allows much easier management of consistent volume
mounts, environment variables, and other pieces of configuration used in common.

#### `bin/start.sh` a More Robust Tool

This script is used in all Jenkins deployment and CI jobs to manage container
setup, build process, and site installation in a consistent manner. It is also
the recommended approach to start up a project locally for the first time, or
when a clean reset is needed.

The `bin/start.sh` script has got command-line options now, including:

* `--update` to skip installation
* `--no-validate` to skip static analysis in build
* `--noop` to simulate script execution
* `--help` learn what else it can do!

### Compatibility Breaks

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

### Release Notes

#### Features

* Jenkins deploy jobs now have an option to run update instead of reinstall.
* start.sh now takes real options and has usage output.
* Make better use of error handling to halt and clean up after errors in jobs.
* Add volume mounts to persist tool caches across build runs.
* Added optional MailHog service to capture Drupal email and facilitate testing. **See generated `TODOS.md`, this feature requires manual action per project.**
* Streamline docker-compose manifests, `*.devcloud.yml` instead of one per environment.
* Break Jenkins home into views by environment with primary for key shortcuts.
* Add jenkins-test-fail job to check on Jenkins error handling.
* Added deploy-local job for local testing of Jenkins
* Added the colorization library from _devtools_vm past, began light use.
* Automated test coverage, 45 assertions and counting.
* Generated documentation improvements

#### Bugs

* Stop clobbering registry-rebuild command which is provided by the devtools-build container
* Stop risky use of nginx-proxy reserved `VIRTUAL_HOST` environment variable in build containers.
* Fixed generator `--replay` run if `flowdockApiKey` and `gitRepoUrl` are not set.
* Replace each instance of hyphen with underscore to generate machine name.
* Make shell scripts executable by default and remove explicit bash shelling to execute.
* Use underscores in lieu of hyphens in all docker-centric identifiers.

## v0.2.1 (February 2016)

Changes since version v0.2.0.

### Features

* Add `--unsafe-perm` to start.sh so project package.json can postinstall theme.
* Add optional support for Varnish via [phase2/varnish4](https://hub.docker.com/r/phase2/varnish4/) Docker image.
(Direct application still available via `app.project.vm`)
* Wipe Redis/Memcache caches on pre-install (via `pre-install.sh`, triggered by `grunt install`). This does not have any Drupal or Drush dependency.
* Allow CI job to run arbitrary Git revisions.

### Bugs

* Support nvm in build container by avoiding subshelling commands.
* Jenkins was reporting Docker library errors in console output,
this has been fixed in [phase2/jenkins-docker](https://hub.docker.com/r/phase2/jenkins-docker) and has
been enforced by the generator by specifying the required 1.9.1 release.
* Disable memcache stampede protection by default.
* Fixed `deploy-*` and `dev-support` Jenkins jobs pulling random git revisions.
* Fixed lack of `CONTRIBUTING.md` generation.
