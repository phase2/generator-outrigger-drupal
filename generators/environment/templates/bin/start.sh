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
FORCE=''
NOOP=0
# This version is used to facilitate troubleshooting, by indicating which
# version of the generator-outrigger-drupal project produced this script.
# If you re-run the generator please include the update. If you make significant
# changes consider creating a compound version "number" indicating that.
START_VERSION=<%= pkg.version %>
# By default we install a new Drupal site rather than update an existing Drupal site.
UPDATE=0
# This is hard-wired, as currently the options are docker-compose manifests for
# local or devcloud. If we wanted to have separate manifests from those, this
# would need to be more meaningfully parameterized.
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
    -f|--force) FORCE=" --force"; shift ;;
    -u|--update) UPDATE=1; shift ;;
    -n|--noop) export NOOP=1; shift ;;
    *) shift ; break ;;
  esac
done

# The ':-' operator sets local as default if an empty string has been specified
# as the Docker Environment.
DOCKER_ENV=${DOCKER_ENV:-local}
if [[ $DOCKER_ENV == 'local' ]]; then
  COMPOSE_EXT=''
else
  # This is a magic docker-compose environment variable that sets the -p flag.
  # It is only needed for non-local environments assuming the project has only
  # a single local instance.
  #
  # Instead of setting this environment variable, you could invoke commands with:
  #
  # docker-compose -p <project>_qa <args>
  export COMPOSE_PROJECT_NAME=${2-'<%= machineName %>_'${DOCKER_ENV}}
fi

# This is a magic docker-compose environment variable that sets the path to the
# docker manifest which will be used by default. With it set, no -f flag is
# needed.
#
# We use it in this script to declutter the majority of docker-compose
# commands--which use the build container.
#
# Instead of setting this environment variable, you could invoke commands with:
#
# docker-compose -f build.yml <args>
export COMPOSE_FILE=build$COMPOSE_EXT.yml

##
# Error handling.
##

# Stop all containers.
# This will allow follow-up runs via Jenkins to manage the workspace.
# Container rm is left to Jenkins or the developer.
teardown() {
  docker-compose -f docker-compose.yml stop || true
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
echoInfo "Preparing site for environment '$DOCKER_ENV' using start.sh (v${START_VERSION})\n"
export DOCKER_ENV

# Spin up cache and db services to support build container.
# Web container might take file locks on existing code, blocking the build process.
cmd "docker-compose -f docker-compose.yml up -d <% if(cache.external) { %>cache <% } %>db"

# Install dependencies and run main application build.
# Run grunt with --force to ignore errors. This won't help if the errors bail the build.
echoInfo "When grunt commands fail they suggest running with '--force'.\n"
echoInfo "This just suppresses errors and is unlikely to fix issues causing your build process to fail.\n"
cmd "docker-compose run --rm -e NPM_CONFIG_LOGLEVEL=error cli \"npm install && grunt --timer --quiet ${NO_VALIDATE}\""

# Now safe to activate web container to support end-to-end testing.
cmd "docker-compose -f docker-compose.yml up -d <% if(proxy.exists) { %>proxy <% } %>www"

# Correct any issues in the web container.
cmd "docker exec <%= machineName %>_${DOCKER_ENV}_www \"/var/www/bin/fix-perms.sh\""

# Install the site.
if [ "$UPDATE" == 0 ]; then
  cmd "docker-compose run --rm grunt \"install --no-db-load ${FORCE}\""
else
  echoInfo "'grunt update' is defined in Gruntconfig.json\n"
  cmd "docker-compose run --rm grunt update"
fi

# Wipe cache after permissions fix.
cmd "docker-compose run --rm grunt cache-clear"

echo
echoSuccess "Application Setup Complete: "
URL=$(docker-compose -f build$COMPOSE_EXT.yml run --rm drush sa @<%= projectName %> --format=list --fields=uri)
echo "$URL"
echo
