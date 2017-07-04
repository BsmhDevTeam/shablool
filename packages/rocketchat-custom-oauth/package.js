Package.describe({
  name: 'lidorcg:rocketchat-custom-oauth',
  summary: 'Custom OAuth flow',
  version: '1.0.0',
  git: 'https://github.com/RocketChat/Rocket.Chat/tree/master/packages/rocketchat-custom-oauth',
  documentation: 'README.md',
});

Package.onUse(function(api) {
  api.use('modules');
  api.use('check');
  api.use('oauth');
  api.use('oauth2');
  api.use('underscore');
  api.use('ecmascript');
  api.use('accounts-oauth');
  api.use('service-configuration');
  api.use('underscorestring:underscore.string');
  api.use('random', 'client');
  api.use('templating', 'client');
  api.use('http', 'server');

  api.mainModule('custom_oauth_client.js', 'client');
  api.mainModule('custom_oauth_server.js', 'server');
  api.export('CustomOAuth');
});
