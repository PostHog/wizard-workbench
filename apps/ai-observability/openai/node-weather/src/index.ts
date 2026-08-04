import OpenAI from 'openai'

import { getWeather } from './weather.js'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '' })

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

/** Answer one question, running the tool if the model asks for it. */
async function ask(question: string): Promise<string> {
    const messages: OpenAI.ChatCompletionMessageParam[] = [{ role: 'user', content: question }]

    const response = await client.chat.completions.create({
        model: MODEL,
        messages,
        tools,
        parallel_tool_calls: false,
    })
    const message = response.choices[0]?.message

    const call = message?.tool_calls?.[0]
    if (!message || !call) {
        return message?.content ?? ''
    }

    const { location } = JSON.parse(call.function.arguments) as { location: string }
    const result = getWeather(location)

    messages.push(message, { role: 'tool', tool_call_id: call.id, content: result })

    const followup = await client.chat.completions.create({
        model: MODEL,
        messages,
        tools,
        parallel_tool_calls: false,
    })
    return followup.choices[0]?.message?.content ?? ''
}

async function main(): Promise<void> {
    console.log(await ask("What's the weather in San Francisco?"))
}

main().catch((err) => {
    console.error(`fatal: ${String(err)}`)
    process.exit(1)
})
