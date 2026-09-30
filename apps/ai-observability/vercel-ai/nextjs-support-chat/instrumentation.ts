import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { PostHogSpanProcessor } from '@posthog/ai/otel'

const projectToken = process.env.POSTHOG_API_KEY
const host = process.env.POSTHOG_HOST

export let posthogSpanProcessor: PostHogSpanProcessor | undefined

export async function register(): Promise<void> {
    if (process.env.NEXT_RUNTIME === 'edge' || posthogSpanProcessor) {
        return
    }

    if (!projectToken || !host) {
        if (process.env.NODE_ENV !== 'production') {
            const variableName = projectToken ? 'POSTHOG_HOST' : 'POSTHOG_API_KEY'
            throw new Error(
                `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
            )
        }

        return
    }

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
}
