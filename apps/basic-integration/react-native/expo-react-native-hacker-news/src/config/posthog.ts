import Constants from 'expo-constants'
import PostHog from 'posthog-react-native'

const projectToken = Constants.expoConfig?.extra?.posthogProjectToken as string | undefined
const host = Constants.expoConfig?.extra?.posthogHost as string | undefined
const missingConfig = !projectToken
  ? 'POSTHOG_PROJECT_TOKEN'
  : !host
    ? 'POSTHOG_HOST'
    : undefined

if (missingConfig && __DEV__) {
  throw new Error(
    `${missingConfig} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingConfig} is configured`,
  )
}

export const isPostHogConfigured = !missingConfig

export const posthog = isPostHogConfigured
  ? new PostHog(projectToken!, {
      host: host!,
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
  info: (message: string, attributes: Record<string, string | number | boolean>) =>
    posthog?.logger.info(message, attributes),
  warn: (message: string, attributes: Record<string, string | number | boolean>) =>
    posthog?.logger.warn(message, attributes),
  error: (message: string, attributes: Record<string, string | number | boolean>) =>
    posthog?.logger.error(message, attributes),
}
