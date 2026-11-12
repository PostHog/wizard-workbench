import { randomUUID } from 'node:crypto'
import { OpenAI } from '@posthog/ai/openai'
import { PostHog } from 'posthog-node'

const posthog = new PostHog(process.env.POSTHOG_API_KEY!, {
    host: process.env.POSTHOG_HOST!,
    privacyMode: false,
    flushAt: 1,
    flushInterval: 0,
    requestTimeout: 2000,
    fetchRetryCount: 0,
})

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY ?? '',
    baseURL: 'https://api.groq.com/openai/v1',
    posthog,
})

const MODEL = 'llama-3.3-70b-versatile'

const BLOCKED = ['password', 'ssn', 'credit card']

function moderate(question: string): void {
    const lowered = question.toLowerCase()
    if (BLOCKED.some((term) => lowered.includes(term))) {
        throw new Error('question rejected by moderation')
    }
}

type ObservabilityContext = {
    distinctId: string
    sessionId: string
    traceId: string
}

async function complete(
    system: string,
    user: string,
    { distinctId, sessionId, traceId }: ObservabilityContext
): Promise<string> {
    const response = await client.chat.completions.create({
        model: MODEL,
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
        ],
        posthogDistinctId: distinctId,
        posthogTraceId: traceId,
        posthogProperties: {
            $ai_session_id: sessionId,
            $ai_provider: 'groq',
        },
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
        const observability = {
            distinctId: this.userId,
            sessionId: this.threadId,
            traceId: randomUUID(),
        }
        const context = this.turns.length > 0 ? await this.condense(observability) : ''
        const answer = await this.reply(context, question, observability)
        this.turns.push({ question, answer })
        return answer
    }

    /** Squash the thread so far into a short recap the next call can use. */
    private condense(observability: ObservabilityContext): Promise<string> {
        const transcript = this.turns.map((t) => `Q: ${t.question}\nA: ${t.answer}`).join('\n\n')
        return complete('Summarize this conversation in two sentences.', transcript, observability)
    }

    private reply(context: string, question: string, observability: ObservabilityContext): Promise<string> {
        const prompt = context ? `Earlier in this thread: ${context}\n\nQuestion: ${question}` : question
        return complete('You are a concise assistant.', prompt, observability)
    }
}

async function main(): Promise<void> {
    try {
        const thread = new Thread('user_123', 'thread_abc')
        console.log(await thread.ask('What is a feature flag?'))
        console.log(await thread.ask('How is that different from an experiment?'))
    } finally {
        await posthog.shutdown(3000).catch(() => {})
    }
}

main().catch((err) => {
    console.error(`fatal: ${String(err)}`)
    process.exit(1)
})
