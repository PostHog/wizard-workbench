import { PostHog } from 'posthog-node'

const projectToken = process.env.POSTHOG_PROJECT_TOKEN
const host = process.env.POSTHOG_HOST

if ((!projectToken || !host) && process.env.NODE_ENV !== 'production') {
    console.warn(
        `${!projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST'} is configured`
    )
}

export const posthog =
    projectToken && host
        ? new PostHog(projectToken, {
              host,
              privacyMode: false,
              enableExceptionAutocapture: true,
              flushAt: 1,
              flushInterval: 0,
              requestTimeout: 2000,
              fetchRetryCount: 0,
          })
        : undefined
