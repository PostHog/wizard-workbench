import { randomUUID } from 'node:crypto'

import { OpenAI } from '@posthog/ai'
import type OpenAIType from 'openai'
import { PostHog } from 'posthog-node'

import { getWeather } from './weather.js'

const posthog = new PostHog(process.env.POSTHOG_PROJECT_API_KEY!, {
    host: process.env.POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
})

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '', posthog })

const MODEL = 'gpt-5-mini'

const USER_ID = 'user_123'

/** One process run is one conversation; this script has no thread/conversation id of its own. */
const SESSION_ID = randomUUID()

const tools: OpenAIType.ChatCompletionTool[] = [
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
    const traceId = randomUUID()
    const messages: OpenAIType.ChatCompletionMessageParam[] = [{ role: 'user', content: question }]

    const response = await client.chat.completions.create({
        model: MODEL,
        messages,
        tools,
        parallel_tool_calls: false,
        posthogDistinctId: USER_ID,
        posthogTraceId: traceId,
        posthogProperties: { $ai_session_id: SESSION_ID },
    })
    const message = response.choices[0]?.message

    const call = message?.tool_calls?.[0]
    if (!message || !call) {
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
        posthogProperties: { $ai_session_id: SESSION_ID },
    })
    return followup.choices[0]?.message?.content ?? ''
}

async function main(): Promise<void> {
    console.log(await ask("What's the weather in San Francisco?"))
}

main()
    .catch((err) => {
        console.error(`fatal: ${String(err)}`)
        process.exitCode = 1
    })
    .finally(() => posthog.shutdown())
