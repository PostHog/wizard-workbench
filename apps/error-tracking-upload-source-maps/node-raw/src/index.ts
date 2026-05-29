import { PostHog } from 'posthog-node'

const client = new PostHog(process.env.POSTHOG_KEY ?? '', {
  host: process.env.POSTHOG_HOST,
})

client.capture({ distinctId: 'node-raw', event: 'hello' })

function throwTestError() {
  throw new Error('PostHog test error - 2026-05-29T00:00:00.000Z')
}

try {
  throwTestError()
} catch (error) {
  client.captureException(error, 'node-raw', { $exception_fingerprint: '342434' })
}

await client.shutdown()
