#!/usr/bin/env bash
##
# Test whether features are in a bad state.
##

DATA=`drush @<%= projectName %> pm-updatestatus 2> /dev/null`
echo "$DATA"
DATA=`echo "$DATA" | grep "available"`
# remove leading whitespace characters
DATA="${DATA#"${DATA%%[![:space:]]*}"}"
# remove trailing whitespace characters
DATA="${DATA%"${DATA##*[![:space:]]}"}"
if [ "$DATA" ];	then
  echo "==================================="
  echo $(echo "$DATA" | wc -l) packages need updating!
  exit 1
fi
exit 0
