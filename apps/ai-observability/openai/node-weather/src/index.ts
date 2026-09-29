import { randomUUID } from 'node:crypto'

import { OpenAI as PostHogOpenAI } from '@posthog/ai/openai'
import OpenAI from 'openai'
import { PostHog } from 'posthog-node'

import { getWeather } from './weather.js'

const posthogApiKey = process.env.POSTHOG_API_KEY
const posthogHost = process.env.POSTHOG_HOST

if (!posthogApiKey && process.env.NODE_ENV !== 'production') {
    throw new Error('POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured')
}

if (!posthogHost && process.env.NODE_ENV !== 'production') {
    throw new Error('POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured')
}

const posthog = posthogApiKey && posthogHost
    ? new PostHog(posthogApiKey, {
        host: posthogHost,
        privacyMode: false,
        enableExceptionAutocapture: true,
    })
    : undefined

const openAIConfig = { apiKey: process.env.OPENAI_API_KEY ?? '' }
const client: PostHogOpenAI = posthog
    ? new PostHogOpenAI({ ...openAIConfig, posthog })
    : new OpenAI(openAIConfig) as unknown as PostHogOpenAI

const MODEL = 'gpt-5-mini'

const USER_ID = 'user_123'
const SESSION_ID = `conversation-${randomUUID()}`

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

/** Answer one question, running the tool if the model asks for it. */
async function ask(question: string): Promise<string> {
    const traceId = randomUUID()
    const messages: OpenAI.ChatCompletionMessageParam[] = [{ role: 'user', content: question }]

    const observabilityContext = posthog
        ? {
            posthogDistinctId: USER_ID,
            posthogTraceId: traceId,
            posthogProperties: { $ai_session_id: SESSION_ID },
        }
        : {}

    const response = await client.chat.completions.create({
        model: MODEL,
        messages,
        tools,
        parallel_tool_calls: false,
        ...observabilityContext,
    })
    const message = response.choices[0]?.message

    const call = message?.tool_calls?.[0]
    if (!message || !call) {
        return message?.content ?? ''
    }

    const { location } = JSON.parse(call.function.arguments) as { location: string }
    const start = Date.now()
    const result = getWeather(location)

    posthog?.capture({
        distinctId: USER_ID,
        event: '$ai_span',
        properties: {
            $ai_trace_id: traceId,
            $ai_session_id: SESSION_ID,
            $ai_span_id: randomUUID(),
            $ai_parent_id: traceId,
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
        ...observabilityContext,
    })
    return followup.choices[0]?.message?.content ?? ''
}

async function main(): Promise<void> {
    try {
        console.log(await ask("What's the weather in San Francisco?"))
    } finally {
        await posthog?.shutdown()
    }
}

main().catch((err) => {
    console.error(`fatal: ${String(err)}`)
    process.exit(1)
})
