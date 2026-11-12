import { PostHog } from 'posthog-node'

type AiMessage = {
    role: string
    content: string
    tool_calls?: unknown
    tool_call_id?: string
}

type Generation = {
    text: string
    promptTokens: number
    completionTokens: number
}

type GenerationCapture = {
    distinctId: string
    sessionId: string
    traceId: string
    messages: AiMessage[]
    generation: Generation
    model: string
    provider: string
    latencyMs: number
}

type ToolSpanCapture = {
    distinctId: string
    sessionId: string
    traceId: string
    toolName: string
    latencyMs: number
}

const projectApiKey = process.env.POSTHOG_PROJECT_API_KEY
const host = process.env.POSTHOG_HOST

function warnMissingConfig(variable: string): void {
    if (process.env.NODE_ENV !== 'production') {
        console.warn(
            `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
        )
    }
}

if (!projectApiKey) {
    warnMissingConfig('POSTHOG_PROJECT_API_KEY')
}
if (!host) {
    warnMissingConfig('POSTHOG_HOST')
}

const aiPosthog = projectApiKey && host
    ? new PostHog(projectApiKey, { host, privacyMode: false })
    : undefined

export function captureGeneration({
    distinctId,
    sessionId,
    traceId,
    messages,
    generation,
    model,
    provider,
    latencyMs,
}: GenerationCapture): void {
    aiPosthog?.capture({
        distinctId,
        event: '$ai_generation',
        properties: {
            $ai_trace_id: traceId,
            $ai_session_id: sessionId,
            $ai_model: model,
            $ai_provider: provider,
            $ai_input: messages,
            $ai_input_tokens: generation.promptTokens,
            $ai_output_choices: [{ role: 'assistant', content: generation.text }],
            $ai_output_tokens: generation.completionTokens,
            $ai_latency: latencyMs / 1000,
        },
    })
}

export function captureToolSpan({
    distinctId,
    sessionId,
    traceId,
    toolName,
    latencyMs,
}: ToolSpanCapture): void {
    aiPosthog?.capture({
        distinctId,
        event: '$ai_span',
        properties: {
            $ai_trace_id: traceId,
            $ai_session_id: sessionId,
            $ai_span_name: toolName,
            $ai_latency: latencyMs / 1000,
        },
    })
}

export async function shutdownAiObservability(): Promise<void> {
    try {
        await aiPosthog?.shutdown()
    } catch (error) {
        console.warn(`PostHog AI Observability shutdown failed: ${String(error)}`)
    }
}
