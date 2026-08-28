const appConfig = require("./app.json");

module.exports = () => ({
  ...appConfig.expo,
  extra: {
    ...appConfig.expo.extra,
    posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY,
    posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  },
});
