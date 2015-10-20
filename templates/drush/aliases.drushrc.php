<?php
/**
 * Drush Aliases
 *
 * This file provides for the automatic generation of site aliases based
 * on the file layout and configuration of the Docker hosting environment.
 *
 * Site alias for tuned Drush usage with the '<%= projectName %>' site.
 */

$aliases['<%= projectName %>'] = array(
  'uri' => isset($_ENV['VIRTUAL_HOST']) ? $_ENV['VIRTUAL_HOST'] : 'http://www.<%= projectName %>.vm/',
  'root' => '/var/www/html'
);
