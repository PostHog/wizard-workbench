import Anthropic from '@anthropic-ai/sdk'
import { randomUUID } from 'node:crypto'
import { PostHog } from 'posthog-node'

import { getWeather } from './weather.js'

const posthog = new PostHog(process.env.POSTHOG_API_KEY!, {
    host: process.env.POSTHOG_HOST,
    enableExceptionAutocapture: true,
})

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

function captureGeneration(
    userId: string,
    threadId: string,
    traceId: string,
    spanId: string,
    parentId: string | undefined,
    input: Anthropic.MessageParam[],
    response: Anthropic.Message,
    latency: number
): void {
    posthog.capture({
        distinctId: userId,
        event: '$ai_generation',
        properties: {
            $ai_trace_id: traceId,
            $ai_session_id: threadId,
            $ai_span_id: spanId,
            $ai_span_name: 'messages.create',
            ...(parentId ? { $ai_parent_id: parentId } : {}),
            $ai_model: MODEL,
            $ai_provider: 'anthropic',
            $ai_input: input,
            $ai_input_tokens: response.usage.input_tokens,
            $ai_output_choices: [{ role: 'assistant', content: response.content }],
            $ai_output_tokens: response.usage.output_tokens,
            $ai_latency: latency,
            $ai_max_tokens: 1024,
            $ai_tools: tools,
        },
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
        const firstGenerationId = randomUUID()

        this.messages.push({ role: 'user', content: question })
        const requestMessages = [...this.messages]
        const requestStart = Date.now()

        const response = await client.messages.create({
            model: MODEL,
            max_tokens: 1024,
            tools,
            tool_choice: toolChoice,
            messages: requestMessages,
        })

        captureGeneration(
            this.userId,
            this.threadId,
            traceId,
            firstGenerationId,
            undefined,
            requestMessages,
            response,
            (Date.now() - requestStart) / 1000
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
        const toolStart = Date.now()
        const result = getWeather(location)

        const toolSpanId = randomUUID()
        posthog.capture({
            distinctId: this.userId,
            event: '$ai_span',
            properties: {
                $ai_trace_id: traceId,
                $ai_session_id: this.threadId,
                $ai_span_id: toolSpanId,
                $ai_span_name: toolUse.name,
                $ai_parent_id: firstGenerationId,
                $ai_input_state: toolUse.input,
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

        const followupGenerationId = randomUUID()
        const followupMessages = [...this.messages]
        const followupStart = Date.now()
        const followup = await client.messages.create({
            model: MODEL,
            max_tokens: 1024,
            tools,
            tool_choice: toolChoice,
            messages: followupMessages,
        })

        captureGeneration(
            this.userId,
            this.threadId,
            traceId,
            followupGenerationId,
            toolSpanId,
            followupMessages,
            followup,
            (Date.now() - followupStart) / 1000
        )

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
    .then(() => posthog.shutdown())
    .catch(async (err) => {
        console.error(`fatal: ${String(err)}`)
        await posthog.shutdown()
        process.exitCode = 1
    })
