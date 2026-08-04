import { PostHog } from 'posthog-node'

// Product analytics for this app. Already wired up, already used across
// src/index.ts. There is one client and everything shares it.
export const posthog = new PostHog(process.env.POSTHOG_PROJECT_API_KEY ?? '', {
    host: process.env.POSTHOG_HOST ?? 'https://us.i.posthog.com',
})
