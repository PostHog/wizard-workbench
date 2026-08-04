import OpenAI from 'openai'

const client = new OpenAI({
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

async function complete(system: string, user: string): Promise<string> {
    const response = await client.chat.completions.create({
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
        const context = this.turns.length > 0 ? await this.condense() : ''
        const answer = await this.reply(context, question)
        this.turns.push({ question, answer })
        return answer
    }

    /** Squash the thread so far into a short recap the next call can use. */
    private condense(): Promise<string> {
        const transcript = this.turns.map((t) => `Q: ${t.question}\nA: ${t.answer}`).join('\n\n')
        return complete('Summarize this conversation in two sentences.', transcript)
    }

    private reply(context: string, question: string): Promise<string> {
        const prompt = context ? `Earlier in this thread: ${context}\n\nQuestion: ${question}` : question
        return complete('You are a concise assistant.', prompt)
    }
}

async function main(): Promise<void> {
    const thread = new Thread('user_123', 'thread_abc')
    console.log(await thread.ask('What is a feature flag?'))
    console.log(await thread.ask('How is that different from an experiment?'))
}

main().catch((err) => {
    console.error(`fatal: ${String(err)}`)
    process.exit(1)
})
