import { randomUUID } from 'node:crypto'

import { OpenAI as PostHogOpenAI } from '@posthog/ai/openai'
import { PostHog } from 'posthog-node'

import { getWeather } from './weather.js'

const posthog = new PostHog(process.env.POSTHOG_API_KEY!, { host: process.env.POSTHOG_HOST })

const client = new PostHogOpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '', posthog })

const MODEL = 'gpt-5-mini'

const USER_ID = 'user_123'

// The process run is the conversation: this app has no thread/conversation id.
const SESSION_ID = randomUUID()

// Derived from the wrapped client so these line up with the openai version it bundles internally.
type ChatCompletionCreateParams = Parameters<typeof client.chat.completions.create>[0]
type ChatMessage = ChatCompletionCreateParams['messages'][number]
type ChatTool = NonNullable<ChatCompletionCreateParams['tools']>[number]

const tools: ChatTool[] = [
    {
        type: 'function',
        function: {
            name: 'get_weather',
            description: 'Get the current weather for a given location.',
            parameters: {
                type: 'object',
                properties: {
                    location: { type: 'string', description: 'City and state, e.g. San Francisco, CA' },
                },
                required: ['location'],
            },
        },
    },
]

/** Answer one question, running the tool if the model asks for it. */
async function ask(question: string): Promise<string> {
    const messages: ChatMessage[] = [{ role: 'user', content: question }]

    // One turn, one trace id: every call below shares it.
    const traceId = randomUUID()
    const posthogProperties = { $ai_session_id: SESSION_ID }

    const response = await client.chat.completions.create({
        model: MODEL,
        messages,
        tools,
        parallel_tool_calls: false,
        posthogDistinctId: USER_ID,
        posthogTraceId: traceId,
        posthogProperties,
    })
    const message = response.choices[0]?.message

    const call = message?.tool_calls?.[0]
    if (!message || !call || call.type !== 'function') {
        return message?.content ?? ''
    }

    const { location } = JSON.parse(call.function.arguments) as { location: string }
    const start = Date.now()
    const result = getWeather(location)

    posthog.capture({
        distinctId: USER_ID,
        event: '$ai_span',
        properties: {
            $ai_trace_id: traceId,
            $ai_session_id: SESSION_ID,
            $ai_span_id: randomUUID(),
            $ai_span_name: call.function.name,
            $ai_input_state: call.function.arguments,
            $ai_output_state: result,
            $ai_latency: (Date.now() - start) / 1000,
        },
    })

    messages.push(message, { role: 'tool', tool_call_id: call.id, content: result })

    const followup = await client.chat.completions.create({
        model: MODEL,
        messages,
        tools,
        parallel_tool_calls: false,
        posthogDistinctId: USER_ID,
        posthogTraceId: traceId,
        posthogProperties,
    })
    return followup.choices[0]?.message?.content ?? ''
}

async function main(): Promise<void> {
    console.log(await ask("What's the weather in San Francisco?"))
    await posthog.shutdown()
}

main().catch(async (err) => {
    console.error(`fatal: ${String(err)}`)
    await posthog.shutdown()
    process.exit(1)
})
