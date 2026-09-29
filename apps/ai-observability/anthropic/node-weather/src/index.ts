import { randomUUID } from 'node:crypto'

import Anthropic from '@anthropic-ai/sdk'
import { PostHog } from 'posthog-node'

import { getWeather } from './weather.js'

const posthogApiKey = process.env.POSTHOG_API_KEY
const posthogHost = process.env.POSTHOG_HOST

if (process.env.NODE_ENV !== 'production' && !posthogApiKey) {
    console.error(
        'POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured'
    )
}

if (process.env.NODE_ENV !== 'production' && !posthogHost) {
    console.error(
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

        const firstRequestMessages = [...this.messages]
        const firstGenerationId = randomUUID()
        const firstStartedAt = Date.now()
        const response = await client.messages.create({
            model: MODEL,
            max_tokens: 1024,
            tools,
            tool_choice: toolChoice,
            messages: firstRequestMessages,
        })

        posthog?.capture({
            distinctId: this.userId,
            event: '$ai_generation',
            properties: {
                $ai_trace_id: traceId,
                $ai_session_id: this.threadId,
                $ai_span_id: firstGenerationId,
                $ai_span_name: 'messages.create',
                $ai_model: MODEL,
                $ai_provider: 'anthropic',
                $ai_input: firstRequestMessages,
                $ai_input_tokens: response.usage.input_tokens,
                $ai_output_choices: [{ role: 'assistant', content: response.content }],
                $ai_output_tokens: response.usage.output_tokens,
                $ai_latency: (Date.now() - firstStartedAt) / 1000,
                $ai_stop_reason: response.stop_reason,
                $ai_max_tokens: 1024,
                $ai_tools: tools,
            },
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
        const startedAt = Date.now()
        const result = getWeather(location)

        const toolSpanId = randomUUID()
        posthog?.capture({
            distinctId: this.userId,
            event: '$ai_span',
            properties: {
                $ai_trace_id: traceId,
                $ai_session_id: this.threadId,
                $ai_span_id: toolSpanId,
                $ai_parent_id: firstGenerationId,
                $ai_span_name: toolUse.name,
                $ai_input_state: toolUse.input,
                $ai_output_state: result,
                $ai_latency: (Date.now() - startedAt) / 1000,
            },
        })

        this.messages.push(
            { role: 'assistant', content: response.content },
            {
                role: 'user',
                content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: result }],
            }
        )

        const followupRequestMessages = [...this.messages]
        const followupStartedAt = Date.now()
        const followup = await client.messages.create({
            model: MODEL,
            max_tokens: 1024,
            tools,
            tool_choice: toolChoice,
            messages: followupRequestMessages,
        })

        posthog?.capture({
            distinctId: this.userId,
            event: '$ai_generation',
            properties: {
                $ai_trace_id: traceId,
                $ai_session_id: this.threadId,
                $ai_span_id: randomUUID(),
                $ai_parent_id: toolSpanId,
                $ai_span_name: 'messages.create',
                $ai_model: MODEL,
                $ai_provider: 'anthropic',
                $ai_input: followupRequestMessages,
                $ai_input_tokens: followup.usage.input_tokens,
                $ai_output_choices: [{ role: 'assistant', content: followup.content }],
                $ai_output_tokens: followup.usage.output_tokens,
                $ai_latency: (Date.now() - followupStartedAt) / 1000,
                $ai_stop_reason: followup.stop_reason,
                $ai_max_tokens: 1024,
                $ai_tools: tools,
            },
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
    .then(() => posthog?.shutdown())
    .catch(async (err) => {
        await posthog?.shutdown()
        console.error(`fatal: ${String(err)}`)
        process.exitCode = 1
    })
