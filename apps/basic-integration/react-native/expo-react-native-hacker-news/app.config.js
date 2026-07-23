const { expo: expoConfig } = require('./app.json');

module.exports = {
  expo: {
    ...expoConfig,
    extra: {
      posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
    },
  },
};
