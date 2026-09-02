import { PostHog } from 'posthog-node'
import { eventName } from '@repo/shared'

const client = new PostHog(process.env.POSTHOG_KEY ?? '', {
  host: process.env.POSTHOG_HOST,
})

client.capture({ distinctId: 'backend', event: eventName('backend', 'hello') })


await client.shutdown()
