import { PostHog } from 'posthog-node'

const client = new PostHog(process.env.POSTHOG_KEY ?? '', {
  host: process.env.POSTHOG_HOST,
})

client.capture({ distinctId: 'node-raw', event: 'hello' })


await client.shutdown()
