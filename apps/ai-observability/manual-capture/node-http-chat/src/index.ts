import { randomUUID } from 'node:crypto'
import { lookupOrder } from './orders.js'
import { posthog } from './posthog.js'

const LLM_URL = process.env.LLM_URL ?? 'http://localhost:11434/v1/chat/completions'
const MODEL = 'llama3.2'
const PROVIDER = 'ollama'

type Message = {
    role: 'system' | 'user' | 'assistant' | 'tool'
    content: string
    tool_calls?: ToolCall[]
    tool_call_id?: string
}

type ToolCall = { id: string; function: { name: string; arguments: string } }

type Completion = {
    text: string
    toolCalls: ToolCall[]
    promptTokens: number
    completionTokens: number
}

const TOOLS = [
    {
        type: 'function',
        function: {
            name: 'lookup_order',
            description: "Look up the caller's most recent order.",
            parameters: {
                type: 'object',
                properties: { user_id: { type: 'string' } },
                required: ['user_id'],
            },
        },
    },
]

type GenerationContext = { traceId: string; sessionId: string; distinctId: string }

async function complete(messages: Message[], context: GenerationContext): Promise<Completion> {
    const start = Date.now()
    const res = await fetch(LLM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MODEL, messages, tools: TOOLS }),
    })
    const latency = (Date.now() - start) / 1000
    if (!res.ok) {
        throw new Error(`model returned ${res.status}`)
    }
    const body = (await res.json()) as {
        choices: { message: { content: string | null; tool_calls?: ToolCall[] } }[]
        usage?: { prompt_tokens: number; completion_tokens: number }
    }
    const message = body.choices[0]?.message

    posthog.capture({
        distinctId: context.distinctId,
        event: '$ai_generation',
        properties: {
            $ai_trace_id: context.traceId,
            $ai_session_id: context.sessionId,
            $ai_model: MODEL,
            $ai_provider: PROVIDER,
            $ai_input: messages,
            $ai_input_tokens: body.usage?.prompt_tokens ?? 0,
            $ai_output_choices: [{ role: 'assistant', content: message?.content ?? '', tool_calls: message?.tool_calls }],
            $ai_output_tokens: body.usage?.completion_tokens ?? 0,
            $ai_latency: latency,
        },
    })

    return {
        text: message?.content ?? '',
        toolCalls: message?.tool_calls ?? [],
        promptTokens: body.usage?.prompt_tokens ?? 0,
        completionTokens: body.usage?.completion_tokens ?? 0,
    }
}

type Turn = { question: string; answer: string }

/** One chat thread. Every question asked below belongs to this thread. */
class Thread {
    private turns: Turn[] = []

    constructor(
        readonly userId: string,
        readonly threadId: string
    ) {}

    /** Answer one question, end to end. */
    async ask(question: string): Promise<string> {
        const context: GenerationContext = { traceId: randomUUID(), sessionId: this.threadId, distinctId: this.userId }

        const history: Message[] = this.turns.flatMap((t) => [
            { role: 'user' as const, content: t.question },
            { role: 'assistant' as const, content: t.answer },
        ])

        const messages: Message[] = [
            { role: 'system', content: 'You are a concise assistant. Use lookup_order for order questions.' },
            ...history,
            { role: 'user', content: question },
        ]

        let result = await complete(messages, context)

        if (result.toolCalls.length > 0) {
            messages.push({ role: 'assistant', content: '', tool_calls: result.toolCalls })
            for (const call of result.toolCalls) {
                const args = JSON.parse(call.function.arguments) as { user_id?: string }
                const toolStart = Date.now()
                const output = lookupOrder(args.user_id ?? this.userId)
                posthog.capture({
                    distinctId: this.userId,
                    event: '$ai_span',
                    properties: {
                        $ai_trace_id: context.traceId,
                        $ai_session_id: context.sessionId,
                        $ai_span_name: call.function.name,
                        $ai_latency: (Date.now() - toolStart) / 1000,
                    },
                })
                messages.push({
                    role: 'tool',
                    tool_call_id: call.id,
                    content: JSON.stringify(output),
                })
            }
            result = await complete(messages, context)
        }

        this.turns.push({ question, answer: result.text })

        posthog.capture({
            distinctId: this.userId,
            event: 'chat_message_sent',
            properties: { thread_id: this.threadId, turn: this.turns.length },
        })

        return result.text
    }
}

async function main(): Promise<void> {
    posthog.identify({ distinctId: 'user_123', properties: { plan: 'free' } })

    const thread = new Thread('user_123', 'thread_abc')
    console.log(await thread.ask('Where is my order?'))
    console.log(await thread.ask('Can I get a refund instead?'))

    await posthog.shutdown()
}

main().catch(async (err) => {
    console.error(`fatal: ${String(err)}`)
    await posthog.shutdown()
    process.exit(1)
})
