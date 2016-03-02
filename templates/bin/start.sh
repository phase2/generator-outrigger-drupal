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

DOCKER_ENV=$1
COMPOSE_EXT=".$1"
if [[ -z $DOCKER_ENV ]]; then
  DOCKER_ENV=local
fi

COMPOSE_PROJECT=$2
if [[ -z $COMPOSE_PROJECT ]]; then
  COMPOSE_PROJECT="-p <%= projectName %>_${DOCKER_ENV}"
fi

if [[ $DOCKER_ENV == 'local' ]]; then
  COMPOSE_EXT=''
  COMPOSE_PROJECT=''
fi

# Spin up cache and db services to support build container.
# Web container might take file locks on existing code, blocking the build process.
docker-compose -f docker-compose$COMPOSE_EXT.yml ${COMPOSE_PROJECT} up -d <% if(cache.external) { %>cache <% } %>db

# Build and run static analysis.
docker-compose -f build$COMPOSE_EXT.yml ${COMPOSE_PROJECT} run --rm cli "npm install --unsafe-perm && grunt --force"

# Now safe to activate web container to support end-to-end testing.
docker-compose -f docker-compose$COMPOSE_EXT.yml ${COMPOSE_PROJECT} up -d <% if(proxy.exists) { %>proxy <% } %>www

# Correct any issues in the web container.
docker exec <%= projectName %>_${DOCKER_ENV}_www "/var/www/bin/fix-perms.sh"

# Install the site.
# Errors in final steps of installation require --force to ensure bin/post-install.sh is run.
# Dev triggers a development build of Open Atrium
docker-compose -f build$COMPOSE_EXT.yml ${COMPOSE_PROJECT} run --rm cli "grunt install --no-db-load --force"

# Wipe cache after permissions fix.
docker-compose -f build$COMPOSE_EXT.yml ${COMPOSE_PROJECT} run grunt cache-clear
