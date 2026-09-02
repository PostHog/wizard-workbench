import Anthropic from '@anthropic-ai/sdk'
import { Anthropic as PostHogAnthropic } from '@posthog/ai/anthropic'
import { PostHog } from 'posthog-node'

import { getWeather } from './weather.js'

const posthog = new PostHog(process.env.POSTHOG_API_KEY ?? '', {
    host: process.env.POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
})

const client = new PostHogAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? '', posthog })

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
        this.messages.push({ role: 'user', content: question })

        const traceId = crypto.randomUUID()
        const posthogProperties = { $ai_session_id: this.threadId }

        const response = (await client.messages.create({
            model: MODEL,
            max_tokens: 1024,
            tools,
            tool_choice: toolChoice,
            messages: this.messages,
            posthogDistinctId: this.userId,
            posthogTraceId: traceId,
            posthogProperties,
        })) as Anthropic.Message

        const toolUse = response.content.find(
            (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
        )

        if (!toolUse) {
            const answer = textOf(response)
            this.messages.push({ role: 'assistant', content: answer })
            return answer
        }

        const { location } = toolUse.input as { location: string }
        const spanStart = Date.now()
        const result = getWeather(location)
        posthog.capture({
            distinctId: this.userId,
            event: '$ai_span',
            properties: {
                $ai_trace_id: traceId,
                $ai_session_id: this.threadId,
                $ai_span_id: crypto.randomUUID(),
                $ai_span_name: toolUse.name,
                $ai_input_state: toolUse.input,
                $ai_output_state: result,
                $ai_latency: (Date.now() - spanStart) / 1000,
            },
        })

        this.messages.push(
            { role: 'assistant', content: response.content },
            {
                role: 'user',
                content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: result }],
            }
        )

        const followup = (await client.messages.create({
            model: MODEL,
            max_tokens: 1024,
            tools,
            tool_choice: toolChoice,
            messages: this.messages,
            posthogDistinctId: this.userId,
            posthogTraceId: traceId,
            posthogProperties,
        })) as Anthropic.Message

        const answer = textOf(followup)
        this.messages.push({ role: 'assistant', content: answer })
        return answer
    }
}

async function main(): Promise<void> {
    const thread = new Conversation('user_123', 'thread_abc')
    console.log(await thread.ask("What's the weather in San Francisco?"))
    console.log(await thread.ask('How about Boston?'))
    await posthog.shutdown()
}

main().catch(async (err) => {
    console.error(`fatal: ${String(err)}`)
    await posthog.shutdown()
    process.exit(1)
})
