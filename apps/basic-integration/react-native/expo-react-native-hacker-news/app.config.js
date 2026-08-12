const appConfig = require("./app.json");

module.exports = () => ({
  ...appConfig.expo,
  extra: {
    ...appConfig.expo.extra,
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST,
  },
});
