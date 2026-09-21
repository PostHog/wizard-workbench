import { NodeSDK } from '@opentelemetry/sdk-node'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { PostHogSpanProcessor } from '@posthog/ai/otel'

const projectToken = process.env.POSTHOG_PROJECT_TOKEN
const host = process.env.POSTHOG_HOST

if ((!projectToken || !host) && process.env.NODE_ENV !== 'production') {
    const missingVariable = projectToken ? 'POSTHOG_HOST' : 'POSTHOG_PROJECT_TOKEN'
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
            'service.name': 'support-chat',
        }),
        spanProcessors: [posthogSpanProcessor],
    })

    sdk.start()
}

export function register() {}
