// Dynamic Expo config that extends app.json with environment variables.
// PostHog keys are read at build time and embedded via expo-constants extras.
// @see https://docs.expo.dev/workflow/configuration/
export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    posthogApiKey: process.env.POSTHOG_API_KEY,
    posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
  },
})
