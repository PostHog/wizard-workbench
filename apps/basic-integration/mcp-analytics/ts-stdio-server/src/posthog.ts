import { PostHog } from 'posthog-node'

const apiKey = process.env.POSTHOG_API_KEY
const host = process.env.POSTHOG_HOST

for (const [name, value] of Object.entries({ POSTHOG_API_KEY: apiKey, POSTHOG_HOST: host })) {
    if (!value) {
        process.stderr.write(
            `${name} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${name} is configured\n`
        )
    }
}

export const posthog = apiKey && host
    ? new PostHog(apiKey, { host, enableExceptionAutocapture: true })
    : undefined
