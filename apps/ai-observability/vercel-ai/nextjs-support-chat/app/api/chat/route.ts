import { openai } from '@ai-sdk/openai'
import { withTracing } from '@posthog/ai/vercel'
import { randomUUID } from 'node:crypto'
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

    const sessionId = `thread-${Buffer.from(threadId).toString('base64url')}`
    const traceId = randomUUID()
    const model = posthog
        ? withTracing(openai('gpt-4o-mini'), posthog, {
              posthogDistinctId: userId,
              posthogTraceId: traceId,
              posthogProperties: { $ai_session_id: sessionId },
              posthogPrivacyMode: false,
          })
        : openai('gpt-4o-mini')

    try {
        const { text } = await generateText({
            model,
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
        await posthog?.flush()
    }
}
