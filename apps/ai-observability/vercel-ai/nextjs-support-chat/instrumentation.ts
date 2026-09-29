import { OpenTelemetry } from '@ai-sdk/otel'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { PostHogSpanProcessor } from '@posthog/ai/otel'
import { registerTelemetry } from 'ai'

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

export async function register(): Promise<void> {}

if (posthogSpanProcessor) {
    const sdk = new NodeSDK({
        resource: resourceFromAttributes({
            'service.name': 'nextjs-support-chat',
        }),
        spanProcessors: [posthogSpanProcessor],
    })

    sdk.start()

    registerTelemetry(
        new OpenTelemetry({
            enrichSpan: ({ runtimeContext }) => ({
                'posthog.distinct_id':
                    typeof runtimeContext?.distinctId === 'string'
                        ? runtimeContext.distinctId
                        : undefined,
                '$ai_session_id':
                    typeof runtimeContext?.sessionId === 'string'
                        ? runtimeContext.sessionId
                        : undefined,
            }),
        })
    )
}
