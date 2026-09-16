import Constants from 'expo-constants'
import PostHog from 'posthog-react-native'

type PostHogExtra = {
  posthogProjectToken?: string
  posthogHost?: string
}

const extra = Constants.expoConfig?.extra as PostHogExtra | undefined
const projectToken = extra?.posthogProjectToken
const host = extra?.posthogHost

function requirePostHogConfiguration(variableName: string) {
  if (__DEV__) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    )
  }
}

if (!projectToken) {
  requirePostHogConfiguration('EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN')
}

if (!host) {
  requirePostHogConfiguration('EXPO_PUBLIC_POSTHOG_HOST')
}

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        captureAppLifecycleEvents: true,
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
            console: [],
          },
        },
      })
    : undefined
