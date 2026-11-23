import { PostHog } from 'posthog-node'

const projectToken = process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.VITE_PUBLIC_POSTHOG_HOST

const posthogLogs =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        enableExceptionAutocapture: true,
        logs: { serviceName: 'clouthub-react-router' },
      })
    : undefined

if (!posthogLogs && process.env.NODE_ENV !== 'production') {
  if (!projectToken) {
    console.warn(
      'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
    )
  }

  if (!host) {
    console.warn(
      'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured'
    )
  }
}

export const posthogLogsLogger = {
  rootLoaderServed: () => posthogLogs?.logger.info('root_loader_served'),
  aboutLoaderServed: () => posthogLogs?.logger.info('about_loader_served'),
}
