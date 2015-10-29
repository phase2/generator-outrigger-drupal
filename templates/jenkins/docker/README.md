# Jenkins Integration

This Jenkins setup is used to manage project-specific jobs.

## Setup

Project jobs are stored in `env/jenkins/jobs`. The `env/jenkins/plugins.txt` file contains pairs of `plugin-name:version` and those get processed and installed during the build phase.

### Running

To run this container:

  - `docker-compose -f jenkins.yml build jenkins`
  - `docker-compose -f jenkins.yml run jenkins`
