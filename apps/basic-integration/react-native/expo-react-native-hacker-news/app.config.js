const appConfig = require('./app.json')

const { expo } = appConfig

module.exports = {
  ...expo,
  extra: {
    ...expo.extra,
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST,
  },
}
