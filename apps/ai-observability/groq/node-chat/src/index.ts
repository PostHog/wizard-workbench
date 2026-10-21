import { randomUUID } from 'node:crypto'
import { OpenAI } from '@posthog/ai/openai'
import BaseOpenAI from 'openai'
import { PostHog } from 'posthog-node'

const posthogApiKey = process.env.POSTHOG_API_KEY

if (!posthogApiKey && process.env.NODE_ENV !== 'production') {
    throw new Error('POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured')
}

const posthog = posthogApiKey
    ? new PostHog(posthogApiKey, {
          host: process.env.POSTHOG_HOST,
          privacyMode: false,
          enableExceptionAutocapture: true,
          flushAt: 1,
          flushInterval: 0,
      })
    : undefined

const client = posthog
    ? new OpenAI({
          apiKey: process.env.GROQ_API_KEY ?? '',
          baseURL: 'https://api.groq.com/openai/v1',
          posthog,
      })
    : undefined

const fallbackClient = posthog
    ? undefined
    : new BaseOpenAI({
          apiKey: process.env.GROQ_API_KEY ?? '',
          baseURL: 'https://api.groq.com/openai/v1',
      })

const MODEL = 'llama-3.3-70b-versatile'

const BLOCKED = ['password', 'ssn', 'credit card']

function moderate(question: string): void {
    const lowered = question.toLowerCase()
    if (BLOCKED.some((term) => lowered.includes(term))) {
        throw new Error('question rejected by moderation')
    }
}

async function complete(
    system: string,
    user: string,
    userId: string,
    threadId: string,
    traceId: string
): Promise<string> {
    if (client) {
        const response = await client.chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user },
            ],
            posthogDistinctId: userId,
            posthogTraceId: traceId,
            posthogProperties: {
                $ai_session_id: threadId,
                $ai_provider: 'groq',
            },
        })
        return response.choices[0]?.message?.content ?? ''
    }

    const response = await fallbackClient!.chat.completions.create({
        model: MODEL,
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
        ],
    })
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
        return complete('Summarize this conversation in two sentences.', transcript, this.userId, this.threadId, traceId)
    }

    private reply(context: string, question: string, traceId: string): Promise<string> {
        const prompt = context ? `Earlier in this thread: ${context}\n\nQuestion: ${question}` : question
        return complete('You are a concise assistant.', prompt, this.userId, this.threadId, traceId)
    }
}

async function main(): Promise<void> {
    try {
        const thread = new Thread('user_123', 'thread_abc')
        console.log(await thread.ask('What is a feature flag?'))
        console.log(await thread.ask('How is that different from an experiment?'))
    } finally {
        await posthog?.shutdown()
    }
}

main().catch((err) => {
    console.error(`fatal: ${String(err)}`)
    process.exit(1)
})
