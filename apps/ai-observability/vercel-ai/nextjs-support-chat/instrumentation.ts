import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { PostHogSpanProcessor } from '@posthog/ai/otel'

export let posthogSpanProcessor: PostHogSpanProcessor | undefined

export async function register() {
    const projectToken = process.env.POSTHOG_PROJECT_TOKEN
    const host = process.env.POSTHOG_HOST

    if (!projectToken || !host) {
        if (process.env.NODE_ENV === 'development') {
            const missingVariable = projectToken ? 'POSTHOG_HOST' : 'POSTHOG_PROJECT_TOKEN'
            console.error(
                new Error(
                    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
                )
            )
        }

        return
    }

    posthogSpanProcessor = new PostHogSpanProcessor({ projectToken, host })

    const sdk = new NodeSDK({
        resource: resourceFromAttributes({
            'service.name': 'support-chat',
        }),
        spanProcessors: [posthogSpanProcessor],
    })

    sdk.start()
}
