const appConfig = require("./app.json");

const config = appConfig.expo;

module.exports = {
  ...config,
  extra: {
    ...config.extra,
    posthogProjectToken: process.env.EXPO_PUBLIC_POSTHOG_KEY,
    posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  },
};
