import { randomUUID } from 'node:crypto'

import { OpenAI as PostHogOpenAI } from '@posthog/ai'
import OpenAI from 'openai'
import { PostHog } from 'posthog-node'

import { getWeather } from './weather.js'

const posthogApiKey = process.env.POSTHOG_API_KEY
const posthogHost = process.env.POSTHOG_HOST

if ((!posthogApiKey || !posthogHost) && process.env.NODE_ENV !== 'production') {
    const missingVariable = posthogApiKey ? 'POSTHOG_HOST' : 'POSTHOG_API_KEY'
    throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    )
}

const posthog =
    posthogApiKey && posthogHost
        ? new PostHog(posthogApiKey, {
              host: posthogHost,
              privacyMode: false,
              enableExceptionAutocapture: true,
          })
        : undefined

const client = posthog
    ? new PostHogOpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '', posthog })
    : new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '' })

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
    messages: OpenAI.ChatCompletionMessageParam[],
    traceId: string,
    sessionId: string,
): Promise<OpenAI.ChatCompletion> {
    const request = { model: MODEL, messages, tools, parallel_tool_calls: false }

    if (posthog) {
        return (client as PostHogOpenAI).chat.completions.create({
            ...request,
            posthog_distinct_id: USER_ID,
            posthog_trace_id: traceId,
            posthog_properties: { $ai_session_id: sessionId },
        })
    }

    return (client as OpenAI).chat.completions.create(request)
}

/** Answer one question, running the tool if the model asks for it. */
async function ask(question: string, sessionId: string): Promise<string> {
    const traceId = randomUUID()
    const messages: OpenAI.ChatCompletionMessageParam[] = [{ role: 'user', content: question }]

    const response = await createCompletion(messages, traceId, sessionId)
    const message = response.choices[0]?.message

    const call = message?.tool_calls?.[0]
    if (!message || !call) {
        return message?.content ?? ''
    }

    const { location } = JSON.parse(call.function.arguments) as { location: string }
    const toolStartedAt = Date.now()
    const result = getWeather(location)

    posthog?.capture({
        distinctId: USER_ID,
        event: '$ai_span',
        properties: {
            $ai_trace_id: traceId,
            $ai_session_id: sessionId,
            $ai_span_id: randomUUID(),
            $ai_span_name: call.function.name,
            $ai_input_state: call.function.arguments,
            $ai_output_state: result,
            $ai_latency: (Date.now() - toolStartedAt) / 1000,
        },
    })

    messages.push(message, { role: 'tool', tool_call_id: call.id, content: result })

    const followup = await createCompletion(messages, traceId, sessionId)
    return followup.choices[0]?.message?.content ?? ''
}

async function main(): Promise<void> {
    const sessionId = randomUUID()
    console.log(await ask("What's the weather in San Francisco?", sessionId))
}

main().finally(() => posthog?.shutdown()).catch((err) => {
    console.error(`fatal: ${String(err)}`)
    process.exit(1)
})
