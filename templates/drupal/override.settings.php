<?php
/**
 * Additional site settings.
 */

<% if(cacheLink) { %>
// Add Memcache for internal caching.
$conf['cache_backends'][] = 'sites/all/modules/contrib/memcache/memcache.inc';
$conf['cache_default_class'] = 'MemCacheDrupal';
$conf['cache_class_cache_form'] = 'DrupalDatabaseCache';
$conf['lock_inc'] = 'sites/all/modules/contrib/memcache/memcache-lock.inc';
$conf['memcache_stampede_protection'] = TRUE;
$conf['memcache_servers'] = array(
  'cache.<%= projectName %>.vm:11211' => 'default',
);
$conf['memcache_bins'] = array(
 'cache' => 'default',
);
$conf['memcache_key_prefix'] = '<%= projectName %>_';
<% } %>
