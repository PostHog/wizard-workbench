import { NodeSDK } from '@opentelemetry/sdk-node'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { PostHogSpanProcessor } from '@posthog/ai/otel'

const projectToken = process.env.POSTHOG_PROJECT_TOKEN
const host = process.env.POSTHOG_HOST

export let posthogSpanProcessor: PostHogSpanProcessor | undefined

if (projectToken && host) {
    posthogSpanProcessor = new PostHogSpanProcessor({
        projectToken,
        host,
    })

    const sdk = new NodeSDK({
        resource: resourceFromAttributes({
            'service.name': 'support-chat',
        }),
        spanProcessors: [posthogSpanProcessor],
    })

    sdk.start()
} else if (process.env.NODE_ENV !== 'production') {
    const variable = projectToken ? 'POSTHOG_HOST' : 'POSTHOG_PROJECT_TOKEN'
    throw new Error(
        `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
    )
}
