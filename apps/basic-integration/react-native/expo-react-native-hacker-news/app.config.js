const { expo } = require('./app.json');

module.exports = {
  ...expo,
  plugins: [...(expo.plugins ?? []), 'expo-localization'],
  extra: {
    ...expo.extra,
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST,
  },
};
