import { PostHog } from 'posthog-node'
import 'dotenv/config'

const client = new PostHog(process.env.POSTHOG_KEY ?? '', {
  host: process.env.POSTHOG_HOST,
})

client.capture({ distinctId: 'node-rollup-typescript-plugin', event: 'hello' })

await client.shutdown()
