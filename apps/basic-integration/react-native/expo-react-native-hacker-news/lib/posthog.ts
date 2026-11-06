import Constants from 'expo-constants'
import PostHog from 'posthog-react-native'

type PostHogExtra = {
  posthogProjectToken?: string
  posthogHost?: string
}

const extra = Constants.expoConfig?.extra as PostHogExtra | undefined
const projectToken = extra?.posthogProjectToken
const host = extra?.posthogHost

if (!projectToken && __DEV__) {
  console.error(
    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured',
  )
}

if (!host && __DEV__) {
  console.error(
    'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured',
  )
}

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        captureAppLifecycleEvents: true,
        logs: {
          serviceName: 'hacker-native',
          environment: __DEV__ ? 'development' : 'production',
          serviceVersion: Constants.expoConfig?.version,
        },
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
            console: [],
          },
        },
      })
    : undefined

export const posthogLogger = {
  info: (message: string, attributes: Record<string, string>) => {
    posthog?.logger.info(message, attributes)
  },
}
