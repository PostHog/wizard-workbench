import { OpenAI } from '@posthog/ai/openai'
import { randomUUID } from 'node:crypto'
import OpenAIClient from 'openai'
import { PostHog } from 'posthog-node'

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

const client = new OpenAIClient({
    apiKey: process.env.GROQ_API_KEY ?? '',
    baseURL: 'https://api.groq.com/openai/v1',
})

const posthogClient = posthog
    ? new OpenAI({
        apiKey: process.env.GROQ_API_KEY ?? '',
        baseURL: 'https://api.groq.com/openai/v1',
        posthog,
    })
    : undefined

const MODEL = 'llama-3.3-70b-versatile'

const BLOCKED = ['password', 'ssn', 'credit card']

function moderate(question: string): void {
    const lowered = question.toLowerCase()
    if (BLOCKED.some((term) => lowered.includes(term))) {
        throw new Error('question rejected by moderation')
    }
}

async function complete(system: string, user: string, thread: Thread, traceId: string): Promise<string> {
    const request = {
        model: MODEL,
        messages: [
            { role: 'system' as const, content: system },
            { role: 'user' as const, content: user },
        ],
    }
    const response = posthogClient
        ? await posthogClient.chat.completions.create({
            ...request,
            posthogDistinctId: thread.userId,
            posthogTraceId: traceId,
            posthogProperties: {
                $ai_session_id: thread.threadId,
                $ai_provider: 'groq',
            },
        })
        : await client.chat.completions.create(request)
    return response.choices[0]?.message?.content ?? ''
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
        moderate(question)
        const traceId = randomUUID()
        const context = this.turns.length > 0 ? await this.condense(traceId) : ''
        const answer = await this.reply(context, question, traceId)
        this.turns.push({ question, answer })
        return answer
    }

    /** Squash the thread so far into a short recap the next call can use. */
    private condense(traceId: string): Promise<string> {
        const transcript = this.turns.map((t) => `Q: ${t.question}\nA: ${t.answer}`).join('\n\n')
        return complete('Summarize this conversation in two sentences.', transcript, this, traceId)
    }

    private reply(context: string, question: string, traceId: string): Promise<string> {
        const prompt = context ? `Earlier in this thread: ${context}\n\nQuestion: ${question}` : question
        return complete('You are a concise assistant.', prompt, this, traceId)
    }
}

async function main(): Promise<void> {
    const thread = new Thread('user_123', 'thread_abc')
    console.log(await thread.ask('What is a feature flag?'))
    console.log(await thread.ask('How is that different from an experiment?'))
}

main()
    .then(async () => {
        await posthog?.shutdown()
    })
    .catch(async (err) => {
        console.error(`fatal: ${String(err)}`)
        await posthog?.shutdown()
        process.exit(1)
    })
