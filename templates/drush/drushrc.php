<?php
/**
 * Drush System configuration
 *
 * This file configures usage of Drush on the build container, in conjunction
 * with configuration and commands placed in /etc/drush.
 */

// On drush sql-dump and other database extraction operations, ignore the data
// in these tables, but keep the table structures.
// Make sure to update the list when new cache tables are added.
// For Atrium sites see the `example.drushrc.php` shipped with the distribution
// for a complete list.
$options['structure-tables']['common'] = array(
  'cache',
  'cache_block',
  'cache_bootstrap',
  'cache_config',
  'cache_container',
  'cache_data',
  'cache_default',
  'cache_discovery',
  'cache_entity',
  'cache_field',
  'cache_filter',
  'cache_form',
  'cache_menu',
  'cache_migrate',
  'cache_page',
  'cache_path',
  'cache_render',
  'cache_rest',
  'cache_token',
  'cache_toolbar',
  'cache_update',
  'cache_variable',
  'cache_views',
  'cache_views_data',
  'history',
  'search_index',
  'search_node_links',
  'search_total',
  'sessions',
);

$options['structure-tables']['common-and-logging'] = array_merge($options['structure-tables']['common'], array(
  'watchdog',
));

// Use the list of cache tables above.
$options['structure-tables-key'] = 'common';
