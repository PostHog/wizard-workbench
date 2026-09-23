import { randomUUID } from 'node:crypto'
import { posthog } from './posthog.js'

type AiMessage = {
    role: 'system' | 'user' | 'assistant' | 'tool'
    content: string
    tool_calls?: unknown[]
    tool_call_id?: string
}

type AiCompletion = {
    text: string
    toolCalls: unknown[]
    promptTokens: number
    completionTokens: number
}

type GenerationCapture = {
    distinctId: string
    sessionId: string
    traceId: string
    messages: AiMessage[]
    completion?: AiCompletion
    latency: number
    httpStatus?: number
    error?: string
}

const posthogConfigured = Boolean(process.env.POSTHOG_PROJECT_API_KEY && process.env.POSTHOG_HOST)

function canCaptureAiEvents(): boolean {
    if (posthogConfigured) {
        return true
    }

    if (process.env.NODE_ENV !== 'production') {
        throw new Error(
            'POSTHOG_PROJECT_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_API_KEY is configured'
        )
    }

    return false
}

export function createAiTraceId(): string {
    return randomUUID()
}

export function captureAiGeneration({
    distinctId,
    sessionId,
    traceId,
    messages,
    completion,
    latency,
    httpStatus,
    error,
}: GenerationCapture): void {
    if (!canCaptureAiEvents()) {
        return
    }

    posthog.capture({
        distinctId,
        event: '$ai_generation',
        properties: {
            $ai_trace_id: traceId,
            $ai_session_id: sessionId,
            $ai_span_id: randomUUID(),
            $ai_parent_id: traceId,
            $ai_span_name: 'chat_completion',
            $ai_model: process.env.LLM_MODEL ?? 'llama3.2',
            $ai_provider: process.env.LLM_PROVIDER ?? 'ollama',
            $ai_input: messages,
            $ai_input_tokens: completion?.promptTokens,
            $ai_output_choices: completion
                ? [{ role: 'assistant', content: completion.text, tool_calls: completion.toolCalls }]
                : undefined,
            $ai_output_tokens: completion?.completionTokens,
            $ai_latency: latency,
            $ai_http_status: httpStatus,
            $ai_request_url: process.env.LLM_URL ?? 'http://localhost:11434/v1/chat/completions',
            $ai_tools: [{ name: 'lookup_order' }],
            $ai_is_error: Boolean(error),
            $ai_error: error,
        },
    })
}

export function captureAiToolSpan({
    distinctId,
    sessionId,
    traceId,
    name,
    latency,
}: {
    distinctId: string
    sessionId: string
    traceId: string
    name: string
    latency: number
}): void {
    if (!canCaptureAiEvents()) {
        return
    }

    posthog.capture({
        distinctId,
        event: '$ai_span',
        properties: {
            $ai_trace_id: traceId,
            $ai_session_id: sessionId,
            $ai_span_id: randomUUID(),
            $ai_parent_id: traceId,
            $ai_span_name: name,
            $ai_latency: latency,
        },
    })
}
