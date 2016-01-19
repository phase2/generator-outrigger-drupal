#!/usr/bin/env bash
##
# Seed Users
#
# Creates dummy users for testing.
#
# Run from root of the code repository.
#
# This script is not automatically triggered by Grunt, and must be run/automated
# separately if desired in a given environment.
##

drush @<%= projectName %> user-create "<%= projectName%>admin" --password="admin1" --mail="<%= projectName %>admin@example.com"
