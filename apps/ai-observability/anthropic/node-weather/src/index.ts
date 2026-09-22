import Anthropic from '@anthropic-ai/sdk'
import PostHogAnthropic from '@posthog/ai/anthropic'
import { PostHog } from 'posthog-node'

import { getWeather } from './weather.js'

const posthogApiKey = process.env.POSTHOG_API_KEY

if (!posthogApiKey && process.env.NODE_ENV !== 'production') {
    throw new Error(
        'POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured'
    )
}

const posthog = posthogApiKey
    ? new PostHog(posthogApiKey, {
          host: process.env.POSTHOG_HOST,
          enableExceptionAutocapture: true,
      })
    : undefined

const client = posthog
    ? new PostHogAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? '', posthog })
    : new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? '' })

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
        const traceId = crypto.randomUUID()
        const observability = posthog
            ? {
                  posthogDistinctId: this.userId,
                  posthogTraceId: traceId,
                  posthogProperties: { $ai_session_id: this.threadId },
              }
            : {}

        this.messages.push({ role: 'user', content: question })

        const response = await (client as PostHogAnthropic).messages.create({
            model: MODEL,
            max_tokens: 1024,
            tools,
            tool_choice: toolChoice,
            messages: this.messages,
            ...observability,
        })

        const toolUse = response.content.find(
            (block: Anthropic.ContentBlock): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
        )

        if (!toolUse) {
            const answer = textOf(response)
            this.messages.push({ role: 'assistant', content: answer })
            return answer
        }

        const { location } = toolUse.input as { location: string }
        const toolStart = Date.now()
        const result = getWeather(location)

        posthog?.capture({
            distinctId: this.userId,
            event: '$ai_span',
            properties: {
                $ai_trace_id: traceId,
                $ai_session_id: this.threadId,
                $ai_span_id: crypto.randomUUID(),
                $ai_span_name: 'get_weather',
                $ai_input_state: { location },
                $ai_output_state: result,
                $ai_latency: (Date.now() - toolStart) / 1000,
            },
        })

        this.messages.push(
            { role: 'assistant', content: response.content },
            {
                role: 'user',
                content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: result }],
            }
        )

        const followup = await (client as PostHogAnthropic).messages.create({
            model: MODEL,
            max_tokens: 1024,
            tools,
            tool_choice: toolChoice,
            messages: this.messages,
            ...observability,
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
