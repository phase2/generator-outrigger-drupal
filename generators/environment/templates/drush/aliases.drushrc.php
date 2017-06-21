<?php
/**
 * Drush Aliases
 *
 * This file provides for the automatic generation of site aliases based
 * on the file layout and configuration of the Docker hosting environment.
 *
 * Site alias for tuned Drush usage with the '<%= projectName %>' site.
 */

$host = getenv('APP_DOMAIN');

$aliases['<%= projectName %>'] = array(
  'uri' => $host ? $host : 'http://www.<%= domain %>.vm/',
  'root' => '/var/www/build/html',
);
