#!/usr/bin/env bash
##
# Start
#
# This script takes your freshly cloned repository and takes it to a working
# Drupal site hosted in a Docker container stack.
##

CALLPATH=`dirname $0`
source "$CALLPATH/framework.sh"

##
# Initialize parameters.
##

NAME=`basename "$0"`
NO_VALIDATE=''
NOOP=0
START_VERSION=<%= pkg.version %>
UPDATE=0
COMPOSE_EXT=".devcloud"

# Wrangle CLI options
TEMP=`getopt -o e::,h,i,n,u,v --long environment::,help,update,noop,no-validate,version -n '$NAME' -- "$@"`

usage() {
  cat <<EOF
Usage: $name [options]

-e|--environment     Specify which environment to target.
-h| --help           This help text.
-i|--no-validate     Skip the static analysis validate step.
                     Useful for speedy build process, or when the report-generating
                     analyze task will also be used.
-n|--noop            Take no action, just output the commands to be run.
-u|--update          Instead of site install, run site update procedures.
EOF
  echo
  echo "Version ${START_VERSION} of ${NAME}."
}

while true ; do
  case "$1" in
    -h|-v|--version|--help) usage ; exit 0 ;;
    # Supported for backwards compatibility with existing Jenkins jobs.
    dev|int|local|ms|qa|review) DOCKER_ENV=$1 ; shift ;;
    -e|--environment) DOCKER_ENV=$2 ; shift 2 ;;
    -i|--no-validate) NO_VALIDATE=" --no-validate"; shift ;;
    -u|--update) UPDATE=1; shift ;;
    -n|--noop) export NOOP=1; shift ;;
    *) shift ; break ;;
  esac
done

DOCKER_ENV=${DOCKER_ENV-local}
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
  echoError "$NAME: Error: Line $1: $2\n"
  teardown
  exit 33
}

# Final actions to take whenever the script ends.
complete() {
  ret=$1
  [ "$ret" -eq 0 ] || echoFail >&2 "$NAME: aborted ($ret)\n"
}

# Cancel docker start on errors.
trap 'cancel $LINENO $BASH_COMMAND' ERR SIGINT SIGTERM SIGQUIT
trap 'complete $?' EXIT

##
# Bring up the site.
##
echoInfo "Preparing site for environment '$DOCKER_ENV' using start.sh (v${START_VERSION})"
export DOCKER_ENV

# Spin up cache and db services to support build container.
# Web container might take file locks on existing code, blocking the build process.
cmd "docker-compose -f docker-compose$COMPOSE_EXT.yml ${COMPOSE_PROJECT} up -d <% if(cache.external) { %>cache <% } %>db"

# Install dependencies and run main application build.
# Run grunt with --force to ignore errors.
# --unsafe-perm ensures dispatch to theme-related operations can still run as root for Docker.
cmd "docker-compose -f build$COMPOSE_EXT.yml ${COMPOSE_PROJECT} run --rm cli \"npm install --unsafe-perm && grunt --timer --quiet\""

# Now safe to activate web container to support end-to-end testing.
cmd "docker-compose -f docker-compose$COMPOSE_EXT.yml ${COMPOSE_PROJECT} up -d <% if(proxy.exists) { %>proxy <% } %>www"

# Correct any issues in the web container.
cmd "docker exec <%= machineName %>_${DOCKER_ENV}_www \"/var/www/bin/fix-perms.sh\""

# Install the site.
if [ "$UPDATE" == 0 ]; then
  # Errors in final steps of installation require --force to ensure bin/post-install.sh is run.
  # Dev triggers a development build of Open Atrium
  cmd "docker-compose -f build$COMPOSE_EXT.yml ${COMPOSE_PROJECT} run --rm cli \"grunt install --no-db-load --force\""
else
  echoInfo "`grunt update` is defined in Gruntconfig.json"
  cmd "docker-compose -f build$COMPOSE_EXT.yml ${COMPOSE_PROJECT} run --rm cli grunt update"
fi

# Wipe cache after permissions fix.
cmd "docker-compose -f build$COMPOSE_EXT.yml ${COMPOSE_PROJECT} run grunt cache-clear"

if [ "$DOCKER_ENV" == 'local' ]; then
  echo
  echoSuccess "Application Setup Complete: "
  // @todo derive URL from DNSDOCK query.
  echo "http://www."<%= domain %>".vm"
fi
echo
