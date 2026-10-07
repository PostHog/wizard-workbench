import { FunctionTool, InMemorySessionService, LlmAgent, Runner } from '@google/adk'
import { PostHogADKPlugin } from '@posthog/ai/adk'
import { PostHog } from 'posthog-node'
import { z } from 'zod'

import { getWeather } from './weather.js'

const APP_NAME = 'wb-aio-google-adk-node-weather'
const USER_ID = 'user_123'
const SESSION_ID = 'thread_abc'
const posthogProjectToken = process.env.POSTHOG_API_KEY
const posthogHost = process.env.POSTHOG_HOST

if ((!posthogProjectToken || !posthogHost) && process.env.NODE_ENV !== 'production') {
    throw new Error(
        'POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured',
    )
}

const posthog = posthogProjectToken && posthogHost
    ? new PostHog(posthogProjectToken, {
        host: posthogHost,
        privacyMode: false,
        enableExceptionAutocapture: true,
    })
    : undefined

const weatherTool = new FunctionTool({
    name: 'get_weather',
    description: 'Get the current weather for a given location.',
    parameters: z.object({
        location: z.string().describe('City and state, e.g. San Francisco, CA'),
    }),
    execute: ({ location }) => getWeather(location),
})

const agent = new LlmAgent({
    name: 'weather_assistant',
    model: 'gemini-3.6-flash',
    instruction: 'Answer weather questions with the get_weather tool. Be concise.',
    tools: [weatherTool],
})

const sessionService = new InMemorySessionService()
const runner = new Runner({
    appName: APP_NAME,
    agent,
    sessionService,
    plugins: posthog ? [new PostHogADKPlugin({ client: posthog, privacyMode: false })] : [],
})

/** Answer one question inside the shared session. ADK runs the tool loop itself. */
async function ask(question: string): Promise<void> {
    for await (const event of runner.runAsync({
        userId: USER_ID,
        sessionId: SESSION_ID,
        newMessage: { role: 'user', parts: [{ text: question }] },
    })) {
        for (const part of event.content?.parts ?? []) {
            if (part.text) {
                console.log(part.text)
            }
        }
    }
}

async function main(): Promise<void> {
    try {
        await sessionService.createSession({ appName: APP_NAME, userId: USER_ID, sessionId: SESSION_ID })
        await ask("What's the weather in San Francisco?")
        await ask('How about Boston?')
    } finally {
        await posthog?.shutdown()
    }
}

main().catch((err) => {
    console.error(`fatal: ${String(err)}`)
    process.exit(1)
})
