<?php
/**
 * Drush System configuration
 *
 * This file configures all usage of Drush on this server.
 */

// Look for alias files.
$options['alias-path'] = '/etc/drush';

// Look for command files for auto-include.
$options['include'] = '/etc/drush/commands';

// Let Drush use unlimited memory.
ini_set('memory_limit', -1);

// Allow Drush to run forever.
ini_set('max_execution_time', -1);

// Ignore the data in these tables, but keep the table structures. Make sure to
// update the list when new cache tables are added. For Atrium sites see the
// example.drushrc.php shipped with the distribution for its complete list.
$options['structure-tables']['common'] = array(
  'cache',
  'cache_block',
  'cache_bootstrap',
  'cache_field',
  'cache_filter',
  'cache_form',
  'cache_menu',
  'cache_page',
  'cache_path',
  'cache_token',
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

// Use the list of cache tables above.
$options['structure-tables-key'] = 'common';
