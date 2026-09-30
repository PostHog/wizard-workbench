import { randomUUID } from 'node:crypto'

import Anthropic from '@anthropic-ai/sdk'
import { PostHog } from 'posthog-node'

import { getWeather } from './weather.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? '' })
const posthogApiKey = process.env.POSTHOG_API_KEY
const posthogHost = process.env.POSTHOG_HOST

if (process.env.NODE_ENV !== 'production') {
    if (!posthogApiKey) {
        throw new Error(
            'POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured'
        )
    }

    if (!posthogHost) {
        throw new Error(
            'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'
        )
    }
}

const posthog =
    posthogApiKey && posthogHost
        ? new PostHog(posthogApiKey, {
              host: posthogHost,
              privacyMode: false,
              enableExceptionAutocapture: true,
              flushAt: 1,
              flushInterval: 0,
          })
        : undefined

const MODEL = 'claude-opus-5'
const MAX_TOKENS = 1024

const tools: Anthropic.Tool[] = [
    {
        name: 'get_weather',
        description: 'Get the current weather for a given location.',
        input_schema: {
            type: 'object',
            properties: {
                location: { type: 'string', description: 'City and state, e.g. San Francisco, CA' },
            },
            required: ['location'],
        },
    },
]

const toolChoice = { type: 'auto', disable_parallel_tool_use: true } as const

function textOf(message: Anthropic.Message): string {
    return message.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map((block) => block.text)
        .join('')
}

function captureGeneration({
    userId,
    threadId,
    traceId,
    parentId,
    input,
    response,
    latency,
}: {
    userId: string
    threadId: string
    traceId: string
    parentId?: string
    input: Anthropic.MessageParam[]
    response: Anthropic.Message
    latency: number
}): string {
    const spanId = randomUUID()

    posthog?.capture({
        distinctId: userId,
        event: '$ai_generation',
        properties: {
            $ai_trace_id: traceId,
            $ai_session_id: threadId,
            $ai_span_id: spanId,
            ...(parentId ? { $ai_parent_id: parentId } : {}),
            $ai_span_name: 'anthropic.messages.create',
            $ai_model: MODEL,
            $ai_provider: 'anthropic',
            $ai_input: input,
            $ai_input_tokens: response.usage.input_tokens,
            $ai_output_choices: [{ role: 'assistant', content: response.content }],
            $ai_output_tokens: response.usage.output_tokens,
            $ai_latency: latency,
            $ai_max_tokens: MAX_TOKENS,
            $ai_tools: tools,
            $ai_stop_reason: response.stop_reason,
        },
    })

    return spanId
}

/** One chat thread. Every question asked below belongs to this thread. */
class Conversation {
    private messages: Anthropic.MessageParam[] = []

    constructor(
        readonly userId: string,
        readonly threadId: string
    ) {}

    /** Answer one question, running the tool if the model asks for it. */
    async ask(question: string): Promise<string> {
        const traceId = randomUUID()
        this.messages.push({ role: 'user', content: question })

        const initialInput = structuredClone(this.messages)
        const initialStart = performance.now()
        const response = await client.messages.create({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            tools,
            tool_choice: toolChoice,
            messages: this.messages,
        })
        const initialGenerationSpanId = captureGeneration({
            userId: this.userId,
            threadId: this.threadId,
            traceId,
            input: initialInput,
            response,
            latency: (performance.now() - initialStart) / 1000,
        })

        const toolUse = response.content.find(
            (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
        )

        if (!toolUse) {
            const answer = textOf(response)
            this.messages.push({ role: 'assistant', content: answer })
            return answer
        }

        const { location } = toolUse.input as { location: string }
        const toolStart = performance.now()
        const result = getWeather(location)
        const toolSpanId = randomUUID()
        posthog?.capture({
            distinctId: this.userId,
            event: '$ai_span',
            properties: {
                $ai_trace_id: traceId,
                $ai_session_id: this.threadId,
                $ai_span_id: toolSpanId,
                $ai_parent_id: initialGenerationSpanId,
                $ai_span_name: 'get_weather',
                $ai_input_state: toolUse.input,
                $ai_output_state: result,
                $ai_latency: (performance.now() - toolStart) / 1000,
            },
        })

        this.messages.push(
            { role: 'assistant', content: response.content },
            {
                role: 'user',
                content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: result }],
            }
        )

        const followupInput = structuredClone(this.messages)
        const followupStart = performance.now()
        const followup = await client.messages.create({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            tools,
            tool_choice: toolChoice,
            messages: this.messages,
        })
        captureGeneration({
            userId: this.userId,
            threadId: this.threadId,
            traceId,
            parentId: toolSpanId,
            input: followupInput,
            response: followup,
            latency: (performance.now() - followupStart) / 1000,
        })

        const answer = textOf(followup)
        this.messages.push({ role: 'assistant', content: answer })
        return answer
    }
}

async function main(): Promise<void> {
    const thread = new Conversation('user_123', 'thread_abc')
    console.log(await thread.ask("What's the weather in San Francisco?"))
    console.log(await thread.ask('How about Boston?'))
}

main()
    .catch((err) => {
        console.error(`fatal: ${String(err)}`)
        process.exitCode = 1
    })
    .finally(async () => {
        await posthog?.shutdown()
    })
