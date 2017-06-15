Package.describe({
  name: 'lidorcg:rocketchat-gitlab',
  version: '0.0.1',
  summary: 'RocketChat settings for GitLab Oauth Flow',
  git: 'https://github.com/RocketChat/Rocket.Chat/tree/develop/packages/rocketchat-gitlab',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use('ecmascript');
  api.use('lidorcg:rocketchat-custom-oauth');
  api.use('templating', 'client');

  api.addFiles('rocketchat-gitlab.js');
});

