// app.config.js extends app.json with runtime environment variables
// PostHog keys are injected via process.env at build time (read from .env)
const baseConfig = require('./app.json')

module.exports = {
  ...baseConfig.expo,
  extra: {
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST,
  },
}
