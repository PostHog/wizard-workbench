import { randomUUID } from 'node:crypto'

import { OpenAI } from '@posthog/ai/openai'
import { PostHog } from 'posthog-node'
import type OpenAISDK from 'openai'

import { getWeather } from './weather.js'

const posthog = new PostHog(process.env.POSTHOG_API_KEY!, {
    host: process.env.POSTHOG_HOST,
    privacyMode: false,
    enableExceptionAutocapture: true,
})

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
    posthog,
})

const MODEL = 'gpt-5-mini'

const USER_ID = 'user_123'
const AI_SESSION_ID = randomUUID()

const tools: OpenAISDK.ChatCompletionTool[] = [
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
    const messages: OpenAISDK.ChatCompletionMessageParam[] = [{ role: 'user', content: question }]

    const response = await client.chat.completions.create({
        model: MODEL,
        messages,
        tools,
        parallel_tool_calls: false,
        posthogDistinctId: USER_ID,
        posthogTraceId: traceId,
        posthogProperties: { $ai_session_id: AI_SESSION_ID },
    })
    const message = response.choices[0]?.message

    const call = message?.tool_calls?.[0]
    if (!message || !call || call.type !== 'function') {
        return message?.content ?? ''
    }

    const { location } = JSON.parse(call.function.arguments) as { location: string }
    const toolStartedAt = Date.now()
    const result = getWeather(location)

    posthog.capture({
        distinctId: USER_ID,
        event: '$ai_span',
        properties: {
            $ai_trace_id: traceId,
            $ai_session_id: AI_SESSION_ID,
            $ai_span_id: randomUUID(),
            $ai_span_name: call.function.name,
            $ai_input_state: call.function.arguments,
            $ai_output_state: result,
            $ai_latency: (Date.now() - toolStartedAt) / 1000,
        },
    })

    messages.push(
        message as unknown as OpenAISDK.ChatCompletionAssistantMessageParam,
        { role: 'tool', tool_call_id: call.id, content: result },
    )

    const followup = await client.chat.completions.create({
        model: MODEL,
        messages,
        tools,
        parallel_tool_calls: false,
        posthogDistinctId: USER_ID,
        posthogTraceId: traceId,
        posthogProperties: { $ai_session_id: AI_SESSION_ID },
    })
    return followup.choices[0]?.message?.content ?? ''
}

async function main(): Promise<void> {
    try {
        console.log(await ask("What's the weather in San Francisco?"))
    } finally {
        await posthog.shutdown()
    }
}

main().catch((err) => {
    console.error(`fatal: ${String(err)}`)
    process.exit(1)
})
