#!/usr/bin/env bash
##
# Fix File Permissions
#
# Some of the file permissions are broken or mis-aligned as a result
# of the various Docker and filesystem layers. This script corrects this.
##

set -x
chown -R apache:apache /var/www/html/sites/default
chown -R apache:apache /var/www/html/sites/default/files
chmod -R 755 /var/www/html/sites/default/files
