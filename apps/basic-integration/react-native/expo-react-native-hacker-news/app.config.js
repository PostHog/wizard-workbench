const app = require("./app.json");

module.exports = {
  expo: {
    ...app.expo,
    extra: {
      ...app.expo.extra,
      posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY,
      posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST,
    },
  },
};
