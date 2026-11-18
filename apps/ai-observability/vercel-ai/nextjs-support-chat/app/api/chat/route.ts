import { openai } from '@ai-sdk/openai'
import { generateText, stepCountIs, tool } from 'ai'
import { z } from 'zod'

import { posthogSpanProcessor } from '@/instrumentation'
import { lookupOrder } from '@/lib/orders'

export const runtime = 'nodejs'

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
        experimental_telemetry: {
            isEnabled: true,
            functionId: 'support-chat',
            metadata: {
                '$ai_session_id': threadId,
                'posthog.distinct_id': userId,
            },
        },
    })

    let flushTimeout: ReturnType<typeof setTimeout> | undefined

    try {
        await Promise.race([
            posthogSpanProcessor?.forceFlush() ?? Promise.resolve(),
            new Promise<void>((resolve) => {
                flushTimeout = setTimeout(resolve, 2_000)
            }),
        ])
    } catch {
        // AI Observability must not affect the chat response.
    } finally {
        if (flushTimeout) {
            clearTimeout(flushTimeout)
        }
    }

    return Response.json({ answer: text, userId, threadId })
}
