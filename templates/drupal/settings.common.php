<?php
/**
 * Additional site settings.
 */

// Forcibly disable poorman's cron.
$conf['cron_safe_threshold'] = 0;

// Database connection settings.
$databases = array (
  'default' =>
  array (
    'default' =>
    array (
      'database' => '<%= machineName %>_drupal',
      'username' => 'admin',
      'password' => 'admin',
      'host' => 'db',
      'port' => '',
      'driver' => 'mysql',
      'prefix' => '',
    ),
  ),
);
<% if(cache.external && cache.service == 'memcache') { %>
// Add Memcache for internal caching.
$conf['cache_backends'][] = 'sites/all/modules/contrib/memcache/memcache.inc';
$conf['cache_default_class'] = 'MemCacheDrupal';
$conf['cache_class_cache_form'] = 'DrupalDatabaseCache';
$conf['lock_inc'] = 'sites/all/modules/contrib/memcache/memcache-lock.inc';
// Good in theory but stampede protection causes performance regressions.
// Explicitly setting the default behavior in caution for testing.
$conf['memcache_stampede_protection'] = FALSE;
$conf['memcache_servers'] = array(
  'cache:11211' => 'default',
);
$conf['memcache_bins'] = array(
 'cache' => 'default',
);
$conf['memcache_key_prefix'] = '<%= machineName %>_';
<% } -%>
<% if(cache.external && cache.service == 'redis') { %>
// Add Redis for internal caching.

// PhpRedis is slightly higher performance.
$conf['redis_client_interface'] = 'Predis';
// Fatal error in lock mechanism with Predis >= 1.0.2
// There is a patch but testing it now is out of scope.
// https://www.drupal.org/node/2507997
// $conf['lock_inc']               = 'sites/all/modules/contrib/redis/redis.lock.inc';
// Unstable feature that tends to have bad errors in conjunction with other path-related modules.
// $conf['path_inc']               = 'sites/all/modules/contrib/redis/redis.path.inc';
$conf['cache_backends'][]       = 'sites/all/modules/contrib/redis/redis.autoload.inc';
$conf['cache_class_cache_form'] = 'DrupalDatabaseCache';
$conf['cache_default_class']    = 'Redis_Cache';
$conf['redis_client_host']      = 'cache';  // Your Redis instance hostname.
$conf['redis_client_port']      = 6379;
<% } -%>

// Include local settings file as an override.
// settings.local.php should not be committed to the Git repository.
if (file_exists(__DIR__ . '/settings.local.php')) {
  include __DIR__ . '/settings.local.php';
}
