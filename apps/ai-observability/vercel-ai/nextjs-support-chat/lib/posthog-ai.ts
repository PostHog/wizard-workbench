import { PostHog } from 'posthog-node'

const projectToken = process.env.POSTHOG_API_KEY
const host = process.env.POSTHOG_HOST
const missingVariable = !projectToken ? 'POSTHOG_API_KEY' : !host ? 'POSTHOG_HOST' : undefined

if (missingVariable && process.env.NODE_ENV !== 'production') {
    throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    )
}

export const posthogAi = missingVariable
    ? undefined
    : new PostHog(projectToken!, {
          host: host!,
          privacyMode: false,
          enableExceptionAutocapture: true,
          flushAt: 1,
          flushInterval: 0,
      })
