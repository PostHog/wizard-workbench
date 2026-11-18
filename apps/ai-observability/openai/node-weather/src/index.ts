import { randomUUID } from 'node:crypto'

import { OpenAI as PostHogOpenAI } from '@posthog/ai/openai'
import OpenAI from 'openai'
import { PostHog } from 'posthog-node'

import { getWeather } from './weather.js'

const posthogApiKey = process.env.POSTHOG_API_KEY
const posthogHost = process.env.POSTHOG_HOST
const posthog = posthogApiKey && posthogHost
    ? new PostHog(posthogApiKey, { host: posthogHost, privacyMode: false })
    : undefined

if (!posthog && process.env.NODE_ENV !== 'production') {
    console.warn(
        'POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured',
    )
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '' })
const instrumentedClient = posthog
    ? new PostHogOpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '', posthog })
    : undefined

const MODEL = 'gpt-5-mini'

const USER_ID = 'user_123'

const tools: OpenAI.ChatCompletionTool[] = [
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

async function createCompletion(
    request: OpenAI.ChatCompletionCreateParamsNonStreaming,
    posthogContext: {
        posthogDistinctId: string
        posthogTraceId: string
        posthogProperties: { $ai_session_id: string }
    },
) {
    if (instrumentedClient) {
        return instrumentedClient.chat.completions.create({ ...request, ...posthogContext })
    }

    return client.chat.completions.create(request)
}

/** Answer one question, running the tool if the model asks for it. */
async function ask(question: string, sessionId: string): Promise<string> {
    const traceId = randomUUID()
    const messages: OpenAI.ChatCompletionMessageParam[] = [{ role: 'user', content: question }]
    const posthogContext = {
        posthogDistinctId: USER_ID,
        posthogTraceId: traceId,
        posthogProperties: { $ai_session_id: sessionId },
    }

    const response = await createCompletion(
        {
            model: MODEL,
            messages,
            tools,
            parallel_tool_calls: false,
        },
        posthogContext,
    )
    const message = response.choices[0]?.message

    const call = message?.tool_calls?.[0]
    if (!message || !call) {
        return message?.content ?? ''
    }

    const { location } = JSON.parse(call.function.arguments) as { location: string }
    const toolStart = Date.now()
    const result = getWeather(location)

    posthog?.capture({
        distinctId: USER_ID,
        event: '$ai_span',
        properties: {
            $ai_trace_id: traceId,
            $ai_session_id: sessionId,
            $ai_span_id: randomUUID(),
            $ai_span_name: 'get_weather',
            $ai_input_state: call.function.arguments,
            $ai_output_state: result,
            $ai_latency: (Date.now() - toolStart) / 1000,
        },
    })

    messages.push(message, { role: 'tool', tool_call_id: call.id, content: result })

    const followup = await createCompletion(
        {
            model: MODEL,
            messages,
            tools,
            parallel_tool_calls: false,
        },
        posthogContext,
    )
    return followup.choices[0]?.message?.content ?? ''
}

async function main(): Promise<void> {
    const sessionId = `process-${randomUUID()}`

    try {
        console.log(await ask("What's the weather in San Francisco?", sessionId))
    } finally {
        await posthog?.shutdown(3000).catch(() => {})
    }
}

main().catch((err) => {
    console.error(`fatal: ${String(err)}`)
    process.exit(1)
})
