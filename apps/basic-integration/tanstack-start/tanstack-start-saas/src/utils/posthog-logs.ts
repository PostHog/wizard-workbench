import { PostHog } from 'posthog-node'

let posthogLogClient: PostHog | undefined
let missingConfigurationWarningShown = false

function warnAboutMissingConfiguration(variableName: string) {
  if (import.meta.env.PROD || missingConfigurationWarningShown) return

  missingConfigurationWarningShown = true
  console.warn(
    `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
  )
}

export function getPostHogLogCaptureClient(): PostHog | undefined {
  const token =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ??
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = process.env.VITE_PUBLIC_POSTHOG_HOST ?? import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!token) {
    warnAboutMissingConfiguration('VITE_PUBLIC_POSTHOG_PROJECT_TOKEN')
    return undefined
  }

  if (!host) {
    warnAboutMissingConfiguration('VITE_PUBLIC_POSTHOG_HOST')
    return undefined
  }

  if (!posthogLogClient) {
    posthogLogClient = new PostHog(token, {
      host,
      flushAt: 1,
      flushInterval: 0,
      requestTimeout: 2000,
      fetchRetryCount: 0,
      logs: { serviceName: 'cloudflow-tanstack-start' },
    })
  }

  return posthogLogClient
}
