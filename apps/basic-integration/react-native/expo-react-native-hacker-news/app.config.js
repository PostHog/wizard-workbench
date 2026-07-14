const config = require("./app.json");

module.exports = {
  ...config,
  expo: {
    ...config.expo,
    extra: {
      ...config.expo.extra,
      posthogProjectToken: process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST,
    },
  },
};
