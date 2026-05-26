import { PostHog } from 'posthog-node'
import 'dotenv/config'

const client = new PostHog(process.env.POSTHOG_KEY ?? '', {
  host: process.env.POSTHOG_HOST,
})

client.capture({ distinctId: 'node-webpack', event: 'hello' })

client.captureException(new Error('PostHog test error - 2026-05-26T00:00:00.000Z'))

await client.shutdown()
