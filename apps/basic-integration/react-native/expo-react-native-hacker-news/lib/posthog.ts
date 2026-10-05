import Constants from 'expo-constants'
import PostHog from 'posthog-react-native'

const extra = Constants.expoConfig?.extra
const projectToken = extra?.posthogProjectToken as string | undefined
const host = extra?.posthogHost as string | undefined
const isPostHogConfigured = Boolean(projectToken && host)

if (!isPostHogConfigured && __DEV__) {
  if (!projectToken) {
    throw new Error(
      'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured',
    )
  }

  throw new Error(
    'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured',
  )
}

export const posthog = isPostHogConfigured
  ? new PostHog(projectToken!, {
      host: host!,
      logs: {
        serviceName: 'hacker-native',
        environment: __DEV__ ? 'development' : 'production',
      },
      errorTracking: {
        autocapture: {
          uncaughtExceptions: true,
          unhandledRejections: true,
        },
      },
    })
  : undefined

/**
 * Dedicated PostHog log exporter. Only purpose-written operational logs should
 * use this wrapper so existing application logging remains local.
 */
type LogAttributes = Record<string, string | number | boolean>

export const posthogLog = {
  info: (body: string, attributes: LogAttributes) =>
    posthog?.logger.info(body, attributes),
  error: (body: string, attributes: LogAttributes) =>
    posthog?.logger.error(body, attributes),
}
