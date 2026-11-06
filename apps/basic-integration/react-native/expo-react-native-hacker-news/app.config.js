const appConfig = require('./app.json')

module.exports = {
  ...appConfig.expo,
  plugins: [...(appConfig.expo.plugins ?? []), 'expo-localization'],
  extra: {
    ...appConfig.expo.extra,
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST,
  },
}
