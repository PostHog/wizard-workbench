import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { PostHogSpanProcessor } from '@posthog/ai/otel'

const projectToken = process.env.POSTHOG_API_KEY
const host = process.env.POSTHOG_HOST
const missingConfigVariable = !projectToken ? 'POSTHOG_API_KEY' : !host ? 'POSTHOG_HOST' : undefined

if (missingConfigVariable && process.env.NODE_ENV !== 'production') {
    console.warn(
        `${missingConfigVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingConfigVariable} is configured`
    )
}

export const posthogSpanProcessor =
    projectToken && host
        ? new PostHogSpanProcessor({
              projectToken,
              host,
          })
        : undefined

const sdk = posthogSpanProcessor
    ? new NodeSDK({
          resource: resourceFromAttributes({
              'service.name': 'support-chat',
          }),
          spanProcessors: [posthogSpanProcessor],
      })
    : undefined

export async function register(): Promise<void> {
    sdk?.start()
}
