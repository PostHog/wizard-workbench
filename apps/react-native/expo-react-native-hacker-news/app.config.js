const baseConfig = require('./app.json')

module.exports = {
  ...baseConfig.expo,
  extra: {
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST,
  },
}
