import Anthropic from '@anthropic-ai/sdk'
import { randomUUID } from 'node:crypto'
import { PostHog } from 'posthog-node'

import { getWeather } from './weather.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? '' })
const posthogApiKey = process.env.POSTHOG_API_KEY
const posthogHost = process.env.POSTHOG_HOST
const posthog =
    posthogApiKey && posthogHost
        ? new PostHog(posthogApiKey, {
              host: posthogHost,
              privacyMode: false,
              enableExceptionAutocapture: true,
          })
        : undefined

if (!posthog && process.env.NODE_ENV !== 'production') {
    if (!posthogApiKey) {
        console.warn(
            'POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured'
        )
    }

    if (!posthogHost) {
        console.warn(
            'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'
        )
    }
}

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

function captureAiEvent(
    event: '$ai_generation' | '$ai_span',
    distinctId: string,
    properties: Parameters<PostHog['capture']>[0]['properties']
): void {
    try {
        posthog?.capture({ distinctId, event, properties })
    } catch {}
}

function captureGeneration(
    response: Anthropic.Message,
    input: Anthropic.MessageParam[],
    userId: string,
    threadId: string,
    traceId: string,
    startedAt: number,
    parentId?: string
): void {
    captureAiEvent('$ai_generation', userId, {
        $ai_trace_id: traceId,
        $ai_session_id: threadId,
        $ai_parent_id: parentId,
        $ai_model: MODEL,
        $ai_provider: 'anthropic',
        $ai_input: input,
        $ai_input_tokens: response.usage.input_tokens,
        $ai_output_choices: [{ role: 'assistant', content: response.content }],
        $ai_output_tokens: response.usage.output_tokens,
        $ai_latency: (Date.now() - startedAt) / 1000,
        $ai_max_tokens: 1024,
        $ai_stop_reason: response.stop_reason,
        $ai_tools: tools,
    })
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

        const requestMessages = [...this.messages]
        const responseStartedAt = Date.now()
        const response = await client.messages.create({
            model: MODEL,
            max_tokens: 1024,
            tools,
            tool_choice: toolChoice,
            messages: requestMessages,
        })
        captureGeneration(
            response,
            requestMessages,
            this.userId,
            this.threadId,
            traceId,
            responseStartedAt
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
        const toolSpanId = randomUUID()
        const toolStartedAt = Date.now()
        const result = getWeather(location)
        captureAiEvent('$ai_span', this.userId, {
            $ai_trace_id: traceId,
            $ai_session_id: this.threadId,
            $ai_span_id: toolSpanId,
            $ai_span_name: toolUse.name,
            $ai_parent_id: traceId,
            $ai_input_state: toolUse.input,
            $ai_output_state: result,
            $ai_latency: (Date.now() - toolStartedAt) / 1000,
        })

        this.messages.push(
            { role: 'assistant', content: response.content },
            {
                role: 'user',
                content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: result }],
            }
        )

        const followupMessages = [...this.messages]
        const followupStartedAt = Date.now()
        const followup = await client.messages.create({
            model: MODEL,
            max_tokens: 1024,
            tools,
            tool_choice: toolChoice,
            messages: followupMessages,
        })
        captureGeneration(
            followup,
            followupMessages,
            this.userId,
            this.threadId,
            traceId,
            followupStartedAt,
            toolSpanId
        )

        const answer = textOf(followup)
        this.messages.push({ role: 'assistant', content: answer })
        return answer
    }
}

async function main(): Promise<void> {
    const thread = new Conversation('user_123', 'thread_abc')

    try {
        console.log(await thread.ask("What's the weather in San Francisco?"))
        console.log(await thread.ask('How about Boston?'))
    } finally {
        if (posthog) {
            await posthog.shutdown(3000).catch(() => {})
        }
    }
}

main().catch((err) => {
    console.error(`fatal: ${String(err)}`)
    process.exit(1)
})
