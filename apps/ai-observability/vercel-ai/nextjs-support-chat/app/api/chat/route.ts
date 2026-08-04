import { openai } from '@ai-sdk/openai'
import { generateText, stepCountIs, tool } from 'ai'
import { z } from 'zod'

import { lookupOrder } from '@/lib/orders'

export async function POST(req: Request): Promise<Response> {
    const { question, userId, threadId } = (await req.json()) as {
        question: string
        userId: string
        threadId: string
    }

    const { text } = await generateText({
        model: openai('gpt-4o-mini'),
        system: 'You are a concise support agent. Look up the order before answering questions about delivery.',
        prompt: question,
        tools: {
            lookupOrder: tool({
                description: "Look up the caller's most recent order.",
                inputSchema: z.object({ userId: z.string() }),
                execute: async ({ userId: id }) => lookupOrder(id),
            }),
        },
        stopWhen: stepCountIs(3),
    })

    return Response.json({ answer: text, userId, threadId })
}
