// eslint-disable-next-line @typescript-eslint/no-require-imports
const appJson = require('./app.json')

export default {
  ...appJson.expo,
  plugins: [...(appJson.expo.plugins || []), 'expo-localization'],
  extra: {
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST,
  },
}
