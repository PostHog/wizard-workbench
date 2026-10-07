import { createHash } from 'node:crypto'

import { openai } from '@ai-sdk/openai'
import { generateText, stepCountIs, tool } from 'ai'
import { z } from 'zod'

import { posthogSpanProcessor } from '@/instrumentation'
import { lookupOrder } from '@/lib/orders'

export async function POST(req: Request): Promise<Response> {
    const { question, userId, threadId } = (await req.json()) as {
        question: string
        userId: string
        threadId: string
    }

    const aiSessionId = `thread-${createHash('sha256').update(threadId).digest('base64url')}`

    try {
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
            experimental_telemetry: {
                isEnabled: true,
                functionId: 'support_chat',
                metadata: {
                    'posthog.distinct_id': userId,
                    '$ai_session_id': aiSessionId,
                },
            },
        })

        return Response.json({ answer: text, userId, threadId })
    } finally {
        await posthogSpanProcessor?.forceFlush()
    }
}
