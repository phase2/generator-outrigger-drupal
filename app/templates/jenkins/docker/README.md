# Jenkins Integration

This Jenkins setup is used to manage project-specific jobs.

## Setup

Project jobs are stored in `env/jenkins/jobs`. The `env/jenkins/plugins.txt` file contains pairs of `plugin-name:version` and those get processed and installed during the build phase.

### Running

To run this container:

  - `docker-compose -f jenkins.yml build jenkins`
  - `docker-compose -f jenkins.yml run jenkins`

### Jenkins Jobs

There are several Jenkins jobs packaged in the repository.

* **ci**: Triggered by every push to the configured Git repository, CI runs all tests and checks and reports back on the health of the code branch.
* **db-export-nightly:** Produces a nightly snapshot database of a clean install. This is made available at `/opt/backups/nightlies`. The most recent snapshot can be found at `/opt/backups/latest.sql.gz`.
* **jenkins-test-default:** A simple job to confirm Jenkins is working.
* **jenkins-test-docker:** A simple job to confirm Jenkins can run docker commands.

### Updating Jobs for Your Infrastructure

Each job may be configured with one or more organization-specific settings.

Many jobs designate a Git repository that is used for canonical development. This repository setting will need to be updated to match the correct Git repository URL.

Phase2 uses [Flowdock](https://flowdock.com) for team messaging, commonly the Jenkins jobs are configured to send a message to the project chat room. Please reconfigure or disable that setting when using this to set up Jenkins for your environment.
