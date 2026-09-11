import { PostHog } from 'posthog-node'
import 'dotenv/config'

const client = new PostHog(process.env.POSTHOG_KEY ?? '', {
  host: process.env.POSTHOG_HOST,
})

client.capture({ distinctId: 'node-webpack', event: 'hello' })

client.shutdown().then(() => process.exit(0))
