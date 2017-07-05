/* global CustomOAuth */
const config = {
  serverURL: 'https://joe.idf',
  identityPath: '/api/v3/user',
  scope: 'api',
  addAutopublishFields: {
    forLoggedInUser: ['services.gitlab'],
    forOtherUsers: ['services.gitlab.username'],
  },
};

const Gitlab = new CustomOAuth('gitlab', config);

// TODO: PRODUCTION - change gitlab url
