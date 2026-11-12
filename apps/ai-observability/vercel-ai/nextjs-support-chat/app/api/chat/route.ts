import { randomUUID } from 'crypto'

import { openai } from '@ai-sdk/openai'
import { withTracing } from '@posthog/ai/vercel'
import { generateText, stepCountIs, tool } from 'ai'
import { z } from 'zod'

import { posthog } from '@/instrumentation'
import { lookupOrder } from '@/lib/orders'

export async function POST(req: Request): Promise<Response> {
    const { question, userId, threadId } = (await req.json()) as {
        question: string
        userId: string
        threadId: string
    }
    const sessionId = threadId.replace(/[^A-Za-z0-9\-_~.@()!':|]/g, '_')

    try {
        const { text } = await generateText({
            model: posthog
                ? withTracing(openai('gpt-4o-mini'), posthog, {
                      posthogDistinctId: userId,
                      posthogTraceId: randomUUID(),
                      posthogProperties: { $ai_session_id: sessionId },
                      posthogPrivacyMode: false,
                  })
                : openai('gpt-4o-mini'),
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
    } finally {
        if (posthog) {
            await posthog.flush().catch(() => {})
        }
    }
}
