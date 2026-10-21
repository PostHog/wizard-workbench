import { randomUUID } from 'node:crypto'

import Anthropic from '@anthropic-ai/sdk'
import { PostHog } from 'posthog-node'

import { getWeather } from './weather.js'

const posthogApiKey = process.env.POSTHOG_API_KEY
const posthogHost = process.env.POSTHOG_HOST

if (!posthogApiKey && process.env.NODE_ENV !== 'production') {
    throw new Error(
        'POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured'
    )
}

if (!posthogHost && process.env.NODE_ENV !== 'production') {
    throw new Error(
        'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'
    )
}

const posthog =
    posthogApiKey && posthogHost
        ? new PostHog(posthogApiKey, {
              host: posthogHost,
              privacyMode: false,
              enableExceptionAutocapture: true,
          })
        : undefined

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? '' })

const MODEL = 'claude-opus-5'

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

async function createInstrumentedMessage(
    params: Anthropic.MessageCreateParamsNonStreaming,
    userId: string,
    sessionId: string,
    traceId: string
): Promise<Anthropic.Message> {
    const startedAt = Date.now()
    const response = await client.messages.create(params)

    posthog?.capture({
        distinctId: userId,
        event: '$ai_generation',
        properties: {
            $ai_trace_id: traceId,
            $ai_session_id: sessionId,
            $ai_model: params.model,
            $ai_provider: 'anthropic',
            $ai_input: params.messages,
            $ai_input_tokens: response.usage.input_tokens,
            $ai_output_choices: [{ role: 'assistant', content: response.content }],
            $ai_output_tokens: response.usage.output_tokens,
            $ai_latency: (Date.now() - startedAt) / 1000,
            $ai_max_tokens: params.max_tokens,
            $ai_tools: params.tools,
            $ai_stop_reason: response.stop_reason,
        },
    })

    return response
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

        const response = await createInstrumentedMessage(
            {
                model: MODEL,
                max_tokens: 1024,
                tools,
                tool_choice: toolChoice,
                messages: this.messages,
            },
            this.userId,
            this.threadId,
            traceId
        )

        const toolUse = response.content.find(
            (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
        )

        if (!toolUse) {
            const answer = textOf(response)
            this.messages.push({ role: 'assistant', content: answer })
            return answer
        }

        const { location } = toolUse.input as { location: string }
        const toolStartedAt = Date.now()
        const result = getWeather(location)

        posthog?.capture({
            distinctId: this.userId,
            event: '$ai_span',
            properties: {
                $ai_trace_id: traceId,
                $ai_session_id: this.threadId,
                $ai_span_id: randomUUID(),
                $ai_span_name: toolUse.name,
                $ai_input_state: toolUse.input,
                $ai_output_state: result,
                $ai_latency: (Date.now() - toolStartedAt) / 1000,
            },
        })

        this.messages.push(
            { role: 'assistant', content: response.content },
            {
                role: 'user',
                content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: result }],
            }
        )

        const followup = await createInstrumentedMessage(
            {
                model: MODEL,
                max_tokens: 1024,
                tools,
                tool_choice: toolChoice,
                messages: this.messages,
            },
            this.userId,
            this.threadId,
            traceId
        )

        const answer = textOf(followup)
        this.messages.push({ role: 'assistant', content: answer })
        return answer
    }
}

async function main(): Promise<void> {
    try {
        const thread = new Conversation('user_123', 'thread_abc')
        console.log(await thread.ask("What's the weather in San Francisco?"))
        console.log(await thread.ask('How about Boston?'))
    } finally {
        await posthog?.shutdown()
    }
}

main().catch((err) => {
    console.error(`fatal: ${String(err)}`)
    process.exit(1)
})
