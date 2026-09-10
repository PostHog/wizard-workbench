import { FunctionTool, InMemorySessionService, LlmAgent, Runner } from '@google/adk'
import { z } from 'zod'

import { getWeather } from './weather.js'

const APP_NAME = 'wb-aio-google-adk-node-weather'
const USER_ID = 'user_123'
const SESSION_ID = 'thread_abc'

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
const runner = new Runner({ appName: APP_NAME, agent, sessionService })

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
    await sessionService.createSession({ appName: APP_NAME, userId: USER_ID, sessionId: SESSION_ID })
    await ask("What's the weather in San Francisco?")
    await ask('How about Boston?')
}

main().catch((err) => {
    console.error(`fatal: ${String(err)}`)
    process.exit(1)
})
