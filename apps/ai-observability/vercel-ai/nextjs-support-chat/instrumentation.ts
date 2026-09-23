import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { PostHogSpanProcessor } from '@posthog/ai/otel'

const projectToken = process.env.POSTHOG_API_KEY
const host = process.env.POSTHOG_HOST

if ((!projectToken || !host) && process.env.NODE_ENV !== 'production') {
    const missingVariable = projectToken ? 'POSTHOG_HOST' : 'POSTHOG_API_KEY'
    throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    )
}

export const posthogSpanProcessor =
    projectToken && host
        ? new PostHogSpanProcessor({
              projectToken,
              host,
          })
        : undefined

if (posthogSpanProcessor) {
    const sdk = new NodeSDK({
        resource: resourceFromAttributes({
            'service.name': 'nextjs-support-chat',
        }),
        spanProcessors: [posthogSpanProcessor],
    })

    sdk.start()
}
