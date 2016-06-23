#!/usr/bin/env bash
##
# Fix File Permissions
#
# Some of the file permissions are broken or mis-aligned as a result
# of the various Docker and filesystem layers.
##

set -x
mkdir -p /var/www/build/html/sites/default/files/private
chown -R apache:apache /var/www/build/html/sites/default/files
chmod 755 /var/www/build/html/sites/default/files
