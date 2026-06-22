import { PostHog } from 'posthog-node'

const client = new PostHog(process.env.POSTHOG_KEY ?? '', {
  host: process.env.POSTHOG_HOST,
})

client.capture({ distinctId: 'docker-single-stage', event: 'hello' })


await client.shutdown()
