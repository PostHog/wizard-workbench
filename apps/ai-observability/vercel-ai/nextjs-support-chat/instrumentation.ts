import { PostHog } from 'posthog-node'

const projectToken = process.env.POSTHOG_API_KEY
const host = process.env.POSTHOG_HOST

if (process.env.NODE_ENV === 'development' && !projectToken) {
    console.error(
        'POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured'
    )
}

if (process.env.NODE_ENV === 'development' && !host) {
    console.error(
        'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'
    )
}

export const posthog =
    projectToken && host
        ? new PostHog(projectToken, {
              host,
              enableExceptionAutocapture: true,
              flushAt: 1,
              flushInterval: 0,
          })
        : undefined
