import { randomUUID } from 'node:crypto'

import { openai } from '@ai-sdk/openai'
import { withTracing } from '@posthog/ai'
import { generateText, stepCountIs, tool } from 'ai'
import { PostHog } from 'posthog-node'
import { z } from 'zod'

import { lookupOrder } from '@/lib/orders'

const phClient = new PostHog(process.env.POSTHOG_API_KEY!, {
    host: process.env.POSTHOG_HOST,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
})

export async function POST(req: Request): Promise<Response> {
    const { question, userId, threadId } = (await req.json()) as {
        question: string
        userId: string
        threadId: string
    }

    const { text } = await generateText({
        model: withTracing(openai('gpt-4o-mini'), phClient, {
            posthogDistinctId: userId,
            posthogTraceId: randomUUID(),
            posthogProperties: { $ai_session_id: threadId },
        }),
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

    await phClient.flush()

    return Response.json({ answer: text, userId, threadId })
}
