const app = require('./app.json');

module.exports = {
  ...app,
  expo: {
    ...app.expo,
    extra: {
      ...app.expo.extra,
      posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.POSTHOG_HOST,
    },
  },
};
