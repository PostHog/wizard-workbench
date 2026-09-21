import { randomUUID } from 'node:crypto'

import { lookupOrder } from './orders.js'
import { posthog } from './posthog.js'

const LLM_URL = process.env.LLM_URL ?? 'http://localhost:11434/v1/chat/completions'
const MODEL = 'llama3.2'

type Message = {
    role: 'system' | 'user' | 'assistant' | 'tool'
    content: string
    tool_calls?: ToolCall[]
    tool_call_id?: string
}

type ToolCall = { id: string; function: { name: string; arguments: string } }

type AiId = ReturnType<typeof randomUUID>

type Completion = {
    text: string
    toolCalls: ToolCall[]
    promptTokens: number
    completionTokens: number
    spanId: AiId
}

type GenerationContext = {
    distinctId: string
    sessionId: string
    traceId: AiId
    parentId: AiId
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

async function complete(messages: Message[], context: GenerationContext): Promise<Completion> {
    const startedAt = performance.now()
    const res = await fetch(LLM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MODEL, messages, tools: TOOLS }),
    })
    if (!res.ok) {
        throw new Error(`model returned ${res.status}`)
    }
    const body = (await res.json()) as {
        choices: { message: { content: string | null; tool_calls?: ToolCall[] } }[]
        usage?: { prompt_tokens: number; completion_tokens: number }
    }
    const message = body.choices[0]?.message
    const completion = {
        text: message?.content ?? '',
        toolCalls: message?.tool_calls ?? [],
        promptTokens: body.usage?.prompt_tokens ?? 0,
        completionTokens: body.usage?.completion_tokens ?? 0,
        spanId: randomUUID(),
    }

    posthog.capture({
        distinctId: context.distinctId,
        event: '$ai_generation',
        properties: {
            $ai_trace_id: context.traceId,
            $ai_session_id: context.sessionId,
            $ai_span_id: completion.spanId,
            $ai_parent_id: context.parentId,
            $ai_span_name: 'chat_completion',
            $ai_model: MODEL,
            $ai_provider: 'ollama',
            $ai_input: messages,
            $ai_input_tokens: completion.promptTokens,
            $ai_output_choices: [{ role: 'assistant', content: completion.text }],
            $ai_output_tokens: completion.completionTokens,
            $ai_latency: (performance.now() - startedAt) / 1_000,
            $ai_tools: TOOLS,
        },
    })

    return completion
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
        const history: Message[] = this.turns.flatMap((t) => [
            { role: 'user' as const, content: t.question },
            { role: 'assistant' as const, content: t.answer },
        ])

        const messages: Message[] = [
            { role: 'system', content: 'You are a concise assistant. Use lookup_order for order questions.' },
            ...history,
            { role: 'user', content: question },
        ]

        const traceId = randomUUID()
        let parentId = traceId
        let result = await complete(messages, {
            distinctId: this.userId,
            sessionId: this.threadId,
            traceId,
            parentId,
        })

        if (result.toolCalls.length > 0) {
            parentId = result.spanId
            messages.push({ role: 'assistant', content: '', tool_calls: result.toolCalls })
            for (const call of result.toolCalls) {
                const startedAt = performance.now()
                const args = JSON.parse(call.function.arguments) as { user_id?: string }
                const output = lookupOrder(args.user_id ?? this.userId)
                const toolSpanId = randomUUID()

                posthog.capture({
                    distinctId: this.userId,
                    event: '$ai_span',
                    properties: {
                        $ai_trace_id: traceId,
                        $ai_session_id: this.threadId,
                        $ai_span_id: toolSpanId,
                        $ai_parent_id: parentId,
                        $ai_span_name: call.function.name,
                        $ai_input_state: { tool_name: call.function.name },
                        $ai_output_state: { result: output === null ? 'not_found' : 'found' },
                        $ai_latency: (performance.now() - startedAt) / 1_000,
                    },
                })

                parentId = toolSpanId
                messages.push({
                    role: 'tool',
                    tool_call_id: call.id,
                    content: JSON.stringify(output),
                })
            }
            result = await complete(messages, {
                distinctId: this.userId,
                sessionId: this.threadId,
                traceId,
                parentId,
            })
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
