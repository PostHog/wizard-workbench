import { randomUUID } from 'node:crypto'

import { OpenAI as PostHogOpenAI } from '@posthog/ai/openai'
import OpenAI from 'openai'
import { PostHog } from 'posthog-node'

import { getWeather } from './weather.js'

const posthogApiKey = process.env.POSTHOG_API_KEY
const posthogHost = process.env.POSTHOG_HOST
const posthog =
    posthogApiKey && posthogHost
        ? new PostHog(posthogApiKey, { host: posthogHost, enableExceptionAutocapture: true })
        : undefined

if (!posthog && process.env.NODE_ENV !== 'production') {
    throw new Error(
        'POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured',
    )
}

const apiKey = process.env.OPENAI_API_KEY ?? ''
const client = new OpenAI({ apiKey })
const instrumentedClient = posthog ? new PostHogOpenAI({ apiKey, posthog }) : undefined

const MODEL = 'gpt-5-mini'

const USER_ID = 'user_123'
const SESSION_ID = randomUUID()

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

async function createCompletion(messages: OpenAI.ChatCompletionMessageParam[], traceId: string) {
    const request = {
        model: MODEL,
        messages,
        tools,
        parallel_tool_calls: false,
    }

    if (!instrumentedClient) {
        return client.chat.completions.create(request)
    }

    return instrumentedClient.chat.completions.create({
        ...request,
        posthogDistinctId: USER_ID,
        posthogTraceId: traceId,
        posthogProperties: { $ai_session_id: SESSION_ID },
        posthogPrivacyMode: false,
    })
}

/** Answer one question, running the tool if the model asks for it. */
async function ask(question: string): Promise<string> {
    const messages: OpenAI.ChatCompletionMessageParam[] = [{ role: 'user', content: question }]
    const traceId = randomUUID()

    const response = await createCompletion(messages, traceId)
    const message = response.choices[0]?.message

    const call = message?.tool_calls?.[0]
    if (!message || !call) {
        return message?.content ?? ''
    }

    const { location } = JSON.parse(call.function.arguments) as { location: string }
    const startedAt = Date.now()
    const result = getWeather(location)

    posthog?.capture({
        distinctId: USER_ID,
        event: '$ai_span',
        properties: {
            $ai_trace_id: traceId,
            $ai_session_id: SESSION_ID,
            $ai_span_id: randomUUID(),
            $ai_span_name: call.function.name,
            $ai_input_state: call.function.arguments,
            $ai_output_state: result,
            $ai_latency: (Date.now() - startedAt) / 1000,
        },
    })

    messages.push(message, { role: 'tool', tool_call_id: call.id, content: result })

    const followup = await createCompletion(messages, traceId)
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
    .finally(async () => {
        await posthog?.shutdown()
    })
