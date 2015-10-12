<?php
/**
 * Drush Aliases
 *
 * This file provides for the automatic generation of site aliases based
 * on the file layout and configuration of the Docker hosting environment.
 *
 * Site alias for tuned Drush usage with the '<%= projectName %>' site.
 */

function p2_env_get_url() {
  if (isset($_ENV['VIRTUAL_HOST'])) {
    return $_ENV['VIRTUAL_HOST'];
  }

  return 'http://www.<%= projectName %>.vm/';
}

$aliases['<%= projectName %>'] = array(
  'url' => p2_env_get_url(),
  'root' => '/var/www/html'
);
