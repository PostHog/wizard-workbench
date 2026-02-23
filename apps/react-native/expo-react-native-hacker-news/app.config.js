const appJson = require('./app.json')

export default {
  ...appJson.expo,
  extra: {
    posthogApiKey: process.env.POSTHOG_API_KEY,
    posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
  },
}
