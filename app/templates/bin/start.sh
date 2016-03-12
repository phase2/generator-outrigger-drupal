#!/usr/bin/env bash
##
# Start
#
# This script takes your freshly cloned repository and takes it to a working
# Drupal site hosted in a Docker container stack.
#
# Arguments:
#  - environment: The first argument is an environment designator. This is not
#    validated, if the name is not a supported environment this script will
#    have multiple failures. Default value: `local`.
#  - project name: Optional. This argument defines the project name, which in
#    combination with the environment designator, is used to define a unique,
#    project specific name for docker-compose.
##

##
# Initialize parameters.
##
NAME=`basename "$0"`
DOCKER_ENV=${1-local}
COMPOSE_EXT=".devcloud"
COMPOSE_PROJECT=${2-'-p <%= machineName %>_'${DOCKER_ENV}}

if [[ $DOCKER_ENV == 'local' ]]; then
  COMPOSE_EXT=''
  COMPOSE_PROJECT=''
fi

##
# Error handling.
##

# Stop all containers.
# This will allow follow-up runs via Jenkins to manage the workspace.
# Container rm is left to Jenkins or the developer.
teardown() {
  docker-compose -f docker-compose$COMPOSE_EXT.yml ${COMPOSE_PROJECT} stop || true
}

# Handler for errors and interruptions.
cancel() {
  echo "$NAME: Error: Line $1: $2"
  teardown
  exit 33
}

# Final actions to take whenever the script ends.
complete() {
  ret=$1
  [ "$ret" -eq 0 ] || echo >&2 "$NAME: aborted ($ret)"
}

# Cancel docker start on errors.
trap 'cancel $LINENO $BASH_COMMAND' ERR SIGINT SIGTERM
trap 'complete $?' EXIT

##
# Bring up the site.
##
echo "Preparing site for environment '$DOCKER_ENV'"
export DOCKER_ENV

# Spin up cache and db services to support build container.
# Web container might take file locks on existing code, blocking the build process.
docker-compose -f docker-compose$COMPOSE_EXT.yml ${COMPOSE_PROJECT} up -d <% if(cache.external) { %>cache <% } %>db

# Install dependencies and run main application build.
# Run grunt with --force to ignore errors.
# --unsafe-perm ensures dispatch to theme-related operations can still run as root for Docker.
docker-compose -f build$COMPOSE_EXT.yml ${COMPOSE_PROJECT} run --rm cli "npm install --unsafe-perm && grunt --timer --quiet"

# Now safe to activate web container to support end-to-end testing.
docker-compose -f docker-compose$COMPOSE_EXT.yml ${COMPOSE_PROJECT} up -d <% if(proxy.exists) { %>proxy <% } %>www

# Correct any issues in the web container.
docker exec <%= machineName %>_${DOCKER_ENV}_www "/var/www/bin/fix-perms.sh"

# Install the site.
# Errors in final steps of installation require --force to ensure bin/post-install.sh is run.
docker-compose -f build$COMPOSE_EXT.yml ${COMPOSE_PROJECT} run --rm cli "grunt install --no-db-load --force"

# Wipe cache after permissions fix.
docker-compose -f build$COMPOSE_EXT.yml ${COMPOSE_PROJECT} run grunt cache-clear
