# Jenkins Integration

This Jenkins setup is used to manage project-specific jobs.

## Setup

This directory contains 2 examples. The local jobs are stored in `env/jobs`. The `env/plugins.txt` file contains pairs of `plugin-name:version` and those get processed and installed during the build phase. This also mounts in the Docker binaries and socket so that Docker commands run inside this container can create containers on the Docker Host.

### Running

To run this container:

  - `docker-compose -f jenkins.yml build jenkins`
  - `docker-compose -f jenkins.yml run jenkins`
