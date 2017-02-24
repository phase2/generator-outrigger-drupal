#!/usr/bin/env bash
##
# Fix File Permissions
#
# Some of the file permissions are broken or mis-aligned as a result
# of the various Docker and filesystem layers.
#
# Paths used align with the volume mappings in the docker-compose
# and build configuration files.
##

set -x
mkdir -p /var/www/src/sites/default/files/private
chown -R apache:apache /var/www/src/sites/default/files
chmod 755 /var/www/src/sites/default/files
