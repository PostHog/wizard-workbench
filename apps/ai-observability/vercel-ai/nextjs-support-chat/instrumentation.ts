import { PostHog } from 'posthog-node'

const projectToken = process.env.POSTHOG_API_KEY
const host = process.env.POSTHOG_HOST

export let posthog: PostHog | undefined

if (projectToken && host) {
    posthog = new PostHog(projectToken, {
        host,
        flushAt: 1,
        flushInterval: 0,
        privacyMode: false,
        enableExceptionAutocapture: true,
    })
} else if (process.env.NODE_ENV !== 'production') {
    const missingVariable = projectToken ? 'POSTHOG_HOST' : 'POSTHOG_API_KEY'

    throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    )
}

export async function register(): Promise<void> {
    // This module initializes the server-side PostHog client when Next.js loads instrumentation.
}
