const { expo } = require("./app.json");

module.exports = {
  ...expo,
  extra: {
    ...expo.extra,
    posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY,
    posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  },
};
