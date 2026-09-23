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

    const hasValidAiSessionId = /^[A-Za-z0-9_~.@()!'|:-]+$/.test(threadId)

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
                functionId: 'support-chat',
                metadata: {
                    'posthog.distinct_id': userId,
                    ...(hasValidAiSessionId ? { '$ai_session_id': threadId } : {}),
                },
            },
        })

        return Response.json({ answer: text, userId, threadId })
    } finally {
        await posthogSpanProcessor?.forceFlush()
    }
}
