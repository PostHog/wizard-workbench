import { openai } from '@ai-sdk/openai'
import { withTracing } from '@posthog/ai/vercel'
import { generateText, stepCountIs, tool } from 'ai'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { lookupOrder } from '@/lib/orders'
import { posthogAi } from '@/lib/posthog-ai'

export async function POST(req: Request): Promise<Response> {
    const { question, userId, threadId } = (await req.json()) as {
        question: string
        userId: string
        threadId: string
    }

    const aiSessionId = Buffer.from(threadId).toString('base64url')
    const model = posthogAi
        ? withTracing(openai('gpt-4o-mini'), posthogAi, {
              posthogDistinctId: userId,
              posthogTraceId: randomUUID(),
              posthogProperties: { $ai_session_id: aiSessionId },
              posthogPrivacyMode: false,
              posthogCaptureImmediate: true,
          })
        : openai('gpt-4o-mini')

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
}
